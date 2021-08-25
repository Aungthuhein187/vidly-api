const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const validateAuth = require("../validator/auth");
const { User } = require("../models/user");

router.post("/", validate(validateAuth), async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email address.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid password.");

  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
