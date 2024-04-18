from flask import Blueprint
from flask_cors import CORS
#from . import events
from .routes import get_relationship_by_liker_id, get_relationship_by_liked_id, get_relationship_by_id, is_matched, create_room_when_user_are_matched


app = Blueprint('relationship', __name__)
CORS(app)

app.add_url_rule('/relationship/get_relationship_by_id', 'get_relationship_by_id', get_relationship_by_id, methods=['GET'])
app.add_url_rule('/relationship/get_relationship_by_liker_id', 'get_relationship_by_liker_id', get_relationship_by_liker_id, methods=['GET'])
app.add_url_rule('/relationship/get_relationship_by_liked_id', 'get_relationship_by_liked_id', get_relationship_by_liked_id, methods=['GET'])
app.add_url_rule('/relationship/is_matched', 'is_matched', is_matched, methods=['GET'])
app.add_url_rule('/relationship/create_room_when_user_are_matched', 'create_room_when_user_are_matched',create_room_when_user_are_matched, methods=['POST'])