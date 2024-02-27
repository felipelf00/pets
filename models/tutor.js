const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TutorSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  phone: { type: String, required: true, maxLength: 16 },
  email: { type: String, required: true, maxLength: 100 },
  address: { type: String, required: true, maxLength: 100 },
});

TutorSchema.virtual("url").get(function () {
  return `/registry/tutor/${this._id}`;
});

module.exports = mongoose.model("Tutor", TutorSchema);
