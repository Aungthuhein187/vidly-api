const config = require("config");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { User } = require("../../../models/user");

describe("user.generateAuthToken()", () => {
  it("should return valid jwt token", () => {
    const payload = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new User(payload).generateAuthToken();

    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

    expect(decoded).toMatchObject(payload);
  });
});
