import os
import json
import random
import threading
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

# Import your database models
from models import db, Admin, Project, ResumeItem, Skill, Profile, AISettings, DemoSite

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

# --- AI Client Configuration ---
# AI Configuration is now loaded dynamically from the AISettings model in the database.

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
    """Downloads the standard, generic resume."""
    profile = Profile.query.first()
    projects = Project.query.order_by(Project.order.asc()).all()
    items = ResumeItem.query.order_by(ResumeItem.order.asc()).all()
    skills = Skill.query.order_by(Skill.order.asc()).all()

    rendered = render_template('resume_pdf_template.html', 
                               profile=profile, 
                               projects=projects, 
                               items=items,
                               skills=skills)
    
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

    rendered = render_template('manual_pdf_template.html', data=data)
    pdf = BytesIO()
    pisa.CreatePDF(BytesIO(rendered.encode("UTF-8")), dest=pdf)
    response = make_response(pdf.getvalue())
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = f'attachment; filename=AI_Resume_{target_role.replace(" ", "_")}.pdf'
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