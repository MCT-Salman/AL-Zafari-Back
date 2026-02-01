/*import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
*/
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['warn', 'error'],
  });

process.on('beforeExit', async () => {
  logger.info('process beforeExit — reconnecting Prisma...');
  try {
    await prisma.$connect();
  } catch (err) {
    logger.error('Error reconnecting Prisma', { message: err?.message, stack: err?.stack });
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
