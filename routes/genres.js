const express = require("express");
const router = express.Router();
const _ = require("lodash");
const admin = require("../middlewares/admin");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const validateGenre = require("../validator/genre");
const validateObjectId = require("../middlewares/validateObjectId");
const { Genre } = require("../models/genre");

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");

  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send("Genre with given id is not found.");

  res.send(genre);
});

router.post("/", [auth, validate(validateGenre)], async (req, res) => {
  const genre = new Genre(_.pick(req.body, ["name"]));
  await genre.save();

  res.status(201).send(genre);
});

router.put(
  "/:id",
  [auth, validateObjectId, validate(validateGenre)],
  async (req, res) => {
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { $set: _.pick(req.body, ["name"]) },
      { new: true }
    );
    if (!genre)
      return res.status(404).send("Genre with given id is not found.");

    res.send(genre);
  }
);

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre)
    return res.status(404).send("Genre with given id is already deleted.");

  res.send(genre);
});

module.exports = router;
