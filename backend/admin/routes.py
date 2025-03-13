from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import check_password_hash, generate_password_hash
import jwt 
import datetime
import mysql.connector
from flask_cors import CORS
import json
from mysql.connector import Error


# Define Blueprint
formstats_bp = Blueprint('formstats', __name__)
admin_bp = Blueprint("admin", __name__)
CORS(admin_bp, resources={r"/": {"origins": "*"}})  # Enable CORS for all admin routes

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
        return None

# Ensure Flask app has a secret key
SECRET_KEY = "SECRETKEY"  # Change this to a strong secret key

#Admin Login API
@admin_bp.route('/login', methods=['POST'])
def admin_login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"message": "Username and password required"}), 400

        conn = get_db_connection()
        if not conn:
            return jsonify({"message": "Database connection failed"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM admin WHERE username = %s", (username,))
        admin = cursor.fetchone()

        if admin and check_password_hash(admin["password_hash"], password):
            token_payload = {
                "admin_id": admin["id"],
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=3)
            }
            token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")

            return jsonify({"message": "Login successful", "token": token}), 200

        return jsonify({"message": "Invalid credentials"}), 401

    except jwt.PyJWTError as jwt_error:
        return jsonify({"message": "JWT encoding error", "error": str(jwt_error)}), 500

    except Exception as e:
        return jsonify({"message": "Internal server error", "error": str(e)}), 500

    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn:
            conn.close()


#Get active users 
@admin_bp.route("/active-users", methods=["GET"])
def get_active_users():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Query active users
        cursor.execute("SELECT * FROM usercredentials WHERE is_active = 1")
        active_users = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify(active_users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# Fetch all users
@admin_bp.route("/users", methods=["GET"])
def get_users():
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT userID, firstname, lastname, username, email, telephone FROM usercredentials")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(users)

# Create User - FIXED
@admin_bp.route("/users", methods=["POST"])
def create_user():
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        hashed_password = generate_password_hash(data["password"])
  # Secure hashing
        query = """
            INSERT INTO usercredentials (firstname, lastname, username, email, hashedpassword, telephone) 
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            data["firstname"], data["lastname"], data["username"], data["email"], hashed_password, data["telephone"]
        ))
        conn.commit()
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Update User
@admin_bp.route("/users/<int:userID>", methods=["PUT"])
def update_user(userID):
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE usercredentials SET username = %s, email = %s WHERE userID = %s",
            (data["username"], data["email"], userID)
        )
        conn.commit()
        return jsonify({"message": "User updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Delete User
@admin_bp.route("/users/<int:userID>", methods=["DELETE"])
def delete_user(userID):
    conn = get_db_connection()
    if not conn:
        return jsonify({"message": "Database connection failed"}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM usercredentials WHERE userID = %s", (userID,))
        conn.commit()
        return jsonify({"message": "User deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


#Form Statistics
def serialize(obj):
    """Convert non-serializable objects to JSON-compatible formats."""
    if isinstance(obj, datetime.datetime):
        return obj.strftime('%Y-%m-%d %H:%M:%S')
    elif isinstance(obj, (int, float)):  
        return obj  # Keep numerical values unchanged
    elif obj is None:
        return None  # Return None instead of "N/A" for better frontend handling
    return str(obj)  # Convert everything else to string

@formstats_bp.route('/formstats', methods=['GET'])
def get_form_stats():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)  # Ensure this works in your MySQL connector version

        # Fetch combined sociodemographics and healthdemographics data using JOIN
        cursor.execute("""
            SELECT s.Age, s.StayWith, s.Religion, s.FamilySize, s.GuardianOccupation, s.GuardianEducation, 
                   s.FinancialSupport, s.PocketMoneyAdequacy, s.OlderSiblings, s.SiblingsRelationships, 
                   s.PocketMoney, s.GuardianVisits, s.OtherVisitors,
                   h.HealthInfoAccess, h.HealthEducators, h.HealthTopics, h.InfoAdequacy
            FROM sociodemographics s
            LEFT JOIN healthdemographics h ON s.QsnID = h.QsnID
        """)
        combined_data = cursor.fetchall()
        
        # Ensure all values are serialized properly
        formatted_data = [{key: serialize(value) for key, value in entry.items()} for entry in combined_data]

        # Wrap the data inside a named key
        response = {
            "sociodemographics": formatted_data
        }

        # Debug: Print API Response to check if data is being fetched correctly
        print("DEBUG: API Response", json.dumps(response, indent=4))

        return jsonify(response)

    except Error as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Database error"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
