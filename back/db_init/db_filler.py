import random
import uuid
import hashlib
from threading import Lock
import os
from tools.date_tools import years_old
from flask import current_app as app
from cryptography.fernet import Fernet

names = (
    "Poulet",
    "Poule",
    "Canard",
    "Saucisse",
    "Crocodile",
    "Pantoufle",
    "Adidas",
    "Pasteque",
    "Gaufre",
    "Crepe",
    "Poil",
    "Monsieur",
    "Madame",
    "Yelle",
    "Pioche",
    "Batman",
    "Spiderman",
    "Chaussette",
    "Pikachu",
    "Pokemon",
    "Pokefion",
    "Roi",
    "Renne",
    "Reine",
    "Oiseau",
    "Pastis",
    "Jambon",
    "Roturier",
    "Roturiere",
    "Genou",
    "Coude",
    "Tournevis",
    "Marteau",
    "Arbre",
    "Peche",
    "Pipi",
    "Caca",
    "Kiki",
    "Kekette",
    "Pouet",
    "Pouette",
    "Dragon",
    "Heros",
    "Heroine",
    "Capitaine",
    "Renard",
    "Renarde",
    "Oie",
    "Amoureux",
    "Amoureuse",
    "Connard",
    "Connasse",
    "Prout",
    "leJ",
    "Proutte",
    "Magichien",
    "Magichienne",
    "Informatichien",
    "Informatichienne",
    "Cassoulet",
    "Quoi",
)

adjectives = (
    "Sale",
    "Propre",
    "Menteur",
    "Jeune",
    "Vieux",
    "Charmeur",
    "Moche",
    "Vilain",
    "LeS",
    "Boiteux",
    "Insensible",
    "Sensible",
    "Musicien",
    "Pretentieux",
    "Modeste",
    "Heureux",
    "Malheureux",
    "Penible",
    "Simple",
    "Complique",
    "Cheveulu",
    "Poilu",
    "Aiguise",
    "Pointu",
    "Blagueur",
    "Ennuyeux",
    "Mourant",
    "Deprime",
    "Joyeux",
    "Feur",
    "Grand",
    "Petit",
    "Immense",
    "Grossier",
    "Jovial",
    "Souriant",
    "Grimacant",
    "Abandonne",
    "Seul",
    "Nul",
    "Qualitatif",
    "Mignon",
    "Barbant",
    "Barbu",
    "Chauve",
    "Cocu",
    "Mechant",
    "Gentil",
    "Feignant",
)

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
    names_len = len(names)
    adj_len = len(adjectives)

    def randomise(self):
        rand_name = random.randint(0, self.names_len - 1)
        rand_adj = random.randint(0, self.adj_len - 1)
        if self.created.get((rand_name, rand_adj)) is None:
            self.created[(rand_name, rand_adj)] = 0
        self.created[(rand_name, rand_adj)] += 1
        name = names[rand_name] + adjectives[rand_adj]
        occurence = self.created[(rand_name, rand_adj)]
        if occurence > 1:
            name += f"{occurence}"
        return {"name": name, "email": f"{name}@mock.com"}


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
    name_email = Randomiser().randomise()
    return (
        uuid.uuid1(),
        name_email["name"],
        hashlib.sha256("mdp".encode("utf-8")).hexdigest(),
        name_email["email"],
        True,
        do_random_date(),
        random.choice(genders),
        random.choice(genders),
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



used_photos = set()

def random_photo_picker(folder_path):
    if not os.path.isdir(folder_path):
        print(f"{folder_path} does not exist")
        return
    files = os.listdir(folder_path)
    photo = random.choice(files)
    if photo in used_photos:
        random_photo_picker(folder_path)
    used_photos.add(photo)
    return photo


def sql_insert_bot_photos(data, conn):
    file_path = data["folder"] + "/" + data["photo"]
    user_id = data["user_id"]
    MIME_TYPE = "image/jpeg"
    with open(file_path, 'rb') as file:
        binaries = file.read()
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
                False,
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