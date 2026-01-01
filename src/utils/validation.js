import Joi from "joi";

export const userRegisterValidation = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Name cannot be empty",
    "string.min": "Name should have at least 3 characters",
    "string.max": "Name should have at most 30 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password should have at least 6 characters",
  }),
});
