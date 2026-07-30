"""Crop channel photos + schematics from supplier PDF pages 8-14.
Rects are fractions (x0,y0,x1,y1) of page width/height, estimated from zoom-2 renders.
Outputs to scripts/assets/channels/ at zoom 4.
"""
import fitz, os
from PIL import Image

SRC = "attached_assets/ORSFLX16_24V_3528_144_(1)_1785448225223.pdf"
OUT = "scripts/assets/channels"
os.makedirs(OUT, exist_ok=True)

# name: (page (1-based), (x0,y0,x1,y1) fractions of displayed page ~723x1010)
CROPS = {
    # --- p8: ALC16S02 (OR-AL-CC) + ALC16S08 ---
    "al-cc-photo":    (8, (55/723, 125/1010, 325/723, 262/1010)),
    "al-cc-dim":      (8, (350/723, 105/1010, 485/723, 232/1010)),
    "al-cc-install":  (8, (495/723, 105/1010, 705/723, 220/1010)),
    "al-cc-space1m":  (8, (370/723, 272/1010, 705/723, 335/1010)),
    "al-cc-space2m":  (8, (25/723, 338/1010, 705/723, 400/1010)),
    "al-22-photo":    (8, (55/723, 548/1010, 325/723, 690/1010)),
    "al-22-dim":      (8, (350/723, 552/1010, 490/723, 662/1010)),
    "al-22-install":  (8, (495/723, 548/1010, 705/723, 662/1010)),
    "al-22-splice":   (8, (305/723, 668/1010, 595/723, 748/1010)),
    "al-22-space1m":  (8, (370/723, 735/1010, 705/723, 798/1010)),
    "al-22-space2m":  (8, (25/723, 792/1010, 705/723, 858/1010)),
    # --- p9: ALC16S07 + ALC16H02 ---
    "al-rf-photo":    (9, (55/723, 95/1010, 325/723, 262/1010)),
    "al-rf-dim":      (9, (355/723, 105/1010, 490/723, 222/1010)),
    "al-rf-install":  (9, (510/723, 100/1010, 620/723, 222/1010)),
    "al-rf-space1m":  (9, (370/723, 272/1010, 705/723, 332/1010)),
    "al-rf-space2m":  (9, (25/723, 338/1010, 705/723, 398/1010)),
    "al-deep-photo":  (9, (55/723, 548/1010, 325/723, 700/1010)),
    "al-deep-dim":    (9, (355/723, 552/1010, 490/723, 700/1010)),
    "al-deep-install":(9, (500/723, 552/1010, 705/723, 665/1010)),
    "al-deep-space1m":(9, (370/723, 712/1010, 705/723, 768/1010)),
    "al-deep-space2m":(9, (25/723, 775/1010, 705/723, 838/1010)),
    # --- p10: ALC16S05FLX (OR-AL-FLX) + PC16/17S02-T (OR-PC-CC) ---
    "al-flx-photo":   (10, (45/727, 122/1010, 300/727, 280/1010)),
    "al-flx-dim":     (10, (365/727, 132/1010, 495/727, 245/1010)),
    "al-flx-install": (10, (545/727, 130/1010, 660/727, 245/1010)),
    "al-flx-space05": (10, (385/727, 310/1010, 700/727, 368/1010)),
    "al-flx-space1m": (10, (50/727, 378/1010, 700/727, 438/1010)),
    "pc-photo":       (10, (45/727, 578/1010, 300/727, 735/1010)),
    "pc-dim":         (10, (365/727, 592/1010, 495/727, 715/1010)),
    "pc-install":     (10, (500/727, 585/1010, 700/727, 705/1010)),
    "pc-space1m":     (10, (375/727, 762/1010, 700/727, 822/1010)),
    "pc-space2m":     (10, (30/727, 825/1010, 700/727, 888/1010)),
    # --- p11: SJJ clip + SSC16S01 clip ---
    "pc-clip-photo":  (11, (45/723, 105/1010, 300/723, 252/1010)),
    "pc-clip-dim":    (11, (355/723, 100/1010, 490/723, 240/1010)),
    "pc-clip-install":(11, (510/723, 100/1010, 630/723, 220/1010)),
    "pc-clip-holes":  (11, (480/723, 250/1010, 680/723, 380/1010)),
    "ss-clip-photo":  (11, (45/723, 565/1010, 300/723, 715/1010)),
    "ss-clip-dim":    (11, (350/723, 585/1010, 460/723, 700/1010)),
    "ss-clip-install":(11, (480/723, 585/1010, 690/723, 700/1010)),
    "ss-clip-holes":  (11, (545/723, 730/1010, 690/723, 815/1010)),
    # --- p12: SSC16S02 (OR-SS-CC) + SSC16H01 ---
    "ss-cc-photo":    (12, (45/723, 120/1010, 310/723, 285/1010)),
    "ss-cc-dim":      (12, (355/723, 132/1010, 470/723, 250/1010)),
    "ss-cc-install":  (12, (490/723, 132/1010, 690/723, 265/1010)),
    "ss-cc-space1m":  (12, (30/723, 318/1010, 700/723, 400/1010)),
    "ss-deep-photo":  (12, (45/723, 555/1010, 310/723, 730/1010)),
    "ss-deep-dim":    (12, (355/723, 565/1010, 470/723, 730/1010)),
    "ss-deep-install":(12, (485/723, 565/1010, 685/723, 700/1010)),
    "ss-deep-space1m":(12, (30/723, 755/1010, 700/723, 845/1010)),
    # --- p13: SSC16FLX (OR-SS-FLX) ---
    "ss-flx-photo":   (13, (45/723, 125/1010, 305/723, 285/1010)),
    "ss-flx-dim":     (13, (345/723, 138/1010, 480/723, 268/1010)),
    "ss-flx-install": (13, (520/723, 132/1010, 615/723, 262/1010)),
    "ss-flx-space":   (13, (25/723, 345/1010, 700/723, 425/1010)),
    # --- p14: buried ALC-WL-B-02 A/B (codes INSIDE diagrams -> mask later) ---
    "bur-photo":      (14, (45/723, 122/1010, 300/723, 280/1010)),
    "bur-dim":        (14, (350/723, 130/1010, 495/723, 295/1010)),
    "bur-install":    (14, (565/723, 122/1010, 660/723, 335/1010)),
    "bur-sections":   (14, (35/723, 340/1010, 330/723, 560/1010)),
}

doc = fitz.open(SRC)
for name, (pno, (fx0, fy0, fx1, fy1)) in CROPS.items():
    page = doc[pno - 1]
    r = page.rect
    clip = fitz.Rect(r.width*fx0, r.height*fy0, r.width*fx1, r.height*fy1)
    pix = page.get_pixmap(matrix=fitz.Matrix(4, 4), clip=clip)
    pix.save(f"{OUT}/{name}.png")
print("done", len(CROPS))

# contact sheet
files = sorted(os.listdir(OUT))
imgs = [(f, Image.open(f"{OUT}/{f}")) for f in files if f.endswith(".png")]
cols = 4
th = 260
rows = (len(imgs)+cols-1)//cols
sheet = Image.new("RGB", (cols*380, rows*(th+30)), "white")
from PIL import ImageDraw
d = ImageDraw.Draw(sheet)
for i, (f, im) in enumerate(imgs):
    im.thumbnail((370, th))
    x, y = (i % cols)*380, (i//cols)*(th+30)
    sheet.paste(im, (x+5, y+25))
    d.text((x+5, y+5), f, fill="black")
sheet.save(".agents/outputs/chan-contact.png")
print("sheet", sheet.size)
