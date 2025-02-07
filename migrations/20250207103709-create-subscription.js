"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("subscription", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      Invoked_requests: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      subscription_plan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "subscription_plan",
          key: "id",
        },
      },
      root_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "root",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW(),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("subscription");
  },
};
