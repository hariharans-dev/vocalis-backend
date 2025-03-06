import express from "express";
import CustomerController from "../controller/audienceSurvey.js";
import authMiddleware from "../middleware/authentication.js";

const customerRouter = express.Router();
const customercontroller = new CustomerController();

customerRouter.post(
  "/endpoint",
  authMiddleware,
  customercontroller.registerEndpoint
);
customerRouter.get("/endpoint", authMiddleware, customercontroller.getEndpoint);
customerRouter.post("/data", customercontroller.registerData);

export default customerRouter;
