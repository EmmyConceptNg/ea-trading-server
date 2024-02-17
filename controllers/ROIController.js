import User from "../models/User.js";

export const ROI = async (req, res) => {
  try {
    // Find subscribed users
    const users = await User.find({ subscribed: true });

    // Iterate over each user
    for (const user of users) {
      // Calculate ROI for user's bot
       const botROI = (user.bot.amount * (user.bot.roi / 100)) / 5;

      // Update user's total ROI
      user.totalRoi += botROI;
      user.roi += botROI;

      // Save changes to the database
      await user.save();
    }

    // Respond with success message
    return res.status(200).json({ message: "ROI updated successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error updating ROI:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
