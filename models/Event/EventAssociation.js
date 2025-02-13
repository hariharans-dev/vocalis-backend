import Event from "./Event.js";
import Event_detail from "./Event_detail.js";

Event.hasOne(Event_detail, {
  foreignKey: "event_id",
  as: "event_detail",
  onDelete: "CASCADE",
  hooks: true,
});

Event_detail.belongsTo(Event);
