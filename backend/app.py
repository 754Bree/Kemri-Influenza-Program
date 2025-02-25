from flask import Flask, request, jsonify
import mysql.connector
from flask_bcrypt import Bcrypt
from flask_cors import CORS

hashed_password = bcrypt.generate_password_hash("your_password").decode('utf-8')
print(hashed_password)  # Store this in your database

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)  # Enable CORS to allow frontend requests

# Database connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="flaskreactifp"
    )

# User login endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    
    print(f"Received login request: Email: {email}, Password: {password}")  # Debugging

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM usercredentials WHERE email = %s", (email,))
        user = cursor.fetchone()
        conn.close()

        print(f"Fetched user: {user}")  # Debugging

        if user and bcrypt.check_password_hash(user['password'], password):
            print("Password matched!")  # Debugging
            return jsonify({
                "message": "Login successful",
                "userID": user["userID"],
                "eSN": user["eSN"],
                "firstname": user["firstname"],
                "lastname": user["lastname"],
                "email": user["email"]
            }), 200
        else:
            print("Invalid credentials")  # Debugging
            return jsonify({"error": "Invalid email or password"}), 401

    except Exception as e:
        print(f"Error: {str(e)}")  # Debugging
        return jsonify({"error": str(e)}), 500
