from flask import Blueprint
from flask_cors import CORS
from .routes import get_user_with_room, get_user_with_room_and_message, get_user_by_username, get_user_by_id

app = Blueprint('user', __name__)
CORS(app)

app.add_url_rule('/get_user_by_id', 'get_user_by_id', get_user_by_id, methods=['GET'])
app.add_url_rule('/get_user_by_username', 'get_user_by_username', get_user_by_username, methods=['GET'])
app.add_url_rule('/get_user_with_room', 'get_user_with_room', get_user_with_room, methods=['GET'])
app.add_url_rule('/get_user_with_room_and_message', 'get_user_with_room_and_message', get_user_with_room_and_message, methods=['GET'])