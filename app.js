import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import sequelize from "./db/db_connection.js";
import seedPlans from "./models/seedPlans.js";

import rootRouter from "./routes/root.js";
import userRouter from "./routes/user.js";
import authRouter from "./routes/authentication.js";
import subscriptionRouter from "./routes/subscription.js";
import eventRouter from "./routes/event.js";
import roleRouter from "./routes/role.js";
import audienceRouter from "./routes/audienceSurvey.js";
import reporterRouter from "./routes/reporterSurvey.js";

import "./insights_subscriber.js";
import testRouter from "./routes/test.js";

dotenv.config({ path: ".env.development" });
const app = express();

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use(express.json());
// sequelize.sync();
// sequelize.sync({ force: true });

(async () => {
  try {
    await sequelize.sync(); // force: true will drop all tables ⚠️
    await seedPlans(); // run after sync

    console.log("✅ Database synced and seeded");
  } catch (error) {
    console.error("❌ Error syncing database:", error);
  }
})();

app.use("/root", rootRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/subscription", subscriptionRouter);
app.use("/event", eventRouter);
app.use("/role", roleRouter);
app.use("/audience", audienceRouter);
app.use("/reporter", reporterRouter);
app.use("/test", testRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function requestEndpoint() {
  fetch("http://localhost:" + port + "/test") 
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log("📡 Periodic response:", data);
    })
    .catch((error) => {
      console.error("❌ Error fetching data:", error);
    });
}

requestEndpoint();
setInterval(requestEndpoint, 120000);
