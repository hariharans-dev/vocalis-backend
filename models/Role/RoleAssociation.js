import Role from "./Role.js";
import Role_list from "./Role_list.js";
import Event from "../Event/Event.js";
import User from "../User/User.js";

Role_list.hasOne(Role, { foreignKey: "role_list_id", as: "role" });
Role.belongsTo(Role_list, { foreignKey: "role_list_id", as: "role_list" });

Event.hasOne(Role, { foreignKey: "event_id", as: "role" });
Role.belongsTo(Event, { foreignKey: "event_id", as: "event" });

Role.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "CASCADE",
});
