import { NextRequest, NextResponse } from "next/server";
import { db } from "@workspace/db";
import {
  quotesTable,
  zonesTable,
  runsTable,
  lineItemsTable,
} from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { renderToBuffer } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import { createElement } from "react";
import type { ReactElement } from "react";
import path from "path";
import fs from "fs";
import { QuotePDFDoc, registerFonts, type PDFLineItem } from "@/lib/admin/QuotePDF";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let fontsRegistered = false;

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const quoteId = parseInt(params.id, 10);
  if (isNaN(quoteId)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const [quote] = await db
    .select()
    .from(quotesTable)
    .where(eq(quotesTable.id, quoteId));
  if (!quote) {
    return new NextResponse("Not found", { status: 404 });
  }

  const zones = await db
    .select()
    .from(zonesTable)
    .where(eq(zonesTable.quoteId, quoteId))
    .orderBy(asc(zonesTable.sortOrder));

  const allRunsRaw: { zoneId: number; label: string; lengthMetres: string }[] =
    [];
  for (const zone of zones) {
    const zoneRuns = await db
      .select()
      .from(runsTable)
      .where(eq(runsTable.zoneId, zone.id))
      .orderBy(asc(runsTable.sortOrder));
    allRunsRaw.push(...zoneRuns);
  }

  const rawItems = await db
    .select()
    .from(lineItemsTable)
    .where(eq(lineItemsTable.quoteId, quoteId))
    .orderBy(asc(lineItemsTable.sortOrder));

  const productImagesDir = path.join(
    process.cwd(),
    "public",
    "admin-assets",
    "products"
  );

  const lineItems: PDFLineItem[] = rawItems.map((item) => {
    const imgPath = path.join(productImagesDir, `${item.partNumber}.png`);
    return {
      partNumber: item.partNumber,
      description: item.description,
      qty: item.qty,
      unit: item.unit,
      imagePath: fs.existsSync(imgPath) ? imgPath : null,
    };
  });

  const createdAt = quote.createdAt ? new Date(quote.createdAt) : new Date();
  const validUntil = quote.validUntil
    ? new Date(quote.validUntil)
    : new Date(createdAt.getTime() + 14 * 24 * 60 * 60 * 1000);

  const abn = process.env.ORENARA_ABN ?? "{ABN}";

  if (!fontsRegistered) {
    registerFonts();
    fontsRegistered = true;
  }

  const element = createElement(QuotePDFDoc, {
    quoteNumber: quote.quoteNumber,
    createdAt,
    validUntil,
    customerType: quote.customerType as "residential" | "commercial",
    customerName: quote.customerName,
    customerEmail: quote.customerEmail,
    customerPhone: quote.customerPhone ?? null,
    customerSuburb: quote.customerSuburb ?? null,
    customerState: quote.customerState ?? null,
    projectLabel: quote.projectLabel,
    lineItems,
    systemPrice: quote.systemPrice ?? null,
    warrantyLine:
      quote.warrantyLine ??
      "System warranty: 2 years (submerged application)",
    abn,
  }) as unknown as ReactElement<DocumentProps>;

  const pdfBuffer = await renderToBuffer(element);

  const ab = pdfBuffer.buffer.slice(
    pdfBuffer.byteOffset,
    pdfBuffer.byteOffset + pdfBuffer.byteLength
  ) as ArrayBuffer;
  return new NextResponse(new Blob([ab], { type: "application/pdf" }), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${quote.quoteNumber}.pdf"`,
    },
  });
}
