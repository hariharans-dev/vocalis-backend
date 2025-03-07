import express from "express";
import authMiddleware from "../middleware/authentication.js";
import AudienceController from "../controller/audienceSurvey.js";

const audienceRouter = express.Router();
const audiencecontroller = new AudienceController();

audienceRouter.post(
  "/endpoint",
  authMiddleware,
  audiencecontroller.registerEndpoint
);
audienceRouter.get("/endpoint", authMiddleware, audiencecontroller.getEndpoint);
audienceRouter.post("/data", audiencecontroller.registerData);
audienceRouter.get("/data", authMiddleware, audiencecontroller.getData);
audienceRouter.post("/report", authMiddleware, audiencecontroller.createReport);
audienceRouter.get("/report", authMiddleware, audiencecontroller.getReport);
export default audienceRouter;
