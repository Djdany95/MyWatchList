import webbrowser, subprocess
from shutil import copy2

# Copiamos los archivos a la carpeta de deploy
def copy():
    copy2('D:/Proyectos/Terminados/MyWatchList/MyWatchList/utils/.htaccess', 'D:/Proyectos/Terminados/MyWatchList/MyWatchList/public_html')
    copy2('D:/Proyectos/Terminados/MyWatchList/MyWatchList/utils/robots.txt', 'D:/Proyectos/Terminados/MyWatchList/MyWatchList/public_html')
    copy2('D:/Proyectos/Terminados/MyWatchList/MyWatchList/utils/sitemap.xml', 'D:/Proyectos/Terminados/MyWatchList/MyWatchList/public_html')

# Abrimos la URL para hacer la subida
def webFTP():
    webbrowser.open("https://files.000webhost.com/")

def openFolder():
    subprocess.call("explorer D:\\Proyectos\\Terminados\\MyWatchList\\MyWatchList", shell=True)

def main():
    copy()
    # webFTP()
    # openFolder()

main()