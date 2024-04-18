from flask import request, current_app
from relationship import sql as relationship_sql
from jwt_policy.jwt_policy import token_required
from validators import uuid
from error_status.error import ForbiddenError
from chat.sql import insert_room


@token_required
def get_relationship_by_id(**kwargs):
    rel = relationship_sql.get_relationship_by_id(uuid.isUuid(request.form.get('id')))
    if kwargs['user']['id'] == str(rel['liker_id']) or kwargs['user']['id'] == str(rel['liked_id']):
        return rel
    raise ForbiddenError('You cannot acces to this information.')


@token_required
def get_relationship_by_liker_id(**kwargs):
    rel = relationship_sql.get_relationship_by_liker_id(uuid.isUuid(request.form.get('id')))
    if str(rel['liker_id']) == kwargs['user']['id'] or str(rel['liked_id']) == kwargs['user']['id']:
        return rel
    raise ForbiddenError('You cannot acces to this information.')


@token_required
def get_relationship_by_liked_id(**kwargs):
    rel = relationship_sql.get_relationship_by_liked_id(uuid.isUuid(request.form.get('id')))
    if str(rel['liker_id']) == kwargs['user']['id'] or str(rel['liked_id']) == kwargs['user']['id']:
        return rel
    raise ForbiddenError('You cannot acces to this information.')


@token_required
def is_matched(**kwargs):
    data = {
        "liker_id": request.form['liker_id'],
        "liked_id": request.form['liked_id']
    }
    is_matched = relationship_sql.is_matched(data)
    if str(is_matched['liker_id']) == kwargs['user']['id'] or str(is_matched['liked_id']) == kwargs['user']['id']:
        return 'success'
    raise ForbiddenError('You cannot acces to this information.')


@token_required
def create_room_when_user_are_matched():
    if is_matched() == 'success':
        return insert_room(
            {
                'user_id1': request.form['liker_id'], 
                'user_id2': request.form['liked_id']
            })
        
     
