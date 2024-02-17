import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now, 
  },
  userId: String,
  wallet: {
    address: String,
    network: String,
  },
  bot: {
    name: String,
    amount: Number,
    roi : Number,
    months : String
  },
  verified: {
    type: Boolean,
    default: false,
  },
  duration : Number
}, {timestamps : true});

export default mongoose.model("Subscription", subscriptionSchema);
