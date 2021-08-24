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
    await Genre.remove({});
    await server.close();
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

    const exec = () => {
      return request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if invalid token is provided", async () => {
      token = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 255 characters", async () => {
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

  describe("PUT /:id", () => {
    let token;
    let genreId;
    let name;

    const exec = () => {
      return request(server)
        .put("/api/genres/" + genreId)
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(async () => {
      token = new User().generateAuthToken();

      const genre = await new Genre({ name: "genre1" }).save();
      genreId = genre._id.toHexString();

      name = "genre2";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if invalid token is provided", async () => {
      token = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 255 characters", async () => {
      name = new Array(257).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if the genreId is invalid", async () => {
      genreId = "1";

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if the given genreId is not found", async () => {
      genreId = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return the genre if the genre is updated", async () => {
      const res = await exec();

      expect(res.body).toMatchObject({ _id: genreId, name });
    });
  });

  describe("DELETE /:id", () => {
    let token;
    let genreId;

    const exec = () => {
      return request(server)
        .delete("/api/genres/" + genreId)
        .set("x-auth-token", token);
    };

    beforeEach(async () => {
      token = new User({
        name: "Aung Thu Hein",
        email: "aung@gmail.com",
        password: "123456",
        isAdmin: true,
      }).generateAuthToken();

      const genre = await new Genre({ name: "genre1" }).save();
      genreId = genre._id.toHexString();
    });

    afterEach(async () => {
      await Genre.remove({});
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if invalid token is provided", async () => {
      token = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 403 if client is not admin", async () => {
      token = new User().generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it("should return 404 if genreId is invalid", async () => {
      genreId = "1";

      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if the genre is not found", async () => {
      genreId = new mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return the genre if the genre is deleted.", async () => {
      const res = await exec();

      expect(res.body).toMatchObject({
        _id: genreId,
        name: "genre1",
      });
    });
  });
});
