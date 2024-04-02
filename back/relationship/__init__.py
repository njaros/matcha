from flask import Blueprint
from flask_cors import CORS
#from . import events
#from .routes import 


app = Blueprint('relationship', __name__)
CORS(app)

#app.add_url_rule('/get_message', 'get_message', get_message, methods=['GET'])