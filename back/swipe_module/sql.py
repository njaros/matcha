from db_init import db_conn as conn
from psycopg.rows import dict_row
from chat import sql as chat_sql
import uuid

base_swipe_request = """
        WITH prefiltered AS (
            SELECT
                id,
                username,
                birthDate,
                gender,
                rank,
                ACOS(
                    SIND(%(self_latitude)s) * SIND(latitude)
                    + COSD(%(self_latitude)s)
                    * COSD(latitude)
                    * COSD(longitude - %(self_longitude)s)
                ) * 6371 AS distance
            FROM
                user_table
            WHERE
                preference IN ('all', %(gender)s)
                AND %(preference)s IN ('all', gender)
                AND id NOT IN (
                    SELECT canceler_id
                    FROM cancel
                    WHERE canceled_id = %(user)s
                ) AND id NOT IN (
                    SELECT canceled_id
                    FROM cancel
                    WHERE canceler_id = %(user)s
                ) AND id NOT IN (
                    SELECT liked_id
                    FROM relationship
                    WHERE liker_id = %(user)s
                ) AND id NOT IN ( %(user)s )
                AND birthDate BETWEEN %(date_min)s AND %(date_max)s
                AND ABS(rank - %(user_rank)s) < %(ranking_gap)s
                AND (
                    %(hobby_ids_len)s = 0
                    OR (
                        SELECT COUNT(*)
                        FROM user_hobbie
                        WHERE user_hobbie.user_id = user_table.id
                        AND user_hobbie.hobbie_id
                            IN (SELECT unnest(%(hobby_ids)s::int[]))
                    ) = %(hobby_ids_len)s
                )
        )
        SELECT
            id
        FROM prefiltered
        WHERE
            distance < %(distance_max)s
        """


def set_request_dict(**kwargs):
    return {
            "user": kwargs["user"]["id"],
            "self_latitude": kwargs["user"]["latitude"],
            "self_longitude": kwargs["user"]["longitude"],
            "gender": kwargs["user"]["gender"],
            "preference": kwargs["user"]["preference"],
            "date_min": kwargs["date_min"],
            "date_max": kwargs["date_max"],
            "distance_max": kwargs["distance_max"],
            "user_rank": kwargs["user"]["rank"],
            "ranking_gap": kwargs["ranking_gap"],
            "hobby_ids": kwargs["hobby_ids"],
            "hobby_ids_len": len(kwargs["hobby_ids"]),
        }


def get_swipe_list_no_sort(**kwargs):
    cur = conn.cursor(row_factory=dict_row)
    cur.execute(
        base_swipe_request,
        set_request_dict(**kwargs),
    )
    swipe_list = cur.fetchall()
    cur.close()
    return swipe_list


def get_swipe_list_age_sort(**kwargs):
    request = base_swipe_request + " ORDER BY birthDate DESC"
    cur = conn.cursor(row_factory=dict_row)
    cur.execute(
        request,
        set_request_dict(**kwargs)
    )
    swipe_list = cur.fetchall()
    cur.close()
    return swipe_list


def get_swipe_list_ranking_sort(**kwargs):
    request = base_swipe_request + " ORDER BY rank DESC"
    cur = conn.cursor(row_factory=dict_row)
    cur.execute(
        request,
        set_request_dict(**kwargs)
    )
    swipe_list = cur.fetchall()
    cur.close()
    return swipe_list


def get_swipe_list_distance_sort(**kwargs):
    request = base_swipe_request + " ORDER BY distance"
    cur = conn.cursor(row_factory=dict_row)
    cur.execute(
        request,
        set_request_dict(**kwargs)
    )
    swipe_list = cur.fetchall()
    cur.close()
    return swipe_list


def get_swipe_list_tags_sort(**kwargs):
    request = base_swipe_request + """
        ORDER BY (
            SELECT COUNT(*)
            FROM user_hobbie
            WHERE id IN (
                SELECT user_id
                FROM user_hobbie
                WHERE hobbie_id IN (
                    SELECT hobbie_id
                    FROM user_hobbie
                    WHERE user_id = %(user)s
                )
            )
        ) DESC
        """
    cur = conn.cursor(row_factory=dict_row)
    cur.execute(
        request,
        set_request_dict(**kwargs)
    )
    swipe_list = cur.fetchall()
    cur.close()
    return swipe_list


def like_user(**kwargs):
    cur = conn.cursor(row_factory=dict_row)
    user = kwargs["user"]["id"]
    target = kwargs["target_id"]
    new_room = None
    cur.execute(
        """
        SELECT id
        FROM relationship
        WHERE liker_id = %s AND liked_id = %s;
        """,
        (user, target),
    )
    if cur.fetchone() is not None:
        cur.close()
        return
    cur.execute(
        """
        SELECT id
        FROM cancel
        WHERE   canceler_id = %s AND canceled_id = %s
                OR canceler_id = %s AND canceled_id = %s;
        """,
        (
            user,
            target,
            target,
            user,
        ),
    )
    if cur.fetchone() is not None:
        cur.close()
        return
    cur.execute(
        """
        INSERT INTO relationship (id, liker_id, liked_id)
        VALUES (%s, %s, %s);
        """,
        (uuid.uuid1(), user, target),
    )
    cur.execute(
        """
        SELECT id
        FROM relationship
        WHERE liker_id = %s AND liked_id = %s;
        """,
        (target, user),
    )
    if cur.fetchone() is not None:
        new_room = chat_sql.insert_room(
            {
                "user_id1": user,
                "user_id2": target,
            }
        )
    conn.commit()
    cur.close()
    return new_room


def dislike_user(**kwargs):
    cur = conn.cursor()
    user = kwargs["user"]["id"]
    target = kwargs["target_id"]
    cur.execute(
        """
        SELECT id
        FROM cancel
        WHERE   canceler_id = %s AND canceled_id = %s
                OR canceler_id = %s AND canceled_id = %s;
        """,
        (user, target, target, user),
    )
    if cur.fetchone() is not None:
        cur.close()
        return
    cur.execute(
        """
        INSERT INTO cancel (id, canceler_id, canceled_id)
        VALUES (%s, %s, %s);
        """,
        (uuid.uuid1(), user, target),
    )
    cur.execute(
        """
        DELETE FROM room
        WHERE   user_1 = %s AND user_2 = %s OR
                user_1 = %s AND user_2 = %s
        """,
        (user, target, target, user),
    )
    cur.close()
    conn.commit()
