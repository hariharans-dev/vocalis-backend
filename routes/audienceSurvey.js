import express from "express";
import CustomerController from "../controller/audienceSurvey.js";
import authMiddleware from "../middleware/authentication.js";

const audienceRouter = express.Router();
const audiencecontroller = new CustomerController();

audienceRouter.post(
  "/endpoint",
  authMiddleware,
  audiencecontroller.registerEndpoint
);
audienceRouter.get("/endpoint", authMiddleware, audiencecontroller.getEndpoint);
audienceRouter.post("/data", audiencecontroller.registerData);
audienceRouter.get("/data", authMiddleware, audiencecontroller.getData);
audienceRouter.post("/report", authMiddleware, audiencecontroller.createReport);
export default audienceRouter;
