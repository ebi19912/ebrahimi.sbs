import os
import json
import random
import threading
import io
import csv
import hashlib
import urllib.parse
import datetime
import html
import re
from io import BytesIO
from flask import Flask, render_template, request, redirect, url_for, flash, make_response, session, jsonify, send_from_directory
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from xhtml2pdf import pisa
from werkzeug.utils import secure_filename, safe_join
import requests
from dotenv import load_dotenv
import zipfile
import shutil
import time
from sqlalchemy import func, desc, distinct, or_

# Import your database models
from models import db, Admin, Project, ResumeItem, Skill, Profile, AISettings, DemoSite, PageVisit

# Import RAG utilities
from rag_utils import initialize_vector_db, get_relevant_context

# Load environment variables
load_dotenv()

app = Flask(__name__)

# --- Configuration ---
# Set the secret key for session management and CSRF protection
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'your_very_secure_secret_key')
# Configure SQLite database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Use absolute path for upload folder to prevent path issues when running from different directories
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', 'uploads')

# Ensure upload directory exists before starting the app
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize Extensions
db.init_app(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message = "Please log in to access this page."

with app.app_context():
    db.create_all()
    # Safe auto-migration for SQLite schema updates
    try:
        from sqlalchemy import text
        with db.engine.connect() as conn:
            result = conn.execute(text("PRAGMA table_info(profile)"))
            cols = [row[1] for row in result.fetchall()]
            if 'resume_template' not in cols:
                conn.execute(text("ALTER TABLE profile ADD COLUMN resume_template VARCHAR(50) DEFAULT 'modern'"))
                conn.commit()
    except Exception as e:
        pass

# --- Jinja Template Filters & Helpers ---
def country_code_to_flag(code):
    """Converts a 2-letter ISO country code into a flag emoji."""
    if not code or len(code) != 2 or code in ('XX', 'LAN'):
        return '🌐'
    try:
        return chr(ord(code[0].upper()) + 127397) + chr(ord(code[1].upper()) + 127397)
    except Exception:
        return '🌐'

def format_datetime(dt):
    if not dt:
        return ''
    return dt.strftime('%Y-%m-%d %H:%M:%S')

def time_ago(dt):
    if not dt:
        return ''
    now = datetime.datetime.utcnow()
    diff = now - dt
    seconds = int(diff.total_seconds())
    if seconds < 60:
        return 'Just now'
    elif seconds < 3600:
        mins = seconds // 60
        return f'{mins}m ago'
    elif seconds < 86400:
        hours = seconds // 3600
        return f'{hours}h ago'
    else:
        days = seconds // 86400
        return f'{days}d ago'

def clean_pdf_html(content):
    """
    Sanitizes and normalizes HTML/Text for flawless xhtml2pdf rendering and ATS parsing.
    Converts typographic Unicode characters to safe ASCII equivalents, removes broken nested tags,
    and strips out unsupported characters and emojis.
    """
    if not content:
        return ""
    text = html.unescape(str(content))
    # Replace unicode typographic dashes and quotes with ASCII equivalents
    text = text.replace('\u2014', ' - ') # em-dash
    text = text.replace('\u2013', '-')   # en-dash
    text = text.replace('\u2012', '-')
    text = text.replace('\u2015', ' - ')
    text = text.replace('\u2018', "'")   # left single quote
    text = text.replace('\u2019', "'")   # right single quote
    text = text.replace('\u201c', '"')   # left double quote
    text = text.replace('\u201d', '"')   # right double quote
    text = text.replace('\u00a0', ' ')   # non-breaking space
    text = text.replace('\u2022', '-')   # bullet
    text = text.replace('\u2026', '...') # ellipsis
    
    # Strip emojis that crash/corrupt PDF generation in Helvetica/Type1
    emoji_pattern = re.compile(
        "["
        "\U00010000-\U0010ffff"
        "\U00002600-\U000027bf"
        "\U00002300-\U000023ff"
        "\U00002b50-\U00002b55"
        "\U0000fe00-\U0000fe0f"
        "]+",
        flags=re.UNICODE
    )
    text = emoji_pattern.sub("", text)
    
    # Clean up HTML tags: remove <p> inside <li>
    text = re.sub(r'<li>\s*<p[^>]*>(.*?)</p>\s*</li>', r'<li>\1</li>', text, flags=re.DOTALL | re.IGNORECASE)
    # Remove useless spans / cite tags
    text = re.sub(r'<\/?span[^>]*>', '', text, flags=re.IGNORECASE)
    
    # Strip unnecessary attributes except href on <a>
    def clean_tag(match):
        tag = match.group(1).lower()
        if tag == 'a':
            href_m = re.search(r'href=[\'"]([^\'"]*)[\'"]', match.group(0), re.IGNORECASE)
            if href_m:
                return f'<a href="{href_m.group(1)}">'
            return '<a>'
        return f'<{tag}>'
    
    text = re.sub(r'<([a-zA-Z0-9]+)\s+[^>]*>', clean_tag, text)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'>\s+<', '><', text)
    return text.strip()

def clean_url(url):
    """Strips https://, http://, and www. for clean visual display in resumes."""
    if not url:
        return ""
    u = str(url).strip()
    u = re.sub(r'^https?://', '', u)
    u = re.sub(r'^www\.', '', u)
    return u.rstrip('/')

app.jinja_env.filters['flag'] = country_code_to_flag
app.jinja_env.filters['datetime'] = format_datetime
app.jinja_env.filters['time_ago'] = time_ago
app.jinja_env.filters['clean_pdf_html'] = clean_pdf_html
app.jinja_env.filters['clean_url'] = clean_url

# --- Resume Templates Registry ---
RESUME_TEMPLATES = {
    'modern': {
        'id': 'modern',
        'name': 'Executive Modern',
        'style_tag': 'Cobalt & Slate',
        'theme_color': '#2563eb',
        'description': 'Balanced modern tech layout with cobalt accents, dual-column skills, and clean status tags.',
        'features': ['100% ATS Optimized', 'Cobalt Accent Bars', 'Dual-Column Skills', 'Clean Status Badges'],
        'preview_image': 'preview_modern.png',
        'template_file': 'pdf_templates/template_modern.html'
    },
    'minimal': {
        'id': 'minimal',
        'name': 'Silicon Valley Minimal',
        'style_tag': 'Monochrome Clean',
        'theme_color': '#111827',
        'description': 'Ultra-clean, high-density monochrome layout with right-aligned contact card preferred by top tech giants.',
        'features': ['100% ATS Optimized', 'Left-Aligned Header', 'Stacked Contact Card', 'High-Density Spacing'],
        'preview_image': 'preview_minimal.png',
        'template_file': 'pdf_templates/template_minimal.html'
    },
    'emerald': {
        'id': 'emerald',
        'name': 'Nordic Emerald',
        'style_tag': 'Teal & Fresh Modern',
        'theme_color': '#0f766e',
        'description': 'Fresh contemporary style with Nordic teal accent bars and modern pill headers for cutting-edge platforms.',
        'features': ['100% ATS Optimized', 'Teal Highlight Banners', 'Fresh Startup Aesthetic', 'Distinct Section Markers'],
        'preview_image': 'preview_emerald.png',
        'template_file': 'pdf_templates/template_emerald.html'
    },
    'ivy': {
        'id': 'ivy',
        'name': 'Ivy League Academic',
        'style_tag': 'Crimson & Formal',
        'theme_color': '#881337',
        'description': 'Distinguished academic styling with crimson double rules, placing Education and Publications at the forefront.',
        'features': ['100% ATS Optimized', 'Crimson Double Rules', 'Academic/Research Priority', 'Refined Typography'],
        'preview_image': 'preview_ivy.png',
        'template_file': 'pdf_templates/template_ivy.html'
    }
}

# --- Geolocation & Tracking Helpers ---
GEO_CACHE = {}  # In-memory IP geo cache: ip -> {country, country_code, city, isp}

BOT_USER_AGENTS = [
    'bot', 'crawl', 'spider', 'slurp', 'googlebot', 'bingbot', 'yandex', 'baiduspider',
    'duckduckbot', 'twitterbot', 'facebookexternalhit', 'linkedinbot', 'telegrambot',
    'applebot', 'semrush', 'ahrefs', 'dotbot', 'mj12bot', 'curl', 'wget', 'python',
    'requests', 'aiohttp', 'httpx', 'urllib', 'go-http', 'java', 'libwww', 'httpclient',
    'zgrab', 'censys', 'shodan', 'masscan', 'nmap', 'sqlmap', 'nikto', 'burp',
    'headless', 'phantomjs', 'selenium', 'puppeteer', 'playwright', 'postman', 'insomnia',
    'axios', 'node-fetch', 'got', 'undici', 'superagent', 'scrapy', 'feed', 'fetch',
    'scan', 'probe', 'inspect', 'netcraft', 'openvas', 'qualys', 'acunetix', 'guzzle',
    'fasthttp', 'faraday', 'winhttp', 'apache-http', 'expanse', 'shadowserver', 'archive.org',
    'sogou', 'petalbot', 'bytespider', 'turnitin', 'screaming frog', 'siteexplorer'
]

EXPLOIT_EXTENSIONS = (
    '.php', '.env', '.yml', '.yaml', '.json', '.xml', '.txt', '.bak', '.old', '.swp',
    '.key', '.pem', '.config', '.conf', '.ini', '.sql', '.sh', '.exe', '.tar', '.gz',
    '.zip', '.rar', '.7z', '.map', '.ico', '.png', '.jpg', '.jpeg', '.svg', '.css',
    '.js', '.woff', '.woff2', '.ttf', '.webmanifest', '.action', '.do', '.jsp', '.asp',
    '.aspx', '.cgi', '.log', '.properties', '.cfg', '.dist', '.temp', '.tmp'
)

