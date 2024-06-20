from flask import request, current_app as app
from datetime import datetime, timezone, timedelta
from flask_mail import Message
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from threading import Lock
import os
import socket
import random
import jwt


class MailerSingleton:
    _instances = {}
    _lock: Lock = Lock()

    def __call__(cls, *args, **kwargs):
        with cls._lock():
            if cls not in cls._instances:
                cls._instances[cls] = super(MailerSingleton, cls).__call__(
                    *args, **kwargs
                )
        return cls._instances[cls]


class Mailer(metaclass=MailerSingleton):

    smtp_server = "smtp.google.com"
    smtp_port = 587
    smtp_username = os.environ.get("MAIL_NAME_ACC")
    smtp_password = os.environ.get("MAIL_APP_PASSWORD")
    sender_email = "doNotRespond@matcha.com"
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(smtp_username, smtp_password)

    def send_email(self, subject, body_text, body_html, receiver):
        msg = MIMEMultipart("alternative")
        msg["From"] = self.sender_email
        msg["To"] = receiver
        msg["Subject"] = subject
        part1 = MIMEText(body_text, "plain")
        part2 = MIMEText(body_html, "html")
        msg.attach(part1)
        msg.attach(part2)
        self.server.sendmail(self.sender_email, receiver, msg.as_string())

    def send_email_register_token(self, **kwargs):
        token = jwt.encode(
            {
                "user_id": kwargs["id"],
                "exp": datetime.now(tz=timezone.utc) + timedelta(weeks=10000),
            },
            app.config["SECRET_EMAIL_TOKEN"],
            algorithm="HS256",
        )
        url_to_send = f"{request.host_url}mail_register/{token}"
        # url_to_send = f"http://{socket.gethostbyname(socket.gethostname())}:5066/mail_register/{token}"
        html = f"""
                <h1>activate your account</h1>
                <a href={url_to_send}>click here to activate your account</a>
                """
        self.send_email("register validation link", "", html, kwargs["email"])

    def send_reset_password(self, **kwargs):
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
        # url_to_send = f"http://{socket.gethostbyname(socket.gethostname())}:5066/confirm_reset_password/{token}"
        html = f"""
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
        self.send_email("reset password", "", html, kwargs["email"])


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
    # url_to_send = f"http://{socket.gethostbyname(socket.gethostname())}:5066/mail_register/{token}"
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
    # url_to_send = f"http://{socket.gethostbyname(socket.gethostname())}:5066/confirm_reset_password/{token}"
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
