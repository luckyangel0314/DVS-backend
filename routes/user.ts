import { Request, ResponseToolkit } from "@hapi/hapi";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";

import Account from "../models/accounts";
import Client from "../models/clients";
import Expert from "../models/experts";
import config from "../config";
import sendMail from "../utils/sendmail";
import GenerateOTP from "../utils/otp";

import { createUserSchema } from "../validation/user/register";
import { verifyEmailSchema } from "../validation/user/verifyEmail";
import { verifyOTPSchema } from "../validation/user/verifyOtp";
import { resetPasswordSchema } from "../validation/user/resetPassword";
import { verifyOTPResendSchema } from "../validation/user/verifyResendOtp";
import { userLoginSchema } from "../validation/user/login";

import { userRegisterSwagger } from '../swagger/userRegister';
import { verifyEmailSwagger } from '../swagger/verifyEmail';
import { verifyEmailResendSwagger } from '../swagger/verifyEmailResend';
import { resendOTPVerifySwagger } from '../swagger/otpVerifyResend';
import { OTPSwagger } from '../swagger/otpVerify';
import { userLoginSwagger } from '../swagger/userLogin';
import { resetPasswordSwagger } from "../swagger/resetPassword";

const options = { abortEarly: false, stripUnknown: true };
export let userRoute = [
  {
    method: "POST",
    path: "/register",
    options: {
      description: "Register User",
      plugins: userRegisterSwagger,
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
        // console.log(request.payload);
        const email = request.payload["email"];
        const user = await Account.findOne({ email });
        if (user) {
          return response.response({ msg: "User already exists." }).code(409);
        }

        // get account data from request data
        const newAccountData = {
          email: request.payload['email'],
          password: request.payload['password'],
          type: request.payload['type'],
          fullName: request.payload['fullName'],
          verifiedStatus: "unverified"
        }
        const newAccount: any = new Account(newAccountData);

        // save account in db after hashing password
        const { password } = newAccount;
        const hash = await bcrypt.hash(password, 10);
        newAccount.password = hash;
        const accountResult = await newAccount.save();

        // get client data from request data
        const newClientData = {
          accountId: accountResult._id,
          // phoneNumber: request.payload['phoneNumber'],
          // birthday: request.payload['birthday'],
          // country: request.payload['country'],
          // languages: request.payload['languages'],
          // socialMedia: request.payload['socialMedia'],
          // organization: request.payload['organization'],
        }
        const newClient: any = new Client(newClientData);

        // save client data in db
        let clientResult: any;
        if (request.payload['type'] == 'client') {
          clientResult = await newClient.save();
        }

        // const newExpertData = {
        //   accountId: request.payload['accountId'],
        //   phoneNumber: request.payload['phoneNumber'],
        //   birthday: request.payload['birthday'],
        //   country: request.payload['country'],
        //   languages: request.payload['languages'],
        //   socialMedia: request.payload['socialMedia'],
        //   address: request.payload['address'],
        //   zipCode: request.payload['zipCode'],
        //   industry: request.payload['industry'],
        //   weeklyCommitment: request.payload['weeklyCommitment'],
        //   hourlyRate: request.payload['hourlyRate'],
        //   projectPreference: request.payload['projectPreference'],
        //   tools: request.payload['tools'],
        //   skills: request.payload['skills'],
        //   education: request.payload['education'],
        //   experience: request.payload['experience'],
        //   profileCompleteness: request.payload['organization'],
        // }
        // const newExpert: any = new Expert(newExpertData);

        // if (request.payload['type'] == 'expert') {
        //   const expertResult = await newExpert.save();
        // }
        const token = Jwt.sign(
          { userId: accountResult._id, email: accountResult.email },
          config.jwtSecret,
          {
            expiresIn: "3m",
          }
        );

        // const verifyContent = "Hi! There, You have recently visited our website and entered your email. Please follow the given link to verify your email http://194.87.199.29:3000/api/v1/user/verify-email/" + token;
        const baseUrl = `${request.server.info.protocol}://${request.info.host}`;
        const content = `<div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;"><h1 style="font-size: 36px; color: #333; margin-bottom: 20px;">Hello</h1><p style="font-size: 18px; color: #666; margin-bottom: 20px;">Welcome!</p><p style="font-size: 18px; color: #666; margin-bottom: 40px;">This is your email verification link. Please click the button below to verify your email:</p><a href="${baseUrl}/api/v1/user/verify-email/${token}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 10px; font-size: 18px;">Verify Email</a></div>`;
        console.log("email send -->");
        sendMail(accountResult.email, content);
        return response.response({ accountResult, clientResult }).code(201);
        // return response.response(newUser).code(201);
        // return token;
      } catch (error) {
        return response.response(error).code(500);
      }
    },
  },
  {
    method: "GET",
    path: "/verify-email/{token}",
    options: {
      description: "Verify Email",
      plugins: verifyEmailSwagger,
      tags: ["api", "user"],
    },
    handler: async (request: Request, response: ResponseToolkit) => {
      const success = fs.readFileSync("./utils/emailVeriffSucess.txt");
      const failed = fs.readFileSync("./utils/emailVeriffFail.txt");
      const decoded = Jwt.decode(request.params.token);
      if (decoded === null) {
        return failed.toLocaleString();
      }
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        return failed.toLocaleString();
      }
      const user = await Account.findById(decoded.userId);
      if (user) {
        console.log("verify email-->", user._id);
        user.verifiedStatus = "verified";
        // const customer = await createCustomer(
        //   user.firstName + " " + user.lastName,
        //   user.email,
        //   user.phoneNumber
        // );
        // user.cus_id = customer["id"];
        await user.save();
        return success.toLocaleString();
      }
      return failed.toLocaleString();
    },
  },
  {
    method: "POST",
    path: "/verify-email-resend",
    options: {
      description: "Resend Email Verification",
      plugins: verifyEmailResendSwagger,
      tags: ["api", "user"],
      validate: {
        payload: verifyEmailSchema,
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
      const user = await Account.findOne({ email: request.payload["email"] });
      if (user) {
        const token = Jwt.sign(
          { userId: user._id, email: user.email },
          config.jwtSecret,
          {
            expiresIn: "3m",
          }
        );
        console.log("verify email request-->", request.payload);
        // sendMail(user.email, token);
        const baseUrl = `${request.server.info.protocol}://${request.info.host}`;
        const content = `<div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;"><h1 style="font-size: 36px; color: #333; margin-bottom: 20px;">Hello</h1><p style="font-size: 18px; color: #666; margin-bottom: 20px;">Welcome To DVS!</p><p style="font-size: 18px; color: #666; margin-bottom: 40px;">This is your email verification link. Please click the button below to verify your email:</p><a href="${baseUrl}/api/v1/user/verify-email/${token}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 10px; font-size: 18px;">Verify Email</a></div>`;
        sendMail(user.email, content);
        return response.response({
          msg: "Email verification has sent to your email",
        }).code(200);
      }
      return response.response([{ message: "User not found", path: ["email"] }]).code(404);
    },
  },
  {
    method: "POST",
    path: "/login",
    options: {
      description: "User Login",
      plugins: userLoginSwagger,
      tags: ["api", "user"],
      validate: {
        payload: userLoginSchema,
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
      console.log("login request -->", request.payload);
      const user = await Account.findOne({ email: request.payload["email"] });
      if (user) {
        const hpass = await bcrypt.compare(
          request.payload["password"],
          user.password
        );
        console.log("login request user-->", user);
        try {
          if (hpass) {
            if (user.verifiedStatus === 'verified') {
              const token = Jwt.sign(
                { userId: user._id, email: user.email },
                config.jwtSecret,
                {
                  expiresIn: "1h",
                }
              );
              return response
                .response({
                  token,
                  info: user,
                })
                .code(200);

              // const otp = GenerateOTP();
              // user.otp = otp;
              // const result = await user.save();
              // const content = `<div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;"><h1 style="font-size: 36px; color: #333; margin-bottom: 20px;">Hello</h1><p style="font-size: 18px; color: #666; margin-bottom: 20px;">Welcome To ShipFinex Homepage</p><p style="font-size: 18px; color: #666; margin-bottom: 40px;">This is your OTP code : <b>${result.otp}</b></p></div>`;
              // sendMail(result.email, content);
              // console.log("otp send -->");
              // return response.response({
              //   msg: "OTP Code has just sent to your email.",
              // });
            } else {
              const token = Jwt.sign(
                { userId: user._id, email: user.email },
                config.jwtSecret,
                {
                  expiresIn: "3m",
                }
              );
              const baseUrl = `${request.server.info.protocol}://${request.info.host}`;
              const content = `<div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;"><h1 style="font-size: 36px; color: #333; margin-bottom: 20px;">Hello</h1><p style="font-size: 18px; color: #666; margin-bottom: 20px;">Welcome!</p><p style="font-size: 18px; color: #666; margin-bottom: 40px;">This is your email verification link. Please click the button below to verify your email:</p><a href="${baseUrl}/api/v1/user/verify-email/${token}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 10px; font-size: 18px;">Verify Email</a></div>`;
              console.log("email send -->");
              sendMail(user.email, content);
              return response.response({
                msg: "Email verification has sent to your email",
              });
            }
          } else {
            console.log("password incorrect -->");
            return response
              .response([
                { message: "Password is incorrect", path: ["password"] },
              ])
              .code(400);
          }
        } catch (error) {
          console.log(error);
        }
      }
      return response
        .response([{ message: "User not found", path: ["email"] }])
        .code(404);
    },
  },
  {
    method: "POST",
    path: "/otp-verify-send",
    options: {
      description: "Resend OTP Verification Code",
      plugins: resendOTPVerifySwagger,
      tags: ["api", "user"],
      validate: {
        payload: verifyOTPResendSchema,
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
      const user = await Account.findOne({ email: request.payload["email"] });
      if (user) {
        const token = Jwt.sign(
          { userId: user._id, email: user.email },
          config.jwtSecret,
          {
            expiresIn: "3m",
          }
        );
        if (user.verifiedStatus === "verified") {
          const otp = GenerateOTP();
          user.otp = otp;
          const result = await user.save();
          const content = `<div style="background-color: #f2f2f2; padding: 20px; border-radius: 10px;"><h1 style="font-size: 36px; color: #333; margin-bottom: 20px;">Hello</h1><p style="font-size: 18px; color: #666; margin-bottom: 20px;">Welcome To DVS!</p><p style="font-size: 18px; color: #666; margin-bottom: 40px;">This is your OTP code : <b>${result.otp}</b></p></div>`;
          sendMail(result.email, content);
          return response.response({
            msg: "OTP Code has just sent to your email.",
          });
        } else {
          return response.response({ msg: "You need to verify email first" }).code(400);
        }
      }
      return response.response([{ message: "User not found", path: ["email"] }]).code(404);
    },
  },
  {
    method: "POST",
    path: "/verify-otp",
    options: {
      description: "Verify OTP",
      plugins: OTPSwagger,
      tags: ["api", "user"],
      validate: {
        payload: verifyOTPSchema,
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
    handler: async (request, response: ResponseToolkit) => {
      console.log("verify otp request in-->", request.payload);
      const user = await Account.findOne({ email: request.payload["email"] });
      if (user) {
        if (user.otp === request.payload["otp"]) {
          const token = Jwt.sign(
            { userId: user._id, email: user.email },
            config.jwtSecret,
            {
              expiresIn: "1h",
            }
          );
          return response
            .response({
              token,
              info: user,
            })
            .code(200);
        }
      }
      return response.response({ msg: "OTP Verification Failed." }).code(400);
    },
  },
  {
    method: "POST",
    path: "/reset-password",
    options: {
      description: "Reset Password",
      plugins: resetPasswordSwagger,
      tags: ["api", "user"],
      validate: {
        payload: resetPasswordSchema,
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
    handler: async (request, response: ResponseToolkit) => {
      const user = await Account.findOne({ email: request.payload["email"] });
      if (user) {
        const hash = await bcrypt.hash(request.payload["email"], 10);
        user.password = hash;
        await user.save();
        return response.response("success").code(200);
      }
      return response.response("No such Email").code(400);
    },
  },
];
