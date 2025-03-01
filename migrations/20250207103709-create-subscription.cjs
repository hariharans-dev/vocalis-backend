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
      invoked_request: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      subscription_plan_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      root_id: {
        type: Sequelize.UUID,
        allowNull: false,
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
  async down(queryInterface) {
    await queryInterface.dropTable("subscription");
  },
};
