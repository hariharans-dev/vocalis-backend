import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/db_connection.js";
import { v4 as uuidv4 } from "uuid";

class Audience_survey extends Model {}

Audience_survey.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    audience_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    event_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Audience_survey",
    tableName: "audience_survey",
    timestamps: true,
  }
);

export default Audience_survey;
