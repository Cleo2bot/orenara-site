import fitz, os
doc = fitz.open("attached_assets/ORSFLX16_24V_3528_144_(1)_1785444485904.pdf")
out = ".agents/outputs/orsflx-assets"
seen = set(int(f.split('-x')[1].split('-')[0]) for f in os.listdir(out))
new = 0
for pno in range(2, 7):  # pages 3-7 connector tiles
    page = doc[pno]
    for img in page.get_images(full=True):
        xref = img[0]
        if xref in seen: continue
        seen.add(xref)
        info = doc.extract_image(xref)
        w, h = info["width"], info["height"]
        if w*h < 25000: continue
        fn = f"{out}/p{pno+1:02d}-x{xref}-{w}x{h}.{info['ext']}"
        open(fn, "wb").write(info["image"])
        new += 1
print("new:", new)
import subprocess
print(subprocess.run(["ls", out], capture_output=True, text=True).stdout)
