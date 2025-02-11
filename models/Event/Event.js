import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/db_connection.js";
import { v4 as uuidv4 } from "uuid";

class Event extends Model {}

Event.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4(),
      primaryKey: true,
    },
    root_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    event_detail_id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Event",
    tableName: "event",
    timestamps: true,
  }
);

export default Event;
