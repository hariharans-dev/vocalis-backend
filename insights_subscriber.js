import { subscribeToChannel } from "./db/redis_connection.js";
import Sentiment from "sentiment";
import Report from "./models/Survey/Report.js";

const sentiment = new Sentiment();

// analyze feedback with basic ML (sentiment package)
function analyzeFeedback(feedbackList) {
  const results = feedbackList.map((text) => sentiment.analyze(text));

  const positives = results
    .filter((r) => r.score > 0)
    .map((r, i) => feedbackList[i]);
  const negatives = results
    .filter((r) => r.score < 0)
    .map((r, i) => feedbackList[i]);

  const total = feedbackList.length;
  const posCount = positives.length;
  const negCount = negatives.length;

  const generalOpinion =
    posCount > negCount
      ? "Mostly Positive"
      : negCount > posCount
      ? "Mostly Negative"
      : "Mixed";

  return {
    general_opinion: generalOpinion,
    total_feedbacks: total,
    positive_feedbacks: posCount,
    negative_feedbacks: negCount,
    positive_summary: positives.join("; ") || "No clear positive feedback",
    negative_summary: negatives.join("; ") || "No clear negative feedback",
    overall_summary: `Feedback shows ${generalOpinion.toLowerCase()} sentiment.`,
  };
}

subscribeToChannel("text-insight", async (data) => {
  try {
    console.log("📊 Received feedback for analysis:", data);
    const id = data.id;

    const results = analyzeFeedback(data.feedback);

    // update Report row with matching id
    const [updated] = await Report.update(results, {
      where: { id },
    });

    if (updated) {
      console.log(`✅ Report ${id} updated with analysis results`);
    } else {
      console.warn(`⚠️ No Report found with id = ${id}`);
    }
  } catch (err) {
    console.error("❌ Error storing analysis:", err);
  }
});
