from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
import jwt, datetime
from models import Admin

admin = Blueprint('admin', __name__)

@admin.route('/login', methods=['POST'])
def login():
    data = request.json
    admin = Admin.query.filter_by(username=data['username']).first()
    if admin and check_password_hash(admin.password, data['password']):
        token = jwt.encode({'user': admin.username, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)}, "secret", algorithm="HS256")
        return jsonify({'token': token})
    return jsonify({'message': 'Invalid credentials'}), 401
