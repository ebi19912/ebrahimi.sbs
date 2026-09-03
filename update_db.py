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

try:
    cursor.execute("ALTER TABLE profile ADD COLUMN favicon VARCHAR(100)")
    print("Column 'favicon' added to profile")
except sqlite3.OperationalError:
    print("Column 'favicon' already exists in profile")

conn.commit()
conn.close()