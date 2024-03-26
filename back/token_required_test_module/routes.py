from jwt_policy.jwt_policy import token_required


@token_required
def test(current_user):
    return [f"hello {current_user} token OK"], 200
