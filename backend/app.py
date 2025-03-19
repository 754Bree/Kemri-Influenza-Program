from flask import Flask, request, jsonify, make_response
from flask_bcrypt import Bcrypt 
from flask_cors import CORS
import jwt
import datetime
import mysql.connector
from admin.routes import admin_bp
import sys
sys.path.append('./backend')
from admin.routes import formstats_bp
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)

app.config['SECRET_KEY'] = "SECRETKEY"
bcrypt = Bcrypt(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)


# Database connection function
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="flaskreactifp"
    )    
#=======================
#Admin API'S
#=======================
# Ensure the admin user exists

#===================================================================

#Form submission API
#====================
@app.route('/api/submit', methods=['POST'])
def submit_response():
    conn = None  
    cursor = None  

    try:
        data = request.json

        # Required fields validation
        required_fields = [
            "age", "stayWith", "religion", "familySize", 
            "guardianOccupation", "guardianEducation", 
            "financialSupport", "olderSiblings", "pocketMoney", 
            "guardianVisits", "reproductiveHealthAccess"
        ]
        
        missing_fields = [field for field in required_fields if data.get(field) is None]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        # Sociodemographics Fields
        age = data["age"]
        stayWith = data["stayWith"]
        religion = data["religion"]
        familySize = data["familySize"]
        guardianOccupation = data["guardianOccupation"]
        guardianEducation = data["guardianEducation"]
        financialSupport = data.get("financialSupport")
        pocketMoneyAdequacy = data.get("pocketMoneyAdequacy")
        olderSiblings = data.get("olderSiblings")
        siblingsRelationships = data.get("siblingsRelationships")
        pocketMoney = data.get("pocketMoney")
        guardianVisits = data.get("guardianVisits")
        otherVisitors = data.get("otherVisitors")

        # HealthDemographics Fields
        reproductiveHealthAccess = data.get("reproductiveHealthAccess", "No")
        educators = ",".join(data.get("educators", [])) if data.get("educators") else None
        topics = ",".join(data.get("topics", [])) if data.get("topics") else None
        infoAdequacy = data.get("infoAdequacy")

        # Establish DB Connection
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert into `sociodemographics`
        sql_sociodemographics = """
        INSERT INTO sociodemographics 
        (age, stayWith, religion, familySize, guardianOccupation, guardianEducation, 
        financialSupport, pocketMoneyAdequacy, olderSiblings, siblingsRelationships, 
        pocketMoney, guardianVisits, otherVisitors) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql_sociodemographics, (
            age, stayWith, religion, familySize, guardianOccupation, guardianEducation,
            financialSupport, pocketMoneyAdequacy, olderSiblings, siblingsRelationships,
            pocketMoney, guardianVisits, otherVisitors
        ))

        # Get the inserted record ID
        QsnID = cursor.lastrowid if cursor.lastrowid else None
        if not QsnID:
            return jsonify({"error": "Failed to retrieve last inserted ID"}), 500

        # Insert into `healthdemographics`
        sql_healthdemographics = """
        INSERT INTO healthdemographics 
        (QsnID, healthInfoAccess, healthEducators, healthTopics, infoAdequacy) 
        VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(sql_healthdemographics, (QsnID, reproductiveHealthAccess, educators, topics, infoAdequacy))

        conn.commit()

        return jsonify({"message": "✅ Data logged successfully", "QsnID": QsnID}), 201

    except mysql.connector.Error as db_err:
        print(f"Database Error: {db_err}")
        return jsonify({"error": f"Database error: {str(db_err)}"}), 500

    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


# SIGNUP API
#============
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
        telephone = data.get("telephone")

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
    "INSERT INTO usercredentials (firstname, lastname, username, email, password, hashedpassword, telephone) VALUES (%s, %s, %s, %s, %s, %s, %s)",
    (firstname, lastname, username, email, password, hashed_password, telephone)
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



# User login endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    print(f"Received login request: Email: {email}")

    conn = None
    cursor = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM usercredentials WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            print("User not found!")
            return jsonify({"error": "Invalid email or password"}), 401

        stored_hash = user["hashedpassword"]
        print(f"Stored Hash: {stored_hash}")
        print(f"Entered Password: {password}")

        if not bcrypt.check_password_hash(stored_hash, password):
            print("Password Mismatch!")
            return jsonify({"error": "Invalid email or password"}), 401

        print("Authenticated!")

        # Generate JWT token
        try:
            token_expiry = datetime.datetime.utcnow() + datetime.timedelta(hours=5)
            token = jwt.encode(
                {
                    "userID": str(user["userID"]),
                    "exp": token_expiry
                },
                app.config['SECRET_KEY'],
                algorithm="HS256"
            )
            print(f"Generated Token: {token}")
        except Exception as jwt_error:
            print(f"JWT Error: {str(jwt_error)}")
            return jsonify({"error": "Token generation failed"}), 500

        # Update login details in the database
        login_time = datetime.datetime.utcnow()
        cursor.execute("""
            UPDATE usercredentials SET last_login = %s, session_start = %s, is_active = 0 WHERE userID = %s
        """, (login_time, login_time, user["userID"]))
        conn.commit()

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

    except Exception as e:
        print(f"Error in /login: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()



@app.route('/logout', methods=['POST'])
def logout():
    data = request.json
    user_id = data.get("userID")

    if not user_id:
        return jsonify({"error": "UserID is required"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Ensure the user exists
        cursor.execute("SELECT * FROM usercredentials WHERE userID = %s", (user_id,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "User not found"}), 404

        logout_time = datetime.datetime.utcnow()
        cursor.execute("""
            UPDATE usercredentials 
            SET session_end = %s, is_active = 0 
            WHERE userID = %s
        """, (logout_time, user_id))
        conn.commit()

        return jsonify({"message": "Logout successful"}), 200

    except Exception as e:
        print(f"Error in /logout: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()




@app.route('/check_session', methods=['POST'])
def check_session():
    data = request.json
    token = data.get("token")

    if not token:
        return jsonify({"error": "Token is required"}), 400

    try:
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        user_id = decoded_token["userID"]
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT is_active FROM usercredentials WHERE userID = %s", (user_id,))
        user = cursor.fetchone()

        if not user or user["is_active"] == 1:
            return jsonify({"error": "Session expired or user not logged in"}), 401

        return jsonify({"message": "Session active"}), 200
    
    except jwt.ExpiredSignatureError:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE usercredentials SET is_active = 1 WHERE userID = %s", (user_id,))
        conn.commit()
        return jsonify({"error": "Session expired"}), 401
    except Exception as e:
        print(f"Error in /check_session: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


app.register_blueprint(admin_bp, url_prefix="/admin")
app.register_blueprint(formstats_bp, url_prefix="/")

if __name__=="__main__":
    app.run(debug=True)
