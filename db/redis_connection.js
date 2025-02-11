import { createClient } from "redis";

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on("error", (err) => {
  console.error("Error:", err);
});

await client.connect();

async function setKey(key, value, expiration) {
  try {
    return await client.set(key, value, { EX: expiration, NX: true });
  } catch (err) {
    console.error("Error setting key:", err);
  }
}

async function getKey(key) {
  try {
    return await client.get(key);
  } catch (err) {
    console.error("Error getting key:", err);
  }
}

async function deleteKey(key) {
  try {
    return client.del(key);
  } catch (error) {
    console.error("Error getting key:", err);
  }
}
export { setKey, getKey, deleteKey, client };
