import os
import sys
from sqlalchemy import text

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app import app, db
from models import AISettings

with app.app_context():
    # Create the table if it doesn't exist
    db.create_all()
    
    # Initialize default settings if none exist
    settings = AISettings.query.first()
    if not settings:
        settings = AISettings(
            provider_name="OpenRouter",
            api_url="https://openrouter.ai/api/v1/chat/completions",
            api_key=os.getenv("OPENROUTER_API_KEY", ""),
            model_name="openrouter/free",
            enable_reasoning=True,
            max_chat_requests=50,
            used_chat_requests=0,
            max_resume_requests=10,
            used_resume_requests=0
        )
        db.session.add(settings)
        db.session.commit()
        print("AISettings table created and initialized.")
    else:
        print("AISettings already exists.")
