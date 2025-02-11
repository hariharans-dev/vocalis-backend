import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config({ path: ".env.development" });

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

export default sequelize;
