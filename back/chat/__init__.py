from flask import Blueprint
from flask_cors import CORS
from . import events
from .routes import add_message, add_room, get_room_with_message, get_message, get_room


app = Blueprint('chat', __name__)
CORS(app)

app.add_url_rule('/add_message', 'add_message', add_message, methods=['POST'])
app.add_url_rule('/add_room', 'add_room', add_room, methods=['POST'])
app.add_url_rule('/get_room', 'get_room', get_room, methods=['GET'])
app.add_url_rule('/get_room_with_message', 'get_room_with_message', get_room_with_message, methods=['GET'])
app.add_url_rule('/get_message', 'get_message', get_message, methods=['GET'])