import redis from "redis";
import fs from "fs";
import path from "path";

async function publishMessage(queue, data, id, audioData) {
  const client = redis.createClient({
    socket: {
      host: "0.0.0.0",
      port: 6379,
    },
  });

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  await client.rPush(queue, JSON.stringify(data));
  console.log(`Published audio message`);

  await client.quit();
}

async function voice_text(survey_id, file) {
  const audioFilePath = path.join("uploads", file);

  try {
    const audioData = fs.readFileSync(audioFilePath);
    const encodedAudio = audioData.toString("base64");
    const audioMessage = { id: survey_id, audio_data: encodedAudio };
    await publishMessage("voice-text", audioMessage);
    fs.unlinkSync(audioFilePath);
  } catch (error) {
    return error;
  }
}

export { voice_text };