EXPLOIT_PATH_SUBSTRINGS = (
    'wp-', 'actuator', 'phpunit', 'eval-', 'cgi-bin', 'xmlrpc', 'vendor', '@fs',
    'proc/', 'etc/passwd', 'shell', 'install', 'setup', 'credentials', 'phpmyadmin',
    'boaform', 'autodiscover', 'owa', 'solr', 'telescope', 'adminer',
    'webdav', 'invoker', 'geoserver', 'struts', 'remote', 'manager', 'ecp/', 'trace',
    'metrics', 'swagger', 'api-docs', 'v1/graphql', 'graphql', 'alfa', 'chosen',
    'database', 'secrets', 'service-account', 'firebase', 'azure', 'docker'
)

DATACENTER_ISPS = (
    'microsoft', 'google llc', 'google cloud', 'amazon', 'aws', 'digitalocean', 'ovh',
    'linode', 'akamai', 'alibaba', 'tencent', 'censys', 'hetzner', 'vultr', 'datacamp',
    'hostinger', 'contabo', 'm247', 'leaseweb', 'choopa', 'the constant company',
    'internetvikings', 'storm industries', 'techoff srv', 'scaleway', 'blix solutions',
    'modat b.v.', 'omega tech', 'driftnet', 'web2objects', 'ucloud information',
    'shenzhen tencent', 'alibaba (us)', 'aceville', '2day telecom'
)

def is_private_ip(ip):
    if not ip:
        return True
    ip_clean = ip.strip()
    if ip_clean in ('127.0.0.1', '::1', 'localhost', 'testclient'):
        return True
    if ip_clean.startswith(('192.168.', '10.', '172.16.', '172.17.', '172.18.', '172.19.', 
                            '172.20.', '172.21.', '172.22.', '172.23.', '172.24.', '172.25.', 
                            '172.26.', '172.27.', '172.28.', '172.29.', '172.30.', '172.31.',
                            '100.64.', '100.65.', '100.66.', '100.67.', '100.68.', '100.69.',
                            '100.70.', '100.71.', '100.72.', '100.73.', '100.74.', '100.75.',
                            '100.76.', '100.77.', '100.78.', '100.79.', '100.80.', '100.81.',
                            '100.82.', '100.83.', '100.84.', '100.85.', '100.86.', '100.87.',
                            '100.88.', '100.89.', '100.90.', '100.91.', '100.92.', '100.93.',
                            '100.94.', '100.95.', '100.96.', '100.97.', '100.98.', '100.99.',
                            '100.100.', '100.101.', '100.102.', '100.103.', '100.104.', '100.105.',
                            '100.106.', '100.107.', '100.108.', '100.109.', '100.110.', '100.111.',
                            '100.112.', '100.113.', '100.114.', '100.115.', '100.116.', '100.117.',
                            '100.118.', '100.119.', '100.120.', '100.121.', '100.122.', '100.123.',
                            '100.124.', '100.125.', '100.126.', '100.127.')):
        return True
    return False

def get_client_ip():
    """Extracts client IP behind Cloudflare, Nginx, or direct connection with anti-spoofing."""
    # 1. Cloudflare validated edge header (Cannot be forged by client)
    cf_ip = request.headers.get('CF-Connecting-IP')
    if cf_ip and not is_private_ip(cf_ip):
        return cf_ip.strip()
    
    # 2. X-Real-IP set by local Nginx proxy from $remote_addr
    x_real = request.headers.get('X-Real-IP')
    if x_real and not is_private_ip(x_real):
        return x_real.strip()
        
    # 3. X-Forwarded-For: find the rightmost/first non-private IP
    xff = request.headers.get('X-Forwarded-For')
    if xff:
        ips = [ip.strip() for ip in xff.split(',')]
        for ip in reversed(ips):  # Traverse from right to left (closest trusted proxy)
            if ip and not is_private_ip(ip):
                return ip
        for ip in ips:
            if ip and not is_private_ip(ip):
                return ip
        
    return request.remote_addr or '127.0.0.1'

def parse_user_agent(ua_string, path='', isp=''):
    if not ua_string:
        return {'device': 'Bot', 'os': 'Unknown', 'browser': 'Other', 'is_bot': True}
    
    ua_lower = ua_string.lower()
    path_lower = (path or '').lower()
    isp_lower = (isp or '').lower()
    
    # Check 1: User Agent bot keywords
    is_bot = any(b in ua_lower for b in BOT_USER_AGENTS)
    
    # Check 2: Exploit paths are always bots/threats
    if any(path_lower.endswith(ext) for ext in EXPLOIT_EXTENSIONS) or any(sub in path_lower for sub in EXPLOIT_PATH_SUBSTRINGS):
        is_bot = True
        
    # Check 3: Short or suspicious UA
    if len(ua_string) < 25:
        is_bot = True
        
    # Check 4: Real Browser signature check (using case-insensitive ua_lower)
    browser = 'Other'
    if 'edg/' in ua_lower or 'edge/' in ua_lower:
        browser = 'Edge'
    elif 'samsungbrowser/' in ua_lower:
        browser = 'Samsung Internet'
    elif 'opera' in ua_lower or 'opr/' in ua_lower:
        browser = 'Opera'
    elif 'chrome/' in ua_lower or 'crios/' in ua_lower:
        browser = 'Chrome'
    elif 'firefox/' in ua_lower or 'fxios/' in ua_lower:
        browser = 'Firefox'
    elif 'safari/' in ua_lower and 'chrome/' not in ua_lower and 'crios/' not in ua_lower:
        browser = 'Safari'
    elif 'msie' in ua_lower or 'trident/' in ua_lower:
        browser = 'Internet Explorer'
    else:
        browser = 'Other'
        is_bot = True  # Real humans always use a standard browser engine
        
    # Check 5: Datacenter ISPs without valid browser interaction
    if any(dc in isp_lower for dc in DATACENTER_ISPS):
        if browser == 'Other' or path_lower not in ('/', ''):
            is_bot = True
            
    # Device
    if is_bot:
        device = 'Bot'
    elif 'ipad' in ua_lower or 'tablet' in ua_lower:
        device = 'Tablet'
    elif any(m in ua_lower for m in ['mobile', 'android', 'iphone', 'ipod', 'blackberry', 'windows phone']):
        device = 'Mobile'
    else:
        device = 'Desktop'
        
    # OS
    if 'windows nt 10' in ua_lower:
        os_name = 'Windows 10/11'
    elif 'windows nt 6.3' in ua_lower:
        os_name = 'Windows 8.1'
    elif 'windows nt 6.1' in ua_lower:
        os_name = 'Windows 7'
    elif 'windows' in ua_lower:
        os_name = 'Windows'
    elif 'iphone' in ua_lower or 'ipad' in ua_lower or 'ipod' in ua_lower:
        os_name = 'iOS'
    elif 'android' in ua_lower:
        os_name = 'Android'
    elif 'mac os x' in ua_lower or 'macintosh' in ua_lower:
        os_name = 'macOS'
    elif 'linux' in ua_lower:
        os_name = 'Linux'
    else:
        os_name = 'Other'
        
    return {
        'device': device,
        'os': os_name,
        'browser': browser,
        'is_bot': is_bot
    }

def parse_referrer(referrer_url):
    if not referrer_url:
        return {'url': '', 'domain': 'Direct / Bookmark', 'category': 'Direct'}
    
    try:
        parsed = urllib.parse.urlparse(referrer_url)
        domain = parsed.netloc.lower()
        if not domain:
            return {'url': referrer_url, 'domain': 'Direct / Bookmark', 'category': 'Direct'}
        
        if domain.startswith('www.'):
            domain = domain[4:]
            
        category = 'Website'
        if 'google.' in domain:
            domain = 'Google'
            category = 'Search Engine'
        elif 'bing.' in domain:
            domain = 'Bing'
            category = 'Search Engine'
        elif 't.me' in domain or 'telegram' in domain:
            domain = 'Telegram'
            category = 'Social Media'
        elif 'linkedin.com' in domain:
            domain = 'LinkedIn'
            category = 'Social Media'
        elif 'instagram.com' in domain:
            domain = 'Instagram'
            category = 'Social Media'
        elif 'twitter.com' in domain or 'x.com' in domain or 't.co' in domain:
            domain = 'Twitter / X'
            category = 'Social Media'
        elif 'github.com' in domain:
            domain = 'GitHub'
            category = 'Developer'
        elif 'youtube.com' in domain:
            domain = 'YouTube'
            category = 'Social Media'
        elif 'whatsapp.com' in domain:
            domain = 'WhatsApp'
            category = 'Social Media'
            
        return {'url': referrer_url, 'domain': domain, 'category': category}
    except Exception:
        return {'url': referrer_url, 'domain': 'External', 'category': 'Website'}

