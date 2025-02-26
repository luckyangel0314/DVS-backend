import Joi from "joi";

export const createUserSchema = Joi.object({
  // firstName: Joi.string().required().messages({
  //   "any.required": "Please provide first name.",
  // }),
  // lastName: Joi.string().required().messages({
  //   "any.required": "Please provide last name.",
  // }),
  email: Joi.string().email().required().messages({
    "any.required": "Please provide email",
    "string.email": "Please provide a valid email.",
  }),
  password: Joi.string().required().min(6).messages({
    "any.required": "Please provide password.",
    "string.min": "Password must be at least 6 characters.",
  }),
  type: Joi.string().required().messages({
    "any.required": "Please provide user type.",
  }),
  fullName: Joi.string().required().messages({
    "any.required": "Please provide First Name.",
  }),
  // birthday: Joi.string().required().messages({
  //   "any.required": "Please provide your birthday.",
  // }),
  // phoneNumber: Joi.string().required().messages({
  //   "any.required": "Please provide phone number.",
  // }),
  // country: Joi.string().required().messages({
  //   "any.required": "Please provide country.",
  // }),
  // languages: Joi.string().required().messages({
  //   "any.required": "Please provide languages.",
  // }),
  // socialMedia: Joi.string().required().messages({
  //   "any.required": "Please provide socialMedia.",
  // }),
  // organization: Joi.object().required().messages({
  //   "any.required": "Please provide organization.",
  // }),
  referralCode: Joi.string().optional(),
});
