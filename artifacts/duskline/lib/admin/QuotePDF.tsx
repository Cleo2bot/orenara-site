import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";
import path from "path";

export function registerFonts() {
  const fontDir = path.join(process.cwd(), "public", "fonts");
  Font.register({
    family: "Archivo",
    src: path.join(fontDir, "Archivo-Medium.ttf"),
    fontWeight: 500,
  });
  Font.register({
    family: "InstrumentSans",
    src: path.join(fontDir, "InstrumentSans-Regular.ttf"),
    fontWeight: 400,
  });
  Font.register({
    family: "IBMPlexMono",
    src: path.join(fontDir, "IBMPlexMono-Regular.ttf"),
    fontWeight: 400,
  });
}

// Swap the JPG here (or replace the file at the same path) — no other code changes needed.
const HERO_IMAGE_PATH = path.join(
  process.cwd(),
  "public",
  "admin-assets",
  "pdf",
  "hero-pool-dusk.jpg"
);

const INK      = "#0F1113";
const BONE     = "#F3EEE4";
const BONE_DIM = "#B8B2A6";
const LINE     = "#DEDAD4";
const H_PAD    = 45;

/**
 * Prevent fi/fl/ff ligature glyph substitution that silently drops letters.
 * Inserts ZWNJ (U+200C) between each pair.
 */
function nolig(text: string): string {
  return text.replace(/fi|fl|ff/g, (m) => m[0] + "\u200C" + m[1]);
}

