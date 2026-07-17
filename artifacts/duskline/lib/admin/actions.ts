"use server";

import { db } from "@workspace/db";
import {
  quotesTable,
  zonesTable,
  runsTable,
  lineItemsTable,
} from "@workspace/db";
import { sql, eq, asc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { deriveBOM } from "@/lib/admin/bom";

export interface ZoneFormInput {
  name: string;
  runs: { label: string; lengthMetres: string }[];
}

export async function createQuote(formData: FormData): Promise<void> {
  const zonesRaw = formData.get("zones") as string;
  const zones: ZoneFormInput[] = JSON.parse(zonesRaw);

  const customerType = formData.get("customerType") as
    | "residential"
    | "commercial";
  const colourTemp = formData.get("colourTemp") as
    | "2700K"
    | "3000K"
    | "4000K"
    | "5700K"
    | "TBC";
  const channelType = formData.get("channelType") as
    | "OR-CHN-RGD"
    | "OR-CHN-FLX"
    | "OR-CHN-SS"
    | "none";

  const allRuns = zones.flatMap((z) =>
    z.runs.map((r) => ({
      label: r.label,
      lengthMetres: parseFloat(r.lengthMetres) || 0,
    }))
  );

  let quoteId!: number;

  await db.transaction(async (tx) => {
    const seqResult = await tx.execute(
      sql`SELECT nextval('quote_number_seq') AS n`
    );
    const n = Number((seqResult.rows[0] as { n: string }).n);
    const quoteNumber = `OR-Q-${String(n).padStart(4, "0")}`;

    const [quote] = await tx
      .insert(quotesTable)
      .values({
        quoteNumber,
        customerType,
        customerName: (formData.get("customerName") as string).trim(),
        customerEmail: (formData.get("customerEmail") as string).trim(),
        customerPhone:
          (formData.get("customerPhone") as string)?.trim() || null,
        customerSuburb:
          (formData.get("customerSuburb") as string)?.trim() || null,
        customerState:
          (formData.get("customerState") as string)?.trim() || null,
        projectLabel: (formData.get("projectLabel") as string).trim(),
        colourTemp,
        channelType,
        notes: (formData.get("notes") as string)?.trim() || null,
      })
      .returning({ id: quotesTable.id });

    quoteId = quote.id;

    for (let zi = 0; zi < zones.length; zi++) {
      const zone = zones[zi];
      const [insertedZone] = await tx
        .insert(zonesTable)
        .values({ quoteId, name: zone.name, sortOrder: zi })
        .returning({ id: zonesTable.id });

      for (let ri = 0; ri < zone.runs.length; ri++) {
        const run = zone.runs[ri];
        await tx.insert(runsTable).values({
          zoneId: insertedZone.id,
          label: run.label,
          lengthMetres: String(parseFloat(run.lengthMetres) || 0),
          sortOrder: ri,
        });
      }
    }

    const bom = deriveBOM(allRuns, colourTemp, channelType);
    if (bom.length > 0) {
      await tx.insert(lineItemsTable).values(
        bom.map((item) => ({
          quoteId,
          partNumber: item.partNumber,
          description: item.description,
          qty: item.qty,
          unit: item.unit,
          isGenerated: item.isGenerated,
          sortOrder: item.sortOrder,
        }))
      );
    }
  });

  redirect(`/admin/quotes/${quoteId}`);
}

export async function updateQuoteStatus(
  quoteId: number,
  status: "draft" | "sent" | "accepted" | "declined" | "expired"
): Promise<void> {
  await db
    .update(quotesTable)
    .set({ status })
    .where(eq(quotesTable.id, quoteId));
}

export async function duplicateQuote(sourceId: number): Promise<void> {
  let newId!: number;

  await db.transaction(async (tx) => {
    const [source] = await tx
      .select()
      .from(quotesTable)
      .where(eq(quotesTable.id, sourceId));
    if (!source) throw new Error("Source quote not found");

    const seqResult = await tx.execute(
      sql`SELECT nextval('quote_number_seq') AS n`
    );
    const n = Number((seqResult.rows[0] as { n: string }).n);
    const quoteNumber = `OR-Q-${String(n).padStart(4, "0")}`;

    const now = new Date();
    const validUntil = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const [newQuote] = await tx
      .insert(quotesTable)
      .values({
        quoteNumber,
        status: "draft",
        customerType: source.customerType,
        customerName: source.customerName,
        customerEmail: source.customerEmail,
        customerPhone: source.customerPhone,
        customerSuburb: source.customerSuburb,
        customerState: source.customerState,
        projectLabel: source.projectLabel,
        colourTemp: source.colourTemp,
        channelType: source.channelType,
        systemPrice: source.systemPrice,
        warrantyLine: source.warrantyLine,
        notes: source.notes,
        validUntil,
      })
      .returning({ id: quotesTable.id });

    newId = newQuote.id;

    const zones = await tx
      .select()
      .from(zonesTable)
      .where(eq(zonesTable.quoteId, sourceId))
      .orderBy(asc(zonesTable.sortOrder));

    for (const zone of zones) {
      const [newZone] = await tx
        .insert(zonesTable)
        .values({ quoteId: newId, name: zone.name, sortOrder: zone.sortOrder })
        .returning({ id: zonesTable.id });

      const runs = await tx
        .select()
        .from(runsTable)
        .where(eq(runsTable.zoneId, zone.id))
        .orderBy(asc(runsTable.sortOrder));

      for (const run of runs) {
        await tx.insert(runsTable).values({
          zoneId: newZone.id,
          label: run.label,
          lengthMetres: run.lengthMetres,
          sortOrder: run.sortOrder,
        });
      }
    }

    const items = await tx
      .select()
      .from(lineItemsTable)
      .where(eq(lineItemsTable.quoteId, sourceId))
      .orderBy(asc(lineItemsTable.sortOrder));

    if (items.length > 0) {
      await tx.insert(lineItemsTable).values(
        items.map((item) => ({
          quoteId: newId,
          partNumber: item.partNumber,
          description: item.description,
          qty: item.qty,
          unit: item.unit,
          isGenerated: item.isGenerated,
          sortOrder: item.sortOrder,
        }))
      );
    }
  });

  redirect(`/admin/quotes/${newId}`);
}

export async function updateQuoteHeader(
  quoteId: number,
  data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerSuburb: string;
    customerState: string;
    projectLabel: string;
    colourTemp: "2700K" | "3000K" | "4000K" | "5700K" | "TBC";
    channelType: "OR-CHN-RGD" | "OR-CHN-FLX" | "OR-CHN-SS" | "none";
  }
): Promise<void> {
  await db
    .update(quotesTable)
    .set({
      customerName: data.customerName.trim(),
      customerEmail: data.customerEmail.trim(),
      customerPhone: data.customerPhone.trim() || null,
      customerSuburb: data.customerSuburb.trim() || null,
      customerState: data.customerState.trim() || null,
      projectLabel: data.projectLabel.trim(),
      colourTemp: data.colourTemp,
      channelType: data.channelType,
    })
    .where(eq(quotesTable.id, quoteId));
}

