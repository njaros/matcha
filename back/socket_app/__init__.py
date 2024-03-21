from flask import Blueprint
from flask_cors import CORS
from . import events

app = Blueprint('socket', __name__)
CORS(app)