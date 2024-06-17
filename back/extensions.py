from flask_socketio import SocketIO, join_room, leave_room

socketio = SocketIO(cors_allowed_origins="*")