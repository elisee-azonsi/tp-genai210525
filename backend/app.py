import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from routes import *
from database import *
from flask_login import LoginManager
from models import User
from routes import routes_bp



load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://elisee:1234@localhost/tp_genai"
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev')

init_db(app)

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

app.register_blueprint(routes_bp)



if __name__ == '__main__':
    app.run(debug=True)
