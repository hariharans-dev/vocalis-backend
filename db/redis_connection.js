import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config({ path: ".env.development" });

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (error) => {
  console.error("❌ Redis connection error:", error);
});

let isConnected = false;
async function connectRedis() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
    console.log("✅ Connected to Redis:");
  }
  return client;
}

async function setKey(key, value, expiration) {
  const redis = await connectRedis();
  return redis.set(key, value, { EX: expiration, NX: true });
}

async function getKey(key) {
  const redis = await connectRedis();
  return redis.get(key);
}

async function deleteKey(key) {
  const redis = await connectRedis();
  return redis.del(key);
}
async function publishMessage(channel, data) {
  const redis = await connectRedis();
  await redis.publish(channel, JSON.stringify(data));
}

async function subscribeToChannel(channel, handler) {
  const sub = createClient({ url: process.env.REDIS_URL });
  await sub.connect();

  sub.subscribe(channel, (message) => {
    const data = JSON.parse(message);
    handler(data);
  });
}

export {
  connectRedis,
  setKey,
  getKey,
  deleteKey,
  publishMessage,
  subscribeToChannel,
};
