import smtplib
from email.message import EmailMessage

s = smtplib.SMTP("smtp.matchamail.email", port=587)

def send_verif_email(email: str):
    msg = EmailMessage()

    s = smtplib.SMTP("smtp.matchamail.email", port=587)
    s.login()

    msg["Subject"] = "Matcha Email Validation"
    msg["From"] = "matcha <matcha@donotrespond.com>"
    msg["To"] = email
    s.send_message(msg)
    s.quit()
