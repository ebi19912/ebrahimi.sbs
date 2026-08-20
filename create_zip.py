import zipfile
import os

def create_zip():
    folder = r'D:\webSites\lasamarmo.it\dist'
    zip_path = r'D:\webSites\lasamarmo_final.zip'
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, _, files in os.walk(folder):
            for file in files:
                abs_path = os.path.join(root, file)
                # Calculate relative path and force forward slashes
                rel_path = os.path.relpath(abs_path, folder).replace(os.sep, '/')
                zf.write(abs_path, rel_path)
    print("Done")

create_zip()
