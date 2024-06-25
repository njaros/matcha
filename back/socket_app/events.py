from extensions import socketio
from flask_socketio import join_room, leave_room, rooms, disconnect, emit
from flask import request, current_app
from user_module.sql import get_user_with_room
from .sql import reset_last_connection
from user_module.sql import get_user_by_id
import jwt


connected_clients = {}
user_sockets: dict[str, set[str]] = {}


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
        user_id = str(user["id"])
        if user_sockets.get(user_id) is None:
            user_sockets[user_id] = []
            emit("connected", {"id": user_id}, broadcast=True)
        user_sockets[str(user["id"])].append(client_id)
    except jwt.exceptions.InvalidTokenError:
        current_app.logger.error("Invalid Authentication token")
        return

    current_app.logger.info("Connection of socket ID: {}".format(client_id))
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
    client_sid = request.sid
    user = connected_clients.get(client_sid)
    user_id = None
    if user is not None:
        user_id = user.get("id")
        if user_id is not None:
            user_id = str(user_id)
            user_sockets[user_id].remove(client_sid)
            if len(user_sockets[user_id]) == 0:
                del user_sockets[user_id]
                reset_last_connection(user_id)
                emit("disconnected", {"id": str(user_id)}, broadcast=True)
    current_app.logger.info(
        f"Disconnect of socket ID: {client_sid} of the user {user_id}"
    )
    current_app.logger.info(
        f"Sockets of this user remaining: {user_sockets.get(user_id)}"
    )
    disconnect(client_sid)
    del connected_clients[client_sid]
    for room in rooms():
        leave_room(room)
