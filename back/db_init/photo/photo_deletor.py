import os


folder_female_19_25 = "db_init/photo/female/19_25"
folder_female_26_35 = "db_init/photo/female/26_35"
folder_female_35_50 = "db_init/photo/female/35_50"
folder_female_50_plus = "db_init/photo/female/50_plus"

folder_male_19_25 = "db_init/photo/male/19_25"
folder_male_26_35 = "db_init/photo/male/26_35"
folder_male_35_50 = "db_init/photo/male/35_50"
folder_male_50_plus= "db_init/photo/male/50_plus"


params = [
    (folder_female_19_25),
    (folder_female_26_35),
    (folder_female_35_50),
    (folder_female_50_plus),
    (folder_male_19_25),
    (folder_male_26_35),
    (folder_male_35_50),
    (folder_male_50_plus)
]

def delete_files_in_folder(folder_path):
    if not os.path.isdir(folder_path):
        print(f"{folder_path} does not exist")
        return
    
    files = os.listdir(folder_path)
    for file_name in files:
        file_path = os.path.join(folder_path, file_name)
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
                print(f'Deleted file: {file_path}')
            else:
                print(f'{file_path} is not a file')
        except Exception as e:
            print(f'Error while suppressing {file_path}')


for param in params:
    delete_files_in_folder(param)