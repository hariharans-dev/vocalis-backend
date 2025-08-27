import { v4 as uuidv4 } from "uuid";
import Subscription_plan from "../models/Subscription/Subscription_plan.js";
import sequelize from "../db/db_connection.js";

export default async function seedPlans() {
  await sequelize.sync(); // run after all models are imported

  const count = await Subscription_plan.count();
  if (count === 0) {
    await Subscription_plan.bulkCreate([
      {
        id: uuidv4(),
        name: "free-tier",
        request: 20,
        description: "Basic plan with limited access.",
      },
    ]);
    console.log("✅ Seeded subscription plans");
  } else {
    console.log("ℹ️ Subscription plans already exist");
  }
}
