from db_init import db_conn as conn
from flask import request, current_app, jsonify

def index():
    cursor = conn.cursor()
    cursor.execute("quelque chose")
    cursor.close()
    conn.commit()
    return 'Welcome to the first aplication'

def test():
    return 'This is a test'


def testPost():
    message = request.json
    current_app.logger.info('CHOKBAR DE BZ-------------> {}'.format(message['message']))
    return message['message'], 200

def in_shape():
    return 'boom snickers'