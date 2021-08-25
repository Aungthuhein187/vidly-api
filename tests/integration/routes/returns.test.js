// Return 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 404 if no rental found
// Return 400 if rental is already processed
// Return 201 if returns is successful
// Set the return date
// Calculate the rentalfee
// Increase the numberInStock of movie
// Return the rental

const moment = require("moment");
const mongoose = require("mongoose");
const request = require("supertest");
const { Movie } = require("../../../models/movie");
const { Rental } = require("../../../models/rental");
const { User } = require("../../../models/user");

describe("/api/returns", () => {
  let server;
  let movie;
  let rental;
  let token;
  let customerId;
  let movieId;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../../index");
    token = new User().generateAuthToken();

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    movie = new Movie({
      _id: movieId,
      title: "title",
      genre: {
        name: "genre1",
      },
      numberInStock: 10,
      dailyRentalRate: 5,
    });

    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "Aung Thu Hein",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "title",
        dailyRentalRate: 5,
      },
    });

    await rental.save();
  });

  afterEach(async () => {
    await Movie.remove({});
    await Rental.remove({});
    await server.close();
  });

  it("should return 401 if client is not logged in", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    customerId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if movieId is not provided", async () => {
    movieId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental found for this customer/movie", async () => {
    await Rental.remove({});

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("should return 400 if the rental is already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("return 201 if the return is successful", async () => {
    const res = await exec();

    expect(res.status).toBe(201);
  });

  it("should set returnDate if input is valid", async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(new Date() - rentalInDb.dateReturned).toBeLessThan(10 * 1000);
  });

  it("calculate rental fee if input is valid", async () => {
    rental.dateOut = moment().subtract(7, "days").toDate();
    await rental.save();

    await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(rentalInDb.rentalFee).toBe(35);
  });

  it("should increase the number in stock of movie", async () => {
    await exec();

    const movieInDb = await Movie.findById(movieId);

    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });
});
