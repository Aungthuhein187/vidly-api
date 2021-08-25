const _ = require("lodash");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const validateReturns = require("../validator/returns");
const express = require("express");
const router = express.Router();
const { Movie } = require("../models/movie");
const { Rental } = require("../models/rental");

router.post("/", [auth, validate(validateReturns)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental)
    return res
      .status(404)
      .send("Rental with given customerId and movieId not found.");

  if (rental.dateReturned)
    return res.status(404).send("Genre with the given id is already returned.");

  rental.return();

  await rental.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );

  return res.status(201).send();
});

module.exports = router;
