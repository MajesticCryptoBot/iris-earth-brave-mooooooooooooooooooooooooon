from PIL import Image, ImageDraw

def frame(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radius = max(2, int(size * 0.22))
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=(51, 144, 236, 255))
    width = max(2, round(size * 0.075))
    pts = [
        (0.20 * size, 0.74 * size),
        (0.36 * size, 0.24 * size),
        (0.50 * size, 0.52 * size),
        (0.64 * size, 0.24 * size),
        (0.80 * size, 0.74 * size),
    ]
    draw.line(pts, fill=(255, 255, 255, 255), width=width, joint="curve")
    return img

sizes = [16, 24, 32, 48, 64, 128, 256]
images = [frame(size) for size in sizes]
images[-1].save("/tmp/wire-icon.png")
images[-1].save(
    "/tmp/wire-icon.ico",
    format="ICO",
    sizes=[(size, size) for size in sizes],
    append_images=images[:-1],
)
print("icon ok", images[-1].size)
