from flask import Blueprint
from flask_cors import CORS
from .routes import login, sign
from error_status.error import *


app = Blueprint('login', __name__)
CORS(app)


app.add_url_rule('/login', 'login', login, methods=['POST'])
app.add_url_rule('/sign', 'sign', sign, methods=['POST'])
