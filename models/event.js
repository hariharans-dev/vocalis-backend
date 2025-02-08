"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      event.belongsTo(models.root, {
        foreignKey: "root_id",
        targetKey: "id",
      });
      event.belongsTo(models.event_detail, {
        foreignKey: "event_detail_id",
        targetKey: "id",
      });
    }
  }
  event.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4(),
        primaryKey: true,
      },
      root_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "root",
          key: "id",
        },
      },
      event_detail_id: {
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
        references: {
          model: "event_detail",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "event",
      tableName: "event",
      timestamps: true,
    }
  );
  return event;
};
