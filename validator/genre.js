const Joi = require("joi");

module.exports = (genre) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required().label("Name"),
  });
  return schema.validate(genre);
};
