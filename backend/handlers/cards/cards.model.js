const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const schema = new Schema({
  title: String,
  subtitle: String,
  description: String,
  phone: String,
  email: String,
  web: String,
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
  bizNumber: Number,
  likes: [String],
  user_id: { type: ObjectId },
  createTime: { type: Date, default: Date.now() },
});

schema.statics.generateUniqueBizNumber = async function () {
  let bizNumber;

  while (true) {
    bizNumber = Math.floor(100000000 + Math.random() * 900000000); // 

    const exists = await this.findOne({ bizNumber });

    if (!exists) break; 
  }

  return bizNumber;
};

exports.Card = mongoose.model("cards", schema);
