from flask import Blueprint
from .routes import upload, get_photos
from flask_cors import CORS


app = Blueprint('profile', __name__)
CORS(app)


app.add_url_rule('/upload', 'upload', upload, methods=['POST'])
app.add_url_rule('/get_photos', 'get_photos', get_photos, methods=["GET"])
