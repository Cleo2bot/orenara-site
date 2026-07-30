import fitz, os
files = {
  "glow": "attached_assets/GLOW_LED_strip_Lighting_brochure_SinglePage_en_20260223_1785444485904.pdf",
  "orsflx": "attached_assets/ORSFLX16_24V_3528_144_(1)_1785444485904.pdf",
}
for tag, path in files.items():
    doc = fitz.open(path)
    print(tag, "pages:", doc.page_count)
    for i, page in enumerate(doc):
        pix = page.get_pixmap(matrix=fitz.Matrix(2,2))
        out = f".agents/outputs/pdf/{tag}-p{i+1}.png"
        pix.save(out)
        print(out, pix.width, pix.height)
        # embedded image count
        print("  embedded images:", len(page.get_images(full=True)))
