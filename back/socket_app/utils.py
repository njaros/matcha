from .events import user_sockets
from uuid import UUID


def is_connected(user_id: str | UUID):
    return user_sockets.get(str(user_id)) is not None
