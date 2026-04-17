import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;

function getDb() {
  if (prisma) {
    return prisma;
  }

  const connectionString =
    process.env.DATABASE_URL ?? process.env.POSTGRES_PRISMA_URL ?? process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL, POSTGRES_PRISMA_URL, or POSTGRES_URL is not set.");
  }

  const adapter = new PrismaPg({ connectionString });

  prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

  return prisma;
}

export const db = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});
