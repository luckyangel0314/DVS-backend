"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_1 = __importDefault(require("../models/users"));
const config_1 = __importDefault(require("../config"));
const user_1 = require("../validation/user");
const user_2 = require("../swagger/user");
const options = { abortEarly: false, stripUnknown: true };
exports.userRoute = [
    {
        method: "POST",
        path: "/register",
        options: {
            description: "Register User",
            plugins: user_2.createUserSwagger,
            tags: ["api", "user"],
            validate: {
                payload: user_1.createUserSchema,
                options,
                failAction: (request, h, error) => {
                    const details = error.details.map((d) => {
                        return {
                            message: d.message,
                            path: d.path,
                        };
                    });
                    return h.response(details).code(400).takeover();
                },
            },
        },
        handler: (request, response) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const email = request.payload["email"];
                const user = yield users_1.default.findOne({ email });
                if (user) {
                    return response.response({ msg: "User already exists." }).code(409);
                }
                const newUser = new users_1.default(request.payload);
                const { password } = newUser;
                const hash = yield bcrypt_1.default.hash(password, 10);
                newUser.password = hash;
                const result = yield newUser.save();
                const token = jsonwebtoken_1.default.sign({ userId: result._id, email: result.email }, config_1.default.jwtSecret, {
                    expiresIn: "3m",
                });
                return response.response(result).code(201);
                // return token;
            }
            catch (error) {
                return response.response(error).code(500);
            }
        }),
    },
    {
        method: "POST",
        path: "/login",
        options: {
            description: "Register User",
            plugins: user_2.createUserSwagger,
            tags: ["api", "user"],
            validate: {
                payload: user_1.createUserSchema,
                options,
                failAction: (request, h, error) => {
                    const details = error.details.map((d) => {
                        return {
                            message: d.message,
                            path: d.path,
                        };
                    });
                    return h.response(details).code(400).takeover();
                },
            },
        },
        handler: (request, response) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const email = request.payload["email"];
                const user = yield users_1.default.findOne({ email });
                if (user) {
                    return response.response({ msg: "User already exists." }).code(409);
                }
                const newUser = new users_1.default(request.payload);
                const { password } = newUser;
                const hash = yield bcrypt_1.default.hash(password, 10);
                newUser.password = hash;
                const result = yield newUser.save();
                const token = jsonwebtoken_1.default.sign({ userId: result._id, email: result.email }, config_1.default.jwtSecret, {
                    expiresIn: "3m",
                });
                return response.response(result).code(201);
                // return token;
            }
            catch (error) {
                return response.response(error).code(500);
            }
        }),
    },
];
//# sourceMappingURL=user.js.map