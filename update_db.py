import sqlite3

# اتصال به دیتابیس
conn = sqlite3.connect('instance/database.db')
cursor = conn.cursor()

tables = ['project', 'resume_item', 'skill']

for table in tables:
    try:
        # اضافه کردن ستون order
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN 'order' INTEGER DEFAULT 0")
        print(f"Column 'order' added to {table}")
    except sqlite3.OperationalError:
        print(f"Column 'order' already exists in {table}")

conn.commit()
conn.close()