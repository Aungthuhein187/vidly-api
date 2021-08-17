const mongoose = require("mongoose");
const Joi = require("joi");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    isGold: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
  })
);

const validateCustomer = (customer) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required().label("Name"),
    isGold: Joi.boolean(),
    phone: Joi.string().min(5).max(255).required().label("Phone"),
  });

  return customerSchema.validate(customer);
};

exports.Customer = Customer;
exports.validate = validateCustomer;