def resolve_geo_for_visit(visit_id, ip, app_instance):
    """Asynchronously resolves IP geolocation and updates the PageVisit record."""
    if is_private_ip(ip):
        return
    
    # Check in-memory cache
    if ip in GEO_CACHE:
        geo = GEO_CACHE[ip]
        with app_instance.app_context():
            try:
                visit = db.session.get(PageVisit, visit_id)
                if visit:
                    visit.country = geo.get('country', 'Unknown')
                    visit.country_code = geo.get('country_code', 'XX')
                    visit.city = geo.get('city', 'Unknown')
                    visit.isp = geo.get('isp', '')
                    # Re-check bot status with resolved ISP
                    ua_check = parse_user_agent(visit.user_agent, path=visit.path, isp=visit.isp)
                    if ua_check['is_bot']:
                        visit.is_bot = True
                        visit.device_type = ua_check['device']
                    db.session.commit()
            except Exception:
                db.session.rollback()
        return

    # Try ip-api.com
    try:
        resp = requests.get(f"http://ip-api.com/json/{ip}?fields=status,message,country,countryCode,city,isp", timeout=3)
        if resp.status_code == 200:
            data = resp.json()
            if data.get('status') == 'success':
                geo = {
                    'country': data.get('country') or 'Unknown',
                    'country_code': data.get('countryCode') or 'XX',
                    'city': data.get('city') or 'Unknown',
                    'isp': data.get('isp') or ''
                }
                GEO_CACHE[ip] = geo
                with app_instance.app_context():
                    visit = db.session.get(PageVisit, visit_id)
                    if visit:
                        visit.country = geo['country']
                        visit.country_code = geo['country_code']
                        visit.city = geo['city']
                        visit.isp = geo['isp']
                        ua_check = parse_user_agent(visit.user_agent, path=visit.path, isp=visit.isp)
                        if ua_check['is_bot']:
                            visit.is_bot = True
                            visit.device_type = ua_check['device']
                        db.session.commit()
                return
    except Exception:
        pass
    
    # Fallback to ipapi.co
    try:
        resp = requests.get(f"https://ipapi.co/{ip}/json/", timeout=3, headers={'User-Agent': 'Mozilla/5.0'})
        if resp.status_code == 200:
            data = resp.json()
            geo = {
                'country': data.get('country_name') or 'Unknown',
                'country_code': data.get('country_code') or 'XX',
                'city': data.get('city') or 'Unknown',
                'isp': data.get('org') or ''
            }
            GEO_CACHE[ip] = geo
            with app_instance.app_context():
                visit = db.session.get(PageVisit, visit_id)
                if visit:
                    visit.country = geo['country']
                    visit.country_code = geo['country_code']
                    visit.city = geo['city']
                    visit.isp = geo['isp']
                    ua_check = parse_user_agent(visit.user_agent, path=visit.path, isp=visit.isp)
                    if ua_check['is_bot']:
                        visit.is_bot = True
                        visit.device_type = ua_check['device']
                    db.session.commit()
    except Exception:
        pass

def get_page_title(path):
    if path == '/' or path == '':
        return 'Home / Portfolio'
    elif path.startswith('/demo/'):
        parts = [p for p in path.split('/') if p]
        slug = parts[1] if len(parts) > 1 else ''
        return f'Demo: {slug}' if slug else 'Demo Site'
    elif path == '/download_resume':
        return 'Download Resume PDF'
    return path

def reclassify_existing_visits():
    """Re-analyzes all existing records in database and flags bots, scrapers, and exploit attempts."""
    try:
        visits = PageVisit.query.all()
        updated = 0
        for v in visits:
            path_lower = (v.path or '').lower()
            
            # Check if this was an asset, API, manifest, or exploit path
            is_exploit_or_asset = (
                any(path_lower.endswith(ext) for ext in EXPLOIT_EXTENSIONS) or
                any(sub in path_lower for sub in EXPLOIT_PATH_SUBSTRINGS) or
                path_lower.startswith(('/api/', '/site.webmanifest', '/robots.txt', '/sitemap', '/favicon'))
            )
            
            ua_info = parse_user_agent(v.user_agent, path=v.path, isp=v.isp)
            
            should_be_bot = ua_info['is_bot'] or is_exploit_or_asset or (v.browser == 'Other')
            
            if v.is_bot != should_be_bot or v.device_type != ua_info['device'] or v.browser != ua_info['browser']:
                v.is_bot = should_be_bot
                v.device_type = ua_info['device']
                v.browser = ua_info['browser']
                v.os = ua_info['os']
                updated += 1
                
        db.session.commit()
        return updated
    except Exception as e:
        db.session.rollback()
        print(f"Error during reclassification: {e}")
        return 0

# --- Visitor Tracking Middleware ---
@app.before_request
def track_visitor():
    path = request.path
    
    # 1. Ignore static files, uploads, admin routes, auth routes, and API endpoints
    if (path.startswith('/static') or 
        path.startswith('/assets') or 
        path.startswith('/admin') or 
        path.startswith('/login') or 
        path.startswith('/logout') or 
        path.startswith('/api/') or 
        path.startswith('/favicon') or
        path.startswith('/site.webmanifest') or
        path.startswith('/robots.txt') or
        path.startswith('/sitemap') or
        path.endswith(('.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.css', '.js', '.map', '.woff', '.woff2', '.ttf', '.webp', '.mp4', '.json', '.xml', '.txt', '.webmanifest'))):
        return
    
    # 2. Don't track if the logged-in admin is browsing
    if current_user.is_authenticated and path.startswith('/admin'):
        return

    # 3. Only track legitimate public web pages
    is_valid_page = (
        path in ('/', '') or 
        path == '/download_resume' or 
        path.startswith('/demo/')
    )

    try:
        ip = get_client_ip()
        ua_string = request.headers.get('User-Agent', '')
        
        # Check Cloudflare Country Header
        cf_country = request.headers.get('CF-IPCountry')
        initial_country = 'Unknown'
        initial_code = 'XX'
        initial_city = 'Unknown'
        initial_isp = ''
        
        if is_private_ip(ip):
            initial_country = 'Localhost'
            initial_code = 'LAN'
            initial_city = 'Local Network'
        elif ip in GEO_CACHE:
            cached = GEO_CACHE[ip]
            initial_country = cached.get('country', 'Unknown')
            initial_code = cached.get('country_code', 'XX')
            initial_city = cached.get('city', 'Unknown')
            initial_isp = cached.get('isp', '')
        elif cf_country and cf_country != 'XX':
            initial_code = cf_country
            initial_country = cf_country

        ua_info = parse_user_agent(ua_string, path=path, isp=initial_isp)
        
        # If it's an exploit probe or non-existent path, force bot
        if not is_valid_page:
            ua_info['is_bot'] = True

        ref = request.referrer or request.args.get('ref') or request.args.get('utm_source') or ''
        ref_info = parse_referrer(ref)
        
        today_str = datetime.date.today().isoformat()
        visitor_hash = hashlib.sha256(f"{ip}_{ua_string}_{today_str}".encode('utf-8')).hexdigest()[:16]
        
        visit = PageVisit(
            ip_address=ip,
            country=initial_country,
            country_code=initial_code,
            city=initial_city,
            isp=initial_isp,
            path=path,
            page_title=get_page_title(path),
            referrer=ref,
            referrer_domain=ref_info['domain'],
            user_agent=ua_string[:500],
            device_type=ua_info['device'],
            browser=ua_info['browser'],
            os=ua_info['os'],
            is_bot=ua_info['is_bot'],
            visitor_hash=visitor_hash,
            timestamp=datetime.datetime.utcnow()
        )
        db.session.add(visit)
        db.session.commit()
        
        # Async geo resolution if needed
        if not is_private_ip(ip) and ip not in GEO_CACHE and (initial_city == 'Unknown' or initial_country == 'Unknown'):
            threading.Thread(target=resolve_geo_for_visit, args=(visit.id, ip, app), daemon=True).start()
            
    except Exception:
        db.session.rollback()

# --- User Loader ---
@login_manager.user_loader
def load_user(user_id):
    return db.session.get(Admin, int(user_id))

# --- Helper Functions ---

def get_structured_data_for_ai():
    """Converts DB data into a structured JSON string for the LLM."""
    profile = Profile.query.first()
    projects = Project.query.all()
    exp = ResumeItem.query.filter_by(category='work').all()
    edu = ResumeItem.query.filter_by(category='education').all()
    skills = Skill.query.all()
    
    data = {
        "profile": {
            "name": profile.full_name if profile else "",
            "about": profile.about_me if profile else ""
        },
        "experience": [{"id": i.id, "title": i.title, "org": i.organization, "desc": i.description} for i in exp],
        "projects": [{"id": p.id, "title": p.title, "desc": p.short_description} for p in projects],
        "skills": [{"id": s.id, "name": s.name} for s in skills],
        "education": [{"id": e.id, "title": e.title} for e in edu]
    }
    return json.dumps(data, ensure_ascii=False)

def get_ai_settings():
    settings = AISettings.query.first()
    if not settings:
        settings = AISettings(
            provider_name="OpenRouter",
            api_url="https://openrouter.ai/api/v1/chat/completions",
            model_name="openrouter/free",
            api_key=os.getenv("OPENROUTER_API_KEY", ""),
            enable_reasoning=True,
            max_chat_requests=50,
            used_chat_requests=0,
            max_resume_requests=10,
            used_resume_requests=0
        )
        db.session.add(settings)
        db.session.commit()
    return settings

