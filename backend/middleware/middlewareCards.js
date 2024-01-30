const Joi = require("joi");

exports.middlewareCards = Joi.object({
  title: Joi.string().required(),
  subtitle: Joi.string().required(),
  description: Joi.string().required(),
  phone: Joi.string().required(),
  web: Joi.string().required(),
  image: Joi.object({
    url: Joi.string().required(),
    alt: Joi.string().required(),
  }),
  address: Joi.object({
    state: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
    houseNumber: Joi.number().required(),
    zip: Joi,
  }),
  bizNumber: Joi.number().required(),
  likes: Joi.array().items(Joi.string()),
  user_id: Joi.string(),
});
