import random
import uuid

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


def do_name(t1, t2):
    return random.choice(t1) + random.choice(t2)


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
    return (
        uuid.uuid1(),
        do_name(names, adjectives),
        "This_is_an_hashed_pass_trust_me",
        "mock@email.com",
        do_random_date(),
        random.choice(genders),
        random.choice(genders),
        "",
        random.randint(0, 10),
        gps["latitude"],
        gps["longitude"],
        True,
    )


def insert_users_in_database(conn, n, lat, lng):
    cur = conn.cursor()
    users = [do_user_near_point(lat, lng) for i in range(0, n)]
    query = """
            INSERT INTO user_table \
            (id, username, password, email, birthDate, \
            gender, preference, biography, rank, latitude, \
            longitude, gpsfixed)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
    cur.executemany(query, users)
    cur.close()
    conn.commit()
