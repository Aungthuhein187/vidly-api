const request = require("supertest");
const { User } = require("../../../models/user");
const { Genre } = require("../../../models/genre");

describe("Auth middleware", () => {
  let server;
  let token;

  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  beforeEach(() => {
    server = require("../../../index");
    token = new User().generateAuthToken();
  });

  afterEach(async () => {
    await Genre.remove({});
    await server.close();
  });

  it("should return 401 if no token is provided", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if invalid token is provided", async () => {
    token = "123";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 201 if valid token is provided", async () => {
    const res = await exec();

    expect(res.status).toBe(201);
  });
});
