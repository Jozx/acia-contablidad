import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: ['error', 'warn'], // Solo muestra errores y advertencias, no queries
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
