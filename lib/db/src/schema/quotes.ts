import {
  pgTable,
  pgSequence,
  serial,
  text,
  timestamp,
  numeric,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const quoteNumberSeq = pgSequence("quote_number_seq", {
  startWith: 7,
  increment: 1,
  minValue: 7,
});

export const quoteStatusEnum = pgEnum("quote_status", [
  "draft",
  "sent",
  "accepted",
  "declined",
  "expired",
]);

export const customerTypeEnum = pgEnum("customer_type", [
  "residential",
  "commercial",
]);

export const colourTempEnum = pgEnum("colour_temp", [
  "2700K",
  "3000K",
  "4000K",
  "5700K",
  "TBC",
]);

export const channelTypeEnum = pgEnum("channel_type", [
  "OR-CHN-RGD",
  "OR-CHN-FLX",
  "OR-CHN-SS",
  "none",
]);

export const quotesTable = pgTable("quotes", {
  id: serial("id").primaryKey(),
  quoteNumber: text("quote_number").notNull().unique(),
  status: quoteStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  sentAt: timestamp("sent_at"),
  validUntil: timestamp("valid_until"),
  customerType: customerTypeEnum("customer_type").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  customerSuburb: text("customer_suburb"),
  customerState: text("customer_state"),
  projectLabel: text("project_label").notNull(),
  colourTemp: colourTempEnum("colour_temp").notNull().default("TBC"),
  channelType: channelTypeEnum("channel_type").notNull().default("none"),
  notes: text("notes"),
  systemPrice: numeric("system_price", { precision: 10, scale: 2 }),
  warrantyLine: text("warranty_line")
    .notNull()
    .default("System warranty: 2 years (submerged application)"),
});

export const zonesTable = pgTable("zones", {
  id: serial("id").primaryKey(),
  quoteId: integer("quote_id")
    .notNull()
    .references(() => quotesTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const runsTable = pgTable("runs", {
  id: serial("id").primaryKey(),
  zoneId: integer("zone_id")
    .notNull()
    .references(() => zonesTable.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  lengthMetres: numeric("length_metres", { precision: 6, scale: 2 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const lineItemsTable = pgTable("line_items", {
  id: serial("id").primaryKey(),
  quoteId: integer("quote_id")
    .notNull()
    .references(() => quotesTable.id, { onDelete: "cascade" }),
  partNumber: text("part_number").notNull(),
  description: text("description").notNull(),
  qty: numeric("qty", { precision: 8, scale: 2 }).notNull(),
  unit: text("unit").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isGenerated: boolean("is_generated").notNull().default(true),
});

export type Quote = typeof quotesTable.$inferSelect;
export type InsertQuote = typeof quotesTable.$inferInsert;
export type Zone = typeof zonesTable.$inferSelect;
export type InsertZone = typeof zonesTable.$inferInsert;
export type Run = typeof runsTable.$inferSelect;
export type InsertRun = typeof runsTable.$inferInsert;
export type LineItem = typeof lineItemsTable.$inferSelect;
export type InsertLineItem = typeof lineItemsTable.$inferInsert;
