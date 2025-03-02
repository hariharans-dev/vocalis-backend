import { createClient } from "redis";

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
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
export { setKey, getKey, deleteKey, client };
