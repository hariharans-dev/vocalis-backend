"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("role", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      role_list_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      event_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });
    await queryInterface.addConstraint("role", {
      fields: ["user_id", "event_id", "role_list_id"],
      type: "unique",
      name: "unique_role",
    });
    s;
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("role", "unique_role");
    await queryInterface.dropTable("role");
  },
};
