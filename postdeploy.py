import os, sys, webbrowser

# Copiamos los archivos a la carpeta de deploy
def copy():
    os.system('copy /Y "utils/.htaccess" "/public_html"')
    os.system('copy /Y "utils/robots.txt" "/public_html"')
    os.system('copy /Y "utils/sitemap.xml" "/public_html"')

# Abrimos la URL para hacer la subida
def webFTP():
    webbrowser.open("https://files.000webhost.com/")

def main():
    copy()
    webFTP()

main()