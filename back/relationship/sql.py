from flask import current_app as app
import uuid
from error_status.error import NotFoundError
from psycopg.rows import dict_row
from chat.sql import delete_room_by_user_ids
from uuid import UUID


def insert_liker_and_liked(data):
    cur = app.config["conn"].cursor()
    query = """
            INSERT INTO relationship (
            liker_id,
            liked_id )
            VALUES (%s, %s, %s);
            """
    cur.execute(
        query,
        (
            uuid.uuid1(),
            data.get("liker_id"),
            data.get("liked_id"),
        ),
    )
    app.config["conn"].commit()
    cur.close()


def get_relationship_by_id(id):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    query = """
            SELECT
                relationship.id AS id,
                relationship.liker_id AS liker_id,
                relationship.liked_id AS liked_id
            FROM relationship
            WHERE relationship.id = %s
            """
    cur.execute(query, (id,))
    res = cur.fetchone()
    if res is None:
        raise NotFoundError("this relationship does not exist.")
    cur.close()
    return res


def get_relationship_by_liker_id(id):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    query = """
            SELECT
                relationship.id AS id,
                relationship.liker_id AS liker_id,
                relationship.liked_id AS liked_id
            FROM relationship
            WHERE relationship.liker_id= %s
            """
    cur.execute(query, (id,))
    res = cur.fetchone()
    if res is None:
        raise NotFoundError("this relationship does not exist.")
    cur.close()
    return res


def get_relationship_by_liked_id(id):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    query = """
            SELECT
                relationship.id AS id,
                relationship.liker_id AS liker_id,
                relationship.liked_id AS liked_id
            FROM relationship
            WHERE relationship.liked_id= %s
            """
    cur.execute(query, (id,))
    res = cur.fetchone()
    if res is None:
        raise NotFoundError("this relationship does not exist.")
    cur.close()
    return res


def is_matched(data):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    query = """
            SELECT
                relationship.id AS id,
                relationship.liker_id AS liker_id,
                relationship.liked_id AS liked_id
            FROM relationship
            WHERE liker_id = %s AND Liked_id = %s;
            """
    cur.execute(query, (data["liker_id"], data["liked_id"]))
    res = cur.fetchone()
    if res is None:
        raise (NotFoundError("Users are not matched"))
    cur.close()
    return res


def remove_like(**kwargs):
    cur = app.config["conn"].cursor()
    cur.execute(
        """
        DELETE FROM relationship
        WHERE liker_id = %(self_id)s AND liked_id = %(other_id)s
        RETURNING (
            SELECT id
            FROM relationship
            WHERE liker_id = %(other_id)s AND liked_id = %(self_id)s
        )
        """,
        {"self_id": kwargs["user"]["id"], "other_id": kwargs["user_id"]},
    )
    matched = cur.fetchone()
    app.config["conn"].commit()
    if matched is not None:
        delete_room_by_user_ids(**kwargs)
    cur.close()


def get_matches_by_user_id(**kwargs):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    cur.execute(
        """
            SELECT  CASE    WHEN user_1 = %(self_id)s THEN user_2
                            WHEN user_2 = %(self_id)s THEN user_1
                            END id,
                    CASE    WHEN user_1 = %(self_id)s
                                THEN user_table_2.username
                            WHEN user_2 = %(self_id)s
                                THEN user_table_1.username
                            END username,
                    CASE    WHEN user_1 = %(self_id)s
                                THEN photos_2.binaries
                            WHEN user_2 = %(self_id)s
                                THEN photos_1.binaries
                            END binaries,
                    CASE    WHEN user_1 = %(self_id)s
                                THEN photos_2.mime_type
                            WHEN user_2 = %(self_id)s
                                THEN photos_1.mime_type
                            END mime_type
            FROM    room
            LEFT OUTER JOIN user_table AS user_table_1
                ON user_1 = user_table_1.id
            LEFT OUTER JOIN user_table AS user_table_2
                ON user_2 = user_table_2.id
            LEFT OUTER JOIN photos AS photos_1 ON user_1 = photos_1.user_id
                AND photos_1.main = true
            LEFT OUTER JOIN photos AS photos_2 ON user_2 = photos_2.user_id
                AND photos_2.main = true
            WHERE   user_1 = %(self_id)s OR user_2 = %(self_id)s
            ORDER BY username
        """,
        {"self_id": kwargs["user"]["id"]},
    )
    list = cur.fetchall()
    cur.close()
    return list


def get_liked_by_user_id(**kwargs):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    cur.execute(
        """
            SELECT  user_table.id AS id,
                    username,
                    photos.binaries AS binaries,
                    photos.mime_type AS mime_type
            FROM    relationship
            LEFT OUTER JOIN user_table ON liked_id = user_table.id
            LEFT OUTER JOIN photos ON photos.user_id = user_table.id
                                   AND photos.main = true
            WHERE   liker_id = %(user)s
                    AND liked_id NOT IN (
                        SELECT liker_id
                        FROM relationship
                        WHERE liked_id = %(user)s
                    )
            ORDER BY username;
        """,
        {"user": kwargs["user"]["id"]},
    )
    list = cur.fetchall()  # modif by me
    cur.close()
    return list


def get_liker_by_user_id(**kwargs):
    cur = app.config["conn"].cursor(row_factory=dict_row)
    cur.execute(
        """
            SELECT  user_table.id AS id,
                    username,
                    photos.binaries AS binaries,
                    photos.mime_type AS mime_type
            FROM    relationship
            LEFT OUTER JOIN user_table ON liker_id = user_table.id
            LEFT OUTER JOIN photos ON photos.user_id = user_table.id
                                   AND photos.main = true
            WHERE   liked_id = %(user)s
                    AND liker_id NOT IN (
                        SELECT liked_id
                        FROM relationship
                        WHERE liker_id = %(user)s
                    )
            ORDER BY username;
        """,
        {"user": kwargs["user"]["id"]},
    )
    list = cur.fetchall()  # modif by me
    cur.close()
    return list


def report_user(**kwargs):
    user_deleted = False
    cur = app.config["conn"].cursor(row_factory=dict_row)
    cur.execute(
        """
        INSERT INTO report (reported_id, reporter_id)
        VALUES (%(reported)s, %(reporter)s)
        ON CONFLICT DO NOTHING
        RETURNING (
            SELECT COUNT(*)
            FROM report
            WHERE reported_id = %(reported)s
        )
        """,
        {"reported": kwargs["user_id"], "reporter": kwargs["user"]["id"]},
    )
    count = cur.fetchone()["count"]
    if count == 9:
        cur.execute(
            """
            DELETE FROM user_table
            WHERE id = %s
            """,
            (kwargs["user_id"],),
        )
        user_deleted = True
    cur.close()
    app.config["conn"].commit()
    return user_deleted


def is_A_canceled_by_B(A: str | UUID, B: str | UUID):
    cur = app.config["conn"].cursor()
    cur.execute(
        """
        SELECT *
        FROM cancel
        WHERE canceled_id = %s AND canceler_id = %s
        """,
        (
            A,
            B,
        ),
    )
    res = cur.fetchone()
    cur.close()
    return res is not None
