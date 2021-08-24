const request = require("supertest");

describe("/", () => {
  let server;

  beforeEach(() => {
    server = require("../../../index");
  });

  afterEach(() => {
    server.close();
  });

  it("GET /", async () => {
    const res = await request(server).get("/").expect(200);

    expect(res.text).toContain("Hello World");
  });
});
