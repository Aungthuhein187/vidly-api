const config = require("config");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { User } = require("../../../models/user");

describe("user.generateAuthToken()", () => {
  it("should return valid jwt token", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new User(payload).generateAuthToken();

    const result = jwt.verify(token, config.get("jwtPrivateKey"));

    expect(result).toMatchObject(payload);
  });
});
