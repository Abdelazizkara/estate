import { PrismaClient } from '@prisma/client';

// Delay Prisma initialization failures so the API server can still start
// and routes like /api/health can work even if DATABASE_URL is misconfigured.
const url = process.env.DATABASE_URL;

let prismaClient: PrismaClient | null = null;
try {
  prismaClient = new PrismaClient();
} catch {
  prismaClient = null;
}


export const getPrisma = (): PrismaClient | null => {
  if (!url) return null;
  return prismaClient;
};

// Backwards-compat export for older code.
// If DATABASE_URL is missing, this will be null at runtime.
export const prisma: PrismaClient | null = getPrisma();




