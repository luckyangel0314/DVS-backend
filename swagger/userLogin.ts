export const userLoginSwagger = {
  "hapi-swagger": {
    responses: {
      200: {
        description: "User logined successfully.",
      },
      400: {
        description: "Input Fields Required.",
      },
      409: {
        description: "User already exists.",
      },
    },
  },
};
