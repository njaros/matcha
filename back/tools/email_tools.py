from flask import current_app as app
from datetime import datetime, timezone, timedelta
from flask_mail import Message
import jwt
import os


def send_email_register_token(**kwargs):
    msg = Message(
        "registration validation link", recipients=(kwargs["email"],)
    )
    token = jwt.encode(
        {
            "user_id": kwargs["id"],
            "exp": datetime.now(tz=timezone.utc) + timedelta(weeks=10000),
        },
        app.config["SECRET_EMAIL_TOKEN"],
        algorithm="HS256",
    )
    url_to_send = f"{os.environ.get('SERVER_URL')}/{token}"
    msg.html = f"""
                <h1>click this registrator link to activate your account</h1>
                <p>{url_to_send}</p>
                """
    app.config["mail"].send(msg)
