import Root from "./Root.js";
import Root_credential from "./Root_credential.js";
import Event from "../Event/Event.js";
import Subscription from "../Subscription/Subscription.js";

Root.hasOne(Root_credential, {
  foreignKey: "root_id",
  as: "root_credential",
  target: "id",
  onDelete: "CASCADE",
  hooks: true,
});

Root.hasMany(Subscription, {
  foreignKey: "root_id",
  target: "id",
  onDelete: "CASCADE",
  hooks: true,
});

Root.hasOne(Event, {
  foreignKey: "root_id",
  target: "id",
  onDelete: "CASCADE",
  hooks: true,
});