def ask_ai(system_prompt, user_prompt, json_mode=False, context_type="chat"):
    """
    Sends a request to the configured AI API.
    Enforces quota limits based on context_type ('chat' or 'resume').
    """
    settings = get_ai_settings()
    
    # Enforce request limits
    if context_type == "chat":
        if settings.used_chat_requests >= settings.max_chat_requests:
            return "Oops! My AI brain needs a little coffee break. The daily chat quota has been reached, but feel free to explore my portfolio and reach out via email!"
    elif context_type == "resume":
        if settings.used_resume_requests >= settings.max_resume_requests:
            raise Exception("AI quota exceeded for Resume Builder.")

    print(f"Connecting to AI Model: {settings.model_name} via {settings.provider_name}...")
    
    headers = {
        "Authorization": f"Bearer {settings.api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-site.com", 
        "X-Title": "My Portfolio Resume Builder"
    }
    
    payload = {
        "model": settings.model_name,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.4
    }
    
    if json_mode:
        payload["response_format"] = {"type": "json_object"}
        
    if settings.enable_reasoning:
        payload["reasoning"] = {"enabled": True}
        
    try:
        response = requests.post(settings.api_url, headers=headers, data=json.dumps(payload))
        response.raise_for_status()
        data = response.json()
        
        content = data['choices'][0]['message'].get('content', '')
        if not content:
            raise ValueError("Empty response received")
            
        # Increment quota upon success
        if context_type == "chat":
            settings.used_chat_requests += 1
        elif context_type == "resume":
            settings.used_resume_requests += 1
        db.session.commit()
            
        return content

    except Exception as e:
        print(f"Failed AI request: {str(e)}")
        raise e

# --- Public Routes ---

@app.route('/')
def index():
    # Serve the React frontend landing page
    dist_dir = os.path.join(app.root_path, 'frontend', 'dist')
    return send_from_directory(dist_dir, 'index.html')

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    assets_dir = os.path.join(app.root_path, 'frontend', 'dist', 'assets')
    return send_from_directory(assets_dir, filename)

@app.route('/api/portfolio')
def api_portfolio():
    profile = Profile.query.first()
    ongoing = Project.query.filter_by(status='ongoing').order_by(Project.order.asc()).all()
    completed = Project.query.filter_by(status='completed').order_by(Project.order.asc()).all()
    
    exp = ResumeItem.query.filter_by(category='work').order_by(ResumeItem.order.asc()).all()
    edu = ResumeItem.query.filter_by(category='education').order_by(ResumeItem.order.asc()).all()
    honors = ResumeItem.query.filter_by(category='honor').order_by(ResumeItem.order.asc()).all()
    papers = ResumeItem.query.filter_by(category='paper').order_by(ResumeItem.order.asc()).all()
    
    skills = Skill.query.order_by(Skill.level.desc()).all()
    demos = DemoSite.query.filter_by(is_active=True).order_by(DemoSite.order.asc()).all()
    
    def to_dict(model_list):
        return [{c.name: getattr(item, c.name) for c in item.__table__.columns} for item in model_list]
        
    profile_dict = {c.name: getattr(profile, c.name) for c in profile.__table__.columns} if profile else {}
    
    return jsonify({
        'profile': profile_dict,
        'ongoing': to_dict(ongoing),
        'completed': to_dict(completed),
        'exp': to_dict(exp),
        'edu': to_dict(edu),
        'honors': to_dict(honors),
        'papers': to_dict(papers),
        'skills': to_dict(skills),
        'demos': to_dict(demos)
    })

@app.route('/download_resume')
def download_resume():
    """Downloads the standard resume using the user's active selected template."""
    profile = Profile.query.first()
    projects = Project.query.order_by(Project.order.asc()).all()
    items = ResumeItem.query.order_by(ResumeItem.order.asc()).all()
    skills = Skill.query.order_by(Skill.order.asc()).all()

    active_tpl_key = (profile.resume_template if profile and profile.resume_template else 'modern')
    tpl_info = RESUME_TEMPLATES.get(active_tpl_key, RESUME_TEMPLATES['modern'])

    rendered = render_template(tpl_info['template_file'], 
                               profile=profile, 
                               projects=projects, 
                               items=items,
                               skills=skills,
                               host_url=request.host_url.rstrip('/'),
                               request=request)
    
    pdf = BytesIO()
    pisa_status = pisa.CreatePDF(BytesIO(rendered.encode("UTF-8")), dest=pdf)
    
    if pisa_status.err:
        return f"PDF Error: {pisa_status.err}"
        
    response = make_response(pdf.getvalue())
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = 'attachment; filename=Resume.pdf'
    return response

# --- Chatbot API Route ---
@app.route('/api/chat', methods=['POST'])
def chat_with_portfolio():
    user_message = request.json.get('message', '').strip()
    is_demo = request.json.get('is_demo', False)
    demo_name = request.json.get('demo_name', '')
    
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        if is_demo:
            system_inst = f"""
            You are the AI Assistant embedded inside the "{demo_name}" website demo.
            This is a demo website created by Rohollah Ebrahimi (a freelance web developer).
            Answer visitor questions. Remind them that this is just a demo and everything is fully customizable.
            If they want to order a site like this or ask for pricing, tell them to use the Order buttons (WhatsApp, Telegram, Email) in the floating menu.
            Be polite, helpful, and act as a sales representative for Rohollah's web design services.
            """
        else:
            relevant_context = get_relevant_context(user_message, k=5)
            
            if not relevant_context:
                 return jsonify({'reply': "I am still indexing the database. Please ask me again in a minute."})

            system_inst = f"""
            You are the AI Assistant for the portfolio.
            Answer visitor questions based ONLY on the context below.
            
            CONTEXT:
            {relevant_context}
            """

        # Use the robust ask_ai function
        bot_reply = ask_ai(system_inst, user_message, json_mode=False, context_type="chat")
        
        return jsonify({'reply': bot_reply})

    except Exception as e:
        print(f"Chat Error: {str(e)}")
        return jsonify({'reply': "Error connecting to AI service. Please try again later."})

# --- Auth Routes ---

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('admin_dashboard'))

    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        # Simple CAPTCHA logic
        user_captcha = request.form.get('captcha')
        real_answer = session.get('captcha_answer')
        
        if not real_answer or not user_captcha or int(user_captcha) != real_answer:
            flash('Invalid CAPTCHA! Please try again.', 'danger')
            return redirect(url_for('login'))

        admin = Admin.query.filter_by(username=username).first()
        
        # Verify user exists and password is correct
        # Supports both bcrypt hashed passwords and legacy plain-text passwords
        if admin:
            is_valid_password = False
            try:
                is_valid_password = bcrypt.check_password_hash(admin.password, password)
            except ValueError:
                # Fallback to plain text comparison if the password in DB is not a valid bcrypt hash
                pass
                
            if is_valid_password or admin.password == password:
                login_user(admin)
                flash('Logged in successfully.', 'success')
                session.pop('captcha_answer', None)
                return redirect(url_for('admin_dashboard'))
        
        flash('Invalid username or password.', 'danger')

    num1 = random.randint(1, 10)
    num2 = random.randint(1, 10)
    session['captcha_answer'] = num1 + num2
    captcha_question = f"{num1} + {num2} = ?"
    return render_template('login.html', captcha_question=captcha_question)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))

# --- Admin Routes ---

@app.route('/admin')
@login_required
def admin_dashboard():
    return render_template('admin_dashboard.html')

# --- Admin Analytics Routes ---

