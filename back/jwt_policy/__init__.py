from flask import Blueprint
from flask_cors import CORS
from .jwt_policy import refresh


app = Blueprint('refresh', __name__)
CORS(app)


app.add_url_rule('/refresh', 'refresh', refresh, methods=['POST'])
