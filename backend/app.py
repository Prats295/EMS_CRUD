from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DB = "employees.db"

# Helper function
def query_db(query, args=(), one=False):
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute(query, args)
    conn.commit()
    rv = cur.fetchall()
    conn.close()
    return (rv[0] if rv else None) if one else rv

# ------------------ USERS (Login/Register) ------------------

# Create users table if not exists
def init_users():
    query_db("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    """)

# Insert default admin user
def insert_admin_user():
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE email='admin@example.com'")
    if not cur.fetchall():
        cur.execute("INSERT INTO users (email, password) VALUES (?, ?)",
                    ("admin@example.com", "admin123"))
    conn.commit()
    conn.close()

init_users()
insert_admin_user()

# Register
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    try:
        query_db("INSERT INTO users (email, password) VALUES (?, ?)", 
                 (data["email"], data["password"]))
        return jsonify({"message": "User registered successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already exists"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Login
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    try:
        user = query_db("SELECT * FROM users WHERE email=? AND password=?", 
                        (data["email"], data["password"]), one=True)
        if user:
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------ EMPLOYEES ------------------

# Create employees table if not exists
def init_employees():
    query_db("""
    CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        department TEXT NOT NULL
    )
    """)

# Insert 10 sample employees if table is empty
def insert_sample_employees():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("SELECT * FROM employees")
    existing = cur.fetchall()
    if existing:
        conn.close()
        return  # Table already has data, do not insert duplicates

    sample_employees = [
        {"first_name": "John", "last_name": "Doe", "email": "john.doe@example.com", "department": "Sales"},
        {"first_name": "Jane", "last_name": "Smith", "email": "jane.smith@example.com", "department": "Marketing"},
        {"first_name": "Michael", "last_name": "Brown", "email": "michael.brown@example.com", "department": "HR"},
        {"first_name": "Emily", "last_name": "Davis", "email": "emily.davis@example.com", "department": "Finance"},
        {"first_name": "Daniel", "last_name": "Wilson", "email": "daniel.wilson@example.com", "department": "IT"},
        {"first_name": "Sophia", "last_name": "Taylor", "email": "sophia.taylor@example.com", "department": "Sales"},
        {"first_name": "David", "last_name": "Anderson", "email": "david.anderson@example.com", "department": "Marketing"},
        {"first_name": "Olivia", "last_name": "Thomas", "email": "olivia.thomas@example.com", "department": "HR"},
        {"first_name": "James", "last_name": "Jackson", "email": "james.jackson@example.com", "department": "Finance"},
        {"first_name": "Ava", "last_name": "White", "email": "ava.white@example.com", "department": "IT"},
    ]

    for emp in sample_employees:
        cur.execute(
            "INSERT INTO employees (first_name, last_name, email, department) VALUES (?, ?, ?, ?)",
            (emp["first_name"], emp["last_name"], emp["email"], emp["department"])
        )

    conn.commit()
    conn.close()

# Initialize tables and sample data
init_employees()
insert_sample_employees()

# ------------------ ROUTES ------------------

# Get all employees
@app.route("/employees", methods=["GET"])
def get_employees():
    employees = query_db("SELECT * FROM employees")
    return jsonify([dict(emp) for emp in employees])

# Add employee
@app.route("/employees", methods=["POST"])
def add_employee():
    data = request.json
    query_db(
        "INSERT INTO employees (first_name, last_name, email, department) VALUES (?, ?, ?, ?)",
        (data["first_name"], data["last_name"], data["email"], data["department"])
    )
    return jsonify({"message": "Employee added successfully"}), 201

# Edit employee
@app.route("/employees/<int:id>", methods=["PUT"])
def update_employee(id):
    data = request.json
    query_db(
        "UPDATE employees SET first_name=?, last_name=?, email=?, department=? WHERE id=?",
        (data["first_name"], data["last_name"], data["email"], data["department"], id)
    )
    return jsonify({"message": "Employee updated successfully"})

# Delete employee
@app.route("/employees/<int:id>", methods=["DELETE"])
def delete_employee(id):
    query_db("DELETE FROM employees WHERE id=?", (id,))
    return jsonify({"message": "Employee deleted successfully"})

# ------------------ RUN ------------------
if __name__ == "__main__":
    app.run(debug=True)
