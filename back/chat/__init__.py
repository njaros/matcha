from flask import Blueprint
from flask_cors import CORS
from . import events
from .routes import add_message, add_room, \
                    get_room_with_message, \
                    get_message, get_room, \
                    get_room_list_by_id, \
                    get_message_list_by_room_id, \
                    increment_unread_msg_count, \
                    set_unread_msg_count_to_0, \
                    get_unread_msg_count


app = Blueprint('chat', __name__)
CORS(app)

app.add_url_rule('/chat/add_message', 'add_message', add_message, methods=['POST'])
app.add_url_rule('/chat/add_room', 'add_room', add_room, methods=['POST'])
app.add_url_rule('/chat/get_room', 'get_room', get_room, methods=['GET'])
app.add_url_rule('/chat/get_room_with_message', 'get_room_with_message', get_room_with_message, methods=['POST'])
app.add_url_rule('/chat/get_message', 'get_message', get_message, methods=['GET'])
app.add_url_rule('/chat/get_room_list_by_id', 'get_room_list_by_id', get_room_list_by_id, methods=['GET'])
app.add_url_rule('/chat/get_message_list_by_room_id', 'get_message_list_by_room_id', get_message_list_by_room_id, methods=['POST'])
app.add_url_rule('/chat/increment_unread_msg_count', 'increment_unread_msg_count', increment_unread_msg_count, methods=['POST'])
app.add_url_rule('/chat/set_unread_msg_count_to_0', 'set_unread_msg_count_to_0', set_unread_msg_count_to_0, methods=['POST'])
app.add_url_rule('/chat/get_unread_msg_count', 'get_unread_msg_count', get_unread_msg_count, methods=['POST'])