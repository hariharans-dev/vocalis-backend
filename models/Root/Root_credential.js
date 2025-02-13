import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/db_connection.js";
import { v4 as uuidv4 } from "uuid";

class Root_credential extends Model {}

Root_credential.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // root_id: {
    //   type: DataTypes.UUID,
    //   unique: true,
    //   allowNull: false,
    // },
  },
  {
    sequelize,
    modelName: "Root_credential",
    tableName: "root_credential",
    timestamps: true,
  }
);

export default Root_credential;
