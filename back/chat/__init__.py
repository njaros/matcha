from flask import Blueprint
from flask_cors import CORS
from . import events
from .routes import add_message


app = Blueprint('chat', __name__)
CORS(app)

app.add_url_rule('/add_message', 'add_message', add_message, methods=['POST'])