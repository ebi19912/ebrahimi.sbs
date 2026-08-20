from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

class Admin(db.Model, UserMixin):
    """
    Admin model for authentication and CMS access.
    Inherits from UserMixin to integrate with Flask-Login.
    """
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False) # Stores bcrypt hashed password

class Profile(db.Model):
    """
    Profile model storing the candidate's personal information.
    There should typically be only one record in this table.
    """
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100))
    contact_info = db.Column(db.Text) # Legacy field
    mobile = db.Column(db.String(50))
    email = db.Column(db.String(100))
    github = db.Column(db.String(200))
    linkedin = db.Column(db.String(200))
    twitter = db.Column(db.String(200))
    telegram = db.Column(db.String(200))
    
    show_mobile = db.Column(db.Boolean, default=True)
    show_email = db.Column(db.Boolean, default=True)
    show_github = db.Column(db.Boolean, default=True)
    show_linkedin = db.Column(db.Boolean, default=True)
    show_twitter = db.Column(db.Boolean, default=True)
    show_telegram = db.Column(db.Boolean, default=True)
    show_whatsapp = db.Column(db.Boolean, default=True)
    
    address = db.Column(db.String(200))
    about_me = db.Column(db.Text)
    interests = db.Column(db.Text)
    personality = db.Column(db.Text)
    hobbies = db.Column(db.Text)
    profile_pic = db.Column(db.String(100)) # Filename of the uploaded picture

class ResumeItem(db.Model):
    """
    Model for storing resume items like Work Experience, Education, Honors, etc.
    The 'category' field determines the section it belongs to.
    """
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50))  # e.g., 'work', 'education', 'honor', 'paper'
    title = db.Column(db.String(200))
    organization = db.Column(db.String(200))
    duration = db.Column(db.String(100))
    description = db.Column(db.Text)
    # فیلد اولویت برای مدیریت ترتیب نمایش (Order field for managing display order)
    order = db.Column(db.Integer, default=0)

class Project(db.Model):
    """
    Model for portfolio projects.
    Stores descriptions, links (GitHub, live demo, video), and status.
    """
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    status = db.Column(db.String(20)) # e.g., 'ongoing', 'completed'
    short_description = db.Column(db.Text)
    full_content = db.Column(db.Text)
    github_link = db.Column(db.String(200))
    video_link = db.Column(db.String(200))
    live_link = db.Column(db.String(200))
    # فیلد اولویت برای مدیریت ترتیب نمایش
    order = db.Column(db.Integer, default=0)

class Skill(db.Model):
    """
    Model for technical skills.
    'level' is expected to be a percentage (0-100).
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50)) 
    level = db.Column(db.Integer)
    # فیلد اولویت برای مدیریت ترتیب نمایش
    order = db.Column(db.Integer, default=0)

class AISettings(db.Model):
    """
    Settings for the AI integration, allowing dynamic configuration from the admin panel.
    """
    id = db.Column(db.Integer, primary_key=True)
    provider_name = db.Column(db.String(100), default="OpenRouter")
    api_url = db.Column(db.String(200), default="https://openrouter.ai/api/v1/chat/completions")
    api_key = db.Column(db.String(200), default="")
    model_name = db.Column(db.String(100), default="openrouter/free")
    enable_reasoning = db.Column(db.Boolean, default=True)
    
    max_chat_requests = db.Column(db.Integer, default=50)
    used_chat_requests = db.Column(db.Integer, default=0)
    
    max_resume_requests = db.Column(db.Integer, default=10)
    used_resume_requests = db.Column(db.Integer, default=0)

class DemoSite(db.Model):
    """
    Model for storing website demos uploaded via zip.
    """
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    slug = db.Column(db.String(200), unique=True)
    description = db.Column(db.Text)
    cover_image = db.Column(db.String(100)) # Filename of cover
    is_active = db.Column(db.Boolean, default=True)
    order = db.Column(db.Integer, default=0)