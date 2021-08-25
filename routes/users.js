const _ = require("lodash");
const auth = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const validate = require("../middlewares/validate");
const validateUser = require("../validator/user");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -__v");
  res.send(user);
});

router.post("/", validate(validateUser), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User is already created.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.save();

  res
    .header("x-auth-token", user.generateAuthToken())
    .send(_.pick(user, ["_id", "name", "email", "isAdmin"]));
});

module.exports = router;
