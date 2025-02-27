from flask import Flask, request, jsonify
import mysql.connector
from flask_bcrypt import Bcrypt
from flask_cors import CORS

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}}, supports_credentials=True)  # Enable CORS to allow frontend requests

# Hash a password
password = "brianaodhiambo"
hashed_password = bcrypt.generate_password_hash("brianaodhiambo").decode('utf-8')
print("Hashed Password:", hashed_password)

# Database connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="flaskreactifp"
    )
@app.route('/signup', methods=['POST'])  # FIXED: Correctly use "POST" inside quotes
def register_user():
    data = request.json
    firstname = data.get("firstname")
    lastname = data.get("lastname")
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    confirm_password = data.get("confirmPassword")

    if not all([firstname, lastname, username, email, password, confirm_password]):
        return jsonify({"success": False, "error": "All fields are required"}), 400

    if password != confirm_password:
        return jsonify({"success": False, "error": "Passwords do not match"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO usercredentials (firstname, lastname, username, email, password) VALUES (%s, %s, %s, %s, %s)",
            (firstname, lastname, username, email, hashed_password)
        )

        conn.commit()
        conn.close()

        return jsonify({"success": True, "message": "User registered successfully"}), 201

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

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

        if user and bcrypt.check_password_hash(user['hashedpassword'], password):
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


if __name__=="__main__":
    app.run(debug=True)