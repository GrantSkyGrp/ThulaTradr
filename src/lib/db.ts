import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const adapter = new PrismaPg({ connectionString });

export const db = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});