export async function deleteQuote(quoteId: number): Promise<void> {
  const [quote] = await db
    .select({ id: quotesTable.id, status: quotesTable.status })
    .from(quotesTable)
    .where(eq(quotesTable.id, quoteId));
  if (!quote) throw new Error("Quote not found.");
  if (quote.status !== "draft") {
    throw new Error(
      "Only draft quotes can be deleted. Mark it declined or expired instead."
    );
  }
  await db.delete(quotesTable).where(eq(quotesTable.id, quoteId));
  redirect("/admin");
}

export async function saveQuoteEdits(
  quoteId: number,
  items: {
    id?: number;
    partNumber: string;
    description: string;
    qty: string;
    unit: string;
    isGenerated: boolean;
    sortOrder: number;
  }[],
  systemPrice: string,
  notes: string,
  warrantyLine: string
): Promise<void> {
  await db.transaction(async (tx) => {
    await tx
      .delete(lineItemsTable)
      .where(eq(lineItemsTable.quoteId, quoteId));

    if (items.length > 0) {
      await tx.insert(lineItemsTable).values(
        items.map((item, i) => ({
          quoteId,
          partNumber: item.partNumber,
          description: item.description,
          qty: item.qty,
          unit: item.unit,
          isGenerated: item.isGenerated,
          sortOrder: i,
        }))
      );
    }

    await tx
      .update(quotesTable)
      .set({
        systemPrice: systemPrice.trim() ? systemPrice.trim() : null,
        notes: notes.trim() ? notes.trim() : null,
        warrantyLine: warrantyLine.trim()
          ? warrantyLine.trim()
          : "System warranty: 2 years (submerged application)",
      })
      .where(eq(quotesTable.id, quoteId));
  });
}
