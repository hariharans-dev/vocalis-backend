import User from "./User.js";
import User_credential from "./User_credential.js";

User.hasOne(User_credential, {
  foreignKey: "user_id",
  as: "user_credential",
  onDelete: "CASCADE",
});

export { User, User_credential };
