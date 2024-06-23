from extensions import socketio
from flask_socketio import join_room, leave_room, rooms, disconnect
from flask import request, current_app
from user_module.sql import get_user_with_room
from uuid import UUID
from user_module.sql import get_user_by_id
import jwt


connected_clients = {}


@socketio.on("connect")
def handle_connection():
    client_id = request.sid

    try:
        token = request.args.get("token")
        data = jwt.decode(
            token, current_app.config["SECRET_ACCESS"], algorithms=["HS256"]
        )
        expDate = data.get("exp")
        if expDate is None:
            current_app.logger.error("token expiration date is expired")
            return
        user = get_user_by_id(data["user_id"])
        if user is None:
            current_app.logger.error("User does not exist")
            return
        connected_clients[client_id] = user
    except jwt.exceptions.InvalidTokenError:
        current_app.logger.error("Invalid Authentication token")
        return

    current_app.logger.info("Connection of socket ID: {}".format(client_id))
    user_id = user["id"]
    room_user = f"user-{user_id}"
    join_room(room_user)
    current_app.logger.info(f"Client {client_id} joined room {room_user}")
    # connected_clients[client_id] = {'user_id': user_id, 'token': token}
    user = get_user_with_room(user_id)
    if user is None:
        current_app.logger.info("User not found in database.")
        return
    if "room" not in user or not isinstance(user["room"], list):
        current_app.logger.info("User does not have any rooms.")
        return
    for room in user["room"]:
        join_room(f"room-{room['room_id']}")


@socketio.on("disconnect")
def handle_disconnect():
    client_id = request.sid
    # current_app.logger.info("Disconnect of socket ID: " + client_id)
    # current_app.logger.info(rooms())
    # current_app.logger.info(connected_clients[client_id])
    leave_room(f"user-{str(connected_clients[client_id]["id"])}")
    leave_room(client_id)
    disconnect(client_id)
    del connected_clients[client_id]
    current_app.logger.info(rooms())
