const Joi = require("joi");

module.exports = (rental) => {
  const schema = Joi.object({
    movieId: Joi.objectId().required(),
    customerId: Joi.objectId().required(),
  });

  return schema.validate(rental);
};
