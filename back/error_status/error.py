from flask import jsonify


class BadRequestError(Exception):
    def __init__(self, message):
        self.message = message


class InternalServerError(Exception):
    def __init__(self, message):
        self.message = message


def handle_bad_request_error(error):
    response = jsonify({'message': error.message})
    response.status_code = 400
    return response


def handle_internal_server_error(error):
    response = jsonify({'message': error.message})
    response.status_code = 500
    return response