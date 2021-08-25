const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

const validateGenre = (genre) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required().label("Name"),
  });
  return schema.validate(genre);
};

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validateGenre = validateGenre;
