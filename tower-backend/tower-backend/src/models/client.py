from src.models.user import db
from datetime import datetime
import uuid

class Client(db.Model):
    __tablename__ = 'clients'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    database_name = db.Column(db.String(100), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relacionamento com usuários
    users = db.relationship('User', backref='client', lazy=True, cascade='all, delete-orphan')
    
    def __init__(self, name, email):
        self.name = name
        self.email = email
        self.database_name = f"client_{str(uuid.uuid4()).replace('-', '_')}"
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'database_name': self.database_name,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_active': self.is_active
        }

