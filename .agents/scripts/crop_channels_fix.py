import fitz, os
from PIL import Image, ImageDraw

SRC = "attached_assets/ORSFLX16_24V_3528_144_(1)_1785448225223.pdf"
OUT = "scripts/assets/channels"

FIX = {
    "al-cc-photo":   (8, (55/723, 128/1010, 330/723, 268/1010)),
    "al-22-space2m": (8, (25/723, 792/1010, 705/723, 848/1010)),
    "al-rf-photo":   (9, (50/723, 100/1010, 330/723, 268/1010)),
    "al-rf-dim":     (9, (340/723, 100/1010, 495/723, 228/1010)),
    "al-flx-dim":    (10, (350/727, 130/1010, 500/727, 248/1010)),
    "al-deep-photo": (9, (55/723, 545/1010, 320/723, 692/1010)),
    "ss-cc-dim":     (12, (340/723, 145/1010, 480/723, 252/1010)),
    "ss-clip-dim":   (11, (335/723, 588/1010, 465/723, 702/1010)),
    "ss-deep-dim":   (12, (340/723, 578/1010, 480/723, 735/1010)),
    "ss-deep-photo": (12, (50/723, 558/1010, 310/723, 700/1010)),
    "ss-flx-dim":    (13, (335/723, 138/1010, 485/723, 262/1010)),
    "bur-dim":       (14, (345/723, 128/1010, 510/723, 298/1010)),
    # buried install: icons only, captions (contain codes) excluded
    "bur-install-buried":   (14, (563/723, 132/1010, 662/723, 218/1010)),
    "bur-install-recessed": (14, (563/723, 258/1010, 662/723, 322/1010)),
    "bur-sections":  (14, (30/723, 338/1010, 335/723, 565/1010)),
}

doc = fitz.open(SRC)
for name, (pno, (fx0, fy0, fx1, fy1)) in FIX.items():
    page = doc[pno-1]
    r = page.rect
    clip = fitz.Rect(r.width*fx0, r.height*fy0, r.width*fx1, r.height*fy1)
    page.get_pixmap(matrix=fitz.Matrix(4,4), clip=clip).save(f"{OUT}/{name}.png")

os.remove(f"{OUT}/bur-install.png")

# mask ALC-WL-B-02-A-GZ label in bur-sections (bottom-left area under first profile)
im = Image.open(f"{OUT}/bur-sections.png")
w, h = im.size
d = ImageDraw.Draw(im)
# label sits around lower-left quadrant; find dark text row? just mask known band:
d.rectangle([0, int(h*0.80), int(w*0.48), int(h*0.92)], fill="white")
im.save(f"{OUT}/bur-sections.png")
print("fixed", im.size)
