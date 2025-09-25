from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.user import User
from src.models.client import Client
from src.models.database_manager import DatabaseManager
import os

client_data_bp = Blueprint('client_data', __name__)

def get_database_manager():
    """Retorna uma instância do gerenciador de banco de dados"""
    return DatabaseManager(os.path.join(current_app.instance_path, 'client_databases'))

@client_data_bp.route('/data', methods=['GET'])
@jwt_required()
def get_client_data():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        client = Client.query.get(user.client_id)
        if not client:
            return jsonify({'error': 'Cliente não encontrado'}), 404
        
        db_manager = get_database_manager()
        
        # Buscar todos os dados do cliente
        query = "SELECT * FROM client_data ORDER BY created_at DESC"
        data = db_manager.execute_query(client.database_name, query)
        
        return jsonify({
            'data': data,
            'total': len(data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@client_data_bp.route('/data', methods=['POST'])
@jwt_required()
def create_client_data():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        client = Client.query.get(user.client_id)
        if not client:
            return jsonify({'error': 'Cliente não encontrado'}), 404
        
        data = request.get_json()
        
        if not data or 'key' not in data:
            return jsonify({'error': 'Chave é obrigatória'}), 400
        
        key = data['key']
        value = data.get('value', '')
        
        db_manager = get_database_manager()
        
        # Inserir dados
        query = "INSERT INTO client_data (key, value) VALUES (?, ?)"
        db_manager.execute_query(client.database_name, query, (key, value))
        
        return jsonify({'message': 'Dados criados com sucesso'}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@client_data_bp.route('/data/<int:data_id>', methods=['PUT'])
@jwt_required()
def update_client_data(data_id):
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        client = Client.query.get(user.client_id)
        if not client:
            return jsonify({'error': 'Cliente não encontrado'}), 404
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados são obrigatórios'}), 400
        
        db_manager = get_database_manager()
        
        # Verificar se o registro existe
        check_query = "SELECT id FROM client_data WHERE id = ?"
        existing = db_manager.execute_query(client.database_name, check_query, (data_id,))
        
        if not existing:
            return jsonify({'error': 'Registro não encontrado'}), 404
        
        # Atualizar dados
        update_fields = []
        params = []
        
        if 'key' in data:
            update_fields.append("key = ?")
            params.append(data['key'])
        
        if 'value' in data:
            update_fields.append("value = ?")
            params.append(data['value'])
        
        if update_fields:
            update_fields.append("updated_at = CURRENT_TIMESTAMP")
            params.append(data_id)
            
            query = f"UPDATE client_data SET {', '.join(update_fields)} WHERE id = ?"
            db_manager.execute_query(client.database_name, query, params)
        
        return jsonify({'message': 'Dados atualizados com sucesso'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@client_data_bp.route('/data/<int:data_id>', methods=['DELETE'])
@jwt_required()
def delete_client_data(data_id):
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        client = Client.query.get(user.client_id)
        if not client:
            return jsonify({'error': 'Cliente não encontrado'}), 404
        
        db_manager = get_database_manager()
        
        # Verificar se o registro existe
        check_query = "SELECT id FROM client_data WHERE id = ?"
        existing = db_manager.execute_query(client.database_name, check_query, (data_id,))
        
        if not existing:
            return jsonify({'error': 'Registro não encontrado'}), 404
        
        # Deletar dados
        query = "DELETE FROM client_data WHERE id = ?"
        db_manager.execute_query(client.database_name, query, (data_id,))
        
        return jsonify({'message': 'Dados deletados com sucesso'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@client_data_bp.route('/settings', methods=['GET'])
@jwt_required()
def get_client_settings():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        client = Client.query.get(user.client_id)
        if not client:
            return jsonify({'error': 'Cliente não encontrado'}), 404
        
        db_manager = get_database_manager()
        
        # Buscar configurações do cliente
        query = "SELECT * FROM client_settings ORDER BY setting_key"
        settings = db_manager.execute_query(client.database_name, query)
        
        # Converter para formato de dicionário
        settings_dict = {setting['setting_key']: setting['setting_value'] for setting in settings}
        
        return jsonify({
            'settings': settings_dict,
            'raw_settings': settings
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@client_data_bp.route('/settings', methods=['POST'])
@jwt_required()
def update_client_settings():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        client = Client.query.get(user.client_id)
        if not client:
            return jsonify({'error': 'Cliente não encontrado'}), 404
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Configurações são obrigatórias'}), 400
        
        db_manager = get_database_manager()
        
        # Atualizar ou inserir configurações
        for key, value in data.items():
            # Verificar se a configuração já existe
            check_query = "SELECT id FROM client_settings WHERE setting_key = ?"
            existing = db_manager.execute_query(client.database_name, check_query, (key,))
            
            if existing:
                # Atualizar
                update_query = "UPDATE client_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?"
                db_manager.execute_query(client.database_name, update_query, (str(value), key))
            else:
                # Inserir
                insert_query = "INSERT INTO client_settings (setting_key, setting_value) VALUES (?, ?)"
                db_manager.execute_query(client.database_name, insert_query, (key, str(value)))
        
        return jsonify({'message': 'Configurações atualizadas com sucesso'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

