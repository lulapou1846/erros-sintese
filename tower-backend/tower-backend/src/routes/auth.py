from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from src.models.user import db, User
from src.models.client import Client
from src.models.database_manager import DatabaseManager
import os

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validação dos dados
        if not data or not all(k in data for k in ('username', 'email', 'password', 'client_name', 'client_email')):
            return jsonify({'error': 'Dados incompletos'}), 400
        
        username = data['username']
        email = data['email']
        password = data['password']
        client_name = data['client_name']
        client_email = data['client_email']
        
        # Verificar se o cliente já existe
        existing_client = Client.query.filter_by(email=client_email).first()
        if existing_client:
            return jsonify({'error': 'Cliente já existe com este email'}), 400
        
        # Verificar se o usuário já existe para este cliente
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'Usuário já existe com este email'}), 400
        
        # Criar novo cliente
        new_client = Client(name=client_name, email=client_email)
        db.session.add(new_client)
        db.session.flush()  # Para obter o ID do cliente
        
        # Criar banco de dados único para o cliente
        db_manager = DatabaseManager(os.path.join(current_app.instance_path, 'client_databases'))
        db_manager.create_client_database(new_client.database_name)
        
        # Criar novo usuário
        new_user = User(username=username, email=email, password=password, client_id=new_client.id)
        db.session.add(new_user)
        db.session.commit()
        
        # Criar token de acesso
        access_token = create_access_token(identity=new_user.id)
        
        return jsonify({
            'message': 'Usuário e cliente criados com sucesso',
            'access_token': access_token,
            'user': new_user.to_dict(),
            'client': new_client.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ('email', 'password')):
            return jsonify({'error': 'Email e senha são obrigatórios'}), 400
        
        email = data['email']
        password = data['password']
        
        # Buscar usuário
        user = User.query.filter_by(email=email, is_active=True).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Credenciais inválidas'}), 401
        
        # Buscar cliente
        client = Client.query.get(user.client_id)
        if not client or not client.is_active:
            return jsonify({'error': 'Cliente inativo'}), 401
        
        # Criar token de acesso
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Login realizado com sucesso',
            'access_token': access_token,
            'user': user.to_dict(),
            'client': client.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        client = Client.query.get(user.client_id)
        
        return jsonify({
            'user': user.to_dict(),
            'client': client.to_dict() if client else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # Com JWT, o logout é feito no frontend removendo o token
    return jsonify({'message': 'Logout realizado com sucesso'}), 200

