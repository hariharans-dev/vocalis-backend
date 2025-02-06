const redis = require("redis");
const fs = require("fs");

const client = redis.createClient({
    socket: {
        host: "127.0.0.1",  
        port: 4000, 
    },
});

client.on("error", (err) => console.log("Redis Client Error", err));

async function publishMessage(id, audioFilePath) {
  try {
    const audioData = fs.readFileSync(audioFilePath);
    const base64Audio = audioData.toString("base64");
    const message = { id: id, audio_data: base64Audio };
    const jsonMessage = JSON.stringify(message);

    await client.connect(); 
    await client.rPush("voice-text", jsonMessage);  // Correct Redis command
    console.log("Published audio message");
  } catch (err) {
    console.error("Error publishing message:", err);
  } finally {
    await client.disconnect(); 
  }
}

// Example usage
const id = 1;
const audioFilePath = "Recording.mp3"; 

publishMessage(id, audioFilePath)
  .catch((err) => {
    console.error("Error:", err);
  });
