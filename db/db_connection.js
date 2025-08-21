import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config({ path: ".env.development" });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // only for dev/self-signed certs
      },
    },
    logging: false,
  }
);

export default sequelize;
