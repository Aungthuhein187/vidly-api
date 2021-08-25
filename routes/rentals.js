const express = require("express");
const router = express.Router();
const _ = require("lodash");
const admin = require("../middlewares/admin");
const auth = require("../middlewares/auth");
const Fawn = require("fawn");
const validate = require("../middlewares/validate");
const validateRentals = require("../validator/rental");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");

  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental)
    return res.status(404).send("Rental with given id is not found.");

  res.send(rental);
});

router.post("/", [auth, validate(validateRentals)], async (req, res) => {
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie is out of stock.");

  const rental = new Rental({
    customer: _.pick(customer, ["_id", "name", "isGold", "phone"]),
    movie: _.pick(movie, ["_id", "title", "dailyRentalRate"]),
  });

  Fawn.Task()
    .save("rentals", rental)
    .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
    .run();

  res.send(rental);
});

router.put("/:id", [auth, validate(validateRentals)], async (req, res) => {
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie");

  const rental = await Rental.findByIdAndUpdate(req.params.id, {
    $set: {
      customer: _.pick(customer, ["_id", "name", "isGold", "phone"]),
      movie: _.pick(movie, ["_id", "title", "dailyRentalRate"]),
    },
  });

  res.send(rental);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const rental = await Rental.findByIdAndDelete(req.params.id);
  if (!rental)
    return res.status(404).send("Rental with given id is already deleted.");

  res.send(rental);
});

module.exports = router;
