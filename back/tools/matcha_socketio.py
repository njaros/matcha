from flask_socketio import emit as base_emit
from uuid import UUID
from flask import current_app as app


def is_A_canceled_by_B(A: str | UUID, B: str | UUID):
    cur = app.config["conn"].cursor()
    cur.execute(
        """
        SELECT *
        FROM cancel
        WHERE canceled_id = %s AND canceler_id = %s
        """,
        (
            A,
            B,
        ),
    )
    res = cur.fetchone()
    cur.close()
    return res is not None


def emit(
    event: str,
    to: str | UUID,
    sender_id: str | UUID,
    *args,
    is_room: bool = False,
    skip_sid: str | list[str] | None = None,
):
    """Event is the same name which the front listener will use to receive.
    To is the id who will receive the emit. Can be either a
    user_id or a conv_id.
    Args is the content of the socket. Can use a dict on it.
    is_room: if True, the emit is used for a chat room, else
    it is for a user.
    Skip_sid: for chat room only, allows to skip socket_ids
    in the room (skiped ids will not receive the emit).

    The emit is sent to a room no matter what.
    The emit is sent to a user only if the sender isn't
    canceled by the user.
    """

    if is_room is True:
        room = f"room-{str(to)}"
    else:
        if is_A_canceled_by_B(sender_id, to):
            return None
        room = f"user-{str(to)}"
    namespace = "/"
    base_emit(event, *args, namespace=namespace, room=room, skip_sid=skip_sid)
