"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      role.belongsTo(models.role_list, {
        foreignKey: "role_list_id",
        targetKey: "id",
      });
      role.belongsTo(models.event, {
        foreignKey: "event_id",
        targetKey: "id",
      });
      role.belongsTo(models.user, {
        foreignKey: "user_id",
        targetKey: "id",
      });
    }
  }
  role.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4(),
        primaryKey: true,
      },
      role_list_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "role_list",
          key: "id",
        },
      },
      event_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "event",
          key: "id",
        },
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "role",
      tableName: "role",
      timestamps: true,
    }
  );
  return role;
};
