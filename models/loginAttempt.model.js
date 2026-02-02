import prisma from "../prisma/client.js";

export const logAttempt = (data) => prisma.loginAttempt.create({ data });

export const getAttemptsByIdentifier = (identifier, limit = 50) =>
  prisma.loginAttempt.findMany({
    where: { identifier },
    orderBy: { created_at: "desc" },
    take: limit,
  });
