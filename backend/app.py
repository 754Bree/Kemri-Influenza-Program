from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import jwt
import datetime
import mysql.connector





app = Flask(__name__)
app.config['SECRET_KEY'] = "SECRETKEY"
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


#DATABASE RESPONSE SAVING
#--------------------=====
@app.route('/api/submit_questionnaire', methods=['POST'])
def submit_response():
    try:

        #Sociodemographics
        #==================
        data = request.json
        questionnaireSN = data.get("questionnaireSN")
        dateCollected = data.get("dateCollected")
        age = data.get("age")
        stayWith =  data.get("stayWith")
        religion = data.get("religion")
        familySize = data.get("familySize")
        guardianOccupation = data.get("guardianOccupation")
        guardianEducation = data.get("guardianEducation")
        financialSupport = data.get("financialSupport")
        pocketMoneyAdequacy = data.get("pocketMoneyAdequacy")
        olderSiblings = data.get("olderSiblings")
        siblingsRelationships = data.get("siblingsRelationships")
        pocketMoney = data.get("pocketMoney")
        guardianVisits = data.get("guardianVisits")
        
        # HealthDemographics
        #======================
        reproductiveHealthAccess = data.get("reproductiveHealthAccess")
        educators = ",".join(data.get("educators", []))  # Convert array to string
        topics = ",".join(data.get("topics", []))  # Convert array to string
        infoAdequacy = data.get("infoAdequacy")


        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        
        cursor = conn.cursor()

        #Insert into Sociodemographics table
        sql_sociodemographics = """
        INSERT INTO sociodemographics
        (QsnSerialNumber, datecollected, age, stayWith, religion, familymembers,
         guardianOccupation, guardianAcademicLevel, olderSiblings, siblingsRelationships,
          pocketMoney, pocketMoneyAdequacy, otherfinancialSupportsources, guardianVisits,
           otherVisitors)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)        
        """
        cursor.execute(sql_sociodemographics, (questionnaireSN, dateCollected, age, stayWith, religion, familySize, 
                                               guardianOccupation, guardianEducation, financialSupport, pocketMoneyAdequacy, 
                                               olderSiblings, siblingsRelationships, pocketMoney, pocketMoneyAdequacy, guardianVisits))
        
        #Insert into Health demographics table
        sql_healthdemographics = """
        INSERT INTO healthdemographics
        (QsnSerialNumber, healthInfoAccess, healthEducator, healthTopics, infoAdequacy)
        VALUES (%s, %s, %s, %s, %s)
        """
        
        cursor.execute(sql_healthdemographics, (questionnaireSN, reproductiveHealthAccess, educators, topics, infoAdequacy))
        
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Logged to Database successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

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

        # Use Flask-Bcrypt's check_password_hash()
        if not bcrypt.check_password_hash(stored_hash, password):
            print("Password Mismatch!")
            return jsonify({"error": "Invalid email or password"}), 401

        print("Password Matched!")

        # Generate JWT token
        try:
            token = jwt.encode(
                {
                    "userID": str(user["userID"]),  # Ensure userID is a string
                    "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=5)
                },
                app.config['SECRET_KEY'],
                algorithm="HS256"
            )
            print(f"Generated Token: {token}")
        except Exception as jwt_error:
            print(f"JWT Error: {str(jwt_error)}")
            return jsonify({"error": "Token generation failed"}), 500

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


if __name__=="__main__":
    app.run(debug=True)
