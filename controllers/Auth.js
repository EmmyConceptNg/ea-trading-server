import Subscription from "../models/Subscription.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import {
  generateRandomString,
  generateStringStartingWithEaTrade,
} from "../utils/utils.js";
import bcrypt from "bcrypt";
import { sendMail } from "./Mail.js";
import path from "path";
import fs from "fs";

export const register = async (req, res) => {
  const { email, network, walletAddress, bot, duration, referral } = req.body;

  const password = generateStringStartingWithEaTrade(10);

  const referralCode = generateRandomString(6);

  const emailExists = await User.findOne({ email: email });

  try {
    if (emailExists) {
      res.status(500).json({ error: "Email already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create the user
      const user = await User.create({
        email: email,
        wallet: {
          network: network,
          address: walletAddress,
        },
        bot,
        password: hashedPassword,
        referralCode: referralCode,
        referral,
      });

      // Create the subscription
      const subscription = await Subscription.create({
        userId: user._id,
        wallet: {
          network: network,
          address: walletAddress,
        },
        bot,
        duration: duration,
      });

      // Send response

      sendMail(email, "Welcome to EA-Trading", html(email, password));

      res.status(201).json({
        message: "User and subscription created successfully",
        user: user,
        subscription: subscription,
      });
    }
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
};

export const changePassword = (req, res) => {
  const { password, confirmPassword, userId } = req.body;

  if (password === confirmPassword) {
    User.findOneAndUpdate(
      { _id: userId },
      { password: password },
      { new: true }
    ).then((user) =>
      res
        .status(200)
        .json({ message: "Password Updated successfully", user: user })
        .catch((err) => res.status(500).json({ error: err.message }))
    );
  } else {
    res.status(500).json({ error: "Password mismatch" });
  }
};

export const passwordVerification = async (req, res) => {
  const { verificationCode, userId } = req.body;
  const user = await User.findOne({ _id: userId });
  if (verificationCode !== user.passwordVerificationToken) {
    res.status(500).json({ error: "Invalid Code. please try again" });
  } else {
    res.status(200).json({
      message: "code verified. Please proceed to change your passwprd",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, "secretKey", {
      expiresIn: "1h",
    });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "An error occurred while logging in" });
  }
};

export const checkEmail = async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email already registered" });
  }
};

export const kyc = async (req, res) => {
  try {



    
    // Retrieve form data including uploaded files
    const {
      firstName,
      lastName,
      identityType,
      network,
      walletAddress,
      userId,
    } = req.body;
    const { identityImage, profileImage } = req.files;

    // Validation: Check if required fields are provided
    if (
      !firstName ||
      !lastName ||
      !identityType ||
      !network ||
      !walletAddress ||
      !userId ||
      !identityImage ||
      !profileImage
    ) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    // Process the uploaded files
    const imagePath = identityImage[0].path;
    const documentPath = profileImage[0].path;

    // Save the user to the database
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        firstName,
        lastName,
        wallet: { network: network, address: walletAddress },
        profileImage: imagePath, // Save image path to user profile
        identity: { image: documentPath, IDType: identityType }, // Save document path to user document
      },
      { new: true }
    );

    res.status(201).json({
      user,
      message:
        "User details updated successfully. Please wait while we verify your details",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const kycStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });
    if (user) {
      const kycStatus = user.verified;

      res.status(200).json({ kycStatus });
    } else {
      res.status(400).json({ error: "Cannot find user" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const subscriptionStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });
    if (user) {
      const subscriptionStatus = user.subscribed;

      res.status(200).json({ subscriptionStatus });
    } else {
      res.status(400).json({ error: "Cannot find user" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getImage = (req, res) => {
  const imageName = req.params.imageName;
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const imagePath = path.join(__dirname, "..", "uploads", imageName);

  // Check if the image file exists
  if (fs.existsSync(imagePath)) {
    // Send the image file as the response
    res.sendFile(imagePath);
  } else {
    // Image not found, return 404 error
    res.status(404).json({ error: "Image not found" });
  }
};

const html = (email, password) => {
  return `
    <html>
    <head>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: rgb(6, 42, 9); padding: 30px 50px 0px 50px; ">
     <table style="margin: 0 auto">
      <tr>
       <td style="text-align: center">
         <img style="max-width: 100px; max-height: 100px" src="" alt="Ea Trading" /> 
         </td>
          </tr>
           </table>
            <h1 style="color: #ffffff; margin-top: 50px">Welcome</h1>
             <p style="color: #ffffff; font-weight: 100; font-size: 13px; margin-top: 60px;">Welcome to EA Trading, login to your account with the details below:</p>
             <p style="color: #07a53d; font-weight: 700; font-size: 35px">
    Email : ${email} 
    </p>
    <p style="color: #07a53d; font-weight: 700; font-size: 35px">
    Password : ${password} 
    </p> <p style=" color: #ffffff; font-weight: 100; font-size: 13px; line-height: 40px;">
     Please do not share this password with anyone </p> 
     <p style="color: #ffffff; font-weight: 100; font-size: 13px; line-height: 40px;">
     Don\'t recognise this activity? Please ignore this mail and contact<span>
     <a style="color: #07a53d" href="mailto:hello@eatrading.com">customer support</a>
      </span> immediately. </p>
       <p style=" color: #ffffff; font-weight: 100; font-size: 13px; line-height: 40px; padding-top: 20px; " >
        <i>This is an automated message, please do not reply.</i>
         </p> <hr style="border: 1px solid #07a53d; margin: 20px 0" /> 
         <p style=" text-align: center; color: #ffffff; font-weight: 100; font-size: 13px; margin-bottom: 50px; " > 
         Stay connected! </p> </body>
           </html>`;
};
