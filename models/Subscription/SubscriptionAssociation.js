import Subscription from "./Subscription.js";
import Subscription_plan from "./Subscription_plan.js";
import Root from "../Root/Root.js";

Subscription.hasOne(Subscription_plan, {
  foreignKey: "subscription_plan_id",
  as: "subscription_plan",
});

export { Subscription, Subscription_plan };
