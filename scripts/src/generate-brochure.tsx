/**
 * Orenara SF16 System Reference — multi-page A4 product brochure.
 * Output: scripts/exports/orenara-sf16-system-reference.pdf
 *
 * Brand: ink #0F1113 / bone #F3EEE4 / ember #D9A05B.
 * Archivo 500 headings, Instrument Sans 400 body, IBM Plex Mono 400 for all
 * part numbers, dimensions and spec figures. 2px radius, no shadows.
 *
 * Part codes per the Orenara part-number reference (30 Jul 2026).
 * Buried channel family has no OR- code yet — shown as "on request".
 */
import React from "react";
import {
  Document,
  Font,
  Image,
  Page,
  Path,
  Rect,
  Line,
  Circle,
  StyleSheet,
  Svg,
  Text,
  View,
  renderToFile,
} from "@react-pdf/renderer";
import { mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const A = path.resolve(__dirname, "../assets");
const OUT = path.resolve(__dirname, "../exports/orenara-sf16-system-reference.pdf");

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
const INK_RAISED = "#17191C";
const BONE = "#F3EEE4";
const BONE_DIM = "#8D8A82"; // bone-dim equivalent on bone paper
const LINE = "#D8D2C4"; // hairline on bone
const LINE_INK = "#2A2D31"; // hairline on ink
const EMBER = "#D9A05B";
const H = 40; // horizontal padding

const s = StyleSheet.create({
  page: {
    backgroundColor: BONE,
    color: INK,
    fontFamily: "Instrument",
    fontSize: 9,
    paddingTop: 36,
    paddingBottom: 30,
    paddingLeft: 0,
    paddingRight: 0,
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
  h2: { fontFamily: "Archivo", fontSize: 13, marginBottom: 2 },
  mono: { fontFamily: "Mono", fontSize: 8 },
  monoSm: { fontFamily: "Mono", fontSize: 7 },
  body: { fontSize: 9, lineHeight: 1.5 },
  dim: { color: BONE_DIM },
  hr: { borderBottomWidth: 1, borderBottomColor: LINE, marginTop: 10, marginBottom: 10 },
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
    fontSize: 7,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: BONE_DIM,
  },
  cellPad: { paddingVertical: 4, paddingRight: 8 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: LINE },
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
    <View style={[s.pad, { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }]}>
      <Text style={s.wordmark}>ORENARA</Text>
      <Text style={s.eyebrow}>{section}</Text>
    </View>
    <View style={[s.pad, { borderBottomWidth: 1, borderBottomColor: LINE, marginTop: 8 }]} />
    <View style={{ flexGrow: 1 }}>{children}</View>
    <View style={[s.pad]}>
      <View style={s.footer}>
        <Text style={s.footText}>Orenara — SF16 System Reference</Text>
        <Text style={s.footText}>Supply-only. Installation by your licensed electrician.</Text>
        <Text style={[s.footText, { fontFamily: "Mono" }]}>{pageNo}</Text>
      </View>
    </View>
  </Page>
);

/* ------------------------------------------------------------------ */
/* SVG pieces                                                          */
/* ------------------------------------------------------------------ */

// Cross-section of strip in aluminium channel, dimensioned.
const CrossSection = () => (
  <Svg width={230} height={190} viewBox="0 0 230 190">
    {/* channel outer */}
    <Path d="M55 60 L55 160 L175 160 L175 60 L167 60 L167 152 L63 152 L63 60 Z" fill={INK} />
    {/* strip body inside channel */}
    <Rect x={69} y={78} width={92} height={74} fill="#E6DFD0" stroke={INK} strokeWidth={1} />
    {/* emitting surface */}
    <Rect x={69} y={78} width={92} height={12} fill={EMBER} />
    {/* dim: strip width 16.5 */}
    <Line x1={69} y1={44} x2={161} y2={44} stroke={INK} strokeWidth={0.8} />
    <Line x1={69} y1={40} x2={69} y2={48} stroke={INK} strokeWidth={0.8} />
    <Line x1={161} y1={40} x2={161} y2={48} stroke={INK} strokeWidth={0.8} />
    {/* dim: channel width 20.4 */}
    <Line x1={55} y1={178} x2={175} y2={178} stroke={INK} strokeWidth={0.8} />
    <Line x1={55} y1={174} x2={55} y2={182} stroke={INK} strokeWidth={0.8} />
    <Line x1={175} y1={174} x2={175} y2={182} stroke={INK} strokeWidth={0.8} />
    {/* dim: strip height 16.5 */}
    <Line x1={196} y1={78} x2={196} y2={152} stroke={INK} strokeWidth={0.8} />
    <Line x1={192} y1={78} x2={200} y2={78} stroke={INK} strokeWidth={0.8} />
    <Line x1={192} y1={152} x2={200} y2={152} stroke={INK} strokeWidth={0.8} />
    {/* dim: channel height 19.6 */}
    <Line x1={30} y1={60} x2={30} y2={160} stroke={INK} strokeWidth={0.8} />
    <Line x1={26} y1={60} x2={34} y2={60} stroke={INK} strokeWidth={0.8} />
    <Line x1={26} y1={160} x2={34} y2={160} stroke={INK} strokeWidth={0.8} />
  </Svg>
);

// Simple wiring schematic. variant: "dimmer" | "direct"
const Wiring = ({ variant }: { variant: "dimmer" | "direct" }) => {
  const withDimmer = variant === "dimmer";
  return (
    <Svg width={470} height={110} viewBox="0 0 470 110">
      {/* AC mains */}
      <Rect x={8} y={40} width={64} height={30} fill="none" stroke={INK} strokeWidth={1} rx={2} />
      <Line x1={72} y1={55} x2={110} y2={55} stroke={INK} strokeWidth={1} />
      {/* driver */}
      <Rect x={110} y={34} width={96} height={42} fill={INK} rx={2} />
      <Line x1={206} y1={55} x2={withDimmer ? 240 : 292} y2={55} stroke={INK} strokeWidth={1} />
      {withDimmer && (
        <>
          <Rect x={240} y={38} width={72} height={34} fill="none" stroke={INK} strokeWidth={1} rx={2} />
          <Line x1={312} y1={55} x2={344} y2={55} stroke={INK} strokeWidth={1} />
        </>
      )}
      {/* IP68 connector */}
      <Circle cx={withDimmer ? 352 : 300} cy={55} r={7} fill="none" stroke={INK} strokeWidth={1.4} />
      <Line x1={withDimmer ? 359 : 307} y1={55} x2={withDimmer ? 376 : 324} y2={55} stroke={INK} strokeWidth={1} />
      {/* strip */}
      <Rect x={withDimmer ? 376 : 324} y={47} width={86} height={16} fill="none" stroke={INK} strokeWidth={1} rx={2} />
      <Rect x={withDimmer ? 376 : 324} y={47} width={86} height={5} fill={EMBER} />
    </Svg>
  );
};

// Pool plan view — 10 x 20 m worked example.
const PoolPlan = () => {
  const x0 = 60, y0 = 46, w = 380, h = 190; // pool rect
  return (
    <Svg width={500} height={300} viewBox="0 0 500 300">
      {/* water */}
      <Rect x={x0} y={y0} width={w} height={h} fill="#E3DCCB" stroke="none" />
      {/* runs: top = 10m (ember) + 10m (ink) ; bottom = 20m double feed ; sides 10m each */}
      {/* top long side, two 10m single-feed runs (single-feed = ink) */}
      <Line x1={x0} y1={y0} x2={x0 + w / 2 - 4} y2={y0} stroke={INK} strokeWidth={4} />
      <Line x1={x0 + w / 2 + 4} y1={y0} x2={x0 + w} y2={y0} stroke={INK} strokeWidth={4} />
      {/* bottom long side, one 20m double-feed run */}
      <Line x1={x0} y1={y0 + h} x2={x0 + w} y2={y0 + h} stroke={EMBER} strokeWidth={4} />
      {/* left + right short sides, 10m single-feed each */}
      <Line x1={x0} y1={y0} x2={x0} y2={y0 + h} stroke={INK} strokeWidth={4} />
      <Line x1={x0 + w} y1={y0} x2={x0 + w} y2={y0 + h} stroke={INK} strokeWidth={4} />
      {/* feed points */}
      {[
        [x0, y0], // top-left run A feed
        [x0 + w / 2, y0], // run B feed
        [x0, y0 + h], // bottom run double feed L
        [x0 + w, y0 + h], // bottom run double feed R
        [x0, y0 + h / 2], // left feed
        [x0 + w, y0 + h / 2], // right feed
      ].map(([cx, cy], i) => (
        <Circle key={i} cx={cx} cy={cy} r={5} fill={BONE} stroke={INK} strokeWidth={1.6} />
      ))}
      {/* driver boxes */}
      {[
        [14, 30], [220, 8], [14, 130], [14, 252], [452, 252], [452, 130],
      ].map(([bx, by], i) => (
        <Rect key={i} x={bx} y={by} width={34} height={18} fill={INK} rx={2} />
      ))}
      {/* leader lines drivers -> feeds */}
      <Line x1={48} y1={39} x2={x0} y2={y0} stroke={INK} strokeWidth={0.7} />
      <Line x1={237} y1={26} x2={x0 + w / 2} y2={y0} stroke={INK} strokeWidth={0.7} />
      <Line x1={48} y1={139} x2={x0} y2={y0 + h / 2} stroke={INK} strokeWidth={0.7} />
      <Line x1={48} y1={261} x2={x0} y2={y0 + h} stroke={INK} strokeWidth={0.7} />
      <Line x1={452} y1={261} x2={x0 + w} y2={y0 + h} stroke={INK} strokeWidth={0.7} />
      <Line x1={452} y1={139} x2={x0 + w} y2={y0 + h / 2} stroke={INK} strokeWidth={0.7} />
    </Svg>
  );
};

/* ------------------------------------------------------------------ */
/* Content data                                                        */
/* ------------------------------------------------------------------ */

const specRows: [string, string][] = [
  ["Input voltage", "24V DC"],
  ["Power", "10W/m"],
  ["LED count", "144 LEDs/m"],
  ["Cutting unit", "83.3mm (12 LEDs)"],
  ["CRI", ">90"],
  ["Beam angle", "120\u00B0"],
  ["Min bend diameter", "120mm"],
  ["Max run — single feed", "10m (CC: 15m)"],
  ["Max run — double feed", "20m (CC: 30m)"],
  ["Lumen maintenance", "L70 70,000h @ 25\u00B0C"],
  ["Operating temp", "-40\u00B0C to 55\u00B0C"],
  ["CCT options", "2200K – 6500K"],
  ["IP rating", "IP68 — submersible"],
];

const certs = [
  "IP68",
  "UV RESISTANT",
  "SALTWATER",
  "FLAME RES.",
  "SOLVENT RES.",
  "LM-80",
  "ANSI C78.377",
  "5YR WARRANTY",
];

const connectors = [
  {
    img: "conn-direct.png",
    name: "Direct entry",
    code: "OR-CON-DIR",
    exit: "Cable exits in line with the strip",
    note: "Straight runs, open ends",
  },
  {
    img: "conn-side.png",
    name: "Side entry",
    code: "OR-CON-SIDE",
    exit: "Cable exits at 90\u00B0, level with the strip",
    note: "Tight end-of-run spaces",
  },
  {
    img: "conn-bottom.png",
    name: "Bottom entry",
    code: "OR-CON-BTM",
    exit: "Cable exits straight down, under the strip",
    note: "THE RECESSED-INSTALL CONNECTOR",
    highlight: true,
  },
  {
    img: "conn-lshape.png",
    name: "L-shape entry",
    code: "OR-CON-L",
    exit: "Cable turns 90\u00B0 within the fitting",
    note: "Shallow cavities, wall returns",
  },
  {
    img: "conn-jumper.png",
    name: "Jumper",
    code: "OR-CON-JMP",
    exit: "Strip-to-strip bridge, both ends sealed",
    note: "Genuine mid-run splices only",
  },
  {
    img: "conn-endcap.png",
    name: "End cap",
    code: "OR-CAP",
    exit: "Seals the blind end of every run",
    note: "Factory-fitted, IP68",
  },
];

const channels = [
  { img: "ch-alu-rigid-1.jpg", ctx: "Surface, straight", code: "OR-AL-CC", mat: "Aluminium, rigid", dims: "20.4 × 19.6mm", feature: true },
  { img: "ch-alu-flex.jpg", ctx: "Surface, curved", code: "OR-AL-FLX", mat: "Aluminium, flexible segmented", dims: "20.4 × 19.8mm" },
  { img: "ch-ss-rigid.jpg", ctx: "Recessed under pool coping", code: "OR-SS-CC", mat: "Stainless 316L, rigid", dims: "18.6 × 20.3mm" },
  { img: "ch-ss-flex.jpg", ctx: "Recessed, curved coping", code: "OR-SS-FLX", mat: "Stainless 316L, flexible", dims: "18.0 × 21.8mm" },
  { img: "ch-plastic.jpg", ctx: "Budget / light duty", code: "OR-PC-CC", mat: "Polycarbonate", dims: "23.5 × 22.9mm" },
  { img: "ch-buried.jpg", ctx: "Buried in ground / deck", code: "ON REQUEST", mat: "Aluminium, buried & recessed", dims: "25.9 × 44.9mm" },
];

/* ------------------------------------------------------------------ */
/* Document                                                            */
/* ------------------------------------------------------------------ */

const Brochure = () => (
  <Document title="Orenara SF16 System Reference" author="Orenara">
    {/* ------------------------------------------------ P1 — Cover */}
    <Page size="A4" style={[s.page, { backgroundColor: INK, color: BONE }]}>
      <View style={[s.pad, { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }]}>
        <Text style={[s.wordmark, { color: BONE }]}>ORENARA</Text>
        <Text style={[s.eyebrow, { color: "#6E6A61" }]}>Product & Installation Reference</Text>
      </View>
      <View style={[s.pad, { borderBottomWidth: 1, borderBottomColor: LINE_INK, marginTop: 8 }]} />
      <View style={[s.pad, { marginTop: 70 }]}>
        <Text style={[s.eyebrow, { color: EMBER }]}>Not Waterproof. Submersible.</Text>
        <Text style={[s.h1, { color: BONE, fontSize: 34, marginTop: 10, lineHeight: 1.15 }]}>
          The SF16 System.
        </Text>
        <Text style={[s.body, { color: "#B9B4A8", marginTop: 12, maxWidth: 330, fontSize: 10.5 }]}>
          Silicone linear LED, sealed end to end and rated for permanent immersion —
          with the connector range and channel system that make a full recessed
          install possible. One system, specified end to end.
        </Text>
      </View>
      <View style={{ marginTop: 46, position: "relative", height: 300 }}>
        <Image
          src={`${A}/brochure/strip-hero.jpg`}
          style={{ position: "absolute", top: 0, left: H, width: 515 - H, height: 300, objectFit: "cover", borderRadius: 2 }}
        />
      </View>
      <View style={{ flexGrow: 1 }} />
      <View style={[s.pad]}>
        <View style={[s.footer, { borderTopColor: LINE_INK }]}>
          <Text style={[s.footText, { color: "#6E6A61" }]}>orenara.com.au</Text>
          <Text style={[s.footText, { color: "#6E6A61" }]}>IP68 outdoor & underwater linear lighting</Text>
          <Text style={[s.footText, { color: "#6E6A61", fontFamily: "Mono" }]}>01</Text>
        </View>
      </View>
    </Page>

    {/* ------------------------------------------------ P2 — Strip spec */}
    <PageShell pageNo="02" section="01 — The Strip">
      <View style={[s.pad, { marginTop: 18 }]}>
        <Text style={s.eyebrow}>SF16 Mono — OR-SF-16M</Text>
        <Text style={s.h1}>16.5mm of sealed silicone.</Text>
        <Text style={[s.body, { maxWidth: 400, marginTop: 6, color: "#3A3D41" }]}>
          A solid silicone extrusion with a flat diffusing face — no dotting, no
          hotspots. The 16.5 × 16.5mm envelope below is the figure your cavity,
          coping and channel planning works from.
        </Text>
      </View>
      <View style={[s.pad, { flexDirection: "row", marginTop: 16 }]}>
        {/* cross-section */}
        <View style={{ width: 240 }}>
          <CrossSection />
          <View style={{ marginTop: 2 }}>
            <Text style={s.monoSm}>STRIP 16.5 × 16.5MM — CHANNEL OR-AL-CC 20.4 × 19.6MM</Text>
            <Text style={[s.monoSm, { color: BONE_DIM, marginTop: 2 }]}>SECTION VIEW, TO SCALE. EMITTING FACE UP.</Text>
          </View>
        </View>
        {/* spec table */}
        <View style={{ flex: 1, marginLeft: 24 }}>
          {specRows.map(([k, v], i) => (
            <View key={i} style={[s.row, i === 0 ? { borderTopWidth: 1, borderTopColor: LINE } : {}]}>
              <Text style={[s.cellPad, { width: 130, fontSize: 8.5, color: "#3A3D41" }]}>{k}</Text>
              <Text style={[s.cellPad, s.mono, { flex: 1 }]}>{v}</Text>
            </View>
          ))}
        </View>
      </View>
      {/* cert row */}
      <View style={[s.pad, { marginTop: 18 }]}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {certs.map((c, i) => (
            <View
              key={i}
              style={{
                borderWidth: 1,
                borderColor: c === "5YR WARRANTY" ? EMBER : LINE,
                borderRadius: 2,
                paddingVertical: 6,
                paddingHorizontal: 8,
                marginRight: 6,
                marginBottom: 6,
              }}
            >
              <Text style={[s.monoSm, c === "5YR WARRANTY" ? { color: "#A66B24" } : {}]}>{c}</Text>
            </View>
          ))}
        </View>
        <Text style={[s.body, { fontSize: 8, color: BONE_DIM, marginTop: 6 }]}>
          Also available in the SF16 family: constant-current mono OR-SF-16CC (15m/30m runs), tunable white OR-SF-16T, RGB OR-SF-16RGB and RGBW OR-SF-16RGBW.
          Ask for the variant sheet when your job needs colour or longer single feeds.
        </Text>
      </View>
    </PageShell>

    {/* ------------------------------------------------ P3 — Connectors */}
    <PageShell pageNo="03" section="02 — Connectors">
      <View style={[s.pad, { marginTop: 18 }]}>
        <Text style={s.eyebrow}>Factory-Sealed, IP68</Text>
        <Text style={s.h1}>Which connector do you need?</Text>
        <Text style={[s.body, { maxWidth: 420, marginTop: 6, color: "#3A3D41" }]}>
          Every connector is moulded onto the strip at the factory and pressure-tested
          before dispatch — there is no field termination to get wrong. Pick by where
          the cable needs to exit.
        </Text>
      </View>
      <View style={[s.pad, { flexDirection: "row", flexWrap: "wrap", marginTop: 14, justifyContent: "space-between" }]}>
        {connectors.map((c, i) => (
          <View
            key={i}
            style={{
              width: 161,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: c.highlight ? EMBER : LINE,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Image src={`${A}/brochure/${c.img}`} style={{ width: 159, height: 118, objectFit: "cover" }} />
            <View style={{ padding: 8 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
                <Text style={{ fontFamily: "Archivo", fontSize: 9.5 }}>{c.name}</Text>
                <Text style={[s.monoSm, { color: "#A66B24" }]}>{c.code}</Text>
              </View>
              <Text style={{ fontSize: 7.5, color: "#3A3D41", marginTop: 3, lineHeight: 1.4 }}>{c.exit}</Text>
              <Text
                style={[
                  s.monoSm,
                  { marginTop: 4, fontSize: 6.5, color: c.highlight ? "#A66B24" : BONE_DIM },
                ]}
              >
                {c.note}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <View style={[s.pad]}>
        <Text style={[s.body, { fontSize: 8, color: BONE_DIM }]}>
          Bottom entry is the one to know: it drops the cable straight through the base of a recessed
          channel, so tile-flush and coping installs need no visible cable path at all.
        </Text>
      </View>
    </PageShell>

    {/* ------------------------------------------------ P4 — Channels */}
    <PageShell pageNo="04" section="03 — Channel System">
      <View style={[s.pad, { marginTop: 18 }]}>
        <Text style={s.eyebrow}>Where We Lead</Text>
        <Text style={s.h1}>A channel for every install context.</Text>
        <Text style={[s.body, { maxWidth: 430, marginTop: 6, color: "#3A3D41" }]}>
          A strip-only spec sheet stops being useful the moment the run has to disappear
          into stone. Match the install context to the channel — every profile below
          accepts the same SF16 strip.
        </Text>
      </View>
      <View style={[s.pad, { flexDirection: "row", flexWrap: "wrap", marginTop: 14, justifyContent: "space-between" }]}>
        {channels.map((c, i) => (
          <View
            key={i}
            style={{
              width: 161,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: c.feature ? EMBER : LINE,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Image src={`${A}/brochure/${c.img}`} style={{ width: 159, height: 100, objectFit: "cover" }} />
            <View style={{ padding: 8 }}>
              <Text style={{ fontFamily: "Archivo", fontSize: 9 }}>{c.ctx}</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3 }}>
                <Text style={[s.monoSm, { color: "#A66B24" }]}>{c.code}</Text>
                <Text style={[s.monoSm, { color: BONE_DIM }]}>{c.dims}</Text>
              </View>
              <Text style={{ fontSize: 7.5, color: "#3A3D41", marginTop: 3 }}>{c.mat}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={[s.pad]}>
        <Text style={[s.body, { fontSize: 8, color: BONE_DIM }]}>
          Aluminium channel (OR-AL-CC) is the standard specification: rigid, surface-mount or recessed,
          in 350mm / 1m / 2m lengths. Flexible segmented aluminium follows curves down to the strip's
          own 120mm bend limit.
        </Text>
      </View>
    </PageShell>

    {/* ------------------------------------------------ P5 — Worked example */}
    <PageShell pageNo="05" section="04 — Worked Example">
      <View style={[s.pad, { marginTop: 18 }]}>
        <Text style={s.eyebrow}>A Real Job, End to End</Text>
        <Text style={s.h1}>Typical 10 × 20m pool perimeter.</Text>
        <Text style={[s.body, { maxWidth: 430, marginTop: 6, color: "#3A3D41" }]}>
          Sixty metres of perimeter, run entirely within SF16 feed limits. Ember runs are
          double-fed; dark runs are single-fed. Every feed point is a factory-sealed
          connector — no field joins anywhere on the job.
        </Text>
      </View>
      <View style={{ alignItems: "center", marginTop: 8 }}>
        <PoolPlan />
      </View>
      <View style={[s.pad, { flexDirection: "row", marginTop: 4 }]}>
        <View style={{ flex: 1, paddingRight: 14 }}>
          <Text style={s.th}>Run breakdown</Text>
          {[
            ["2 × 10m", "top side — single feed each"],
            ["1 × 20m", "bottom side — double feed"],
            ["2 × 10m", "ends — single feed each"],
            ["6", "feed points, IP68 factory-sealed"],
            ["6", "24V drivers in dry plant locations"],
          ].map(([a, b], i) => (
            <View key={i} style={[s.row, i === 0 ? { borderTopWidth: 1, borderTopColor: LINE, marginTop: 4 } : {}]}>
              <Text style={[s.cellPad, s.mono, { width: 56 }]}>{a}</Text>
              <Text style={[s.cellPad, { flex: 1, fontSize: 8 }]}>{b}</Text>
            </View>
          ))}
        </View>
        <View style={{ width: 200, borderWidth: 1, borderColor: EMBER, borderRadius: 2, padding: 10 }}>
          <Text style={[s.monoSm, { color: "#A66B24" }]}>WITH CC MONO</Text>
          <Text style={{ fontSize: 8, lineHeight: 1.5, marginTop: 4, color: "#3A3D41" }}>
            The constant-current strip (OR-SF-16CC) runs 30m on a double feed — the same pool
            becomes two runs and four feed points, with no mid-run splice on
            either long side.
          </Text>
        </View>
      </View>
    </PageShell>

    {/* ------------------------------------------------ P6 — Wiring + footer */}
    <PageShell pageNo="06" section="05 — Power & Control">
      <View style={[s.pad, { marginTop: 18 }]}>
        <Text style={s.eyebrow}>Simple by Design</Text>
        <Text style={s.h1}>Driver, strip, dimmer. That's it.</Text>
      </View>
      <View style={[s.pad, { marginTop: 12 }]}>
        <Text style={s.th}>With dimming</Text>
        <Wiring variant="dimmer" />
        <View style={{ flexDirection: "row", width: 470 }}>
          <Text style={[s.monoSm, { width: 100, textAlign: "center" }]}>AC MAINS</Text>
          <Text style={[s.monoSm, { width: 110, textAlign: "center" }]}>24V DC DRIVER</Text>
          <Text style={[s.monoSm, { width: 110, textAlign: "center" }]}>DIMMER</Text>
          <Text style={[s.monoSm, { width: 150, textAlign: "center" }]}>IP68 PLUG → SF16 STRIP</Text>
        </View>
        <View style={{ marginTop: 14 }}>
          <Text style={s.th}>Direct 24V DC</Text>
          <Wiring variant="direct" />
          <View style={{ flexDirection: "row", width: 470 }}>
            <Text style={[s.monoSm, { width: 100, textAlign: "center" }]}>AC MAINS</Text>
            <Text style={[s.monoSm, { width: 130, textAlign: "center" }]}>24V DC DRIVER</Text>
            <Text style={[s.monoSm, { width: 180, textAlign: "center" }]}>IP68 PLUG → SF16 STRIP</Text>
          </View>
        </View>
      </View>
      <View style={[s.pad, s.hr]} />
      <View style={[s.pad, { flexDirection: "row" }]}>
        <View style={{ flex: 1, paddingRight: 16 }}>
          <Text style={s.th}>Dimming compatibility</Text>
          {[
            ["Mono / CC mono", "0-10V, DALI, DMX, Triac, PWM"],
            ["Tunable white", "0-10V, DALI, DMX, PWM"],
            ["RGB / RGBW", "DMX or PWM — decoder required"],
          ].map(([a, b], i) => (
            <View key={i} style={[s.row, i === 0 ? { borderTopWidth: 1, borderTopColor: LINE, marginTop: 4 } : {}]}>
              <Text style={[s.cellPad, { width: 110, fontSize: 8 }]}>{a}</Text>
              <Text style={[s.cellPad, s.monoSm, { flex: 1 }]}>{b}</Text>
            </View>
          ))}
          <Text style={{ fontSize: 8, color: BONE_DIM, marginTop: 8, lineHeight: 1.5 }}>
            Drivers stay in dry plant locations — only the sealed strip and its
            factory-moulded connectors go near water.
          </Text>
        </View>
        <View style={{ width: 210, backgroundColor: INK, borderRadius: 2, padding: 12 }}>
          <Text style={[s.monoSm, { color: EMBER }]}>HOW TO ORDER</Text>
          <Text style={{ fontSize: 8.5, color: BONE, lineHeight: 1.55, marginTop: 6 }}>
            Orenara is a supply-only business. Send your run lengths and install
            context — we return a component-level quote with a firm lead time,
            confirmed at quote stage.
          </Text>
          <Text style={{ fontSize: 8.5, color: "#B9B4A8", lineHeight: 1.55, marginTop: 8 }}>
            Installation is arranged by you or your licensed electrician.
          </Text>
          <Text style={[s.monoSm, { color: BONE, marginTop: 10 }]}>hello@orenara.com</Text>
          <Text style={[s.monoSm, { color: "#6E6A61", marginTop: 2 }]}>orenara.com.au</Text>
        </View>
      </View>
    </PageShell>
  </Document>
);

async function main() {
  mkdirSync(path.resolve(__dirname, "../exports"), { recursive: true });
  await renderToFile(<Brochure />, OUT);
  console.log("written:", OUT);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
