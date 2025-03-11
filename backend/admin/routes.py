from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
import datetime
import mysql.connector

# Define Blueprint
admin_bp = Blueprint("admin", __name__)  

# Database connection function
def get_db_connection():
    try:
        return mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="flaskreactifp"
        )
    except mysql.connector.Error as err:
        print(f"Database Connection Error: {err}")
        return None  # Ensure we don't proceed if DB connection fails
hashed_password = generate_password_hash("AdminP@ss")  # Replace with actual password
print(hashed_password)

@admin_bp.route('/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    print(f"Received Login Request: username={username}, password={password}")

    if not username or not password:
        return jsonify({"message": "Username and password required"}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed"}), 500

    try:
        cursor = conn.cursor(dictionary=True)

        # Fetch admin details from DB
        cursor.execute("SELECT * FROM admin WHERE username = %s", (username,))
        admin = cursor.fetchone()

        if admin:
            print(f"Admin Found: {admin}")  # Debugging

            stored_hash = admin.get("password_hash")
            if stored_hash and check_password_hash(stored_hash, password):
                token = jwt.encode(
                    {"admin_id": admin["id"], "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=3)},
                    current_app.config["SECRET_KEY"],  # Uses Flask app's secret key
                    algorithm="HS256"
                )
                print("Login successful!")  # Debugging
                return jsonify({"message": "Login successful", "token": token}), 200
            else:
                print("Invalid credentials")  # Debugging
                return jsonify({"message": "Invalid credentials"}), 401

        print("Admin not found")  # Debugging
        return jsonify({"message": "Admin not found"}), 404

    except Exception as e:
        print(f"Database error: {e}")  # Debugging
        return jsonify({"message": "Database error", "error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@admin_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Fetch user credentials
    query = "SELECT userID, password FROM usercredentials WHERE username = %s"
    cursor.execute(query, (username,))
    user = cursor.fetchone()

    if user and check_password_hash(user["password"], password):
        # Update last_login and session_start
        update_query = "UPDATE usercredentials SET last_login = NOW(), session_start = NOW(), session_end = NULL WHERE userID = %s"
        cursor.execute(update_query, (user["userID"],))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Login successful", "userID": user["userID"]}), 200
    else:
        cursor.close()
        conn.close()
        return jsonify({"error": "Invalid credentials"}), 401


# API to fetch active users
@admin_bp.route("/active-users", methods=["GET"])
def get_active_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT userID, username, email, last_login, session_start, session_end, 
    TIMESTAMPDIFF(SECOND, session_start, COALESCE(session_end, NOW())) AS session_duration
    FROM usercredentials 
    WHERE is_active = TRUE
    ORDER BY session_start DESC
    """
    cursor.execute(query)
    users = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(users)
@admin_bp.route("/users", methods=["GET"])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT userID, username, email FROM usercredentials")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(users)

# Create User
@admin_bp.route("/users", methods=["POST"])
def create_user():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO usercredentials (username, email, password_hash) VALUES (%s, %s, SHA2(%s, 256))",
        (data["username"], data["email"], data["password"]),
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "User created successfully"}), 201

# Update User
@admin_bp.route("/users/<int:userID>", methods=["PUT"])
def update_user(userID):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE usercredentials SET username = %s, email = %s WHERE userID = %s",
        (data["username"], data["email"], userID),
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "User updated successfully"})

# Delete User
@admin_bp.route("/users/<int:userID>", methods=["DELETE"])
def delete_user(userID):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM usercredentials WHERE userID = %s", (userID,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "User deleted successfully"})