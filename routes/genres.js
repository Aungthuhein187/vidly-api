const express = require("express");
const router = express.Router();
const _ = require("lodash");
const admin = require("../middlewares/admin");
const auth = require("../middlewares/auth");
const { Genre, validate } = require("../models/genre");

router.get("/", async (req, res, next) => {
  const genres = await Genre.find().sort("name");

  res.send(genres);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send("Genre with given id is not found.");

  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre(_.pick(req.body, ["name"]));
  await genre.save();

  res.send(genre);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { $set: _.pick(req.body, ["name"]) },
    { new: true }
  );
  if (!genre) return res.status(404).send("Genre with given id is not found.");

  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre)
    return res.status(404).send("Genre with given id is already deleted.");

  res.send(genre);
});

module.exports = router;
