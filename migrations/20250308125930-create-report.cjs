"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable("report", {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        event_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        user_type: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        report_type: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        general_opinion: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        summary: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        overall_summary: {
          type: Sequelize.JSON,
          allowNull: true,
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

      await queryInterface.addIndex("report", ["event_id"]);
      await queryInterface.addIndex("report", ["user_id"]);
      await queryInterface.addIndex("report", ["report_type"]);
    } catch (error) {
      console.error("Error during 'up' migration:", error);
      throw error;
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.dropTable("report");
    } catch (error) {
      console.error("Error during 'down' migration:", error);
      throw error;
    }
  },
};
