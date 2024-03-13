from flask import Blueprint
from extensions import socketio

app = Blueprint('app2', __name__)


@socketio.on('message', namespace='/app2')
def handle_message(data):
    print('receveid message: ', data)
    socketio.emit('response', {'data': 'Message receveid!'})