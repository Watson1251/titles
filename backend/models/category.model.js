const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const categorySchema = mongoose.Schema({
  index: { type: Number, required: true, unique: true },
  categoryAr: { type: String, required: true, unique: true },
  categoryEn: { type: String, },
  totalTitles: { type: Number, required: true },
});

categorySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Category", categorySchema);