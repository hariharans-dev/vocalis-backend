import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import sequelize from "./db/db_connection.js";

import rootRouter from "./routes/root.js";
import userRouter from "./routes/user.js";
import authRouter from "./routes/authentication.js";
import subscriptionRouter from "./routes/subscription.js";
import eventRouter from "./routes/event.js";
import roleRouter from "./routes/role.js";
import audienceRouter from "./routes/audienceSurvey.js";

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
sequelize.sync();
// sequelize.sync({ force: true });

app.use("/root", rootRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/subscription", subscriptionRouter);
app.use("/event", eventRouter);
app.use("/role", roleRouter);
app.use("/customer", audienceRouter);
app.get("/test", async (req, res) => {
  const response = {
    status: 200,
    data: "api is active",
  };
  res.status(200).send(response);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
