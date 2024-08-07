import random
import uuid
import hashlib
import os
import json
from threading import Lock
from tools.date_tools import years_old
from flask import current_app as app
from cryptography.fernet import Fernet

genders = ("man", "woman")

preference = ("man", "woman", "all")


class RandomiserSingleton(type):
    _instances = {}
    _lock: Lock = Lock()

    def __call__(cls, *args, **kwargs):
        with cls._lock:
            if cls not in cls._instances:
                cls._instances[cls] = super(RandomiserSingleton, cls).__call__(
                    *args, **kwargs
                )
        return cls._instances[cls]


class Randomiser(metaclass=RandomiserSingleton):

    created = {}
    base_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(base_dir, 'data.json')
    with open(file_path, 'r') as file:
        file_content = file.read()
        data = json.loads(file_content)
    results = data['d']['results']
    man_names = [
        entry['ENFANT_PRENOM']
        for entry in results
        if 'ENFANT_PRENOM' in entry
        and entry['ENFANT_SEXE'] in 'M'
    ]
    woman_names = [
        entry['ENFANT_PRENOM']
        for entry in results
        if 'ENFANT_PRENOM' in entry
        and entry['ENFANT_SEXE'] in 'F'
    ]

    def randomise(self, gender):
        if gender == 'woman':
            names = self.woman_names
        else:
            names = self.man_names
        count = len(names)
        rand_name = random.randint(0, count - 1)
        if gender not in self.created:
            self.created[gender] = {}
        if rand_name not in self.created[gender]:
            self.created[gender][rand_name] = 0
        self.created[gender][rand_name] += 1
        occurence = self.created[gender][rand_name]
        name = names[rand_name]
        email_name = name
        if occurence > 1:
            email_name += f"{occurence}"
        return {"name": name, "email": f"{email_name}@mock.com"}


def latitudeModulo(lat):
    sign = False
    if lat < 90 and lat > -90:
        return lat
    if lat < 0:
        sign = True
        lat *= -1
    lat %= 180
    if lat > 90:
        if sign is True:
            return 90 - lat
        else:
            return lat - 90
    if sign is True:
        return -lat
    return lat


def longitudeModulo(lng):
    sign = False
    if lng < 180 and lng > -180:
        return lng
    if lng < 0:
        sign = True
        lng *= -1
    lng %= 360
    if lng > 180:
        if sign is True:
            return 360 - lng
        else:
            return lng - 360
    if sign is True:
        return -lng
    return lng


def do_random_date():
    """yyyy-mm-dd"""
    data = (
        {"weight": 5, "range": (1920, 1954)},
        {"weight": 10, "range": (1954, 1964)},
        {"weight": 10, "range": (1964, 1974)},
        {"weight": 25, "range": (1974, 1988)},
        {"weight": 50, "range": (1988, 2005)},
    )
    dice = random.randint(0, 99)
    weight_range = (0, 1)
    for elt in data:
        dice -= elt["weight"]
        if dice < 0:
            weight_range = elt["range"]
            break
    yyyy = random.randrange(weight_range[0], weight_range[1])
    mm = random.randrange(1, 12)
    dd = random.randrange(1, 28)
    return str(yyyy) + "-" + str(mm) + "-" + str(dd)


def do_gps_near_point(latitude, longitude):
    return {
        "latitude": latitudeModulo(latitude + (random.random() - 0.5)),
        "longitude": longitudeModulo(longitude + (random.random() - 0.5)),
    }


def do_user_near_point(latitude, longitude):
    gps = do_gps_near_point(latitude, longitude)
    gender = random.choice(genders)
    name_email = Randomiser().randomise(gender)
    return (
        uuid.uuid1(),
        name_email["name"],
        hashlib.sha256("mdp".encode("utf-8")).hexdigest(),
        name_email["email"],
        True,
        do_random_date(),
        gender,
        random.choice(preference),
        """Lorem ipsum dolor sit amet, consectetur adipiscing elit,\
    sed do eiusmod\
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim\
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\
    commodo consequat.""",
        random.randint(0, 10),
        gps["latitude"],
        gps["longitude"],
        True,
    )


randoPickerDict = {}


def random_photo_picker(folder_path):
    if not os.path.isdir(folder_path):
        print(f"{folder_path} does not exist")
    files = os.listdir(folder_path)
    if randoPickerDict.get(folder_path) is None:
        randoPickerDict[folder_path] = [x for x in range(0, len(files))]
    randIdx = random.choice(randoPickerDict[folder_path])
    randoPickerDict[folder_path].remove(randIdx)
    if len(randoPickerDict[folder_path]) == 0:
        del randoPickerDict[folder_path]
    return files[randIdx]


def sql_insert_bot_photos(data, conn):
    file_path = data["folder"] + "/" + data["photo"]
    user_id = data["user_id"]
    MIME_TYPE = "image/jpeg"
    with open(file_path, 'rb') as file:
        binaries = file.read()
        file.close()
    hasher = Fernet(app.config["SECRET_PHOTO"])
    query = """
        INSERT INTO photos
        (id, mime_type, binaries, main, user_id)
        VALUES(%s, %s, %s, %s, %s);
        """
    cur = conn.cursor()
    cur.execute(
        query,(
                uuid.uuid1(),
                MIME_TYPE,
                hasher.encrypt(binaries),
                True,
                user_id,
        )
    )
    conn.commit()
    cur.close()

def insert_bot_photos(conn, users):

    age_gender_folders = {
        "man": {
            (18, 25): "db_init/photo/male/19_25",
            (26, 35): "db_init/photo/male/26_35",
            (36, 50): "db_init/photo/male/35_50",
            (50, float('inf')): "db_init/photo/male/50_plus"
        },
        "woman": {
            (18, 25): "db_init/photo/female/19_25",
            (26, 35): "db_init/photo/female/26_35",
            (36, 50): "db_init/photo/female/35_50",
            (50, float('inf')): "db_init/photo/female/50_plus"
        }
    }
    for user in users:
        age = years_old(user[5])
        gender = user[6]
        if gender in age_gender_folders:
            for age_range, folder in age_gender_folders[gender].items():
                if age_range[0] <= age <= age_range[1]:
                    sql_insert_bot_photos(
                        {
                            "photo": random_photo_picker(folder),
                            "user_id": user[0],
                            "folder": folder
                        }, 
                        conn
                    )
                    break


def insert_users_in_database(conn, n, lat, lng):
    cur = conn.cursor()
    users = [do_user_near_point(lat, lng) for i in range(0, n)]
    query = """
            INSERT INTO user_table \
            (id, username, password, email, email_verified, birthDate, \
            gender, preference, biography, rank, latitude, \
            longitude, gpsfixed)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
    cur.executemany(query, users)
    insert_bot_photos(conn, users)
    cur.close()
    conn.commit()