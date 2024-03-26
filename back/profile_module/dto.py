from flask import current_app as app
import os
from functools import wraps
from flask import request


def image_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'file' not in request.files:
            return ["no file"], 400
        file = request.files['file']
        if file.filename == '':
            return ["no file"], 400
        if len(img.name) > 30:
            return ["image name too long, must be less than 30 characters"], 400
        MIME_type = img.content[0:4]
        match MIME_type:
            case b'\xff\xd8\xff\xe0':
                return "jpg"
            case b'\x89\x50\x4e\x47':
                return "pbg"
            case b'\x47\x49\x46\x38':
                return "gif"
        return "unhandled MIME_type"
    