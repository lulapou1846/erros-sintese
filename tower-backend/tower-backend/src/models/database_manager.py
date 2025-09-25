import os
import sqlite3
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, text

class DatabaseManager:
    """Gerenciador para criar e gerenciar bancos de dados únicos por cliente"""
    
    def __init__(self, base_path):
        self.base_path = base_path
        if not os.path.exists(base_path):
            os.makedirs(base_path)
    
    def create_client_database(self, database_name):
        """Cria um novo banco de dados para o cliente"""
        db_path = os.path.join(self.base_path, f"{database_name}.db")
        
        # Verifica se o banco já existe
        if os.path.exists(db_path):
            return db_path
        
        # Cria o banco de dados
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Cria tabelas básicas para o cliente
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS client_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key TEXT NOT NULL,
                value TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS client_files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL,
                file_path TEXT NOT NULL,
                file_type TEXT,
                file_size INTEGER,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS client_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                setting_key TEXT UNIQUE NOT NULL,
                setting_value TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        
        return db_path
    
    def get_client_database_path(self, database_name):
        """Retorna o caminho do banco de dados do cliente"""
        return os.path.join(self.base_path, f"{database_name}.db")
    
    def delete_client_database(self, database_name):
        """Remove o banco de dados do cliente"""
        db_path = self.get_client_database_path(database_name)
        if os.path.exists(db_path):
            os.remove(db_path)
            return True
        return False
    
    def execute_query(self, database_name, query, params=None):
        """Executa uma query no banco de dados do cliente"""
        db_path = self.get_client_database_path(database_name)
        if not os.path.exists(db_path):
            raise FileNotFoundError(f"Database {database_name} not found")
        
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row  # Para retornar resultados como dicionários
        cursor = conn.cursor()
        
        try:
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            
            if query.strip().upper().startswith('SELECT'):
                results = [dict(row) for row in cursor.fetchall()]
                conn.close()
                return results
            else:
                conn.commit()
                conn.close()
                return cursor.rowcount
        except Exception as e:
            conn.close()
            raise e

