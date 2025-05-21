import os
from flask import request, jsonify, session,  Blueprint, current_app
from database import db
from models import User, Prompt, has_exceeded_daily_limit
from openai import OpenAI
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))



routes_bp = Blueprint('routes', __name__)


def get_user_or_ip():
    return str(session.get("user_id") or get_remote_address())



@routes_bp.route("/api/generate", methods=["POST"])
def generate_product_description():
    if has_exceeded_daily_limit(current_user.id):
            return jsonify({'error': 'Limite de requêtes atteinte pour aujourd\'hui.'}), 429
    
    data = request.get_json()
    product_name = data.get("product_name")

    if not product_name:
        return jsonify({"error": "Le nom du produit est requis."}), 400

    prompt = f"{product_name}"

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Tu es un expert marketing."},
                {"role": "user", "content": prompt}
            ]
        )
        result = response.choices[0].message.content.strip()
        new_entry = Prompt(product_name=prompt, result=result, user_id=current_user.id)

        db.session.add(new_entry)
        db.session.commit()

        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@routes_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email et mot de passe requis'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'Utilisateur déjà inscrit'}), 409

    hashed_pw = generate_password_hash(password)
    new_user = User(email=email, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()

    login_user(new_user)
    return jsonify({'message': 'Inscription réussie'}), 201

@routes_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        login_user(user)
        return jsonify({'message': 'Connexion réussie'}), 200
    else:
        return jsonify({'error': 'Identifiants invalides'}), 401


@routes_bp.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Déconnexion réussie'}), 200


@routes_bp.route('/api/history', methods=['GET'])
@login_required
def user_history():
    history = Prompt.query.filter_by(user_id=current_user.id).order_by(Prompt.id.desc()).limit(10).all()
    history_data = [{"product_name": h.product_name, "result": h.result, "timestamp": h.timestamp.isoformat()} for h in history]
    
    
    return jsonify(history_data)


