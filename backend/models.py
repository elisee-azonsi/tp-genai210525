from database import db
from flask_login import UserMixin
from datetime import datetime

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    prompts = db.relationship('Prompt', backref='user', lazy=True)

class Prompt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(255), nullable=False)
    result = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

def has_exceeded_daily_limit(user_id):
    today = datetime.utcnow().date()
    count = Prompt.query.filter(
        Prompt.user_id == user_id,
        db.func.date(Prompt.timestamp) == today
    ).count()
    return count >= 5