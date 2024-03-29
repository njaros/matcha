from flask import request, current_app as app
from functools import wraps


def image_dto(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        denied_files = []
        accepted_files = []
        files = request.files.getlist("file[]")
        app.logger.info(files)
        for file in files:
            buffer = file.read()
            file.close()
            MIME_type = buffer[0:4]
            match MIME_type:
                case b'\xff\xd8\xff\xe0':
                    accepted_files.append(("jpg", file.filename, buffer))
                case b'\x89\x50\x4e\x47':
                    accepted_files.append(("png", file.filename, buffer))
                case b'\x47\x49\x46\x38':
                    accepted_files.append(("gif", file.filename, buffer))
                case _:
                    app.logger.info(file.filename)
                    denied_files.append(file.filename)
        if len(accepted_files) == 0:
            if len(denied_files) == 0:
                return "no file", 400
            else:
                return denied_files, 400
        return f(accepted_files, denied_files, *args, **kwargs)
    return decorated