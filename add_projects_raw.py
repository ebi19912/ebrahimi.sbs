import sqlite3
import requests

repos = [
    'ebi19912/AutoEncoder_FeatureExt_mosmeddata',
    'ebi19912/AddProduct_AI_Wordpress'
]

conn = sqlite3.connect('instance/database.db')
cursor = conn.cursor()

for repo in repos:
    url = f'https://api.github.com/repos/{repo}'
    resp = requests.get(url)
    if resp.status_code == 200:
        data = resp.json()
        title = data.get('name', '')
        description = data.get('description', '') or 'No description provided.'
        link = data.get('html_url', '')
        
        cursor.execute('SELECT id FROM project WHERE github_link = ?', (link,))
        if not cursor.fetchone():
            cursor.execute('INSERT INTO project (title, short_description, github_link, status, "order") VALUES (?, ?, ?, ?, ?)', (title, description, link, 'completed', 0))
            print(f'Added: {title}')
        else:
            print(f'Already exists: {title}')
    else:
        print(f'Failed to fetch {repo}')

conn.commit()
conn.close()
