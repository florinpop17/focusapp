import { text, pgTable, timestamp, serial, integer } from "drizzle-orm/pg-core";

const updateAndCreatedAt = {
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
};

export type Role = "USER" | "ADMIN";
export type Plan = "FREE" | "BASIC" | "PREMIUM";

export const users = pgTable("user", {
    id: text("id").primaryKey(),
    role: text("role").$type<Role>().notNull().default("USER"),
    plan: text("plan").$type<Plan>().notNull().default("FREE"),
    email: text("email"),
    ...updateAndCreatedAt,
});

export const userPurchases = pgTable("user_purchases", {
    id: serial("id").primaryKey(),
    userId: text("user_id"),
    stripeCustomerEmail: text("stripe_customer_email").notNull().unique(),
    plan: text("plan").$type<Plan>().notNull(),
    total: integer("total").notNull(),
    ...updateAndCreatedAt,
});

export const timers = pgTable("timers", {
    id: serial("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    startedAt: timestamp("started_at").notNull(),
    stoppedAt: timestamp("stopped_at"),
    duration: integer("duration"),

    ...updateAndCreatedAt,
});