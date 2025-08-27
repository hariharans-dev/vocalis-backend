import { v4 as uuidv4 } from "uuid";
import Subscription_plan from "../models/Subscription/Subscription_plan.js";
import RoleList from "../models/Role/Role_list.js";
import sequelize from "../db/db_connection.js";

export default async function seedPlans() {
  await sequelize.sync(); // run after all models are imported

  const countSubscriptionPlan = await Subscription_plan.count();
  if (countSubscriptionPlan === 0) {
    await Subscription_plan.bulkCreate([
      {
        id: uuidv4(),
        name: "free-tier",
        request: 20,
        price: 0,
        description: "Basic plan with limited access.",
      },
    ]);
    console.log("✅ Seeded subscription plans");
  } else {
    console.log("ℹ️ Subscription plans already exist");
  }

  const countRoleList = await RoleList.count();
  if (countRoleList === 0) {
    await RoleList.bulkCreate([
      {
        id: uuidv4(),
        name: "admin",
        description: "access to all functions in an event",
      },
      {
        id: uuidv4(),
        name: "reporter",
        description: "access to record voice feedback in an event",
      },
    ]);
    console.log("✅ Seeded subscription plans");
  } else {
    console.log("ℹ️ Subscription plans already exist");
  }
}
