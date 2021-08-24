const auth = require("../../../middlewares/auth");
const mongoose = require("mongoose");
const { User } = require("../../../models/user");

describe("Auth middleware", () => {
  it("should return req.user if valid token is provided", () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new User(user).generateAuthToken();

    const req = { header: jest.fn().mockReturnValue(token) };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);
    expect(req.user).toMatchObject(user);
  });
});
