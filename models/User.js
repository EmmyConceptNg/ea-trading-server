import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    referralCode: {
      type: String,
      unique: true,
    },
    referral: String,
    password: String,
    wallet: {
      network: String,
      address: String,
    },
    identity: {
      IDType: String,
      image: String,
    },
    bot: {
      name: String,
      amount: { type: Number, default: 0 },
      roi: { type: Number, default: 0 },
      months: String,
    },
    roi: { type: Number, default: 0 },
    totalRoi: { type: Number, default: 0 },
    withdrawal: { type: Number, default: 0 },
    profileImage: String,
    emailVerificationToken: String,
    passwordVerificationToken: String,
    verified: {
      type: Boolean,
      default: false,
    },
    subscribed: {
      type: Boolean,
      default: false,
    },
    referralPaid: {
      type: Boolean,
      default: false,
    },
    referralEarned: {
      type: Number,
      default: 0,
    },
    referralCount : {type : Number, default : 0}
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
