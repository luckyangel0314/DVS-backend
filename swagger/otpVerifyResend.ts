export const resendOTPVerifySwagger = {
  "hapi-swagger": {
    responses: {
      200: {
        description: "OTP has sent to your email",
      },
      400: {
        description: "You need to verify email first",
      },
      404: {
        description: "User not found",
      }
    },
  },
};
