from flask import Flask, Blueprint, request, jsonify, current_app
from werkzeug.security import check_password_hash, generate_password_hash
import jwt 
import datetime
import mysql.connector
from flask_cors import CORS
import json
from mysql.connector import Error

# Initialize Flask app
app = Flask(__name__)
app.config["SECRET_KEY"] = "SECRETKEY"  # Change this to a strong secret key
CORS(app)  # Enable CORS for all routes

# Define Blueprints
admin_bp = Blueprint("admin", __name__)
formstats_bp = Blueprint("formstats", __name__)

# Database connection function
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="flaskreactifp"
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Database Connection Error: {err}")
        return None

# Fetch users from db
@admin_bp.route("/admin/users", methods=["GET"])
def get_users():
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT userID, username, firstname, lastname, email, telephone FROM usercredentials")
        users = cursor.fetchall()

        cursor.close()
        conn.close()
        return jsonify(users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Admin Login API
@admin_bp.route("/login", methods=["POST"])
def admin_login():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

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
            token = jwt.encode(token_payload, current_app.config["SECRET_KEY"], algorithm="HS256")

            return jsonify({"message": "Login successful", "token": token}), 200

        return jsonify({"message": "Invalid credentials"}), 401
    except jwt.PyJWTError as jwt_error:
        return jsonify({"message": "JWT encoding error", "error": str(jwt_error)}), 500
    except Exception as e:
        return jsonify({"message": "Internal server error", "error": str(e)}), 500
    finally:
        if "cursor" in locals() and cursor:
            cursor.close()
        if "conn" in locals() and conn:
            conn.close()

# Get active users
@admin_bp.route("/active-users", methods=["GET"])
def get_active_users():
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT userID, firstname, lastname, email, is_active FROM usercredentials")
        users = cursor.fetchall()

        # Add active status
        for user in users:
            user["active_status"] = "green" if user["is_active"] == 0 else "red"

        cursor.close()
        conn.close()
        return jsonify(users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add a new user
@admin_bp.route("/admin/users", methods=["POST"])
def add_user():
    try:
        data = request.json
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor()
        query = """
            INSERT INTO usercredentials (username, firstname, lastname, email, telephone)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (data["username"], data["firstname"], data["lastname"], data["email"], data["telephone"]))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "User added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update a user
@admin_bp.route("/admin/users/<int:userID>", methods=["PUT"])
def update_user(userID):
    try:
        data = request.json
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor()
        query = """
            UPDATE usercredentials SET username=%s, firstname=%s, lastname=%s, email=%s, telephone=%s 
            WHERE userID=%s
        """
        cursor.execute(query, (data["username"], data["firstname"], data["lastname"], data["email"], data["telephone"], userID))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "User updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete a user
@admin_bp.route("/admin/users/<int:userID>", methods=["DELETE"])
def delete_user(userID):
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor()
        cursor.execute("DELETE FROM usercredentials WHERE userID = %s", (userID,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Form Statistics
def serialize(obj):
    """Convert non-serializable objects to JSON-compatible formats."""
    if isinstance(obj, datetime.datetime):
        return obj.strftime('%Y-%m-%d %H:%M:%S')
    return obj

@formstats_bp.route('/formstats', methods=['GET'])
def get_form_stats():
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT s.Age, s.StayWith, s.Religion, s.FamilySize, s.GuardianOccupation, s.GuardianEducation, 
                   s.FinancialSupport, s.PocketMoneyAdequacy, s.OlderSiblings, s.SiblingsRelationships, 
                   s.PocketMoney, s.GuardianVisits, s.OtherVisitors,
                   h.HealthInfoAccess, h.HealthEducators, h.HealthTopics, h.InfoAdequacy
            FROM sociodemographics s
            LEFT JOIN healthdemographics h ON s.QsnID = h.QsnID
        """)
        combined_data = cursor.fetchall()

        formatted_data = [{key: serialize(value) for key, value in entry.items()} for entry in combined_data]
        response = {"sociodemographics": formatted_data}

        cursor.close()
        conn.close()
        return jsonify(response)
    except Error as e:
        return jsonify({"error": "Database error"}), 500
    finally:
        if "cursor" in locals() and cursor:
            cursor.close()
        if "conn" in locals() and conn:
            conn.close()

# Register Blueprints
app.register_blueprint(admin_bp, url_prefix="/admin")
app.register_blueprint(formstats_bp, url_prefix="/formstats")

if __name__ == "__main__":
    app.run(debug=True)
