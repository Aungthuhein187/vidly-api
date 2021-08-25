const Joi = require("joi");

module.exports = (customer) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required().label("Name"),
    isGold: Joi.boolean(),
    phone: Joi.string().min(7).max(255).required().label("Phone"),
  });

  return schema.validate(customer);
};
