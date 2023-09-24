import Joi from "joi";
export const verifyOTPResendSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Please provide email",
    "string.email": "Please provide a valid email.",
  }),
  referralCode: Joi.string().optional(),
});
