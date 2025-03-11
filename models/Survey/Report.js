import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/db_connection.js";
import { v4 as uuidv4 } from "uuid";

class Report extends Model {}

Report.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    event_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    report_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    general_opinion: { type: DataTypes.JSON },
    summary: { type: DataTypes.JSON },
    overall_summary: { type: DataTypes.JSON },
  },
  {
    sequelize,
    modelName: "Report",
    tableName: "report",
    timestamps: true,
  }
);

export default Report;
