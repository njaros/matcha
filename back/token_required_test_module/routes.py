from jwt_policy.jwt_policy import token_required


@token_required
def test(**kwargs):
    return [f"hello {kwargs["user"]["username"]} token OK"], 200
