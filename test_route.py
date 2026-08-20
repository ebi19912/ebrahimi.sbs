from app import app
from flask import send_from_directory

with app.test_request_context():
    try:
        resp = app.test_client().get('/demo/lasamarmo/assets/index-mfsNL2HL.js')
        print(resp.status_code)
    except Exception as e:
        print(e)
