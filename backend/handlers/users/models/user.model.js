const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const ObjectId = Schema.Types.ObjectId;
const schema = new Schema({
  name: {
    first: { type: String },
    middle: { type: String },
    last: { type: String },
    _id: { type: ObjectId, default: () => new mongoose.Types.ObjectId() },
  },
  phone: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  image: {
    url: { type: String },
    alt: { type: String },
    _id: { type: ObjectId, default: () => new mongoose.Types.ObjectId() },
  },
  address: {
    state: { type: String },
    country: { type: String },
    city: { type: String },
    street: { type: String },
    houseNumber: { type: Number },
    zip: { type: Number },
    _id: { type: ObjectId, default: () => new mongoose.Types.ObjectId() },
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  IsBusiness: {
    type: Boolean,
    default: false,
  },
  createTime: { type: Date, default: Date.now() },
});
exports.User = mongoose.model("users", schema);
