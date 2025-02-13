import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/db_connection.js";
import { v4 as uuidv4 } from "uuid";

class Event_detail extends Model {}

Event_detail.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    event_id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "Event_detail",
    tableName: "event_detail",
    timestamps: true,
  }
);

export default Event_detail;
