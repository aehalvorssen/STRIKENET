import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sightings = pgTable("sightings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  species: text("species").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  quantity: integer("quantity").default(1),
  description: text("description"),
  imageUrl: text("image_url"),
  aiIdentification: text("ai_identification"),
  isVerified: text("is_verified").default("pending"), // pending, confirmed, rejected
  reportedAt: timestamp("reported_at").defaultNow().notNull(),
  userAgent: text("user_agent"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSightingSchema = createInsertSchema(sightings).omit({
  id: true,
  reportedAt: true,
}).extend({
  species: z.enum(["Lionfish", "Walking Catfish", "Mayan Cichlid", "Green Iguana", "Egyptian Goose", "Other"]),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  quantity: z.number().min(1).max(1000).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Sighting = typeof sightings.$inferSelect;
export type InsertSighting = z.infer<typeof insertSightingSchema>;
