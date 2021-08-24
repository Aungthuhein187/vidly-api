// Return 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 404 if no rental found
// Return 400 if rental is already processed
// Return 200 if returns is successful
// Set the return date
// Calculate the rentalfee
// Increase the numberInStock of movie
// Return the rental
const { when } = require("joi");
const mongoose = require("mongoose");
const request = require("supertest");
const { Rental } = require("../../../models/rental");
const { User } = require("../../../models/user");

describe("/api/returns", () => {
  let server;
  let rental;
  let token;
  let customerId;
  let movieId;

  const exec = async () => {
    return await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../../index");
    token = new User().generateAuthToken();

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

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
});
