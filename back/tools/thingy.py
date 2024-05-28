from uuid import UUID


def notNoneLen(data: dict):
    count = 0
    for k, v in data.items():
        if v is not None:
            count += 1
    return count


def to_socket_uuid(uuid: UUID) -> str:
    return str(uuid).replace("-", "")
