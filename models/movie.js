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

exports.Movie = Movie;