@app.route('/admin/analytics')
@login_required
def admin_analytics():
    time_range = request.args.get('range', '7d')
    search_query = request.args.get('search', '').strip()
    bot_filter = request.args.get('bot', '0')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 50))
    
    now = datetime.datetime.utcnow()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Calculate cutoff date based on range
    if time_range == 'today':
        cutoff = today_start
    elif time_range == '7d':
        cutoff = now - datetime.timedelta(days=7)
    elif time_range == '30d':
        cutoff = now - datetime.timedelta(days=30)
    else:  # 'all'
        cutoff = None
        
    base_query = PageVisit.query
    if cutoff:
        base_query = base_query.filter(PageVisit.timestamp >= cutoff)
        
    if bot_filter == '0':
        base_query = base_query.filter(PageVisit.is_bot == False)
    elif bot_filter == '1':
        base_query = base_query.filter(PageVisit.is_bot == True)
        
    if search_query:
        search_like = f"%{search_query}%"
        base_query = base_query.filter(
            or_(
                PageVisit.ip_address.like(search_like),
                PageVisit.path.like(search_like),
                PageVisit.country.like(search_like),
                PageVisit.city.like(search_like),
                PageVisit.referrer_domain.like(search_like),
                PageVisit.browser.like(search_like),
                PageVisit.os.like(search_like)
            )
        )
        
    # Global Verified Human KPIs
    all_time_human_views = PageVisit.query.filter_by(is_bot=False).count()
    all_time_human_unique = db.session.query(func.count(distinct(PageVisit.visitor_hash))).filter(PageVisit.is_bot == False).scalar() or 0
    today_human_views = PageVisit.query.filter(PageVisit.timestamp >= today_start, PageVisit.is_bot == False).count()
    today_human_unique = db.session.query(func.count(distinct(PageVisit.visitor_hash))).filter(PageVisit.timestamp >= today_start, PageVisit.is_bot == False).scalar() or 0
    total_bot_attacks = PageVisit.query.filter_by(is_bot=True).count()
    
    # Filtered KPI metrics for current view
    filtered_views = base_query.count()
    filtered_unique = base_query.with_entities(func.count(distinct(PageVisit.visitor_hash))).scalar() or 0
    
    # Top Pages
    top_pages = base_query.with_entities(
        PageVisit.path, 
        PageVisit.page_title, 
        func.count(PageVisit.id).label('count')
    ).group_by(PageVisit.path, PageVisit.page_title).order_by(desc('count')).limit(10).all()
    
    # Top Referrers
    top_referrers = base_query.with_entities(
        PageVisit.referrer_domain,
        func.count(PageVisit.id).label('count')
    ).group_by(PageVisit.referrer_domain).order_by(desc('count')).limit(10).all()
    
    # Top Countries
    top_countries = base_query.with_entities(
        PageVisit.country,
        PageVisit.country_code,
        func.count(PageVisit.id).label('count')
    ).group_by(PageVisit.country, PageVisit.country_code).order_by(desc('count')).limit(10).all()
    
    # Device breakdown
    device_counts = base_query.with_entities(
        PageVisit.device_type,
        func.count(PageVisit.id).label('count')
    ).group_by(PageVisit.device_type).all()
    
    # Browser breakdown
    browser_counts = base_query.with_entities(
        PageVisit.browser,
        func.count(PageVisit.id).label('count')
    ).group_by(PageVisit.browser).order_by(desc('count')).limit(6).all()

    # OS breakdown
    os_counts = base_query.with_entities(
        PageVisit.os,
        func.count(PageVisit.id).label('count')
    ).group_by(PageVisit.os).order_by(desc('count')).limit(6).all()
    
    # Timeline chart data
    chart_days = 30 if time_range == '30d' else (7 if time_range == '7d' else (1 if time_range == 'today' else 14))
    chart_labels = []
    chart_views = []
    chart_uniques = []
    
    is_bot_chart_filter = (PageVisit.is_bot == False) if bot_filter == '0' else ((PageVisit.is_bot == True) if bot_filter == '1' else None)
    
    if time_range == 'today':
        for h in range(24):
            h_start = today_start + datetime.timedelta(hours=h)
            h_end = h_start + datetime.timedelta(hours=1)
            q = PageVisit.query.filter(PageVisit.timestamp >= h_start, PageVisit.timestamp < h_end)
            if is_bot_chart_filter is not None:
                q = q.filter(is_bot_chart_filter)
            h_views = q.count()
            
            uq = db.session.query(func.count(distinct(PageVisit.visitor_hash))).filter(PageVisit.timestamp >= h_start, PageVisit.timestamp < h_end)
            if is_bot_chart_filter is not None:
                uq = uq.filter(is_bot_chart_filter)
            h_unique = uq.scalar() or 0
            
            chart_labels.append(f"{h:02d}:00")
            chart_views.append(h_views)
            chart_uniques.append(h_unique)
    else:
        for d in range(chart_days - 1, -1, -1):
            day_date = (now - datetime.timedelta(days=d)).date()
            d_start = datetime.datetime.combine(day_date, datetime.time.min)
            d_end = datetime.datetime.combine(day_date, datetime.time.max)
            
            q = PageVisit.query.filter(PageVisit.timestamp >= d_start, PageVisit.timestamp <= d_end)
            if is_bot_chart_filter is not None:
                q = q.filter(is_bot_chart_filter)
            d_views = q.count()
            
            uq = db.session.query(func.count(distinct(PageVisit.visitor_hash))).filter(PageVisit.timestamp >= d_start, PageVisit.timestamp <= d_end)
            if is_bot_chart_filter is not None:
                uq = uq.filter(is_bot_chart_filter)
            d_unique = uq.scalar() or 0
            
            chart_labels.append(day_date.strftime('%b %d'))
            chart_views.append(d_views)
            chart_uniques.append(d_unique)
            
    # Recent visits pagination
    visits_pagination = base_query.order_by(PageVisit.timestamp.desc()).paginate(page=page, per_page=per_page, error_out=False)
    
    return render_template(
        'admin_analytics.html',
        all_time_views=all_time_human_views,
        all_time_unique=all_time_human_unique,
        today_views=today_human_views,
        today_unique=today_human_unique,
        total_bot_attacks=total_bot_attacks,
        filtered_views=filtered_views,
        filtered_unique=filtered_unique,
        top_pages=top_pages,
        top_referrers=top_referrers,
        top_countries=top_countries,
        device_counts=device_counts,
        browser_counts=browser_counts,
        os_counts=os_counts,
        chart_labels=json.dumps(chart_labels),
        chart_views=json.dumps(chart_views),
        chart_uniques=json.dumps(chart_uniques),
        visits=visits_pagination.items,
        pagination=visits_pagination,
        time_range=time_range,
        search_query=search_query,
        bot_filter=bot_filter
    )

@app.route('/admin/analytics/reclassify', methods=['POST'])
@login_required
def reclassify_analytics():
    try:
        count = reclassify_existing_visits()
        flash(f'Successfully re-analyzed and cleaned {count} visitor records. Bot and scanner traffic is now filtered!', 'success')
    except Exception as e:
        db.session.rollback()
        flash(f'Error re-classifying records: {str(e)}', 'danger')
    return redirect(url_for('admin_analytics'))

@app.route('/admin/analytics/export')
@login_required
def export_analytics():
    visits = PageVisit.query.order_by(PageVisit.timestamp.desc()).all()
    
    si = io.StringIO()
    cw = csv.writer(si)
    cw.writerow(['ID', 'Timestamp (UTC)', 'IP Address', 'Country', 'Country Code', 'City', 'ISP', 'Path', 'Page Title', 'Referrer Domain', 'Referrer URL', 'Device', 'Browser', 'OS', 'Is Bot'])
    
    for v in visits:
        cw.writerow([
            v.id,
            v.timestamp.strftime('%Y-%m-%d %H:%M:%S') if v.timestamp else '',
            v.ip_address,
            v.country,
            v.country_code,
            v.city,
            v.isp,
            v.path,
            v.page_title,
            v.referrer_domain,
            v.referrer,
            v.device_type,
            v.browser,
            v.os,
            'Yes' if v.is_bot else 'No'
        ])
        
    output = make_response(si.getvalue().encode('utf-8-sig'))
    output.headers["Content-Disposition"] = f"attachment; filename=visitor_logs_{datetime.date.today().isoformat()}.csv"
    output.headers["Content-type"] = "text/csv; charset=utf-8"
    return output

@app.route('/admin/analytics/clear', methods=['POST'])
@login_required
def clear_analytics():
    try:
        PageVisit.query.delete()
        db.session.commit()
        flash('All visitor logs have been successfully cleared.', 'success')
    except Exception as e:
        db.session.rollback()
        flash(f'Error clearing logs: {str(e)}', 'danger')
    return redirect(url_for('admin_analytics'))

@app.route('/admin/refresh-ai-knowledge')
@login_required
def refresh_ai_knowledge():
    try:
        initialize_vector_db(app)
        flash('AI Knowledge Base successfully synced with Website Database!', 'success')
    except Exception as e:
        flash(f'Error updating AI: {str(e)}', 'danger')
        print(e)
    return redirect(url_for('admin_dashboard'))

# --- AI Settings Routes ---
@app.route('/admin/ai-settings', methods=['GET', 'POST'])
@login_required
def admin_ai_settings():
    settings = get_ai_settings()
        
    if request.method == 'POST':
        settings.provider_name = request.form.get('provider_name')
        settings.api_url = request.form.get('api_url')
        settings.api_key = request.form.get('api_key')
        settings.model_name = request.form.get('model_name')
        settings.enable_reasoning = request.form.get('enable_reasoning') == 'on'
        
        settings.max_chat_requests = int(request.form.get('max_chat_requests', 50))
        settings.max_resume_requests = int(request.form.get('max_resume_requests', 10))
        
        db.session.commit()
        flash('AI Settings updated successfully!', 'success')
        return redirect(url_for('admin_ai_settings'))
        
    return render_template('admin_ai_settings.html', settings=settings)

@app.route('/admin/ai-settings/reset', methods=['POST'])
@login_required
def reset_ai_usage():
    settings = get_ai_settings()
    settings.used_chat_requests = 0
    settings.used_resume_requests = 0
    db.session.commit()
    flash('AI usage counters have been reset to zero.', 'success')
    return redirect(url_for('admin_ai_settings'))

# --- AI Resume Builder Logic ---

