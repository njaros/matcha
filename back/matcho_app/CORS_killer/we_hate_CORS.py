# https://stackoverflow.com/questions/25594893/how-to-enable-cors-in-flask/26395623#26395623
from flask import make_response, jsonify, request
from functools import wraps


def options_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", '*')
    response.headers.add("Access-Control-Allow-Headers", '*')
    response.headers.add("Access-Control-Allow-Methods", '*')
    return response


def post_response(data):
    response = jsonify(data.to_dict())
    response.headers.add("Access-Control-Allow-Origin", '*')
    return response


# tentative de decorateur pour simplifier les requetes POST
def post_wrapper(post_route):
    @wraps
    def decorated(*args, **kwargs):
        if request.method == "OPTIONS":
            return options_response()
        else:
            res = post_route(*args, **kwargs)
            return post_response(res)
