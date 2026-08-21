from PIL import Image

img = Image.open("public/SpruceGoose-transparent.png").convert("RGBA")

img.save("app/favicon.ico", format="ICO", sizes=[(16,16), (32,32), (48,48)])

print("Done! favicon.ico updated.")