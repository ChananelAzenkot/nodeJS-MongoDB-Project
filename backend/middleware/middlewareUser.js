const Joi = require("joi");

exports.middlewareUser = Joi.object({
  name: Joi.object({
    first: Joi.string().required(),
    middle: Joi.string().optional(),
    last: Joi.string().required(),
  }),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  password: Joi.string().required(),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.string().required(),
    houseNumber: Joi.number().required(),
    country: Joi.string().required(),
  }),
  image: Joi.object({
    url: Joi.string().required(),
    alt: Joi.string().required(),
  }),
});
