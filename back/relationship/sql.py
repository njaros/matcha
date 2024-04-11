from db_init import db_conn as conn
from flask import current_app as app
import uuid
from error_status.error import NotFoundError
from user_module.sql import get_user_by_id
from chat.sql import insert_room

def insert_liker_and_liked(data):
    cur = conn.cursor()
    query = ("""
            INSERT INTO relationship (
            liker_id,
            liked_id )
            VALUES (%s, %s, %s);
            """)
    cur.execute(query, (uuid.uuid1(), data.get('liker_id'), data.get('liked_id'),))
    conn.commit()
    cur.close()


def get_relationship_by_id(id):
    cur = conn.cursor()
    query = """
            SELECT relationship.id as id,
                    relationship.liker_id as liker_id,
                    relationship.liked_id as liked_id
            FROM relationship
            WHERE relationship.id = %s;
            """
    cur.execute(query, (id,))
    res = cur.fetchone()
    columns = [desc[0] for desc in cur.description]
    rel_dict = dict(zip(columns, res))
    cur.close()
    return rel_dict


def get_relationship_by_liker_id(id):
    cur = conn.cursor()
    query = """
            SELECT * 
            FROM relationship
            WHERE liker_id = %s; 
            """
    cur.execute(query, (id,))
    res = cur.fetchall()
    columns = [desc[0] for desc in cur.description]
    if res is [None]:
        app.logger.info('alaid')
        return 'alaid' #TODO retour d erreur
    rel = []
    app.logger.info(res)
    for row in res:
        rel_dict = dict(zip(columns, row))
        app.logger.info(rel_dict)
        rel.append(rel_dict)
    cur.close()
    return rel


def get_relationship_by_liked_id(id):
    cur = conn.cursor()
    query = """
            SELECT * 
            FROM relationship
            WHERE liked_id = %s; 
            """
    cur.execute(query, (id,))
    res = cur.fetchall()
    columns = [desc[0] for desc in cur.description]
    if res is None:
        app.logger.info('alaid')
        return 'alaid' #TODO retour d erreur
    rel = []
    app.logger.info(res)
    for row in res:
        rel_dict = dict(zip(columns, row))
        app.logger.info(rel_dict)
        rel.append(rel_dict)
    cur.close()
    return rel


def is_matched(data):
    cur = conn.cursor()
    query = """
            SELECT *
            FROM relationship
            WHERE liker_id = %s AND Liked_id = %s; 
            """
    cur.execute(query, (data.get('liker_id'), data.get('liked_id')))
    res = cur.fetchone()
    if res is None:
        raise(NotFoundError('Users are not matched'))
    columns = [desc[0] for desc in cur.description]
    matched_dict = dict(zip(columns, res))
    cur.close()
    data = {
        'user_id1': data.get('liker_id'),
        'user_id2': data.get('liked_id')
    }
    insert_room(data)
    return matched_dict
