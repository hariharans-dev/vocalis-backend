import Root from "./Root.js";
import Root_credential from "./Root_credential.js";
import Event from "../Event/Event.js";
import Subscription from "../Subscription/Subscription.js";

Root.hasOne(Root_credential, {
  foreignKey: "root_id",
  as: "root_credential",
  onDelete: "CASCADE",
  hooks: true,
  constraints: false,
});

Root_credential.belongsTo(Root, {
  foreignKey: "root_id",
  as: "root_credential",
  onDelete: "CASCADE",
  hooks: true,
  constraints: false,
});

Root.hasMany(Subscription, {
  foreignKey: "root_id",
  onDelete: "CASCADE",
  hooks: true,
  constraints: false,
});

Subscription.belongsTo(Root, {
  foreignKey: "root_id",
  onDelete: "CASCADE",
  hooks: true,
  constraints: false,
});

Root.hasMany(Event, {
  foreignKey: "root_id",
  onDelete: "CASCADE",
  hooks: true,
  constraints: false,
});

Event.belongsTo(Root, {
  foreignKey: "root_id",
  onDelete: "CASCADE",
  hooks: true,
  constraints: false,
});

// export { Root, Root_credential };
