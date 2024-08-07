from jwt_policy.jwt_policy import token_required
from . import sql
from .dto import like_dislike_dto, filter_swipe_dto
from tools.matcha_socketio import emit
from flask import current_app


@token_required
@like_dislike_dto
def like_user(**kwargs):
    new_room = sql.like_user(**kwargs)
    emit('liked',
         kwargs['target_id'],
         kwargs["user"]["id"],
         {"id": str(kwargs["user"]["id"])},
         )
    if new_room is not None:
        emit('match',
             kwargs['target_id'],
             kwargs["user"]["id"],
             {"id": str(kwargs["user"]["id"])},
             )
        return new_room
    return [], 200


@token_required
@like_dislike_dto
def dislike_user(**kwargs):
    sql.dislike_user(**kwargs)
    return [], 200


@token_required
@filter_swipe_dto
def get_swipe_list(**kwargs):
    match kwargs["sort"]:
        case "age":
            return sql.get_swipe_list_age_sort(**kwargs)
        case "distance":
            return sql.get_swipe_list_distance_sort(**kwargs)
        case "rank":
            return sql.get_swipe_list_ranking_sort(**kwargs)
        case "tags":
            return sql.get_swipe_list_tags_sort(**kwargs)
    return sql.get_swipe_list_no_sort(**kwargs)
