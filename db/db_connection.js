require("dotenv").config();

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: process.env.DB,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  define: {
    freezeTableName: true,
  },
});

module.exports = sequelize;
