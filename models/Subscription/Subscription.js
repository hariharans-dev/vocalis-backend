import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/db_connection.js";
import { v4 as uuidv4 } from "uuid";

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
  },
  {
    sequelize,
    modelName: "Subscription",
    tableName: "subscription",
    timestamps: true,
  }
);

export default Subscription;
