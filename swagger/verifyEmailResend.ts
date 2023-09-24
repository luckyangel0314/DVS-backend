export const verifyEmailResendSwagger = {
  "hapi-swagger": {
    responses: {
      200: {
        description: "Email verification has sent to your email",
      },
      404: {
        description: "User not found",
      }
    },
  },
};
