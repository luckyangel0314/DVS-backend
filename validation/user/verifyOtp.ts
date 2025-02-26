import Joi from "joi";
export const verifyOTPSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Please provide email",
    "string.email": "Please provide a valid email.",
  }),
  otp: Joi.string().required().messages({
    "any.required": "Please provide otp",
    "string.otp": "Please provide a valid otp.",
  }),
  referralCode: Joi.string().optional(),
});
