import os
import sys
from sqlalchemy import text

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app import app, db

def add_boolean_column(table_name, column_name):
    try:
        db.session.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} BOOLEAN DEFAULT 1"))
        db.session.commit()
        print(f"Added column {column_name} to {table_name}.")
    except Exception as e:
        db.session.rollback()
        print(f"Column {column_name} might already exist: {e}")

with app.app_context():
    add_boolean_column("profile", "show_mobile")
    add_boolean_column("profile", "show_email")
    add_boolean_column("profile", "show_github")
    add_boolean_column("profile", "show_linkedin")
    add_boolean_column("profile", "show_twitter")
    add_boolean_column("profile", "show_telegram")
    add_boolean_column("profile", "show_whatsapp")
