from flask import Blueprint
from flask_cors import CORS
from . import events

app = Blueprint('app2', __name__)