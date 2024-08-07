from flask import jsonify


class BadRequestError(Exception):
    def __init__(self, message):
        self.message = message


class InternalServerError(Exception):
    def __init__(self, message):
        self.message = message


class NotFoundError(Exception):
    def __init__(self, message):
        self.message = message


class ForbiddenError(Exception):
    def __init__(self, message):
        self.message = message


class RequestTooLargeError(Exception):
    def __init__(self, message):
        self.message = message


def handle_request_too_large_error(error):
    response = jsonify({"message": error.message})
    response.status_code = 413
    return response


def handle_bad_request_error(error):
    response = jsonify({"message": error.message})
    response.status_code = 400
    return response


def handle_internal_server_error(error):
    response = jsonify({"message": error.message})
    response.status_code = 500
    return response


def handle_not_found_error(error):
    response = jsonify({"message": error.message})
    response.status_code = 404
    return response


def handle_forbidden_error(error):
    response = jsonify({"message": error.message})
    response.status_code = 403
    return response


def handle_miss_key_error(error):
    response = jsonify({"message": f"missing credential: {error.args[0]}"})
    response.status_code = 400
    return response


def handle_miss_key_error_internal(error):
    response = jsonify({"message": f"missing credential: {error.args[0]}"})
    response.status_code = 400
    return response


def handle_value_error(error):
    response = jsonify({"message": f"wrong parameter value: {error.args[0]}"})
    response.status_code = 400
    return response


def handle_recipient_error(error):
    response = jsonify(
        {
            "message:": f"not valid RFC 5321 address: {list(error.args[0].keys())[0]}"
        }
    )
    response.status_code = 400
    return response
