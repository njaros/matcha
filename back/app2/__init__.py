from flask import Blueprint
from extensions import socketio
from flask_cors import CORS


app = Blueprint('app2', __name__)



@socketio.on('message', namespace='/app2')
def handle_message(data):
    print('receveid message: ', data)
    res = 'received message: ' + data
    socketio.emit('res', res, broadcast=True)
