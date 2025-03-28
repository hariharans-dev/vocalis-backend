import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config({ path: ".env.development" });

const sequelize = new Sequelize({
  dialect: process.env.DB,
  host: "publicdb.cv6sc46iamt4.ap-south-1.rds.amazonaws.com",
  username: "admin",
  password: "your_password",
  database: "vocalis",
  define: {
    freezeTableName: true,
  },
});

console.log(await sequelize.validate());

// DB_HOST=localhost
// DB_PORT=3306
// DB_USERNAME=root
// DB_PASSWORD=your_password
// DB_NAME=vocalis
// DB=mysql