@app.route('/admin/ai-resume', methods=['GET', 'POST'])
@login_required
def ai_resume_start():
    if request.method == 'GET':
        return render_template('admin_ai_resume.html')
    
    job_description = request.form.get('job_description')
    
    # 1. RAG Context
    rag_context = get_relevant_context(job_description, k=15)
    
    # 2. Raw Database Data
    my_data_json = get_structured_data_for_ai()
    
    # 3. Robust Prompt
    prompt = f"""
    You are a Senior Technical Resume Writer.
    Your Goal: Tailor my resume for a specific Job Description (JD).
    
    CRITICAL STYLE GUIDELINES:
    1. No AI Clichés (e.g., "unleashing", "delving", "tapestry").
    2. Scientific & Precise verbs ("Engineered", "Optimized", "Architected").
    3. Focus on Results (PAR Method).
    
    INPUT DATA:
    - Target JD: {job_description}
    - My Background (RAG): {rag_context}
    - DB Items (JSON): {my_data_json}
    
    TASK:
    1. Extract "target_role".
    2. Write "custom_summary" (Professional & Specific).
    3. Select IDs for relevant Experience, Projects, Skills (Keep Education).
    4. Rewrite descriptions for selected items to match JD keywords.
    
    OUTPUT JSON FORMAT ONLY:
    {{
        "target_role": "String",
        "custom_summary": "String",
        "selected_exp_ids": [Int],
        "selected_proj_ids": [Int],
        "selected_skill_ids": [Int],
        "selected_edu_ids": [Int],
        "selected_honor_ids": [],
        "selected_paper_ids": [],
        "tailored_descriptions": {{
            "exp_ID": "Rewritten description...",
            "proj_ID": "Rewritten description..."
        }}
    }}
    """
    
    try:
        # Use robust ask_ai with JSON mode enabled
        ai_content = ask_ai(
            system_prompt="You are a JSON-speaking Resume Assistant. Output valid JSON only.", 
            user_prompt=prompt,
            json_mode=True,
            context_type="resume"
        )
        
        # Clean up Markdown code blocks if present (common with DeepSeek/Llama)
        if "```json" in ai_content:
            ai_content = ai_content.split("```json")[1].split("```")[0]
        elif "```" in ai_content:
            ai_content = ai_content.split("```")[1].split("```")[0]
            
        ai_data = json.loads(ai_content)
        
        session['ai_suggestion'] = ai_data

        return render_template('admin_ai_result.html', 
                               ai_data=ai_data,
                               profile=Profile.query.first(),
                               projects=Project.query.order_by(Project.order.asc()).all(),
                               skills=Skill.query.order_by(Skill.order.asc()).all(),
                               exp=ResumeItem.query.filter_by(category='work').order_by(ResumeItem.order.asc()).all(),
                               edu=ResumeItem.query.filter_by(category='education').order_by(ResumeItem.order.asc()).all(),
                               honors=ResumeItem.query.filter_by(category='honor').order_by(ResumeItem.order.asc()).all(),
                               papers=ResumeItem.query.filter_by(category='paper').order_by(ResumeItem.order.asc()).all())
        
    except Exception as e:
        flash(f"AI Error: {str(e)}", "danger")
        print(f"DEBUG ERROR: {e}")
        return redirect(url_for('ai_resume_start'))

@app.route('/admin/ai-resume/generate', methods=['POST'])
@login_required
def ai_resume_generate():
    target_role = request.form.get('target_role')
    custom_summary = request.form.get('custom_summary')
    
    ids = {
        'exp': request.form.getlist('selected_exp'),
        'proj': request.form.getlist('selected_proj'),
        'edu': request.form.getlist('selected_edu'),
        'skill': request.form.getlist('selected_skills'),
        'honor': request.form.getlist('selected_honors'),
        'paper': request.form.getlist('selected_papers')
    }

    def process(model, id_list, desc_prefix=None):
        if not id_list: return []
        items = model.query.filter(model.id.in_(id_list)).all()
        item_map = {str(i.id): i for i in items}
        ordered = []
        for i_id in id_list:
            if i_id in item_map:
                obj = item_map[i_id]
                if desc_prefix:
                    new_text = request.form.get(f'{desc_prefix}_{i_id}')
                    if new_text:
                        if model == Project:
                            obj.short_description = new_text
                            obj.full_content = ""
                        else:
                            obj.description = new_text
                ordered.append(obj)
        return ordered
    data = {
        'full_name': Profile.query.first().full_name,
        'mobile': Profile.query.first().mobile,
        'email': Profile.query.first().email,
        'github': Profile.query.first().github,
        'linkedin': Profile.query.first().linkedin,
        'show_mobile': Profile.query.first().show_mobile,
        'show_email': Profile.query.first().show_email,
        'show_github': Profile.query.first().show_github,
        'show_linkedin': Profile.query.first().show_linkedin,
        'address': Profile.query.first().address,
        'target_role': target_role,
        'summary': custom_summary,
        'experience': process(ResumeItem, ids['exp'], 'desc_exp'),
        'projects': process(Project, ids['proj'], 'desc_proj'),
        'education': process(ResumeItem, ids['edu'], 'desc_edu'),
        'skills': process(Skill, ids['skill']),
        'honors': process(ResumeItem, ids['honor'], 'desc_honor'),
        'papers': process(ResumeItem, ids['paper'], 'desc_paper')
    }

    active_tpl_key = request.form.get('template_id') or (Profile.query.first().resume_template if Profile.query.first() and Profile.query.first().resume_template else 'modern')
    tpl_info = RESUME_TEMPLATES.get(active_tpl_key, RESUME_TEMPLATES['modern'])

    rendered = render_template(tpl_info['template_file'],
                               profile=Profile.query.first(),
                               projects=data['projects'],
                               items=data['experience'] + data['education'] + data['honors'] + data['papers'],
                               skills=data['skills'],
                               target_role=target_role,
                               summary=custom_summary,
                               host_url=request.host_url.rstrip('/'),
                               request=request,
                               data=data)
    pdf = BytesIO()
    pisa_status = pisa.CreatePDF(BytesIO(rendered.encode("UTF-8")), dest=pdf)
    if pisa_status.err:
        return f"PDF Error: {pisa_status.err}"
        
    response = make_response(pdf.getvalue())
    response.headers['Content-Type'] = 'application/pdf'
    role_filename = (target_role or "Custom").replace(" ", "_")
    response.headers['Content-Disposition'] = f'attachment; filename=AI_Resume_{role_filename}.pdf'
    return response

# --- Manual Resume Builder ---

@app.route('/admin/manual-builder', methods=['GET', 'POST'])
@login_required
def manual_resume_builder():
    if request.method == 'POST':
        return ai_resume_generate()

    return render_template('admin_manual_builder.html', 
                           profile=Profile.query.first(),
                           projects=Project.query.order_by(Project.order.asc()).all(),
                           skills=Skill.query.order_by(Skill.order.asc()).all(),
                           exp=ResumeItem.query.filter_by(category='work').order_by(ResumeItem.order.asc()).all(),
                           edu=ResumeItem.query.filter_by(category='education').order_by(ResumeItem.order.asc()).all(),
                           honors=ResumeItem.query.filter_by(category='honor').order_by(ResumeItem.order.asc()).all(),
                           papers=ResumeItem.query.filter_by(category='paper').order_by(ResumeItem.order.asc()).all())

# --- CRUD Routes (Projects) ---

@app.route('/admin/projects')
@login_required
def admin_projects_list():
    projects = Project.query.order_by(Project.order.asc()).all()
    return render_template('admin_project_list.html', projects=projects)

@app.route('/admin/projects/new', methods=['GET', 'POST'])
@login_required
def new_project():
    if request.method == 'POST':
        filename = None
        media = request.files.get('media_file')
        if media and media.filename:
            filename = secure_filename(media.filename)
            media.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        new_p = Project(
            title=request.form.get('title'),
            status=request.form.get('status'),
            short_description=request.form.get('short_description'),
            full_content=request.form.get('full_content'),
            github_link=request.form.get('github_link'),
            video_link=request.form.get('video_link'),
            live_link=request.form.get('live_link'),
            tags=request.form.get('tags'),
            media_file=filename,
            order=0
        )
        db.session.add(new_p)
        db.session.commit()
        flash('Project added!', 'success')
        return redirect(url_for('admin_projects_list'))
    return render_template('admin_edit_project.html', project=None)

