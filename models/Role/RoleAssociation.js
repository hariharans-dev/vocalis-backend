import Role from "./Role.js";
import Role_list from "./Role_list.js";
import Event from "../Event/Event.js";
import User from "../User/User.js";

// Role_list ↔ Role
Role_list.hasMany(Role, { foreignKey: "role_list_id", as: "roles" });
Role.belongsTo(Role_list, { foreignKey: "role_list_id", as: "role_list" });

// Event ↔ Role
Event.hasMany(Role, { foreignKey: "event_id", as: "roles" });
Role.belongsTo(Event, { foreignKey: "event_id", as: "event" });

// User ↔ Role
User.hasMany(Role, { foreignKey: "user_id", as: "roles" });
Role.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "CASCADE",
});
