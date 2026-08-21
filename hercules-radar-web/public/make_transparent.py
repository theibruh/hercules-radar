from PIL import Image

# Load the logo
img = Image.open("SpruceGoose.png").convert("RGBA")

bg_color = (41, 46, 55)  #292e37
tolerance = 30  #wiggle room for color matching

pixels = img.getdata()
new_pixels = []

for pixel in pixels:
    r, g, b, a = pixel
    # Check if this pixel is close enough to the background color
    if (abs(r - bg_color[0]) <= tolerance and
        abs(g - bg_color[1]) <= tolerance and
        abs(b - bg_color[2]) <= tolerance):
        new_pixels.append((r, g, b, 0))  # make transparent
    else:
        new_pixels.append(pixel)  # keep as-is

img.putdata(new_pixels)
img.save("SpruceGoose-transparent.png")

print("Done! Saved as SpruceGoose-transparent.png")