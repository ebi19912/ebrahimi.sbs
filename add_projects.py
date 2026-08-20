import requests
from app import app, db
from models import Project

repos = [
    'ebi19912/AutoEncoder_FeatureExt_mosmeddata',
    'ebi19912/AddProduct_AI_Wordpress'
]

with app.app_context():
    for repo in repos:
        url = f'https://api.github.com/repos/{repo}'
        resp = requests.get(url)
        if resp.status_code == 200:
            data = resp.json()
            title = data.get('name', '')
            description = data.get('description', '') or 'No description provided.'
            link = data.get('html_url', '')
            
            existing = Project.query.filter_by(link=link).first()
            if not existing:
                p = Project(title=title, description=description, link=link)
                db.session.add(p)
                print(f'Added: {title}')
            else:
                print(f'Already exists: {title}')
        else:
            print(f'Failed to fetch {repo}')
            
    db.session.commit()
