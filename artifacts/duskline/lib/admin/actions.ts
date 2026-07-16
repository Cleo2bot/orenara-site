"use server";

import { db } from "@workspace/db";
import {
  quotesTable,
  zonesTable,
  runsTable,
  lineItemsTable,
} from "@workspace/db";
import { sql, eq } from "drizzle-orm";
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
