from flask import Blueprint
from flask_cors import CORS
#from . import events
from .routes import get_relationship_by_liker_id, get_relationship_by_liked_id, get_relationship_by_id


app = Blueprint('relationship', __name__)
CORS(app)

app.add_url_rule('/get_relationship_by_id', 'get_relationship_by_id', get_relationship_by_id, methods=['GET'])
app.add_url_rule('/get_relationship_by_liker_id', 'get_relationship_by_liker_id', get_relationship_by_liker_id, methods=['GET'])
app.add_url_rule('/get_relationship_by_liked_id', 'get_relationship_by_liked_id', get_relationship_by_liked_id, methods=['GET'])