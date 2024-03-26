from flask import Blueprint
from .routes import upload
from flask_cors import CORS


app = Blueprint('profile', __name__)
CORS(app)


app.add_url_rule('/upload', 'upload', upload, methods=['POST'])
