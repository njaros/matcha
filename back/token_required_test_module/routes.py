from jwt_policy.jwt_policy import token_required


@token_required
def test():
    return ["token OK"], 200
