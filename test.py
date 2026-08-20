import sqlite3
c = sqlite3.connect('instance/portfolio.db').cursor()
print(c.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall())
