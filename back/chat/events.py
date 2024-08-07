from extensions import socketio
from flask import request, current_app as app, jsonify
from flask_socketio import join_room, emit, leave_room
from socket_app.events import connected_clients
from chat.sql import (
    increment_unread_msg_count,
    set_unread_msg_count_to_0,
    correct_room,
)
from validators import str, uuid, int


@socketio.on("join_video_chat_room")
def join_video_chat_room(roomName):
    room_id = roomName
    room = socketio.server.manager.rooms.get("/", {}).get(
        f"video-room-{room_id}", set()
    )
    number_of_people_in_room = len(room)

    app.logger.debug("number_of_people_in_room: %d", number_of_people_in_room)

    if number_of_people_in_room >= 2:
        app.logger.debug('FROM too many people')
        emit('too_many_people', room=request.sid)
        return

    if number_of_people_in_room == 1:
        app.logger.debug("FROM number of people in room")
        emit("another_person_ready", room=f"video-room-{room_id}", skip_sid=request.sid)

    join_room(f"video-room-{room_id}")
    app.logger.debug("FROM JOIN VIDEO CHAT ROOM")


@socketio.on("leave_video_chat_room")
def leave_video_chat_room(roomName):
    room_id = roomName
    leave_room(f"video-room-{room_id}")
    emit("chat_disconnection", room=f"video-room-{room_id}", skip_sid=request.sid)
    app.logger.debug("FROM LEAVE VIDEO CHAT ROOM")


@socketio.on("send_connection_offer")
def send_connection_offer(data):
    offer = data.get("offer")
    roomName = data.get("roomName")
    emit(
        "send_connection_offer",
        {"offer": offer, "roomName": roomName},
        room=f"video-room-{roomName}",
        skip_sid=request.sid,
    )
    app.logger.debug("FROM SEND CONNECTION OFFER")


@socketio.on("answer")
def answer(data):
    answer = data.get("answer")
    roomName = data.get("roomName")
    emit(
        "answer",
        {"answer": answer, "roomName": roomName},
        room=f"video-room-{roomName}",
        skip_sid=request.sid,
    )
    app.logger.debug("FROM ANSWER")


@socketio.on("send_candidate")
def send_candidate(data):
    candidate = data.get("candidate")
    roomName = data.get("roomName")
    emit(
        "send_candidate",
        {"candidate": candidate, "roomName": roomName},
        room=f"video-room-{roomName}",
        skip_sid=request.sid,
    )
    app.logger.debug("FROM SEND CANDIDATE")


@socketio.on("set_msg_count_to_0")
def set_msg_count_to_0(room_id): 
    user = connected_clients[request.sid]
    set_unread_msg_count_to_0(user["id"], room_id)


@socketio.on("join_chat_room")
def join_chat_room(room_id):
    join_room(f"room-{room_id}")


@socketio.on("send_message")
def send_message(data):
    author = data.get("author")
    user_id = author.get("id")
    username = author.get("username")
    content = data.get("content")
    room_id = data.get("room_id")
    send_at = data.get("send_at")

    
    if None in (user_id, username, content, room_id, send_at):
        return jsonify({"error": "Missing one or more required fields"}), 400

    try:
        uuid.isUuid(user_id)
        uuid.isUuid(room_id)

    except Exception as error:
        if error.args:
            app.logger.error(error.args[0])

    # if not all(isinstance(param, str) for param in [ username, content, send_at]):
    #     app.logger.error('Wrong type of parameter')

    # try and catch
    target = correct_room(room_id, connected_clients[request.sid]["id"])
    if target is None:
        app.logger.warn(f"Room {room_id} not found in database.")
        return
    # target = (
    #     room["user_1"]["id"]
    #     if room["user_1"]["id"] != user_id
    #     else room["user_2"]["id"]
    # )
    increment_unread_msg_count(target, room_id)

    emit("msg_count", room_id, room=f"room-{room_id}")
    emit(
        "receive_message",
        {
            "author": {"user_id": user_id, "username": username},
            "content": content,
            "room": room_id,
            "send_at": send_at,
        },
        room=f"room-{room_id}",
        skip_sid=request.sid,
    )
    emit(
        "last_message",
        {
            "author": {"user_id": user_id, "username": username},
            "content": content,
            "room": room_id,
            "send_at": send_at,
        },
        room=f"room-{room_id}",
    )
