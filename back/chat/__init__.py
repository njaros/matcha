from flask import Blueprint
from flask_cors import CORS
from . import events
from .routes import add_message, add_room


app = Blueprint('chat', __name__)
CORS(app)

app.add_url_rule('/add_message', 'add_message', add_message, methods=['POST'])
app.add_url_rule('/add_room', 'add_room', add_room, methods=['POST'])