import os
import shutil

target_dir = r"d:\ebrahimi_website\static\demos\marmi-nebrodi"
if os.path.exists(target_dir):
    extracted_items = os.listdir(target_dir)
    if len(extracted_items) == 1:
        single_item_path = os.path.join(target_dir, extracted_items[0])
        if os.path.isdir(single_item_path):
            for item in os.listdir(single_item_path):
                shutil.move(os.path.join(single_item_path, item), target_dir)
            os.rmdir(single_item_path)
            print("Fixed directory structure.")