@app.route('/admin/projects/edit/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_project(id):
    project = Project.query.get_or_404(id)
    if request.method == 'POST':
        project.title = request.form.get('title')
        project.status = request.form.get('status')
        project.short_description = request.form.get('short_description')
        project.full_content = request.form.get('full_content')
        project.github_link = request.form.get('github_link')
        project.video_link = request.form.get('video_link')
        project.live_link = request.form.get('live_link')
        project.tags = request.form.get('tags')
        
        media = request.files.get('media_file')
        if media and media.filename:
            filename = secure_filename(media.filename)
            media.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            project.media_file = filename
            
        db.session.commit()
        flash('Project updated!', 'success')
        return redirect(url_for('admin_projects_list'))
    return render_template('admin_edit_project.html', project=project)

@app.route('/admin/project/delete/<int:id>', methods=['POST'])
@login_required
def delete_project(id):
    project = Project.query.get_or_404(id)
    db.session.delete(project)
    db.session.commit()
    flash('Project deleted successfully.', 'success')
    return redirect(url_for('admin_projects_list'))

# --- AI Generator for About Me ---
@app.route('/admin/ai/generate-about-me', methods=['POST'])
@login_required
def generate_about_me():
    profile = Profile.query.first()
    skills = Skill.query.all()
    projects = Project.query.all()
    
    skill_names = [s.name for s in skills]
    project_titles = [p.title for p in projects]
    name = profile.full_name if profile and profile.full_name else "a professional"
    
    system_prompt = "You are an expert career coach and resume writer."
    user_prompt = f"Write a professional 'About Me' summary for a portfolio website. The candidate's name is {name}. Their main skills are: {', '.join(skill_names)}. Some of their projects include: {', '.join(project_titles)}. Write a compelling, professional, and well-structured summary (around 3-5 sentences) that highlights their expertise. Output ONLY the summary text, no extra conversational filler."
    
    try:
        generated_text = ask_ai(system_prompt, user_prompt, json_mode=False, context_type="resume")
        return jsonify({"success": True, "text": generated_text})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# --- Resume Template Gallery & Selector ---

@app.route('/admin/resume-templates', methods=['GET', 'POST'])
@login_required
def admin_resume_templates():
    profile = Profile.query.first()
    if request.method == 'POST':
        selected_id = request.form.get('template_id')
        if selected_id in RESUME_TEMPLATES:
            if profile:
                profile.resume_template = selected_id
                db.session.commit()
                flash(f"Resume template successfully changed to '{RESUME_TEMPLATES[selected_id]['name']}'!", "success")
        return redirect(url_for('admin_resume_templates'))
    
    current_template = (profile.resume_template if profile and profile.resume_template else 'modern')
    return render_template('admin_resume_templates.html', 
                           templates_list=list(RESUME_TEMPLATES.values()),
                           current_template=current_template)

@app.route('/admin/resume-templates/preview/<template_key>')
@login_required
def admin_resume_template_preview(template_key):
    if template_key not in RESUME_TEMPLATES:
        template_key = 'modern'
        
    tpl_info = RESUME_TEMPLATES[template_key]
    profile = Profile.query.first()
    projects = Project.query.order_by(Project.order.asc()).all()
    items = ResumeItem.query.order_by(ResumeItem.order.asc()).all()
    skills = Skill.query.order_by(Skill.order.asc()).all()
    
    rendered = render_template(tpl_info['template_file'],
                               profile=profile,
                               projects=projects,
                               items=items,
                               skills=skills,
                               target_role="Senior AI Specialist & Full-Stack Engineer",
                               host_url=request.host_url.rstrip('/'),
                               request=request)
    
    pdf = BytesIO()
    pisa_status = pisa.CreatePDF(BytesIO(rendered.encode("UTF-8")), dest=pdf)
    if pisa_status.err:
        return f"PDF Error: {pisa_status.err}"
        
    response = make_response(pdf.getvalue())
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = f'inline; filename=Resume_Preview_{template_key}.pdf'
    return response

# --- CRUD Routes (Resume Items) ---

@app.route('/admin/resume')
@login_required
def admin_resume_list():
    items = ResumeItem.query.order_by(ResumeItem.order.asc()).all()
    return render_template('admin_resume_list.html', items=items)

@app.route('/admin/resume/new', methods=['GET', 'POST'])
@login_required
def new_resume_item():
    if request.method == 'POST':
        item = ResumeItem(
            category=request.form.get('category'),
            title=request.form.get('title'),
            organization=request.form.get('organization'),
            duration=request.form.get('duration'),
            description=request.form.get('description'),
            order=0
        )
        db.session.add(item)
        db.session.commit()
        flash('Item added!', 'success')
        return redirect(url_for('admin_resume_list'))
    return render_template('admin_edit_resume.html', item=None)

@app.route('/admin/resume/edit/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_resume_item(id):
    item = ResumeItem.query.get_or_404(id)
    if request.method == 'POST':
        item.category = request.form.get('category')
        item.title = request.form.get('title')
        item.organization = request.form.get('organization')
        item.duration = request.form.get('duration')
        item.description = request.form.get('description')
        db.session.commit()
        flash('Resume item updated!', 'success')
        return redirect(url_for('admin_resume_list'))
    return render_template('admin_edit_resume.html', item=item)

@app.route('/admin/resume/delete/<int:id>')
@login_required
def delete_resume_item(id):
    item = ResumeItem.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return redirect(url_for('admin_resume_list'))

# --- CRUD Routes (Skills) ---

@app.route('/admin/skills', methods=['GET', 'POST'])
@login_required
def admin_skills():
    if request.method == 'POST':
        name = request.form.get('name')
        level = request.form.get('level')
        if name and level:
            db.session.add(Skill(name=name, level=int(level), order=0))
            db.session.commit()
            flash('Skill added!', 'success')
        return redirect(url_for('admin_skills'))
    return render_template('admin_skills.html', skills=Skill.query.order_by(Skill.order.asc()).all())

@app.route('/admin/skills/delete/<int:id>')
@login_required
def delete_skill(id):
    skill = Skill.query.get_or_404(id)
    db.session.delete(skill)
    db.session.commit()
    return redirect(url_for('admin_skills'))

# --- Reordering Route ---

@app.route('/admin/reorder', methods=['POST'])
@login_required
def reorder_items():
    data = request.json
    model_map = {'skill': Skill, 'project': Project, 'resume': ResumeItem, 'demo': DemoSite}
    model_cls = model_map.get(data.get('model'))

    if not model_cls:
        return jsonify({'status': 'error', 'message': 'Invalid model'}), 400

    try:
        for index, item_id in enumerate(data.get('order', [])):
            item = model_cls.query.get(item_id)
            if item:
                item.order = index
        db.session.commit()
        return jsonify({'status': 'success'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

# --- Profile & Account Routes ---

@app.route('/admin/profile', methods=['GET', 'POST'])
@login_required
def edit_profile():
    profile = Profile.query.first()
    if not profile:
        profile = Profile()
        db.session.add(profile)
        db.session.commit()
        
    if request.method == 'POST':
        profile.full_name = request.form.get('full_name')
        profile.mobile = request.form.get('mobile')
        profile.email = request.form.get('email')
        profile.github = request.form.get('github')
        profile.linkedin = request.form.get('linkedin')
        profile.twitter = request.form.get('twitter')
        profile.telegram = request.form.get('telegram')
        profile.youtube = request.form.get('youtube')
        
        profile.show_mobile = 'show_mobile' in request.form
        profile.show_email = 'show_email' in request.form
        profile.show_github = 'show_github' in request.form
        profile.show_linkedin = 'show_linkedin' in request.form
        profile.show_twitter = 'show_twitter' in request.form
        profile.show_telegram = 'show_telegram' in request.form
        profile.show_whatsapp = 'show_whatsapp' in request.form
        profile.show_youtube = 'show_youtube' in request.form
        
        profile.address = request.form.get('address')
        profile.about_me = request.form.get('about_me')
        profile.interests = request.form.get('interests')
        profile.personality = request.form.get('personality')
        profile.hobbies = request.form.get('hobbies')
        
        if 'profile_pic' in request.files:
            file = request.files['profile_pic']
            if file and file.filename != '':
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                profile.profile_pic = filename
        
        db.session.commit()
        flash('Profile updated!', 'success')
        return redirect(url_for('edit_profile'))
        
    return render_template('admin_profile.html', profile=profile)

@app.route('/admin/account', methods=['GET', 'POST'])
@login_required
def admin_account():
    if request.method == 'POST':
        current_password = request.form.get('current_password')
        new_username = request.form.get('new_username')
        new_password = request.form.get('new_password')
        confirm_password = request.form.get('confirm_password')
        
        # Verify current password (supports both hash and plain-text for backward compatibility)
        is_valid_current = False
        try:
            is_valid_current = bcrypt.check_password_hash(current_user.password, current_password)
        except ValueError:
            pass
            
        if not (is_valid_current or current_user.password == current_password):
            flash('Incorrect current password!', 'danger')
            return redirect(url_for('admin_account'))
            
        if new_username:
            current_user.username = new_username
            
        if new_password:
            if new_password != confirm_password:
                flash('New passwords do not match!', 'danger')
                return redirect(url_for('admin_account'))
            
            # Hash the new password before storing it
            current_user.password = bcrypt.generate_password_hash(new_password).decode('utf-8')
            
        db.session.commit()
        flash('Settings updated! Please login again.', 'success')
        logout_user()
        return redirect(url_for('login'))
        
    return render_template('admin_account.html')

# --- Demo Sites Management ---

def process_demo_zip(zip_file, target_dir):
    """
    Extracts uploaded demo zip to target_dir and validates that it contains html files.
    Promotes single subfolder if necessary.
    Returns (success: bool, error_message: str)
    """
    temp_dir = target_dir + '_temp_' + str(int(time.time() * 1000))
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    os.makedirs(temp_dir, exist_ok=True)
    
    zip_filename = secure_filename(zip_file.filename) or 'demo_upload.zip'
    zip_path = os.path.join(app.config['UPLOAD_FOLDER'], zip_filename)
    zip_file.save(zip_path)
    
    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(temp_dir)
        if os.path.exists(zip_path):
            os.remove(zip_path) # Clean up zip
            
        # Check if the extracted zip contained a single root directory
        extracted_items = os.listdir(temp_dir)
        if len(extracted_items) == 1:
            single_item_path = os.path.join(temp_dir, extracted_items[0])
            if os.path.isdir(single_item_path):
                # Promote contents up one level
                for item in os.listdir(single_item_path):
                    shutil.move(os.path.join(single_item_path, item), temp_dir)
                os.rmdir(single_item_path)
                
        # Check if there's any HTML file
        has_html = False
        for root, dirs, files in os.walk(temp_dir):
            if any(f.lower().endswith('.html') or f.lower().endswith('.htm') for f in files):
                has_html = True
                break
                
        if not has_html:
            if os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)
            return False, 'The uploaded zip file does not contain any .html files. Please check your zip file.'
                
        # Replace target directory with the new contents
        if os.path.exists(target_dir):
            shutil.rmtree(target_dir)
        shutil.move(temp_dir, target_dir)
        return True, None
    except Exception as e:
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
        if os.path.exists(zip_path):
            os.remove(zip_path)
        return False, f'Error processing zip: {e}'

@app.route('/admin/demos', methods=['GET', 'POST'])
@login_required
def admin_demos():
    if request.method == 'POST':
        title = request.form.get('title', '').strip()
        slug = request.form.get('slug', '').strip().lower()
        description = request.form.get('description', '').strip()
        zip_file = request.files.get('demo_zip')
        
        if not title or not slug or not zip_file:
            flash('Title, slug, and zip file are required.', 'danger')
            return redirect(url_for('admin_demos'))
            
        existing = DemoSite.query.filter_by(slug=slug).first()
        if existing:
            flash('A demo with this URL slug already exists. Please choose a unique slug.', 'danger')
            return redirect(url_for('admin_demos'))

        media = request.files.get('media_file')
        media_filename = None
        if media and media.filename:
            media_filename = secure_filename(media.filename)
            media.save(os.path.join(app.config['UPLOAD_FOLDER'], media_filename))
            
        # Ensure demos directory exists
        demos_dir = os.path.join(app.root_path, 'static', 'demos')
        os.makedirs(demos_dir, exist_ok=True)
        
        target_dir = os.path.join(demos_dir, slug)
        success, err = process_demo_zip(zip_file, target_dir)
        if not success:
            flash(err, 'danger')
            return redirect(url_for('admin_demos'))
            
        demo = DemoSite(title=title, slug=slug, description=description, media_file=media_filename)
        db.session.add(demo)
        db.session.commit()
        flash('Demo site uploaded and deployed successfully.', 'success')
        return redirect(url_for('admin_demos'))
        
    demos = DemoSite.query.order_by(DemoSite.order.asc()).all()
    return render_template('admin_demos.html', demos=demos)

@app.route('/admin/demos/edit/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_demo(id):
    demo = DemoSite.query.get_or_404(id)
    if request.method == 'POST':
        title = request.form.get('title', '').strip()
        slug = request.form.get('slug', '').strip().lower()
        description = request.form.get('description', '').strip()
        is_active = True if request.form.get('is_active') in ['1', 'on', 'true', True] else False
        
        if not title or not slug:
            flash('Title and URL slug are required.', 'danger')
            return render_template('admin_edit_demo.html', demo=demo)
            
        # Check slug uniqueness against other demos
        conflict = DemoSite.query.filter(DemoSite.slug == slug, DemoSite.id != demo.id).first()
        if conflict:
            flash('A demo with this URL slug already exists. Please choose a unique slug.', 'danger')
            return render_template('admin_edit_demo.html', demo=demo)
            
        demos_dir = os.path.join(app.root_path, 'static', 'demos')
        os.makedirs(demos_dir, exist_ok=True)
        
        old_slug = demo.slug
        old_target_dir = os.path.join(demos_dir, old_slug)
        new_target_dir = os.path.join(demos_dir, slug)
        
        # If slug changed, rename the static directory
        if slug != old_slug:
            if os.path.exists(old_target_dir):
                if os.path.exists(new_target_dir):
                    shutil.rmtree(new_target_dir)
                shutil.move(old_target_dir, new_target_dir)
            demo.slug = slug
            
        # Optional Zip Replacement
        zip_file = request.files.get('demo_zip')
        if zip_file and zip_file.filename:
            target_dir = os.path.join(demos_dir, demo.slug)
            success, err = process_demo_zip(zip_file, target_dir)
            if not success:
                flash(err, 'danger')
                return render_template('admin_edit_demo.html', demo=demo)
                
        # Optional Media File Replacement / Removal
        if request.form.get('remove_media') == '1':
            demo.media_file = None
            
        media = request.files.get('media_file')
        if media and media.filename:
            media_filename = secure_filename(media.filename)
            media.save(os.path.join(app.config['UPLOAD_FOLDER'], media_filename))
            demo.media_file = media_filename
            
        demo.title = title
        demo.description = description
        demo.is_active = is_active
        
        db.session.commit()
        flash('Demo updated successfully.', 'success')
        return redirect(url_for('admin_demos'))
        
    return render_template('admin_edit_demo.html', demo=demo)

@app.route('/admin/demos/delete/<int:id>', methods=['POST'])
@login_required
def delete_demo(id):
    demo = DemoSite.query.get_or_404(id)
    demos_dir = os.path.join(app.root_path, 'static', 'demos', demo.slug)
    if os.path.exists(demos_dir):
        shutil.rmtree(demos_dir)
    db.session.delete(demo)
    db.session.commit()
    flash('Demo deleted successfully.', 'success')
    return redirect(url_for('admin_demos'))

# --- Demo Hosting & Injection ---

DEMO_FAB_TEMPLATE = """
<!-- BEGIN DEMO INJECTION -->
<div style="position: fixed; bottom: 20px; left: 20px; z-index: 999999; font-family: sans-serif; background: rgba(0,0,0,0.8); color: white; padding: 15px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); max-width: 250px;">
    <h6 style="margin: 0 0 10px 0; font-weight: bold; color: #fff; font-size: 16px;">This is a Live Demo</h6>
    <p style="font-size: 12px; margin: 0 0 15px 0; line-height: 1.4; color: #ccc;">Fully customizable. Order a site like this:</p>
    <div style="display: flex; flex-direction: column; gap: 8px;">
        <a href="https://wa.me/{whatsapp}?text=Hi!%20I%20am%20interested%20in%20ordering%20a%20website%20like%20the%20{demo_name}%20demo." target="_blank" style="display: block; text-align: center; background: #25D366; color: white; text-decoration: none; padding: 8px; border-radius: 5px; font-weight: bold; font-size: 13px;">📲 WhatsApp</a>
        <a href="{telegram}?text=Hi!%20I%20am%20interested%20in%20ordering%20a%20website%20like%20the%20{demo_name}%20demo." target="_blank" style="display: block; text-align: center; background: #0088cc; color: white; text-decoration: none; padding: 8px; border-radius: 5px; font-weight: bold; font-size: 13px;">✈️ Telegram</a>
        <a href="mailto:{email}?subject=Interested%20in%20{demo_name}%20website&body=Hi!%20I%20am%20interested%20in%20ordering%20a%20website%20like%20the%20{demo_name}%20demo." style="display: block; text-align: center; background: #dc3545; color: white; text-decoration: none; padding: 8px; border-radius: 5px; font-weight: bold; font-size: 13px;">✉️ Email</a>
    </div>
</div>
<script>window.IS_DEMO_SITE = true; window.DEMO_NAME = "{demo_name}";</script>
<!-- END DEMO INJECTION -->
</body>
"""

@app.route('/demo/<slug>')
@app.route('/demo/<slug>/')
@app.route('/demo/<slug>/<path:filename>')
def serve_demo(slug, filename=None):
    demo = DemoSite.query.filter_by(slug=slug).first()
    if not demo:
        return "Demo not found", 404
        
    demos_dir = os.path.join(app.root_path, 'static', 'demos', slug)
    
    # If no filename provided or it's a directory, try to find an index file or fallback to first html file
    if not filename or filename.endswith('/'):
        prefix = filename if filename else ""
        if os.path.exists(os.path.join(demos_dir, prefix + "index.html")):
            filename = prefix + "index.html"
        elif os.path.exists(os.path.join(demos_dir, prefix + "index.htm")):
            filename = prefix + "index.htm"
        else:
            # Fallback: look for any .html file in that directory
            search_dir = os.path.join(demos_dir, prefix)
            if os.path.exists(search_dir):
                html_files = [f for f in os.listdir(search_dir) if f.lower().endswith('.html') or f.lower().endswith('.htm')]
                if html_files:
                    # Sort to make it deterministic, or prefer 'home' if it exists
                    html_files.sort(key=lambda x: 0 if 'home' in x.lower() else 1)
                    filename = prefix + html_files[0]
                else:
                    return "No HTML file found in directory.", 404
            else:
                return "Directory not found", 404
        
    file_path = os.path.join(demos_dir, filename)
    
    if not os.path.exists(file_path):
        # Try appending .html
        if os.path.exists(file_path + '.html'):
            file_path += '.html'
        else:
            return "File not found", 404
            
    # Inject if HTML
    if file_path.endswith('.html') or file_path.endswith('.htm'):
        profile = Profile.query.first()
        wa = profile.mobile.replace('+', '').replace(' ', '') if profile and profile.mobile else ""
        tg = profile.telegram if profile and profile.telegram else "#"
        em = profile.email if profile and profile.email else ""
        
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
        # Get Chat Widget HTML
        chat_html = render_template('chat_widget.html')
            
        injection = DEMO_FAB_TEMPLATE.format(
            demo_name=demo.title,
            whatsapp=wa,
            telegram=tg,
            email=em
        ) + chat_html + "</body>"
        
        if "</body>" in content:
            content = content.replace("</body>", injection)
        else:
            content += injection
            
        response = make_response(content)
        response.headers['Content-Type'] = 'text/html; charset=utf-8'
        return response
    
    return send_from_directory(demos_dir, filename)

# --- Initialization & Main ---

def run_async_indexing(app_instance):
    """Runs vector DB indexing in background on startup"""
    with app_instance.app_context():
        try:
            print("Starting background indexing...")
            initialize_vector_db(app_instance)
            print("Background indexing finished!")
        except Exception as e:
            print(f"Background indexing failed: {e}")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # Clean & re-classify existing visits to ensure bot/scanner traffic is filtered
        try:
            cleaned = reclassify_existing_visits()
            if cleaned > 0:
                print(f"Analytics: Automatically re-classified {cleaned} historical visitor records.")
        except Exception as e:
            print(f"Analytics reclassification skipped: {e}")

        # Create default admin if not exists
        if not Admin.query.filter_by(username='admin').first():
            # Hash the default password for security
            hashed_pw = bcrypt.generate_password_hash('123').decode('utf-8')
            db.session.add(Admin(username='admin', password=hashed_pw))
            db.session.commit()
            print("Initialized default admin user.")
    
    # Run indexing in background thread if not in reloader
    if os.environ.get('WERKZEUG_RUN_MAIN') != 'true':
        threading.Thread(target=run_async_indexing, args=(app,), daemon=True).start()

    app.run(debug=True, host='0.0.0.0', port=5000)