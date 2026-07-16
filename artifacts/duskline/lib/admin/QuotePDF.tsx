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
  const fonts = path.join(process.cwd(), "public", "fonts");
  Font.register({
    family: "Archivo",
    src: path.join(fonts, "Archivo-Medium.ttf"),
    fontWeight: 500,
  });
  Font.register({
    family: "InstrumentSans",
    src: path.join(fonts, "InstrumentSans-Regular.ttf"),
    fontWeight: 400,
  });
  Font.register({
    family: "IBMPlexMono",
    src: path.join(fonts, "IBMPlexMono-Regular.ttf"),
    fontWeight: 400,
  });
}

const INK = "#0F1113";
const BONE = "#F3EEE4";
const BONE_DIM = "#B8B2A6";
const LINE = "#DEDAD4";

const s = StyleSheet.create({
  page: {
    backgroundColor: BONE,
    color: INK,
    fontFamily: "InstrumentSans",
    fontSize: 9,
    paddingTop: 48,
    paddingBottom: 60,
    paddingLeft: 45,
    paddingRight: 45,
  },
  /* ── header ─────────────────────────────────────── */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  wordmark: {
    fontFamily: "Archivo",
    fontWeight: 500,
    fontSize: 15,
    letterSpacing: 3.3,
    textTransform: "uppercase",
    color: INK,
  },
  headerLeft: {
    flexDirection: "column",
  },
  quoteNumber: {
    fontFamily: "IBMPlexMono",
    fontSize: 13,
    color: INK,
    marginTop: 8,
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
  validUntil: {
    fontFamily: "IBMPlexMono",
    fontSize: 8,
    color: INK,
  },
  /* ── divider ─────────────────────────────────────── */
  divider: {
    height: 1,
    backgroundColor: LINE,
    marginVertical: 14,
  },
  /* ── customer block ─────────────────────────────── */
  projectLabel: {
    fontFamily: "Archivo",
    fontSize: 13,
    fontWeight: 500,
    color: INK,
    marginBottom: 6,
  },
  customerField: {
    fontSize: 9,
    color: INK,
    marginBottom: 2,
  },
  customerMuted: {
    fontSize: 8,
    color: BONE_DIM,
    marginBottom: 2,
  },
  /* ── table ───────────────────────────────────────── */
  tableContainer: {
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: "row",
    paddingBottom: 6,
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
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    alignItems: "center",
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
  /* image columns (shown only when images exist) */
  cellImgPartNo: { width: "16%" },
  cellImgDescription: { width: "50%" },
  cellImgQty: { width: "10%" },
  cellImgUnit: { width: "10%" },
  cellImgSlot: { width: "14%", alignItems: "flex-end" },
  productImage: {
    width: 28,
    height: 28,
    objectFit: "contain",
  },
  /* ── price block ─────────────────────────────────── */
  priceRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "baseline",
    marginTop: 12,
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
    marginBottom: 2,
  },
  /* ── terms ───────────────────────────────────────── */
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
  /* ── footer ─────────────────────────────────────── */
  footer: {
    position: "absolute",
    bottom: 32,
    left: 45,
    right: 45,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontFamily: "IBMPlexMono",
    fontSize: 7,
    color: BONE_DIM,
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
  logoBase64?: string;
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
    logoBase64,
    abn,
  } = props;

  const hasImages = lineItems.some((i) => i.imagePath !== null);
  const priceNum = systemPrice ? parseFloat(systemPrice) : null;
  const priceIncGst = priceNum !== null ? priceNum * 1.1 : null;
  const locationParts = [customerSuburb, customerState].filter(Boolean);
  const location = locationParts.join(", ");
  const paymentTerms =
    customerType === "residential"
      ? "Payment in full on order confirmation."
      : "50% deposit on confirmation, balance before dispatch.";

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* HEADER */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.wordmark}>ORENARA</Text>
            <Text style={s.quoteNumber}>{quoteNumber}</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.headerMeta}>Issued {formatDate(createdAt)}</Text>
            <Text style={s.validUntil}>
              Valid until {formatDate(validUntil)}
            </Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* CUSTOMER BLOCK */}
        <Text style={s.projectLabel}>{projectLabel}</Text>
        <Text style={s.customerField}>{customerName}</Text>
        {location ? (
          <Text style={s.customerMuted}>{location}</Text>
        ) : null}
        <Text style={s.customerMuted}>{customerEmail}</Text>
        {customerPhone ? (
          <Text style={s.customerMuted}>{customerPhone}</Text>
        ) : null}

        <View style={s.divider} />

        {/* LINE ITEMS */}
        <View style={s.tableContainer}>
          <View style={s.tableHeader}>
            {hasImages ? (
              <>
                <Text style={[s.tableHeaderCell, s.cellImgPartNo]}>
                  Part No
                </Text>
                <Text style={[s.tableHeaderCell, s.cellImgDescription]}>
                  Description
                </Text>
                <Text
                  style={[
                    s.tableHeaderCell,
                    s.cellImgQty,
                    { textAlign: "right" },
                  ]}
                >
                  Qty
                </Text>
                <Text
                  style={[
                    s.tableHeaderCell,
                    s.cellImgUnit,
                    { textAlign: "right" },
                  ]}
                >
                  Unit
                </Text>
                <Text style={[s.tableHeaderCell, s.cellImgSlot]} />
              </>
            ) : (
              <>
                <Text style={[s.tableHeaderCell, s.cellPartNo]}>Part No</Text>
                <Text style={[s.tableHeaderCell, s.cellDescription]}>
                  Description
                </Text>
                <Text
                  style={[s.tableHeaderCell, s.cellQty, { textAlign: "right" }]}
                >
                  Qty
                </Text>
                <Text
                  style={[s.tableHeaderCell, s.cellUnit, { textAlign: "right" }]}
                >
                  Unit
                </Text>
              </>
            )}
          </View>

          {lineItems.map((item, i) => (
            <View key={i} style={s.tableRow}>
              {hasImages ? (
                <>
                  <Text style={[s.cellPartNo, s.cellImgPartNo]}>
                    {item.partNumber}
                  </Text>
                  <Text style={[s.cellDescription, s.cellImgDescription]}>
                    {item.description}
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
                  <Text style={s.cellDescription}>{item.description}</Text>
                  <Text style={s.cellQty}>{item.qty}</Text>
                  <Text style={s.cellUnit}>{item.unit}</Text>
                </>
              )}
            </View>
          ))}
        </View>

        {/* PRICE BLOCK */}
        {priceNum !== null ? (
          <>
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
          </>
        ) : null}

        <View style={s.divider} />

        {/* TERMS */}
        <View style={s.termsBlock}>
          <Text style={s.termsHeading}>Terms</Text>
          <Text style={s.termsLine}>
            Every system is built to order — allow up to 20 business days from
            order confirmation.
          </Text>
          <Text style={s.termsLine}>{warrantyLine}</Text>
          <Text style={s.termsLine}>{paymentTerms}</Text>
          <Text style={s.termsLine}>
            Supply only. Installation by the customer's licensed electrician.
            Every run arrives sealed, tested and labelled per zone.
          </Text>
          <Text style={s.termsLine}>Quote valid 14 days from issue.</Text>
        </View>

        {/* FOOTER */}
        <View style={s.footer}>
          <Text style={s.footerText}>orenara.com.au</Text>
          <Text style={s.footerText}>ABN {abn}</Text>
        </View>
      </Page>
    </Document>
  );
}
