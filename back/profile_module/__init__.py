from flask import Blueprint
from .routes import *
from flask_cors import CORS


app = Blueprint('profile', __name__)
CORS(app)


app.add_url_rule('/profile/upload', 'upload', upload, methods=['POST'])
app.add_url_rule('/profile/get_photos', 'get_photos', get_photos, methods=["GET"])
app.add_url_rule('/profile/delete_photo', 'delete_photo', delete_photo, methods=["POST"])
app.add_url_rule('/profile/change_main_photo', 'change_main_photo', change_main_photo, methods=["POST"])
app.add_url_rule('/profile/change_biography', 'change_biography', change_biography, methods=["POST"])
app.add_url_rule('/profile/update_user', 'update_user', update_user, methods=["POST"])
