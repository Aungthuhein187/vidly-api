const Joi = require("joi");

module.exports = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required().label("Name"),
    email: Joi.string().max(255).email().required().label("Email"),
    password: Joi.string().min(5).max(255).required().label("Password"),
    isAdmin: Joi.boolean(),
  });

  return schema.validate(user);
};
