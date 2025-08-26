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
    general_opinion: { type: DataTypes.STRING, allowNull: true },
    total_feedbacks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    positive_feedbacks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    negative_feedbacks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    positive_summary: { type: DataTypes.STRING, allowNull: true },
    negative_summary: { type: DataTypes.STRING, allowNull: true },
    overall_summary: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "Report",
    tableName: "report",
    timestamps: true,
  }
);

export default Report;
