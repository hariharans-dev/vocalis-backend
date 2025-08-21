import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config({ path: ".env.development" });

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (error) => {
  console.log("redis_connection.js error1: ", error);
});

(async () => {
  await client.connect();
})();

async function setKey(key, value, expiration) {
  return await client.set(key, value, { EX: expiration, NX: true });
}

async function getKey(key) {
  return await client.get(key);
}

async function deleteKey(key) {
  return client.del(key);
}

async function publishMessage(queue, data) {
  await client.rPush(queue, JSON.stringify(data));
  console.log(`Published message`);
}

export { setKey, getKey, deleteKey, client, publishMessage };
