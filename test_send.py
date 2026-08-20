import os
from flask import Flask, send_from_directory

app = Flask(__name__)
os.makedirs('test_dir/assets', exist_ok=True)
with open('test_dir/assets/test.js', 'w') as f:
    f.write('console.log("hello");')

@app.route('/<path:filename>')
def serve(filename):
    return send_from_directory('test_dir', filename)

if __name__ == '__main__':
    with app.test_request_context('/assets/test.js'):
        try:
            resp = serve('assets/test.js')
            print("Status:", resp.status_code)
        except Exception as e:
            print("Error:", e)
