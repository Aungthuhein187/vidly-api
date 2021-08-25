const Joi = require("joi");

module.exports = (movie) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required().label("Name"),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number()
      .min(0)
      .max(255)
      .required()
      .label("NumberInStock"),
    dailyRentalRate: Joi.number()
      .min(0)
      .max(255)
      .required()
      .label("DailyRentalRate"),
  });

  return schema.validate(movie);
};
