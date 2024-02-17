import mongoose from "mongoose";

const Withdrawal = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now, 
  },
  userId: String,
  wallet: {
    address: String,
    network: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  amount : Number
}, {timestamps : true});

export default mongoose.model("Withdrawal", Withdrawal);
