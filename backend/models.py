import sqlite3

def get_db_connection():
    conn = sqlite3.connect("ems.db")
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Drop old table if exists (so we can recreate with new schema)
    cursor.execute("DROP TABLE IF EXISTS users")

    # Create users table with new columns
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    # Create employees table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            position TEXT NOT NULL,
            salary REAL NOT NULL
        )
    """)

    conn.commit()
    conn.close()
