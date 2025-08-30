import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/db_connection.js";
import { v4 as uuidv4 } from "uuid";
import randomThreeWords from "../../utility/random.js"; // import the function

class Subscription extends Model {}

Subscription.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    remaining_request: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    subscription_plan_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    root_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    unique_code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Subscription",
    tableName: "subscription",
    timestamps: true,
  }
);

Subscription.beforeValidate(async (subscription, options) => {
  if (!subscription.unique_code) {
    let code;
    let exists = true;

    while (exists) {
      code = randomThreeWords();
      const found = await Subscription.findOne({
        where: { unique_code: code },
      });
      if (!found) exists = false;
    }

    subscription.unique_code = code;
  }
});

export default Subscription;
