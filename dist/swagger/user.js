"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSwagger = void 0;
exports.createUserSwagger = {
    "hapi-swagger": {
        responses: {
            201: {
                description: "User created successfully.",
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
//# sourceMappingURL=user.js.map