const s = StyleSheet.create({
  /* ── page ─────────────────────────────────────────────────────────── */
  page: {
    backgroundColor: BONE,
    color: INK,
    fontFamily: "InstrumentSans",
    fontSize: 9,
    paddingTop: 44,
    paddingBottom: 44,
    paddingLeft: 0,
    paddingRight: 0,
    flexDirection: "column",
  },

  /* ── section — horizontal indent for normal content ── */
  section: {
    paddingLeft: H_PAD,
    paddingRight: H_PAD,
  },

  /* ── header ──────────────────────────────────────────────────────── */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "column",
  },
  wordmark: {
    fontFamily: "Archivo",
    fontWeight: 500,
    fontSize: 15,
    letterSpacing: 3.3,
    textTransform: "uppercase",
    color: INK,
  },
  quoteNumber: {
    fontFamily: "IBMPlexMono",
    fontSize: 13,
    color: INK,
    marginTop: 6,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  headerMeta: {
    fontFamily: "IBMPlexMono",
    fontSize: 8,
    color: BONE_DIM,
    marginBottom: 2,
  },
  validUntilRight: {
    fontFamily: "IBMPlexMono",
    fontSize: 8,
    color: INK,
  },

  /* ── divider — spans full page (inline margins handle indentation) ── */
  divider: {
    height: 1,
    backgroundColor: LINE,
    marginLeft: H_PAD,
    marginRight: H_PAD,
    marginVertical: 11,
  },

  /* ── hero band — full bleed, explicit height keeps image cropped ── */
  heroBand: {
    height: 82,
    width: "100%",
  },
  heroImage: {
    width: "100%",
    height: 82,
    objectFit: "cover",
    objectPosition: "center top",
  },

  /* ── pitch block — full bleed, own horizontal padding ── */
  pitchBlock: {
    backgroundColor: INK,
    paddingLeft: H_PAD,
    paddingRight: H_PAD,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 8,
  },
  pitchBrandLine: {
    fontFamily: "Archivo",
    fontWeight: 500,
    fontSize: 12,
    color: BONE,
    marginBottom: 6,
  },
  pitchParagraph: {
    fontFamily: "InstrumentSans",
    fontSize: 8,
    color: BONE_DIM,
    lineHeight: 1.4,
    marginBottom: 6,
  },
  pitchProofItem: {
    fontFamily: "IBMPlexMono",
    fontSize: 6.5,
    color: BONE,
    marginBottom: 3,
  },

  /* ── customer block ──────────────────────────────────────────────── */
  projectLabel: {
    fontFamily: "Archivo",
    fontSize: 13,
    fontWeight: 500,
    color: INK,
    marginBottom: 4,
  },
  customerField: {
    fontSize: 9,
    color: INK,
    marginBottom: 2,
  },
  customerMuted: {
    fontSize: 8,
    color: BONE_DIM,
  },

  /* ── table ───────────────────────────────────────────────────────── */
  tableContainer: {
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: "row",
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: INK,
  },
  tableHeaderCell: {
    fontFamily: "IBMPlexMono",
    fontSize: 7,
    color: BONE_DIM,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    alignItems: "flex-start",
  },
  cellPartNo: {
    width: "18%",
    fontFamily: "IBMPlexMono",
    fontSize: 8,
    color: INK,
  },
  cellDescription: {
    width: "60%",
    fontSize: 9,
    color: INK,
    paddingRight: 8,
  },
  cellQty: {
    width: "11%",
    fontFamily: "IBMPlexMono",
    fontSize: 9,
    textAlign: "right",
    color: INK,
  },
  cellUnit: {
    width: "11%",
    fontFamily: "IBMPlexMono",
    fontSize: 8,
    textAlign: "right",
    color: BONE_DIM,
    paddingLeft: 4,
  },
  cellImgPartNo:      { width: "16%" },
  cellImgDescription: { width: "50%" },
  cellImgQty:         { width: "10%" },
  cellImgUnit:        { width: "10%" },
  cellImgSlot:        { width: "14%", alignItems: "flex-end" },
  productImage: {
    width: 28,
    height: 28,
    objectFit: "contain",
  },

  /* ── price block ─────────────────────────────────────────────────── */
  priceRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "baseline",
    marginTop: 10,
    marginBottom: 2,
  },
  priceLabel: {
    fontFamily: "IBMPlexMono",
    fontSize: 8,
    color: BONE_DIM,
    textTransform: "uppercase",
    marginRight: 10,
  },
  priceValue: {
    fontFamily: "Archivo",
    fontSize: 18,
    fontWeight: 500,
    color: INK,
  },
  priceSub: {
    fontFamily: "IBMPlexMono",
    fontSize: 8,
    color: BONE_DIM,
    textAlign: "right",
    marginTop: 2,
  },

  /* ── validity + lead-time (page 1) ──────────────────────────────── */
  leadTimeBlock: {
    marginTop: 4,
  },
  leadTimeLine: {
    fontFamily: "InstrumentSans",
    fontSize: 8,
    color: BONE_DIM,
    lineHeight: 1.4,
    marginBottom: 2,
  },

  /* ── terms (page 2) ──────────────────────────────────────────────── */
  termsBlock: {
    marginTop: 4,
  },
  termsHeading: {
    fontFamily: "IBMPlexMono",
    fontSize: 7,
    color: BONE_DIM,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  termsLine: {
    fontSize: 8,
    color: INK,
    marginBottom: 4,
    lineHeight: 1.45,
  },

  /* ── spacer ──────────────────────────────────────────────────────── */
  spacer: {
    flexGrow: 1,
  },

  /* ── footer — in-flow, sits after the spacer ─────────────────────── */
  footer: {
    paddingTop: 8,
    paddingLeft: H_PAD,
    paddingRight: H_PAD,
    paddingBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: LINE,
  },
  footerText: {
    fontFamily: "IBMPlexMono",
    fontSize: 7,
    color: BONE_DIM,
  },

  /* ── page-2 header ───────────────────────────────────────────────── */
  page2Header: {
    marginBottom: 16,
  },
  page2Wordmark: {
    fontFamily: "Archivo",
    fontWeight: 500,
    fontSize: 15,
    letterSpacing: 3.3,
    textTransform: "uppercase",
    color: INK,
  },
});

export interface PDFLineItem {
  partNumber: string;
  description: string;
  qty: string;
  unit: string;
  imagePath: string | null;
}

