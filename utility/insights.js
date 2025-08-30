import fs from "fs";
import path from "path";
import { publishMessage } from "../db/redis_connection.js";

async function voice_text(survey_id, file) {
  const audioFilePath = path.join("uploads", file);

  try {
    const audioMessage = {
      id: survey_id,
      audio_data: encodedAudio,
      file_format: "webm",
    };

    await publishMessage("voice-text", audioMessage);

    // Cleanup
    fs.unlinkSync(audioFilePath); // delete webm
  } catch (error) {
    console.error("Error in voice_text:", error);
    return error;
  }
}

async function text_insight(data) {
  await publishMessage("text-insight", data);
}

export { voice_text, text_insight };
