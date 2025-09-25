from flask import Blueprint, request, jsonify, current_app, url_for
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from src.models.user import db, User
from src.models.client import Client
import os
import uuid
from PIL import Image

profile_bp = Blueprint('profile', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def resize_image(image_path, max_size=(300, 300)):
    """Redimensiona a imagem mantendo a proporção"""
    with Image.open(image_path) as img:
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        img.save(image_path, optimize=True, quality=85)

@profile_bp.route('/', methods=['GET'])
@jwt_required()
def get_profile():
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

@profile_bp.route('/', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        data = request.get_json()
        
        # Atualizar campos permitidos
        if 'username' in data:
            user.username = data['username']
        
        if 'email' in data:
            # Verificar se o email já existe para outro usuário
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user and existing_user.id != user.id:
                return jsonify({'error': 'Email já está em uso'}), 400
            user.email = data['email']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Perfil atualizado com sucesso',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@profile_bp.route('/upload-picture', methods=['POST'])
@jwt_required()
def upload_profile_picture():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        if 'file' not in request.files:
            return jsonify({'error': 'Nenhum arquivo enviado'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'Nenhum arquivo selecionado'}), 400
        
        if file and allowed_file(file.filename):
            # Gerar nome único para o arquivo
            filename = secure_filename(file.filename)
            file_extension = filename.rsplit('.', 1)[1].lower()
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            
            # Salvar arquivo
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(file_path)
            
            # Redimensionar imagem
            resize_image(file_path)
            
            # Remover foto anterior se existir
            if user.profile_picture:
                old_file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], 
                                           os.path.basename(user.profile_picture))
                if os.path.exists(old_file_path):
                    os.remove(old_file_path)
            
            # Atualizar usuário
            user.profile_picture = f"/api/profile/picture/{unique_filename}"
            db.session.commit()
            
            return jsonify({
                'message': 'Foto de perfil atualizada com sucesso',
                'profile_picture': user.profile_picture,
                'user': user.to_dict()
            }), 200
        
        return jsonify({'error': 'Tipo de arquivo não permitido'}), 400
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@profile_bp.route('/picture/<filename>')
def get_profile_picture(filename):
    """Serve as fotos de perfil"""
    try:
        return current_app.send_static_file(f'uploads/{filename}')
    except Exception as e:
        return jsonify({'error': 'Imagem não encontrada'}), 404

@profile_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        data = request.get_json()
        
        if not data or not all(k in data for k in ('current_password', 'new_password')):
            return jsonify({'error': 'Senha atual e nova senha são obrigatórias'}), 400
        
        current_password = data['current_password']
        new_password = data['new_password']
        
        # Verificar senha atual
        if not user.check_password(current_password):
            return jsonify({'error': 'Senha atual incorreta'}), 400
        
        # Atualizar senha
        user.set_password(new_password)
        db.session.commit()
        
        return jsonify({'message': 'Senha alterada com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

