from db_init import db_conn as conn
from flask import current_app as app
import uuid
from error_status.error import NotFoundError
from chat.sql import insert_room

def insert_liker_and_liked(data):
    cur = conn.cursor()
    query = """
            INSERT INTO relationship (
            liker_id,
            liked_id )
            VALUES (%s, %s, %s);
            """
    cur.execute(query, (uuid.uuid1(), data.get('liker_id'), data.get('liked_id'),))
    conn.commit()
    cur.close()


def get_relationship_by_id(id):
    cur = conn.cursor()
    query = """
            SELECT
                json_build_object(
                    'id', relationship.id,
                    'liker_id', relationship.liker_id,
                    'liked_id', relationship.liked_id
                )
            FROM relationship
            WHERE relationship.id = %s
            """
    cur.execute(query, (id,))
    res = cur.fetchone()
    if res is None:
        raise NotFoundError('this relationship does not exist.')
    cur.close()
    return res[0]


def get_relationship_by_liker_id(id):
    cur = conn.cursor()
    query = """
            SELECT
                json_build_object(
                    'id', relationship.id,
                    'liker_id', relationship.liker_id,
                    'liked_id', relationship.liked_id
                )
            FROM relationship
            WHERE relationship.liker_id = %s
            """
    cur.execute(query, (id,))
    res = cur.fetchone()
    if res is None:
        raise NotFoundError('this relationship does not exist.')
    cur.close()
    return res[0]


def get_relationship_by_liked_id(id):
    cur = conn.cursor()
    query = """
            SELECT
                json_build_object(
                    'id', relationship.id,
                    'liker_id', relationship.liker_id,
                    'liked_id', relationship.liked_id
                )
            FROM relationship
            WHERE relationship.liked_id = %s
            """
    cur.execute(query, (id,))
    res = cur.fetchone()
    if res is None:
        raise NotFoundError('this relationship does not exist.')
    cur.close()
    return res[0]


def is_matched(data):
    cur = conn.cursor()
    query = """
            SELECT
                json_build_object(
                    'id', relationship.id,
                    'liker_id', relationship.liker_id,
                    'liked_id', relationship.liked_id
                )
            FROM relationship
            WHERE liker_id = %s AND Liked_id = %s; 
            """
    cur.execute(query, (data['liker_id'], data['liked_id']))
    res = cur.fetchone()
    if res is None:
        raise(NotFoundError('Users are not matched'))
    cur.close()
    return res[0]
