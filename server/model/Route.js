const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
  from: { type: [Number], required: true },
  to: { type: [Number], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group"},

});

const Route = mongoose.model("Route", RouteSchema);
module.exports = Route;
