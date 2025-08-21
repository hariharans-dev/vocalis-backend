import express from "express";
import SubscriptionController from "../controller/subscription.js";
import authMiddleware from "../middleware/authentication.js";
import adminMiddleware from "../middleware/admin.js";

const subscriptionRouter = express.Router();
const subscriptioncontroller = new SubscriptionController();

// rootRouter.use(authMiddleware);

subscriptionRouter.post("/", authMiddleware, subscriptioncontroller.register);
subscriptionRouter.post("/get", authMiddleware, subscriptioncontroller.get);
subscriptionRouter.post("/plan/get", subscriptioncontroller.getPlan);
subscriptionRouter.post(
  "/plan",
  adminMiddleware,
  subscriptioncontroller.createPlan
);

export default subscriptionRouter;
