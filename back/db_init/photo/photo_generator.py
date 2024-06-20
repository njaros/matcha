import requests
import json
import os

url_female_19_25 = "https://www.this-person-does-not-exist.com/new?time=1718886847110&gender=female&age=19-25&etnic=any" 
url_female_26_35 = "https://www.this-person-does-not-exist.com/new?time=1718886847110&gender=female&age=26-35&etnic=any"
url_female_35_50 = "https://www.this-person-does-not-exist.com/new?time=1718886847110&gender=female&age=35-50&etnic=any" 
url_female_50_plus = "https://www.this-person-does-not-exist.com/new?time=1718886847110&gender=female&age=50&etnic=any"

url_male_19_25 = "https://www.this-person-does-not-exist.com/new?time=1718886847110&gender=male&age=19-25&etnic=any" 
url_male_26_35 = "https://www.this-person-does-not-exist.com/new?time=1718886847110&gender=male&age=26-35&etnic=any"
url_male_35_50 = "https://www.this-person-does-not-exist.com/new?time=1718886847110&gender=male&age=35-50&etnic=any" 
url_male_50_plus = "https://www.this-person-does-not-exist.com/new?time=1718886847110&gender=male&age=50&etnic=any"

folder_female_19_25 = "db_init/photo/female/19_25"
folder_female_26_35 = "db_init/photo/female/26_35"
folder_female_35_50 = "db_init/photo/female/35_50"
folder_female_50_plus = "db_init/photo/female/50_plus"

folder_male_19_25 = "db_init/photo/male/19_25"
folder_male_26_35 = "db_init/photo/male/26_35"
folder_male_35_50 = "db_init/photo/male/35_50"
folder_male_50_plus= "db_init/photo/male/50_plus"

weights = {
    "female": {
        "19_25": 99,
        "26_35": 76,
        "35_50": 50,
        "50_plus": 25
    },
    "male": {
        "19_25": 99,
        "26_35": 76,
        "35_50": 50,
        "50_plus": 25
    }
}

configurations = {
    "female": {
        "19_25": (weights["female"]["19_25"], url_female_19_25, folder_female_19_25),
        "26_35": (weights["female"]["26_35"], url_female_26_35, folder_female_26_35),
        "35_50": (weights["female"]["35_50"], url_female_35_50, folder_female_35_50),
        "50_plus": (weights["female"]["50_plus"], url_female_50_plus, folder_female_50_plus)
    },
    "male": {
        "19_25": (weights["male"]["19_25"], url_male_19_25, folder_male_19_25),
        "26_35": (weights["male"]["26_35"], url_male_26_35, folder_male_26_35),
        "35_50": (weights["male"]["35_50"], url_male_35_50, folder_male_35_50),
        "50_plus": (weights["male"]["50_plus"], url_male_50_plus, folder_male_50_plus)
    }
}


list_photos = set()

def generate_photos(url, folder_path):
    url_response = requests.get(url)
    if url_response.status_code == 200:
        url_res = url_response.content.decode('utf-8')
        res_json = json.loads(url_res)
        file_name = res_json['name']
        if file_name in list_photos:
            generate_photos()
            print('Doublon detected, regenerating photos')
        else: 
            list_photos.add(file_name)
            if not os.path.exists(folder_path):
                os.makedirs(folder_path)
            file_path = os.path.join(folder_path, file_name)
            res = requests.get(f'https://www.this-person-does-not-exist.com/img/{file_name}')
            with open(file_path, "wb") as file:
                file.write(res.content)
            print(f"Image saved as {file_name} in {folder_path}")
    else:
        print("Failed to retrieve image")



def generate_photos_with_config(iterations, url, folder_path):
    for _ in range(iterations):
        generate_photos(url, folder_path)

for gender, configs in configurations.items():
    for age_range, config in configs.items():
        iterations, url, folder_path = config
        generate_photos_with_config(iterations, url, folder_path)