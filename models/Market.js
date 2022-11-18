import mongoose from "mongoose";

const Schema = mongoose.Schema;

const marketSchema = new Schema({
  name: {
    type: String,
  },
  distance: {
    type: Number,
    default: 0,
  },
  numberOfStalls: {
    type: Number,
    default: 0,
  },
  imageUrl: {
    type: String,
  },
  blurHash: {
    type: String,
  },
});

const Market = mongoose.model("Market", marketSchema);

export default Market;
