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
      amount: Number,
      roi : Number,
      months : String
    },
    roi: Number,
    totalRoi: Number,
    profileImage: String,
    emailVerificationToken: String,
    passwordVerificationToken: String,
    verified : {
      type: Boolean,
      default: false,
    }, subscribed : {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
