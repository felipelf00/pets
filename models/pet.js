const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PetSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  species: { type: String, required: true, maxLength: 100 },
  description: { type: String, maxLength: 200 },
  weight: { type: Number },
  sex: { type: String, enum: ["macho", "fêmea"] },
  date_of_birth: { type: Date },
  tutor: { type: Schema.Types.ObjectId },
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

module.exports = mongoose.model("Pet", PetSchema);
