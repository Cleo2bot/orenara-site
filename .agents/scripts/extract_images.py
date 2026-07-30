import fitz, os
doc = fitz.open("attached_assets/ORSFLX16_24V_3528_144_(1)_1785444485904.pdf")
out = ".agents/outputs/orsflx-assets"
seen = set()
for pno in range(doc.page_count):
    page = doc[pno]
    for img in page.get_images(full=True):
        xref = img[0]
        if xref in seen: continue
        seen.add(xref)
        info = doc.extract_image(xref)
        w, h = info["width"], info["height"]
        if w*h < 90000: continue  # skip tiny icons/fragments
        ext = info["ext"]
        fn = f"{out}/p{pno+1:02d}-x{xref}-{w}x{h}.{ext}"
        with open(fn, "wb") as f:
            f.write(info["image"])
print("saved:", len(os.listdir(out)))
for f in sorted(os.listdir(out)): print(f)
