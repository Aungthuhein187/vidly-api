const _ = require("lodash");
const auth = require("../middlewares/auth");
const moment = require("moment");
const validate = require("../middlewares/validate");
const validateReturns = require("../validator/returns");
const express = require("express");
const router = express.Router();
const { Movie } = require("../models/movie");
const { Rental } = require("../models/rental");

router.post("/", [auth, validate(validateReturns)], async (req, res) => {
  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });

  if (!rental)
    return res
      .status(404)
      .send("Rental with given customerId and movieId not found.");

  if (rental.dateReturned)
    return res.status(404).send("Genre with the given id is already returned.");

  rental.dateReturned = new Date();

  const diff = moment().diff(rental.dateOut, "days");
  rental.rentalFee = rental.movie.dailyRentalRate * diff;

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
