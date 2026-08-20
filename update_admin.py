import os
import sys

# Add current path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db, Admin, bcrypt

with app.app_context():
    # Find existing admin or create a new one
    admin = Admin.query.first()
    if not admin:
        admin = Admin()
        db.session.add(admin)
    
    # Update credentials
    admin.username = 'ebrahimirohollah@gmail.com'
    admin.password = bcrypt.generate_password_hash('RavelPavel69@@').decode('utf-8')
    
    db.session.commit()
    print("Admin credentials updated successfully!")
