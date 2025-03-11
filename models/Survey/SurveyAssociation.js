import Audience from "./Audience.js";
import Audience_survey from "./Audience_survey.js";
import Reporter_survey from "./Reporter_survey.js";
import Report from "./Report.js";
import Event from "../Event/Event.js";
import User from "../User/User.js";

Audience.hasOne(Audience_survey, {
  foreignKey: "audience_id",
  as: "audience_survey",
  onDelete: "CASCADE",
});

Audience_survey.belongsTo(Audience, {
  foreignKey: "audience_id",
  as: "audience",
});

Audience.hasOne(Reporter_survey, {
  foreignKey: "audience_id",
  as: "reporter_survey",
  onDelete: "CASCADE",
});

Reporter_survey.belongsTo(Audience, {
  foreignKey: "audience_id",
  as: "audience",
});

Event.hasMany(Audience_survey, {
  foreignKey: "event_id",
  as: "audience_survey",
  onDelete: "CASCADE",
});

Audience_survey.belongsTo(Event, { foreignKey: "event_id", as: "event" });

// Report.hasOne(Event, { foreignKey: "event_id", as: "event" });

// Event.belongsTo(Report, { foreignKey: "event_id", as: "report" });

// Event.hasMany(Reporter_survey, {
//   foreignKey: "event_id",
//   as: "event",
//   target: "id",
// });

// User.hasMany(Reporter_survey, {
//   foreignKey: "user_id",
//   as: "user",
//   target: "id",
// });
