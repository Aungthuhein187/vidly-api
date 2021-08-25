const Joi = require("joi");

module.exports = (req) => {
  const schema = Joi.object({
    email: Joi.string().max(255).email().required().label("Email"),
    password: Joi.string().min(5).max(255).required().label("Password"),
  });

  return schema.validate(req);
};
