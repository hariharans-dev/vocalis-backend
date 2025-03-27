import redis from "redis";
import fs from "fs";
import path from "path";

async function publishMessage(queue, data) {
  const client = redis.createClient({
    socket: {
      host: "0.0.0.0",
      port: 6379,
    },
  });

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  await client.rPush(queue, JSON.stringify(data));
  console.log(`Published message`);

  await client.quit();
}

async function voice_text(survey_id, file) {
  const audioFilePath = path.join("uploads", file);
  const fileExtension = path.extname(file).toLowerCase();

  try {
    const audioData = fs.readFileSync(audioFilePath);
    const encodedAudio = audioData.toString("base64");
    const audioMessage = {
      id: survey_id,
      audio_data: encodedAudio,
      file_format: fileExtension.replace(".", ""), // Remove the dot from the extension
    };
    await publishMessage("voice-text", audioMessage);

    fs.unlinkSync(audioFilePath);
  } catch (error) {
    console.error("Error in voice_text:", error);
    return error;
  }
}

async function text_insight(data) {
  console.log(data);
  await publishMessage("text-insight", data);
}

export { voice_text, text_insight };
