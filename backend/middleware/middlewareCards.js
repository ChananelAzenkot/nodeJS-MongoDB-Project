const Joi = require("joi");

exports.middlewareCards = Joi.object({
  title: Joi.string().required().min(2).max(100),

  subtitle: Joi.string().required().min(2).max(100),

  description: Joi.string().required().min(10).max(500),

  phone: Joi.string()
    .pattern(/^(0[2-4,8-9][0-9]{7}|0[57,73,74,76-79]{2}[0-9]{7})$/)
    .message('user "phone" must be a valid Israeli phone number')
    .required(),

  web: Joi.string()
    .pattern(/(http(s?):)([/|.|\w|\s|-])*\./)
    .message('card "web" must be a valid url')
    .allow(""),

  image: Joi.object()
    .keys({
      url: Joi.string()
        .pattern(/(http(s?):)([/|.|\w|\s|-])*\./)
        .message('card.image "url" must be a valid url')
        .allow(""),
      alt: Joi.string().min(2).max(256).allow(""),
    })
    .required(),
  address: Joi.object()
    .keys({
      state: Joi.string().allow(""),
      country: Joi.string().min(2).max(256).required(),
      city: Joi.string().min(2).max(256).required(),
      street: Joi.string().min(2).max(256).required(),
      houseNumber: Joi.number().required(),
      zip: Joi.number(),
    })
    .required(),
  bizNumber: Joi.number().required(),
  user_id: Joi.string().required(),
});
