import os


class Config:
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
    MAIL_DEBUG = True
    MAIL_SUPPRESS_SEND = False
    MAIL_DEFAULT_SENDER = ("Matcha Mailer", "donotresponse@pouet.com")
    MAIL_MAX_EMAILS = None
    MAIL_ASCII_ATTACHMENTS = False
