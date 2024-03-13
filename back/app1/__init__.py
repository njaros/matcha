from flask import Blueprint

app = Blueprint('app1', __name__)

@app.route('/')
def index():
    return 'Welcome to the first aplication'