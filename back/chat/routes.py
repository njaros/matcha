from db_init import db_conn as conn
from flask import request, current_app, jsonify
from chat import sql as chat_sql

def add_message():
    content = request.form.get('content')
    user_id_sender = request.form.get('user_id_sender')
    user_id_receiver = request.form.get('user_id_receiver')
    time = request.form.get('time')

    data = {
        'content': content,
        'user_id_sender': user_id_sender,
        'user_id_receiver': user_id_receiver,
        'time': time
    }

    chat_sql.insert_message_in_database(data)
    return [], 200
