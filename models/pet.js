const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const PetSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  species: { type: String, required: true, maxLength: 100 },
  description: { type: String, maxLength: 200 },
  weight: { type: Number },
  sex: { type: String, enum: ["macho", "fêmea"], default: null },
  date_of_birth: { type: Date },
  tutor: { type: Schema.Types.ObjectId, ref: "Tutor" },
});

PetSchema.virtual("age").get(function () {
  if (this.date_of_birth) {
    const currentDate = new Date();
    const birthDate = new Date(this.date_of_birth);

    const birthdayOccured =
      currentDate.getMonth() > birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() >= birthDate.getDate());

    return birthdayOccured
      ? currentDate.getFullYear() - birthDate.getFullYear()
      : currentDate.getFullYear() - birthDate.getFullYear() - 1;
  } else return undefined;
});

PetSchema.virtual("url").get(function () {
  return `/registry/pet/${this._id}`;
});

PetSchema.virtual("date_of_birth_formatted").get(function () {
  return this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toFormat("dd/MM/yyyy")
    : "";
});

module.exports = mongoose.model("Pet", PetSchema);
