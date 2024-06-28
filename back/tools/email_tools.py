from flask import request, current_app as app
from datetime import datetime, timezone, timedelta
from flask_mail import Message
import random
import jwt


def send_email_register_token(**kwargs):
    msg = Message("registration validation link", recipients=(kwargs["email"],))
    token = jwt.encode(
        {
            "user_id": kwargs["id"],
            "exp": datetime.now(tz=timezone.utc) + timedelta(weeks=10000),
        },
        app.config["SECRET_EMAIL_TOKEN"],
        algorithm="HS256",
    )
    url_to_send = f"{request.host_url}mail_register/{token}"
    msg.html = f"""
                <h1>activate your account</h1>
                <a href={url_to_send}>click here to activate your account</a>
                """
    app.config["mail"].send(msg)


def send_reset_password(**kwargs):
    msg = Message("reset password", recipients=(kwargs["email"],))
    new_pass = str(random.randint(100000, 999999))
    token = jwt.encode(
        {
            "new_pass": new_pass,
            "email": kwargs["email"],
            "exp": datetime.now(tz=timezone.utc) + timedelta(weeks=10000),
        },
        app.config["SECRET_RESET_PASSWORD"],
        algorithm="HS256",
    )
    url_to_send = f"{request.host_url}confirm_reset_password/{token}"
    msg.html = f"""
                <h1>reset your password</h1>
                <h2>If you click to the link at the end of page, your \
password will be changed to</h2>
                <h1>{new_pass}</h1>
                <h2>Then do not forget to change the password \
in your settings</h2>
                <h2>If you didn't asked for a password reset, ignore this \
mail and we advise you to change your email in your profile.
                <a href={url_to_send}>click here to reset your password</a>
                """
    app.config["mail"].send(msg)
