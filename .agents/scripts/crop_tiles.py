import fitz, os
doc = fitz.open("attached_assets/ORSFLX16_24V_3528_144_(1)_1785444485904.pdf")
out = ".agents/outputs/orsflx-tiles"
os.makedirs(out, exist_ok=True)
mat = fitz.Matrix(4,4)  # 288 dpi
def clusters(rects, gap=10):
    groups = []
    for r in rects:
        placed = False
        for g in groups:
            if any(abs(r.y0-o.y0)<gap*8 and (r.x0 < o.x1+gap and o.x0 < r.x1+gap) or (fitz.Rect(r).intersects(fitz.Rect(o.x0-gap,o.y0-gap,o.x1+gap,o.y1+gap))) for o in g):
                g.append(r); placed=True; break
        if not placed: groups.append([r])
    return groups
for pno in range(2,7):
    page = doc[pno]
    blocks = page.get_text("dict")["blocks"]
    rects = [fitz.Rect(b["bbox"]) for b in blocks if b["type"]==1]
    # merge overlapping/adjacent rects iteratively
    merged = rects[:]
    changed = True
    while changed:
        changed = False
        res = []
        while merged:
            r = merged.pop()
            i = 0
            while i < len(merged):
                o = merged[i]
                if fitz.Rect(r.x0-6,r.y0-6,r.x1+6,r.y1+6).intersects(o):
                    r |= o; merged.pop(i); changed=True
                else: i+=1
            res.append(r)
        merged = res
    merged.sort(key=lambda r:(round(r.y0),r.x0))
    for i,r in enumerate(merged):
        if r.width < 60 or r.height < 40: continue
        pix = page.get_pixmap(matrix=mat, clip=r)
        fn = f"{out}/p{pno+1:02d}-tile{i:02d}-{int(r.width)}x{int(r.height)}.png"
        pix.save(fn)
print(sorted(os.listdir(out)))
