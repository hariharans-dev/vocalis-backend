import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import rootRouter from "./routes/root.js";
import userRouter from "./routes/user.js";
import authRouter from "./routes/authentication.js";

dotenv.config({ path: ".env.development" });
const app = express();
app.use(express.json());
app.use(cors());

app.use("/root", rootRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.get("/test", async (req, res) => {
  const response = {
    status: 200,
    data: "api is active",
  };
  res.send(response);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
