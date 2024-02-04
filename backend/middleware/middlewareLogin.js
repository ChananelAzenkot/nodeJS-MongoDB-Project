const Joi = require("joi");
// joi is a validation library of Login // 
exports.middlewareLogin = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .message('"email" must be a valid email address')
    .required(),
  password: Joi.string()
    .pattern(
      /((?=.*\d{1})(?=.*[A-Z]{1})(?=.*[a-z]{1})(?=.*[!@#$%^&*-]{1}).{7,20})/
    )
    .message(
      '"Password" must be 7-20 characters long and include at least one digit, one uppercase letter, one lowercase letter, and one special character (!@#$%^&*-).'
    )
    .required(),
});
