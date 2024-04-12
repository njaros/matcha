from extensions import socketio
from flask import request, current_app
from flask_socketio import Namespace
from socket_app.events import connected_clients
from uuid import UUID

@socketio.on('handle_message')
def handle_message(data):
    current_app.logger.info(UUID(connected_clients[request.sid]['user_id']))
    current_app.logger.info(data['message'])
