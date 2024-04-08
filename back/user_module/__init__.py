from flask import Blueprint
from flask_cors import CORS
from .routes import get_user_with_room

app = Blueprint('user', __name__)
CORS(app)

app.add_url_rule('/get_user_with_room', 'get_user_with_room', get_user_with_room, methods=['POST'])