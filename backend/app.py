from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import jwt
import datetime
import mysql.connector

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)  # Enable CORS to allow frontend requests

# Database connection function
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="flaskreactifp"
    )

# SIGNUP API
@app.route('/signup', methods=['POST'])
def register_user():
    try:
        data = request.json
        print("Received signup request:", data)  # Debugging Log
        
        # Extract user inputs
        firstname = data.get("firstname")
        lastname = data.get("lastname")
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        confirm_password = data.get("confirmPassword")

        # Validation Checks
        if not all([firstname, lastname, username, email, password, confirm_password]):
            print("Error: Missing required fields")  # Debug Log
            return jsonify({"success": False, "error": "All fields are required"}), 400

        if password != confirm_password:
            print("Error: Passwords do not match")  # Debug Log
            return jsonify({"success": False, "error": "Passwords do not match"}), 400

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Database Connection
        conn = get_db_connection()
        cursor = conn.cursor()
        print("Connected to MySQL")  # Debug Log

        # Insert user data
        cursor.execute(
    "INSERT INTO usercredentials (firstname, lastname, username, email, password, hashedpassword) VALUES (%s, %s, %s, %s, %s, %s)",
    (firstname, lastname, username, email, password, hashed_password)
)


        user_id = cursor.lastrowid  # Get the new user ID
        eSN = f"KIFP-000{user_id}"  # Generate eSN

        # Update eSN
        cursor.execute("UPDATE usercredentials SET eSN = %s WHERE userID = %s", (eSN, user_id))

        conn.commit()
        cursor.close()
        conn.close()

        print(f"User {username} registered successfully with eSN: {eSN}")  # Debug Log
        return jsonify({"success": True, "message": "User registered successfully", "eSN": eSN}), 201

    except Exception as e:
        print(f"Error in /signup: {str(e)}")  # Show exact error
        return jsonify({"success": False, "error": str(e)}), 500


# API FOR GETTING QUESTIONNAIRE SERIAL NUMBER
@app.route('/api/get-questionnaire-sn', methods=['GET'])
def get_questionnaire_sn():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT QsnSerialNumber FROM sociodemographics ORDER BY id DESC LIMIT 1")
    result = cursor.fetchone()

    cursor.close()
    conn.close()

    if result:
        return jsonify(result)  # Returns {"QsnSerialNumber": "some_value"}
    else:
        return jsonify({"QsnSerialNumber": None})  # If no data is found

# User login endpoint
# Ensure SECRET_KEY is set
app.config['SECRET_KEY'] = "SECRETKEY"

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    print(f"Received login request: Email: {email}")

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM usercredentials WHERE email = %s", (email,))
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if user and bcrypt.check_password_hash(user['hashedpassword'], password):
            print("Password matched!")

            # Generate JWT token with string userID
            token = jwt.encode(
                {
                    "userID": str(user["userID"]),  # Ensure userID is a string
                    "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=5)
                },
                app.config['SECRET_KEY'],
                algorithm="HS256"
            )

            response = jsonify({
                "message": "Login successful",
                "userID": user["userID"],
                "eSN": user["eSN"],
                "firstname": user["firstname"],
                "lastname": user["lastname"],
                "email": user["email"],
                "token": token
            })

            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            response.headers.add("Access-Control-Allow-Credentials", "true")

            return response, 200

        else:
            print("Invalid credentials")
            return jsonify({"error": "Invalid email or password"}), 401

    except Exception as e:
        print(f"Error in /login: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500



if __name__=="__main__":
    app.run(debug=True)
