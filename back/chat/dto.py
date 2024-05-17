from validators import uuid, str
from functools import wraps
from flask import request
from error_status.error import RequestTooLargeError

def message_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        
        kwargs['content'] = str.isString(request.json['content'], {'maxlen': 1500})
        kwargs['room_id'] = uuid.isUuid(request.json['room_id'])
        return  f(*args, **kwargs)
    return decorated