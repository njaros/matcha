from flask import Blueprint
from flask_cors import CORS
from .routes import index, in_shape, test, testPost

app = Blueprint('app1', __name__)
CORS(app)


app.add_url_rule('/app1', 'index', index, methods=['GET'])
app.add_url_rule('/app1/in_shape', 'in_shape', in_shape, methods=['GET'])
app.add_url_rule('/app1/test', 'test', test, methods=['GET'])
app.add_url_rule('/app1/testPost', 'testPost', testPost, methods=['POST'])
