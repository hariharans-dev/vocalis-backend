import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({ path: ".env.development" }); // load env vars

console.log("🔍 Environment variables:");
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "*****" : "MISSING");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);

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

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
  } finally {
    await sequelize.close();
    console.log("🔌 Connection closed");
  }
}

testConnection();
