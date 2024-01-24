const Joi = require("joi");

exports.middlewareUsers = Joi.object({
    name: Joi.object({
        first: Joi.string().required(),
        middle: Joi.string().required(),
        last: Joi.string().required(),
    }),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().required(),
    address: Joi.object({
        state: Joi
            .string()
            .required(),
        country: Joi
            .string()
            .required(),
        city: Joi
            .string()
            .required(),
        street: Joi
            .string()
            .required(),
        houseNumber: Joi
            .number()
            .required(),
        zip: Joi,
    }),
    image: Joi.object({
        url: Joi.string().required(),
        alt: Joi.string().required(),
    }),
});
