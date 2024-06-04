import yagmail
from flask import current_app as app


def send_verif_email(email: str):
    yag = yagmail.SMTP(app.config["MATCHA_MAIL"])
    yag.send(
        to=email,
        subject="test",
        contents="hello"
    )


if __name__ == "__main__":
    send_verif_email("nicolas.jaros@proton.me")
