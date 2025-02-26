import mongoose from "mongoose";

const Schema = mongoose.Schema;
const accountSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  verifiedStatus: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ["admin", "staff", "client", "expert"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  lastLoggedIn: {
    type: Date,
    default: Date.now(),
  },
});

const Account = mongoose.model("account", accountSchema);
export default Account;
