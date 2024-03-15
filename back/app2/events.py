from extensions import socketio

@socketio.on('message', namespace='/app2')
def handle_message(data):
    # Envoi des données à l'événement 'res'
    socketio.emit('res', {"str": "wsh la team", "str2": "ca va ou quoi les gars", "str3":"couiiiiiiiiiiiisse"}, namespace='/app2')
