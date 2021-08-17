const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { User, validate } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User is already created.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  user.save();

  res.send(true);
});

module.exports = router;
