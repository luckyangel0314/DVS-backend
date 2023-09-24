import mongoose from "mongoose";

const Schema = mongoose.Schema;
const expertSchema = new Schema({
  accountId: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  birthday: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  languages: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  industry: { // Array of string
    type: String,
    required: true,
  },
  tools: { // Array of string
    type: String,
    required: true,
  },
  skills: { // Array of string
    type: String,
    required: true,
  },
  education: { // Array of object
    type: String,
    required: true,
  },
  experience: { // Array of object
    type: String,
    required: true,
  },
  socialMedia: { // Array of object
    type: String,
    required: true,
  },
  projectPreference: { // Array of string
    type: String,
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
  weeklyCommitment: {
    type: Number,
    required: true,
  },
  organization: {
    type: String,
    required: true,
  },
  profileCompleteness: {
    type: String,
    required: true,
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

const Expert = mongoose.model("expert", expertSchema);
export default Expert;
