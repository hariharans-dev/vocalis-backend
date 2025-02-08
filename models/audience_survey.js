"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class audience_survey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      audience_survey.belongsTo(models.audience, {
        foreignKey: "audience_id",
        targetKey: "id",
      });
      audience_survey.belongsTo(models.event, {
        foreignKey: "event_id",
        targetKey: "id",
      });
    }
  }
  audience_survey.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4(),
        primaryKey: true,
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      audience_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "audience",
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
    },
    {
      sequelize,
      modelName: "audience_survey",
      tableName: "audience_survey",
      timestamps: true,
    }
  );
  return audience_survey;
};
