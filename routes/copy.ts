import { Request, ResponseToolkit } from "@hapi/hapi";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import Account from "../models/accounts";
import config from "../config";
import {
  createUserSchema,
} from "../validation/user/register";

import {
  createUserSwagger,
} from '../swagger/userRegister'

const options = { abortEarly: false, stripUnknown: true };
export let userRoute = [
  {
    method: "POST",
    path: "/register",
    options: {
      description: "Register User",
      plugins: createUserSwagger,
      tags: ["api", "user"],
      validate: {
        payload: createUserSchema,
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
    handler: async (request: Request, response: ResponseToolkit) => {
      try {
        const email = request.payload["email"];
        const user = await User.findOne({ email });
        if (user) {
          return response.response({ msg: "User already exists." }).code(409);
        }
        const newUser: any = new User(request.payload);
        const { password } = newUser;
        const hash = await bcrypt.hash(password, 10);
        newUser.password = hash;
        const result = await newUser.save();
        const token = Jwt.sign(
          { userId: result._id, email: result.email },
          config.jwtSecret,
          {
            expiresIn: "3m",
          }
        );

        return response.response(result).code(201);
        // return token;
      } catch (error) {
        return response.response(error).code(500);
      }
    },
  },
  {
    method: "POST",
    path: "/login",
    options: {
      description: "Register User",
      plugins: createUserSwagger,
      tags: ["api", "user"],
      validate: {
        payload: createUserSchema,
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
    handler: async (request: Request, response: ResponseToolkit) => {
      try {
        const email = request.payload["email"];
        const user = await User.findOne({ email });
        if (user) {
          return response.response({ msg: "User already exists." }).code(409);
        }
        const newUser: any = new User(request.payload);
        const { password } = newUser;
        const hash = await bcrypt.hash(password, 10);
        newUser.password = hash;
        const result = await newUser.save();
        const token = Jwt.sign(
          { userId: result._id, email: result.email },
          config.jwtSecret,
          {
            expiresIn: "3m",
          }
        );

        return response.response(result).code(201);
        // return token;
      } catch (error) {
        return response.response(error).code(500);
      }
    },
  },
];
