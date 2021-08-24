const { Genre } = require("../../../models/genre");
const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../../models/user");

describe("/api/genres", () => {
  let server;
  beforeEach(() => {
    server = require("../../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((genre) => genre.name === "genre1")).toBeTruthy();
      expect(res.body.some((genre) => genre.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = await new Genre({ name: "genre1" }).save();

      const res = await request(server).get("/api/genres/" + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/genres/1");

      expect(res.status).toBe(404);
    });

    it("should return 404 if genre is not found", async () => {
      const res = await request(server).get(
        "/api/genres/" + new mongoose.Types.ObjectId()
      );

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("return 400 if invalid token is provided", async () => {
      token = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("return 400 if genre is less than 5 characters", async () => {
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("return 400 if genre is more than 255 characters", async () => {
      name = new Array(257).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      const res = await exec();

      const genre = await Genre.find({ name: "genre1" });

      expect(res.status).toBe(201);
      expect(genre).not.toBeNull();
    });

    it("should save the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
