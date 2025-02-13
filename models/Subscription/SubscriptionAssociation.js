import Subscription from "./Subscription.js";
import Subscription_plan from "./Subscription_plan.js";

Subscription_plan.hasOne(Subscription, {
  foreignKey: "subscription_plan_id",
  as: "subscription_plan",
});

Subscription.belongsTo(Subscription_plan, {
  foreignKey: "subscription_plan_id",
  as: "subscription_plan",
});
