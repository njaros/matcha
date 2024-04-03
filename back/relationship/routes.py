from flask import request, current_app
from relationship import sql as relationship_sql

def get_relationship_by_id():
    return relationship_sql.get_relationship_by_id(request.form.get('id'))


def get_relationship_by_liker_id():
    return relationship_sql.get_relationship_by_liker_id(request.form.get('liker_id'))


def get_relationship_by_liked_id():
    return relationship_sql.get_relationship_by_liked_id(request.form.get('liked_id'))