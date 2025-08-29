import express from "express";
import SubscriptionController from "../controller/subscription.js";
import authMiddleware from "../middleware/authentication.js";

const subscriptionRouter = express.Router();
const subscriptioncontroller = new SubscriptionController();

// rootRouter.use(authMiddleware);

subscriptionRouter.post("/", authMiddleware, subscriptioncontroller.register);
subscriptionRouter.post("/get", authMiddleware, subscriptioncontroller.get);
subscriptionRouter.post("/plan/get", subscriptioncontroller.getPlan);
subscriptionRouter.post(
  "/plan",
  authMiddleware,
  subscriptioncontroller.createPlan
);
subscriptionRouter.put(
  "/plan",
  authMiddleware,
  subscriptioncontroller.updatePlan
);
subscriptionRouter.delete(
  "/plan",
  authMiddleware,
  subscriptioncontroller.deletePlan
);

export default subscriptionRouter;
