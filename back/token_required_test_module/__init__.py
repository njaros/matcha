from flask import Blueprint
from flask_cors import CORS
from .routes import test


app = Blueprint('test', __name__)
CORS(app)


app.add_url_rule('/test', 'test', test, methods=['GET'])
