import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app import app, db

with app.app_context():
    db.create_all()
    print("Database updated with DemoSite.")
