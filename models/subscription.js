"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class subscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      subscription.belongsTo(models.subscription_plan, {
        foreignKey: "subscription_plan_id",
        targetKey: "id",
      });
      subscription.belongsTo(models.root, {
        foreignKey: "root_id",
        targetKey: "id",
      });
    }
  }
  subscription.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
      },
      Invoked_requests: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      subscription_plan_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "subscription_plan",
          key: "id",
        },
      },
      root_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "root",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "subscription",
      tableName: "subscription",
      timestamps: true,
    }
  );
  return subscription;
};
