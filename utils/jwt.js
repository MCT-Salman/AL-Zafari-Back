import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../prisma/client.js";
import { RefreshTokenModel } from "../models/index.js";
import logger from "./logger.js";
import { TOKEN_NOT_CORRECT } from "../validators/messagesResponse.js";

/* ======================================================
   ENV & CONSTANTS
====================================================== */

const {
  JWT_SECRET,
  REFRESH_SECRET,
  PASSWORD_RESET_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  PASSWORD_RESET_EXPIRES_IN,
  NODE_ENV
} = process.env;

if (NODE_ENV === "production") {
  if (!JWT_SECRET || !REFRESH_SECRET || !PASSWORD_RESET_SECRET) {
    logger.error("❌ Missing JWT secrets in production");
    process.exit(1);
  }
}

const JWT_ALGORITHM = "HS256";
const JWT_ISSUER = "automation-api";
const JWT_AUDIENCE = "automation-client";

/* ======================================================
   HELPERS
====================================================== */

const durationToMs = (str) => {
  if (!str) return 0;
  const match = str.trim().match(/^(\d+)\s*([smhdw])$/i);
  if (!match) return 0;

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();

  const map = {
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
    w: 604_800_000
  };

  return value * (map[unit] || 0);
};

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

/* ======================================================
   TOKEN GENERATORS
====================================================== */

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    algorithm: JWT_ALGORITHM,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    algorithm: JWT_ALGORITHM,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE
  });
};

export const generatePasswordResetToken = (payload) => {
  return jwt.sign(
    { ...payload, type: "pwd_reset" },
    PASSWORD_RESET_SECRET,
    {
      expiresIn: PASSWORD_RESET_EXPIRES_IN,
      algorithm: JWT_ALGORITHM,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE
    }
  );
};

/* ======================================================
   TOKEN VERIFIERS
====================================================== */

export const verifyAccessToken = (token) =>
  jwt.verify(token, JWT_SECRET, {
    algorithms: [JWT_ALGORITHM],
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE
  });

export const verifyRefreshToken = (token) =>
  jwt.verify(token, REFRESH_SECRET, {
    algorithms: [JWT_ALGORITHM],
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE
  });

export const verifyPasswordResetToken = (token) => {
  const decoded = jwt.verify(token, PASSWORD_RESET_SECRET);
  if (decoded.type !== "pwd_reset") {
    throw new Error(TOKEN_NOT_CORRECT);
  }
  return decoded;
};

/* ======================================================
   TOKEN PAIR (LOGIN)
====================================================== */

export const generateTokenPair = async (
  userId,
  sessionId,
  role,
  tx = prisma
) => {
  const accessToken = generateAccessToken({
    id: userId,
    sid: sessionId,
    role,
    type: "access"
  });

  const refreshToken = generateRefreshToken({
    id: userId,
    sid: sessionId,
    type: "refresh"
  });

  await tx.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId,
      sessionId,
      expiresAt: new Date(Date.now() + durationToMs(REFRESH_TOKEN_EXPIRES_IN))
    }
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: Math.floor(durationToMs(ACCESS_TOKEN_EXPIRES_IN) / 1000)
  };
};


/* ======================================================
   REFRESH ACCESS TOKEN (ROTATION)
====================================================== */

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new Error(TOKEN_NOT_CORRECT);

  const decoded = verifyRefreshToken(refreshToken);
  if (decoded.type !== "refresh") throw new Error(TOKEN_NOT_CORRECT);

  return prisma.$transaction(async (tx) => {
    const tokenHash = hashToken(refreshToken);

    const stored = await tx.refreshToken.findFirst({
      where: {
        tokenHash,
        isRevoked: false,
        expiresAt: { gt: new Date() }
      },
      include: {
        user: { select: { id: true, role: true, is_active: true } }
      }
    });

    if (!stored || !stored.user.is_active) {
      throw new Error(TOKEN_NOT_CORRECT);
    }

    const session = await tx.session.findFirst({
      where: {
        id: decoded.sid,
        userId: decoded.id,
        revokedAt: null
      }
    });

    if (!session) throw new Error(TOKEN_NOT_CORRECT);

    await tx.refreshToken.updateMany({
      where: {
        sessionId: decoded.sid,
        isRevoked: false
      },
      data: {
        isRevoked: true,
        revokedAt: new Date()
      }
    });

    return generateTokenPair(
      stored.user.id,
      decoded.sid,
      stored.user.role,
      tx
    );
  });
};

/* ======================================================
   REVOKE TOKENS
====================================================== */

export const revokeRefreshToken = async (refreshToken) => {
  try {
    return await RefreshTokenModel.revokeRefreshTokenByHash(
      hashToken(refreshToken)
    );
  } catch (err) {
    logger.error("Revoke refresh token error", err);
    return false;
  }
};

export const revokeAllUserRefreshTokens = async (userId) => {
  try {
    await RefreshTokenModel.revokeAllUserTokens(userId);
    return true;
  } catch (err) {
    logger.error("Revoke all user tokens error", err);
    return false;
  }
};

export const revokeUserRefreshTokensExceptSession = async (userId, sessionId) => {
  try {
    await RefreshTokenModel.revokeUserTokensExceptSession(userId, sessionId);
    return true;
  } catch (err) {
    logger.error("Revoke tokens except session error", err);
    return false;
  }
};

/* ======================================================
   CLEANUP JOB
====================================================== */

export const cleanupExpiredTokens = async () => {
  try {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          {
            isRevoked: true,
            revokedAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
          }
        ]
      }
    });

    if (NODE_ENV !== "production" || result.count > 0) {
      logger.info(`🧹 Cleaned ${result.count} refresh tokens`);
    }

    return result.count;
  } catch (err) {
    logger.error("Cleanup refresh tokens error", err);
    return 0;
  }
};

let cleanupInterval;

export const startCleanupInterval = () => {
  if (cleanupInterval) clearInterval(cleanupInterval);

  cleanupInterval = setInterval(cleanupExpiredTokens, 60 * 60 * 1000);
};

export const stopCleanupInterval = () => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
};
