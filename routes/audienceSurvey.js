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
audienceRouter.post(
  "/endpoint/get",
  authMiddleware,
  audiencecontroller.getEndpoint
);
audienceRouter.post("/data", audiencecontroller.registerData);
audienceRouter.post("/data/get", authMiddleware, audiencecontroller.getData);
audienceRouter.post("/report", authMiddleware, audiencecontroller.createReport);
audienceRouter.post("/report/get", authMiddleware, audiencecontroller.getReport);

export default audienceRouter;
