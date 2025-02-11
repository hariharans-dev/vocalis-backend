import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/db_connection.js";
import { v4 as uuidv4 } from "uuid";

class Subscription_plan extends Model {}

Subscription_plan.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    request: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Subscription_plan",
    tableName: "subscription_plan",
    timestamps: true,
  }
);

export default Subscription_plan;
