from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid
import bcrypt

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    profile_picture = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Chave estrangeira para o cliente
    client_id = db.Column(db.String(36), db.ForeignKey('clients.id'), nullable=False)
    
    def __init__(self, username, email, password, client_id):
        self.username = username
        self.email = email
        self.client_id = client_id
        self.set_password(password)
    
    def set_password(self, password):
        """Hash da senha usando bcrypt"""
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        """Verifica se a senha está correta"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'profile_picture': self.profile_picture,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_active': self.is_active,
            'client_id': self.client_id
        }
    
    def __repr__(self):
        return f'<User {self.username}>'

