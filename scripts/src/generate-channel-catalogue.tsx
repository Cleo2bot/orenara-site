/**
 * Orenara Channel System Catalogue — customer-facing A4 PDF covering the full
 * SF16 mounting-channel range. Dimensions, schematics and photos reproduced
 * from the supplier technical drawings (all supplier branding/codes removed).
 *
 * Coded items use Orenara OR- part numbers; uncoded models are "ON REQUEST".
 * Output: scripts/exports/orenara-channel-catalogue.pdf
 */
import React from "react";
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  renderToFile,
} from "@react-pdf/renderer";
import { mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const A = path.resolve(__dirname, "../assets");
const C = `${A}/channels`;
const OUT = path.resolve(__dirname, "../exports/orenara-channel-catalogue.pdf");

Font.register({ family: "Archivo", src: `${A}/fonts/archivo-500.ttf`, fontWeight: 500 });
Font.register({
  family: "Instrument",
  fonts: [
    { src: `${A}/fonts/instrument-400.ttf`, fontWeight: 400 },
    { src: `${A}/fonts/instrument-500.ttf`, fontWeight: 500 },
  ],
});
Font.register({ family: "Mono", src: `${A}/fonts/plexmono-400.ttf`, fontWeight: 400 });
Font.registerHyphenationCallback((w) => [w]);

const INK = "#0F1113";
const BONE = "#F3EEE4";
const BONE_DIM = "#8D8A82";
const LINE = "#D8D2C4";
const EMBER = "#D9A05B";
const H = 40;

const s = StyleSheet.create({
  page: {
    backgroundColor: BONE,
    color: INK,
    fontFamily: "Instrument",
    fontSize: 9,
    paddingTop: 36,
    paddingBottom: 30,
  },
  pad: { paddingLeft: H, paddingRight: H },
  wordmark: { fontFamily: "Archivo", fontSize: 13, letterSpacing: 3.2, color: INK },
  eyebrow: {
    fontFamily: "Archivo",
    fontSize: 7.5,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: BONE_DIM,
  },
  h1: { fontFamily: "Archivo", fontSize: 22, letterSpacing: 0.2, marginTop: 4 },
  h2: { fontFamily: "Archivo", fontSize: 12 },
  mono: { fontFamily: "Mono", fontSize: 8 },
  monoSm: { fontFamily: "Mono", fontSize: 6.5 },
  body: { fontSize: 9, lineHeight: 1.5 },
  dim: { color: BONE_DIM },
  footer: {
    borderTopWidth: 1,
    borderTopColor: LINE,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footText: { fontSize: 7, color: BONE_DIM },
  th: {
    fontFamily: "Archivo",
    fontSize: 6.5,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: BONE_DIM,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 2,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  panelLabel: {
    fontFamily: "Archivo",
    fontSize: 6.5,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: BONE_DIM,
    marginBottom: 3,
  },
});

const PageShell = ({
  children,
  pageNo,
  section,
}: {
  children: React.ReactNode;
  pageNo: string;
  section: string;
}) => (
  <Page size="A4" style={s.page}>
    <View
      style={[
        s.pad,
        { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
      ]}
    >
      <Text style={s.wordmark}>ORENARA</Text>
      <Text style={s.eyebrow}>{section}</Text>
    </View>
    <View style={[s.pad, { borderBottomWidth: 1, borderBottomColor: LINE, marginTop: 8 }]} />
    <View style={{ flexGrow: 1 }}>{children}</View>
    <View style={s.pad}>
      <View style={s.footer}>
        <Text style={s.footText}>Orenara — Channel System Catalogue</Text>
        <Text style={s.footText}>Supply-only. Installation by your licensed electrician.</Text>
        <Text style={s.footText}>{pageNo}</Text>
      </View>
    </View>
  </Page>
);

const Code = ({ code }: { code: string }) =>
  code === "ON REQUEST" ? (
    <Text style={[s.mono, { color: EMBER }]}>ON REQUEST</Text>
  ) : (
    <Text style={[s.mono, { color: EMBER }]}>{code}</Text>
  );

type Variant = {
  length: string;
  screw: string;
  holes: string;
};

type Channel = {
  code: string;
  name: string;
  material: string;
  wh: string;
  photo: string;
  dimImg: string;
  installImgs: { img: string; label: string }[];
  spacingImgs: { img: string; label: string }[];
  variants: Variant[];
  note?: string;
};

const ChannelBlock = ({ ch }: { ch: Channel }) => (
  <View style={[s.pad, { marginTop: 12 }]} wrap={false}>
    {/* title row */}
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
      <Text style={s.h2}>{ch.name}</Text>
      <Code code={ch.code} />
    </View>
    <Text style={[s.body, s.dim, { marginTop: 1, fontSize: 8 }]}>{ch.material}</Text>

    <View style={{ flexDirection: "row", marginTop: 6 }}>
      {/* photo */}
      <View style={[s.card, { width: 190, height: 110, marginRight: 8 }]}>
        <Image src={`${C}/${ch.photo}`} style={{ maxWidth: 176, maxHeight: 98, objectFit: "contain" }} />
      </View>
      {/* dimension */}
      <View style={{ width: 130, marginRight: 8 }}>
        <Text style={s.panelLabel}>Section — mm</Text>
        <View style={[s.card, { height: 100, width: 130 }]}>
          <Image src={`${C}/${ch.dimImg}`} style={{ maxWidth: 116, maxHeight: 88, objectFit: "contain" }} />
        </View>
      </View>
      {/* installation */}
      <View style={{ flexGrow: 1 }}>
        <Text style={s.panelLabel}>Installation</Text>
        <View style={{ flexDirection: "row" }}>
          {ch.installImgs.map((ii) => (
            <View key={ii.img} style={{ marginRight: 6, alignItems: "center" }}>
              <View style={[s.card, { width: 82, height: 82 }]}>
                <Image src={`${C}/${ii.img}`} style={{ maxWidth: 72, maxHeight: 72, objectFit: "contain" }} />
              </View>
              <Text style={[s.monoSm, s.dim, { marginTop: 2 }]}>{ii.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>

    {/* fixing-hole spacing schematics */}
    {ch.spacingImgs.length > 0 && (
      <View style={{ marginTop: 6 }}>
        <Text style={s.panelLabel}>Fixing-hole spacing — mm</Text>
        {ch.spacingImgs.map((sp) => (
          <View key={sp.img} style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}>
            <View style={[s.card, { flexGrow: 1, paddingVertical: 3 }]}>
              <Image src={`${C}/${sp.img}`} style={{ width: 430, maxHeight: 34, objectFit: "contain" }} />
            </View>
            <Text style={[s.monoSm, s.dim, { width: 52, textAlign: "right" }]}>{sp.label}</Text>
          </View>
        ))}
      </View>
    )}

    {/* variants table */}
    <View style={{ marginTop: 6 }}>
      <View style={{ flexDirection: "row", borderBottomWidth: 1, borderBottomColor: INK, paddingBottom: 2 }}>
        <Text style={[s.th, { width: 120 }]}>Part</Text>
        <Text style={[s.th, { width: 80 }]}>W × H (mm)</Text>
        <Text style={[s.th, { width: 90 }]}>Length</Text>
        <Text style={[s.th, { width: 100 }]}>Screw holes</Text>
        <Text style={[s.th, { width: 50 }]}>Holes</Text>
        <Text style={[s.th, { flexGrow: 1 }]}>Suits</Text>
      </View>
      {ch.variants.map((v, i) => (
        <View
          key={i}
          style={{ flexDirection: "row", borderBottomWidth: 1, borderBottomColor: LINE, paddingVertical: 2.5 }}
        >
          <View style={{ width: 120 }}>
            <Code code={ch.code} />
          </View>
          <Text style={[s.mono, { width: 80 }]}>{i === 0 ? ch.wh : ""}</Text>
          <Text style={[s.mono, { width: 90 }]}>{v.length}</Text>
          <Text style={[s.mono, { width: 100 }]}>{v.screw}</Text>
          <Text style={[s.mono, { width: 50 }]}>{v.holes}</Text>
          <Text style={[s.mono, { flexGrow: 1 }]}>SF16 range</Text>
        </View>
      ))}
    </View>
    {ch.note ? <Text style={[s.body, s.dim, { marginTop: 4, fontSize: 8 }]}>{ch.note}</Text> : null}
  </View>
);

const SectionIntro = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <View style={[s.pad, { marginTop: 14 }]}>
    <Text style={s.eyebrow}>{eyebrow}</Text>
    <Text style={[s.h2, { fontSize: 15, marginTop: 2 }]}>{title}</Text>
  </View>
);

/* ------------------------------------------------------------------ data */

const alCC: Channel = {
  code: "OR-AL-CC",
  name: "Aluminium channel, surface / recessed",
  material: "Rigid aluminium, standard specification",
  wh: "20.40 × 19.60",
  photo: "al-cc-photo.png",
  dimImg: "al-cc-dim.png",
  installImgs: [{ img: "al-cc-install.png", label: "SURFACE / RECESSED" }],
  spacingImgs: [
    { img: "al-cc-space1m.png", label: "1000MM" },
    { img: "al-cc-space2m.png", label: "2000MM" },
  ],
  variants: [
    { length: "35mm", screw: "\u03A6 4.0mm", holes: "2" },
    { length: "1000mm", screw: "slot 4.0mm", holes: "2" },
    { length: "2000mm", screw: "slot 4.0mm", holes: "4" },
  ],
};

const al22: Channel = {
  code: "ON REQUEST",
  name: "Aluminium channel, wide-body",
  material: "Rigid aluminium, 22mm body with splice plates",
  wh: "22.00 × 20.80",
  photo: "al-22-photo.png",
  dimImg: "al-22-dim.png",
  installImgs: [{ img: "al-22-install.png", label: "SURFACE / RECESSED" }],
  spacingImgs: [
    { img: "al-22-space1m.png", label: "1000MM" },
    { img: "al-22-space2m.png", label: "2000MM" },
  ],
  variants: [
    { length: "35mm", screw: "\u03A6 4.0mm", holes: "2" },
    { length: "1000mm", screw: "slot 4.0mm", holes: "2" },
    { length: "2000mm", screw: "slot 4.0mm", holes: "4" },
  ],
  note: "Joins with 44.0 × 2.0mm splice plates (supplied on request) for continuous runs.",
};

const alRF: Channel = {
  code: "ON REQUEST",
  name: "Aluminium channel, recessed flange",
  material: "Rigid aluminium, 32mm trim flange for plaster / joinery reveals",
  wh: "22.00 × 22.80",
  photo: "al-rf-photo.png",
  dimImg: "al-rf-dim.png",
  installImgs: [{ img: "al-rf-install.png", label: "RECESSED" }],
  spacingImgs: [
    { img: "al-rf-space1m.png", label: "1000MM" },
    { img: "al-rf-space2m.png", label: "2000MM" },
  ],
  variants: [
    { length: "35mm", screw: "\u03A6 4.0mm", holes: "2" },
    { length: "1000mm", screw: "slot 4.0mm", holes: "2" },
    { length: "2000mm", screw: "slot 4.0mm", holes: "4" },
  ],
};

const alDeep: Channel = {
  code: "ON REQUEST",
  name: "Aluminium channel, deep-set",
  material: "Rigid aluminium, 33.9mm deep body for regressed light lines",
  wh: "22.00 × 33.90",
  photo: "al-deep-photo.png",
  dimImg: "al-deep-dim.png",
  installImgs: [{ img: "al-deep-install.png", label: "SURFACE / RECESSED" }],
  spacingImgs: [
    { img: "al-deep-space1m.png", label: "1000MM" },
    { img: "al-deep-space2m.png", label: "2000MM" },
  ],
  variants: [
    { length: "35mm", screw: "\u03A6 4.0mm", holes: "2" },
    { length: "1000mm", screw: "slot 4.0mm", holes: "2" },
    { length: "2000mm", screw: "slot 4.0mm", holes: "4" },
  ],
};

const alFLX: Channel = {
  code: "OR-AL-FLX",
  name: "Flexible aluminium channel",
  material: "Segmented aluminium — follows curves to the strip's own 120mm bend limit",
  wh: "20.40 × 19.79",
  photo: "al-flx-photo.png",
  dimImg: "al-flx-dim.png",
  installImgs: [{ img: "al-flx-install.png", label: "SURFACE" }],
  spacingImgs: [
    { img: "al-flx-space05.png", label: "500MM" },
    { img: "al-flx-space1m.png", label: "1000MM" },
  ],
  variants: [
    { length: "500mm", screw: "segment fix", holes: "\u2014" },
    { length: "1000mm", screw: "segment fix", holes: "\u2014" },
  ],
  note: "Segments 14.0mm wide at 5.0mm spacing.",
};

const pcCC: Channel = {
  code: "OR-PC-CC",
  name: "Polycarbonate channel",
  material: "Clear polycarbonate — budget / light-duty",
  wh: "23.53 × 22.90",
  photo: "pc-photo.png",
  dimImg: "pc-dim.png",
  installImgs: [{ img: "pc-install.png", label: "SURFACE / RECESSED" }],
  spacingImgs: [
    { img: "pc-space1m.png", label: "1000MM" },
    { img: "pc-space2m.png", label: "2000MM" },
  ],
  variants: [{ length: "1000mm", screw: "\u03A6 4.0mm", holes: "2" }],
};

const pcClip: Channel = {
  code: "ON REQUEST",
  name: "Polycarbonate mounting clip",
  material: "Clear polycarbonate saddle clip",
  wh: "23.30 × 28.70",
  photo: "pc-clip-photo.png",
  dimImg: "pc-clip-dim.png",
  installImgs: [
    { img: "pc-clip-install.png", label: "SURFACE" },
    { img: "pc-clip-holes.png", label: "HOLE LAYOUT" },
  ],
  spacingImgs: [],
  variants: [{ length: "30mm", screw: "\u03A6 4.4mm", holes: "2" }],
};

const ssClip: Channel = {
  code: "ON REQUEST",
  name: "Stainless mounting clip",
  material: "Stainless steel 316L saddle clip",
  wh: "19.35 × 20.03",
  photo: "ss-clip-photo.png",
  dimImg: "ss-clip-dim.png",
  installImgs: [
    { img: "ss-clip-install.png", label: "SURFACE / RECESSED" },
    { img: "ss-clip-holes.png", label: "HOLE LAYOUT" },
  ],
  spacingImgs: [],
  variants: [{ length: "50mm", screw: "\u03A6 4.0mm", holes: "2" }],
};

const ssCC: Channel = {
  code: "OR-SS-CC",
  name: "Stainless channel, rigid",
  material: "Stainless steel 316L — recessed under pool coping",
  wh: "18.60 × 20.30",
  photo: "ss-cc-photo.png",
  dimImg: "ss-cc-dim.png",
  installImgs: [{ img: "ss-cc-install.png", label: "SURFACE / RECESSED" }],
  spacingImgs: [{ img: "ss-cc-space1m.png", label: "1000MM" }],
  variants: [{ length: "1000mm", screw: "slot 4.0×10mm", holes: "2" }],
};

const ssDeep: Channel = {
  code: "ON REQUEST",
  name: "Stainless channel, deep-set",
  material: "Stainless steel 316L, 33.26mm deep body",
  wh: "18.45 × 33.26",
  photo: "ss-deep-photo.png",
  dimImg: "ss-deep-dim.png",
  installImgs: [{ img: "ss-deep-install.png", label: "SURFACE / RECESSED" }],
  spacingImgs: [{ img: "ss-deep-space1m.png", label: "1000MM" }],
  variants: [{ length: "1000mm", screw: "slot 4.0×10mm", holes: "2" }],
};

const ssFLX: Channel = {
  code: "OR-SS-FLX",
  name: "Stainless channel, flexible",
  material: "Stainless steel 316L segmented — recessed curved coping",
  wh: "18.00 × 21.80",
  photo: "ss-flx-photo.png",
  dimImg: "ss-flx-dim.png",
  installImgs: [{ img: "ss-flx-install.png", label: "SURFACE" }],
  spacingImgs: [{ img: "ss-flx-space.png", label: "1000MM" }],
  variants: [
    { length: "100mm", screw: "segment fix", holes: "\u2014" },
    { length: "300mm", screw: "segment fix", holes: "\u2014" },
    { length: "500mm", screw: "segment fix", holes: "\u2014" },
    { length: "1000mm", screw: "segment fix", holes: "\u2014" },
  ],
};

/* ------------------------------------------------------------------ doc */

const Doc = () => (
  <Document
    title="Orenara — Channel System Catalogue"
    author="Orenara"
    subject="SF16 mounting channel range — dimensions, spacing and installation"
  >
    {/* p1: title + aluminium */}
    <PageShell pageNo="01" section="Channel System Catalogue">
      <View style={[s.pad, { marginTop: 16 }]}>
        <Text style={s.eyebrow}>SF16 LED Linear Flex</Text>
        <Text style={s.h1}>Mounting channel range.</Text>
        <Text style={[s.body, { marginTop: 6, maxWidth: 420 }]}>
          Every profile below accepts the same SF16 strip. Dimensions in millimetres,
          drawn to the manufacturing tolerance of the extrusion. Items marked{" "}
          <Text style={{ color: EMBER, fontFamily: "Mono", fontSize: 8 }}>ON REQUEST</Text>{" "}
          are available to order — contact us for codes and lead times.
        </Text>
      </View>
      <SectionIntro eyebrow="01" title="Aluminium channel" />
      <ChannelBlock ch={alCC} />
    </PageShell>

    <PageShell pageNo="02" section="Aluminium">
      <ChannelBlock ch={al22} />
      <ChannelBlock ch={alRF} />
    </PageShell>

    <PageShell pageNo="03" section="Aluminium">
      <ChannelBlock ch={alDeep} />
      <SectionIntro eyebrow="02" title="Flexible aluminium channel" />
      <ChannelBlock ch={alFLX} />
    </PageShell>

    <PageShell pageNo="04" section="Polycarbonate">
      <SectionIntro eyebrow="03" title="Polycarbonate channel & clips" />
      <ChannelBlock ch={pcCC} />
      <ChannelBlock ch={pcClip} />
    </PageShell>

    <PageShell pageNo="05" section="Stainless Steel">
      <SectionIntro eyebrow="04" title="Stainless steel channel" />
      <ChannelBlock ch={ssCC} />
      <ChannelBlock ch={ssClip} />
    </PageShell>

    <PageShell pageNo="06" section="Stainless Steel">
      <ChannelBlock ch={ssDeep} />
      <ChannelBlock ch={ssFLX} />
    </PageShell>

    {/* p7: buried & recessed system */}
    <PageShell pageNo="07" section="Buried & Recessed">
      <SectionIntro eyebrow="05" title="Buried & recessed system" />
      <View style={[s.pad, { marginTop: 10 }]}>
        <View style={{ flexDirection: "row" }}>
          <View style={[s.card, { width: 210, height: 130, marginRight: 8 }]}>
            <Image src={`${C}/bur-photo.png`} style={{ maxWidth: 196, maxHeight: 118, objectFit: "contain" }} />
          </View>
          <View style={{ width: 150, marginRight: 8 }}>
            <Text style={s.panelLabel}>Section — mm</Text>
            <View style={[s.card, { height: 120, width: 150 }]}>
              <Image src={`${C}/bur-dim.png`} style={{ maxWidth: 136, maxHeight: 108, objectFit: "contain" }} />
            </View>
          </View>
          <View style={{ flexGrow: 1 }}>
            <Text style={s.panelLabel}>Installation</Text>
            <View style={{ flexDirection: "row" }}>
              <View style={{ marginRight: 6, alignItems: "center" }}>
                <View style={[s.card, { width: 86, height: 78 }]}>
                  <Image src={`${C}/bur-install-buried.png`} style={{ maxWidth: 76, maxHeight: 68, objectFit: "contain" }} />
                </View>
                <Text style={[s.monoSm, s.dim, { marginTop: 2 }]}>BURIED</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <View style={[s.card, { width: 86, height: 78 }]}>
                  <Image src={`${C}/bur-install-recessed.png`} style={{ maxWidth: 76, maxHeight: 68, objectFit: "contain" }} />
                </View>
                <Text style={[s.monoSm, s.dim, { marginTop: 2 }]}>RECESSED</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 8 }}>
          <Text style={s.panelLabel}>Profile sections — mm</Text>
          <View style={[s.card, { paddingVertical: 8 }]}>
            <Image src={`${C}/bur-sections.png`} style={{ maxWidth: 440, maxHeight: 180, objectFit: "contain" }} />
          </View>
        </View>

        {/* table */}
        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", borderBottomWidth: 1, borderBottomColor: INK, paddingBottom: 2 }}>
            <Text style={[s.th, { width: 120 }]}>Part</Text>
            <Text style={[s.th, { width: 110 }]}>W × H (mm)</Text>
            <Text style={[s.th, { width: 130 }]}>Installation</Text>
            <Text style={[s.th, { flexGrow: 1 }]}>Lengths</Text>
          </View>
          {[
            { code: "OR-AL-BUR", wh: "25.88 \u00D7 44.86", inst: "Buried mounted", len: "500 / 1000 / 2000mm" },
            { code: "ON REQUEST", wh: "36.02 \u00D7 34.20", inst: "Recessed", len: "500 / 1000 / 2000mm" },
            { code: "ON REQUEST", wh: "19.8 \u00D7 7.6", inst: "Connective accessory", len: "80mm" },
          ].map((r, i) => (
            <View key={i} style={{ flexDirection: "row", borderBottomWidth: 1, borderBottomColor: LINE, paddingVertical: 2.5 }}>
              <View style={{ width: 120 }}>
                <Code code={r.code} />
              </View>
              <Text style={[s.mono, { width: 110 }]}>{r.wh}</Text>
              <Text style={[s.mono, { width: 130 }]}>{r.inst}</Text>
              <Text style={[s.mono, { flexGrow: 1 }]}>{r.len}</Text>
            </View>
          ))}
        </View>
        <Text style={[s.body, s.dim, { marginTop: 6, fontSize: 8 }]}>
          The buried profile sits proud-of-slab in wet-pour applications; the recessed variant
          drops flush behind a 36mm trim. Runs join with the 80mm connective accessory. All parts
          suit the SF16 strip range.
        </Text>

        {/* how to order */}
        <View style={{ backgroundColor: INK, borderRadius: 2, padding: 14, marginTop: 16 }}>
          <Text style={[s.eyebrow, { color: "#9A968C" }]}>How to order</Text>
          <Text style={{ fontFamily: "Archivo", fontSize: 12, color: BONE, marginTop: 4 }}>
            Quote the OR- part code and length. Anything marked ON REQUEST — send us the
            drawing reference on this page and we'll confirm code, price and lead time.
          </Text>
        </View>
      </View>
    </PageShell>
  </Document>
);

mkdirSync(path.dirname(OUT), { recursive: true });
renderToFile(<Doc />, OUT).then(() => console.log("written:", OUT));