export interface QuotePDFProps {
  quoteNumber: string;
  createdAt: Date;
  validUntil: Date;
  customerType: "residential" | "commercial";
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  customerSuburb: string | null;
  customerState: string | null;
  projectLabel: string;
  lineItems: PDFLineItem[];
  systemPrice: string | null;
  warrantyLine: string;
  abn: string;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format 11-digit ABN to standard display: XX XXX XXX XXX */
function formatABN(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.length === 11) {
    return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8, 11)}`;
  }
  return raw;
}

export function QuotePDFDoc(props: QuotePDFProps) {
  const {
    quoteNumber,
    createdAt,
    validUntil,
    customerType,
    customerName,
    customerEmail,
    customerPhone,
    customerSuburb,
    customerState,
    projectLabel,
    lineItems,
    systemPrice,
    warrantyLine,
    abn,
  } = props;

  const hasImages = lineItems.some((i) => i.imagePath !== null);
  const priceNum    = systemPrice ? parseFloat(systemPrice) : null;
  const priceIncGst = priceNum !== null ? priceNum * 1.1 : null;

  const locationParts = [customerSuburb, customerState].filter(Boolean);
  const location      = locationParts.join(", ");
  // Single-line contact: "Suburb, State · email · phone"
  const contactParts  = [location, customerEmail, customerPhone].filter(Boolean);
  const contactLine   = nolig(contactParts.join(" \u00B7 "));

  const paymentTerms = nolig(
    customerType === "residential"
      ? "Payment in full on order con\u200Cfirmation."
      : "50% deposit on con\u200Cfirmation, balance before dispatch."
  );

  const leadTimeSentence = nolig(
    "Every system is built to order \u2014 allow up to 20 business days from order con\u200Cfirmation."
  );

  const warrantyDisplay    = nolig(warrantyLine);
  const supplyOnlySentence = nolig(
    "Supply only. Installation by the customer\u2019s licensed electrician. Every run arrives sealed, tested and labelled per zone."
  );

  const displayABN = formatABN(abn);

  const FooterView = (
    <View style={s.footer}>
      <Text style={s.footerText}>orenara.com.au</Text>
      <Text style={s.footerText}>ABN {displayABN}</Text>
    </View>
  );

  return (
    <Document>
      {/* ═══════════════════════════════════════════════════════ PAGE 1 */}
      <Page size="A4" style={s.page}>

        {/* HEADER */}
        <View style={[s.section, s.header]}>
          <View style={s.headerLeft}>
            <Text style={s.wordmark}>ORENARA</Text>
            <Text style={s.quoteNumber}>{quoteNumber}</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.headerMeta}>
              {nolig("Issued " + formatDate(createdAt))}
            </Text>
            <Text style={s.validUntilRight}>
              {nolig("Valid until " + formatDate(validUntil))}
            </Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* HERO IMAGE BAND — full bleed */}
        <View style={s.heroBand}>
          <Image style={s.heroImage} src={HERO_IMAGE_PATH} />
        </View>

        {/* PITCH BLOCK — full bleed with own padding */}
        <View style={s.pitchBlock}>
          <Text style={s.pitchBrandLine}>Not Waterproof. Submersible.</Text>
          <Text style={s.pitchParagraph}>
            {nolig(
              "Sealed silicone, end to end. No seams, no glued joints, no ingress path. " +
              "Every Orenara system is rated IP68 across the strip, connectors and end caps \u2014 " +
              "built for pool edges, water features and coastal exposure."
            )}
          </Text>
          <Text style={s.pitchProofItem}>
            {nolig("IP68 END TO END \u2014 strip, connectors and end caps all rated")}
          </Text>
          <Text style={s.pitchProofItem}>
            {nolig("NO FIELD JOINS \u2014 factory-sealed runs, cut to length")}
          </Text>
          <Text style={s.pitchProofItem}>2-YEAR SUBMERGED WARRANTY</Text>
        </View>

        {/* CUSTOMER BLOCK */}
        <View style={s.section}>
          <Text style={s.projectLabel}>{nolig(projectLabel)}</Text>
          <Text style={s.customerField}>{nolig(customerName)}</Text>
          {contactLine ? (
            <Text style={s.customerMuted}>{contactLine}</Text>
          ) : null}
        </View>

        <View style={s.divider} />

        {/* LINE ITEMS TABLE */}
        <View style={[s.section, s.tableContainer]}>
          <View style={s.tableHeader}>
            {hasImages ? (
              <>
                <Text style={[s.tableHeaderCell, s.cellImgPartNo]}>Part No</Text>
                <Text style={[s.tableHeaderCell, s.cellImgDescription]}>Description</Text>
                <Text style={[s.tableHeaderCell, s.cellImgQty, { textAlign: "right" }]}>Qty</Text>
                <Text style={[s.tableHeaderCell, s.cellImgUnit, { textAlign: "right" }]}>Unit</Text>
                <Text style={[s.tableHeaderCell, s.cellImgSlot]} />
              </>
            ) : (
              <>
                <Text style={[s.tableHeaderCell, s.cellPartNo]}>Part No</Text>
                <Text style={[s.tableHeaderCell, s.cellDescription]}>Description</Text>
                <Text style={[s.tableHeaderCell, s.cellQty, { textAlign: "right" }]}>Qty</Text>
                <Text style={[s.tableHeaderCell, s.cellUnit, { textAlign: "right" }]}>Unit</Text>
              </>
            )}
          </View>

          {lineItems.map((item, i) => (
            <View key={i} style={s.tableRow} wrap={false}>
              {hasImages ? (
                <>
                  <Text style={[s.cellPartNo, s.cellImgPartNo]}>{item.partNumber}</Text>
                  <Text style={[s.cellDescription, s.cellImgDescription]}>
                    {nolig(item.description)}
                  </Text>
                  <Text style={[s.cellQty, s.cellImgQty]}>{item.qty}</Text>
                  <Text style={[s.cellUnit, s.cellImgUnit]}>{item.unit}</Text>
                  <View style={s.cellImgSlot}>
                    {item.imagePath ? (
                      <Image style={s.productImage} src={item.imagePath} />
                    ) : null}
                  </View>
                </>
              ) : (
                <>
                  <Text style={s.cellPartNo}>{item.partNumber}</Text>
                  <Text style={s.cellDescription}>{nolig(item.description)}</Text>
                  <Text style={s.cellQty}>{item.qty}</Text>
                  <Text style={s.cellUnit}>{item.unit}</Text>
                </>
              )}
            </View>
          ))}
        </View>

        {/* PRICE BLOCK */}
        {priceNum !== null && (
          <View style={s.section}>
            <View style={s.divider} />
            {customerType === "residential" ? (
              <>
                <View style={s.priceRow}>
                  <Text style={s.priceLabel}>System price</Text>
                  <Text style={s.priceValue}>
                    {formatCurrency(priceIncGst!)} inc GST
                  </Text>
                </View>
                <Text style={s.priceSub}>
                  ({formatCurrency(priceNum)} ex GST)
                </Text>
              </>
            ) : (
              <View style={s.priceRow}>
                <Text style={s.priceLabel}>System price</Text>
                <Text style={s.priceValue}>
                  {formatCurrency(priceNum)} ex GST
                </Text>
              </View>
            )}
          </View>
        )}

        {/* VALIDITY + LEAD-TIME */}
        <View style={s.section}>
          <View style={s.divider} />
          <View style={s.leadTimeBlock}>
            <Text style={s.leadTimeLine}>
              {nolig("Valid until " + formatDate(validUntil))}
            </Text>
            <Text style={s.leadTimeLine}>{leadTimeSentence}</Text>
          </View>
        </View>

        {/* SPACER pushes footer to bottom */}
        <View style={s.spacer} />

        {/* FOOTER */}
        {FooterView}
      </Page>

      {/* ═══════════════════════════════════════════════════════ PAGE 2 */}
      <Page size="A4" style={s.page}>

        <View style={[s.section, s.page2Header]}>
          <Text style={s.page2Wordmark}>ORENARA</Text>
        </View>

        <View style={s.divider} />

        <View style={[s.section, s.termsBlock]}>
          <Text style={s.termsHeading}>Terms</Text>
          <Text style={s.termsLine}>{leadTimeSentence}</Text>
          <Text style={s.termsLine}>{warrantyDisplay}</Text>
          <Text style={s.termsLine}>{paymentTerms}</Text>
          <Text style={s.termsLine}>{supplyOnlySentence}</Text>
          <Text style={s.termsLine}>
            {nolig("Quote valid 14 days from issue.")}
          </Text>
        </View>

        {/* SPACER pushes footer to bottom */}
        <View style={s.spacer} />

        {/* FOOTER */}
        {FooterView}
      </Page>
    </Document>
  );
}
