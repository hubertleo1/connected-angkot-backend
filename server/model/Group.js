const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  plate_number: {
    type: String,
    // only have a fleet of 4 angkots! Will expand soon! Right now, just randomly assigned
    enum: ["B75604", "D2483AC", "BP2843GF", "B4907D"],
    required: true,
  }
});

const Group = mongoose.model("Group", GroupSchema);
module.exports = Group;
