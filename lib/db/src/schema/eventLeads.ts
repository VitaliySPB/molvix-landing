import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const eventLeadsTable = pgTable("event_leads", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  eventType: text("event_type"),
  participants: text("participants"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type EventLead = typeof eventLeadsTable.$inferSelect;
