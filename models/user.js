const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
});

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required().label("Name"),
    email: Joi.string().max(255).email().required().label("Email"),
    password: Joi.string().min(5).max(255).required().label("Password"),
  });

  return schema.validate(user);
};

exports.User = User;
exports.validate = validateUser;
