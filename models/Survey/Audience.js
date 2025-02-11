import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/db_connection.js";
import { v4 as uuidv4 } from "uuid";

class Audience extends Model {}

Audience.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Audience",
    tableName: "audience",
    timestamps: true,
  }
);

export default Audience;
