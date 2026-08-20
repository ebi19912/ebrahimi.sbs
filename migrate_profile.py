import os
import sys
from sqlalchemy import text

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app import app, db

def add_column_if_not_exists(table_name, column_name, column_type):
    try:
        db.session.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type}"))
        db.session.commit()
        print(f"Added column {column_name} to {table_name}.")
    except Exception as e:
        db.session.rollback()
        print(f"Column {column_name} might already exist: {e}")

with app.app_context():
    add_column_if_not_exists("profile", "mobile", "VARCHAR(50)")
    add_column_if_not_exists("profile", "email", "VARCHAR(100)")
    add_column_if_not_exists("profile", "github", "VARCHAR(200)")
    add_column_if_not_exists("profile", "linkedin", "VARCHAR(200)")
    add_column_if_not_exists("profile", "twitter", "VARCHAR(200)")
    add_column_if_not_exists("profile", "telegram", "VARCHAR(200)")
