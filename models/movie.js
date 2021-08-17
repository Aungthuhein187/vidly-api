const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      maxlength: 255,
      minlength: 5,
      required: true,
      trim: true,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      min: 0,
      max: 255,
      required: true,
    },
    dailyRentalRate: {
      type: Number,
      min: 0,
      max: 255,
      required: true,
    },
  })
);

const validateMovie = (movie) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required().label("Name"),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number()
      .min(0)
      .max(255)
      .required()
      .label("NumberInStock"),
    dailyRentalRate: Joi.number()
      .min(0)
      .max(255)
      .required()
      .label("DailyRentalRate"),
  });

  return schema.validate(movie);
};

exports.Movie = Movie;
exports.validate = validateMovie;
