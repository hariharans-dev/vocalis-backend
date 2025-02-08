require("dotenv").config();
const express = require("express");
const cors = require("cors");

const sequelize = require("./db/db_connection");
const Sequelize = require("sequelize");
(async function () {
  await sequelize.sync();
})();
const { root, event } = require("./models");
// const db = new Root();
const app = express();
app.use(express.json());
app.use(cors());

// (async () => {
//   try {
//     await sequelize.sync(); // ✅ Use `await` to ensure proper execution
//     console.log("Database synced successfully!");
//   } catch (error) {
//     console.error("Error syncing database:", error);
//   }
// })();

// const authRoutes = require("./routes/authentication-router");

const port = process.env.PORT || 5000;

app.get("/test", async (req, res) => {
  console.log(await root.findAll());
  const response = {
    status: 200,
    data: "api is active",
  };
  res.send(response);
});

// app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
