from app import app
import os

with app.app_context():
    print(os.listdir('static/demos/lasamarmo.it'))
