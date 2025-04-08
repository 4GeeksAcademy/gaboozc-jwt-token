from flask import request, jsonify, Blueprint
from flask_cors import CORS
from api.models import db, User

api = Blueprint('api', __name__)
CORS(api)

@api.route('/hello', methods=['GET'])
def handle_hello():
    return jsonify({ "message": "Hola! Conexión exitosa con el backend." }), 200

@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({ "msg": "Faltan datos" }), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({ "msg": "El usuario ya existe" }), 409

    new_user = User(email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({ "msg": "Usuario creado con éxito" }), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email, password=password).first()

    if not user:
        return jsonify({ "msg": "Credenciales inválidas" }), 401

    return jsonify({ "msg": "Inicio de sesión exitoso", "user": email }), 200
