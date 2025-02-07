"use strict";
const { Model, UUIDV4 } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class root_credential extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      root_credential.belongsTo(models.root, {
        foreignKey: "root_id",
        targetKey: "id",
      });
    }
  }
  root_credential.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: ture,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      root_id: {
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
        references: {
          model: "root",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "root_credential",
      tableName: "root_credential",
      timestamps: true,
    }
  );
  return root_credential;
};
