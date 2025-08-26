import fs from "fs";
import path from "path";
import { publishMessage } from "../db/redis_connection.js";
import converter from "webm-to-wav-converter";
const { webmToWav } = converter;

async function voice_text(survey_id, file) {
  const audioFilePath = path.join("uploads", file);
  const wavFilePath = path.join("uploads", `${survey_id}.wav`);

  try {
    // ✅ Read webm buffer
    const webmBuffer = fs.readFileSync(audioFilePath);

    // ✅ Convert to wav buffer
    const wavBuffer = await webmToWav(webmBuffer);

    // ✅ Save wav to temp
    fs.writeFileSync(wavFilePath, Buffer.from(wavBuffer));

    // ✅ Encode to base64
    const encodedAudio = Buffer.from(wavBuffer).toString("base64");

    const audioMessage = {
      id: survey_id,
      audio_data: encodedAudio,
      file_format: "wav",
    };

    await publishMessage("voice-text", audioMessage);

    // Cleanup
    fs.unlinkSync(audioFilePath); // delete webm
    fs.unlinkSync(wavFilePath); // delete wav
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
