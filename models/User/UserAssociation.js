import Role from "../Role/Role.js";
import User from "./User.js";
import User_credential from "./User_credential.js";

User.hasOne(User_credential, {
  foreignKey: "user_id",
  as: "user_credential",
  onDelete: "CASCADE",
});

User_credential.belongsTo(User, { foreignKey: "user_id" });

User.hasOne(Role, { foreignKey: "user_id", as: "role", onDelete: "CASCADE" });
