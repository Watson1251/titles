const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const titleSchema = mongoose.Schema({
  index: { type: Number, required: true, unique: true },
  categoryId: { type: String, required: true },
  nameAr: { type: String, required: true },
  nameEn: { type: String, },
  rarity: { type: String, required: true },
  points: { type: Number, required: true },
  outof: { type: Number, required: true },
  descriptionAr: { type: String, },
  descriptionEn: { type: String, },
  notes: { type: String, },
});

titleSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Title", titleSchema);