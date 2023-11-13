import sqlite3

with open('../relation.sql', 'r') as sql_file:
    sql_script = sql_file.read()


db = sqlite3.connect('../db.sqlite3')
cursor = db.cursor()
cursor.executescript(sql_script)
db.commit()
db.close()
