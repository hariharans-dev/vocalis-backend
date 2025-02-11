import jwt from "jsonwebtoken";
import rand from "random-key";

import { setKey, deleteKey } from "../db/redis_connection.js";

const generateAuthToken = async (payload, expireTime) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expireTime,
  });
};

const createJWT = async (id, role) => {
  const redisPayload = { id: id, role: role };
  const redisId = rand.generate(36);
  const expireTime = Number(process.env.EXPIRE_TIME) * 3600 || 86400;

  await setKey(redisId, JSON.stringify(redisPayload), expireTime);

  const jwtPayload = { id: redisId, createdAt: Date.now() };
  const jwt = await generateAuthToken(jwtPayload, expireTime);
  return jwt;
};

const refreshJWT = async (oldredisId, id, role) => {
  const redisPayload = { id: id, role: role };
  const redisId = rand.generate(36);
  const expireTime = Number(process.env.EXPIRE_TIME) * 3600 || 86400;

  await deleteKey(oldredisId);

  await setKey(redisId, JSON.stringify(redisPayload), expireTime);

  const jwtPayload = { id: redisId, createdAt: Date.now() };
  const jwt = await generateAuthToken(jwtPayload, expireTime);

  return jwt;
};

export { createJWT, refreshJWT };
