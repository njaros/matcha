from flask import Blueprint
from flask_cors import CORS
# from .events import events
# from .routes import 

app = Blueprint('chat', __name__)
CORS(app)