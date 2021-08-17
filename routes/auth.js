const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email address.");

  const result = await bcrypt.compare(req.body.password, user.password);
  if (!result) return res.status(400).send("Invalid password.");

  res.send(true);
});

const validate = (req) => {
  const schema = Joi.object({
    email: Joi.string().max(255).email().required().label("Email"),
    password: Joi.string().min(5).max(255).required().label("Password"),
  });

  return schema.validate(req);
};

module.exports = router;
