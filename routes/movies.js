const express = require("express");
const router = express.Router();
const _ = require("lodash");
const admin = require("../middlewares/admin");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const validateMovie = require("../validator/movie");
const validateObjectId = require("../middlewares/validateObjectId");
const { Movie } = require("../models/movie");
const { Genre } = require("../models/genre");

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");

  res.send(movies);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send("Movie with given id is not found.");

  res.send(movie);
});

router.post("/", [auth, validate(validateMovie)], async (req, res) => {
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  let movie = _.pick(req.body, ["title", "numberInStock", "dailyRentalRate"]);

  movie = new Movie({
    ...movie,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
  });
  await movie.save();

  res.send(movie);
});

router.put(
  "/:id",
  [auth, validateObjectId, validate(validateMovie)],
  async (req, res) => {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!movie)
      return res.status(404).send("Movie with given id is not found.");

    res.send(movie);
  }
);

router.delete("/:id", [auth, validateObjectId, admin], async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).send("Movie with given id is not found.");

  res.send(movie);
});

module.exports = router;
