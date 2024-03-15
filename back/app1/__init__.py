from flask import Blueprint
from .routes import index, in_shape, test

app = Blueprint('app1', __name__)


app.add_url_rule('/app1', 'index', index, methods=['GET'])
app.add_url_rule('/app1/in_shape', 'in_shape', in_shape, methods=['GET'])
app.add_url_rule('/app1/test', 'test', test, methods=['GET'])
