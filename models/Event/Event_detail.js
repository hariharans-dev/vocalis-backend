import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/db_connection.js";
import { v4 as uuidv4 } from "uuid";

class Event_details extends Model {}

Event_details.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Event_detail",
    tableName: "event_detail",
    timestamps: true,
  }
);

export default Event_details;
