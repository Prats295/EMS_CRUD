import sqlite3

def get_db_connection():
    conn = sqlite3.connect("ems.db")   # database file
    conn.row_factory = sqlite3.Row     # access columns by name
    return conn
