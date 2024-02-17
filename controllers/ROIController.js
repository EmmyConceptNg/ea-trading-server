import User from "../models/User.js";

export const ROI = async (req, res) => {
  try {
    // Find subscribed users
    const users = await User.find({ subscribed: true, role : 'user' });

    // Iterate over each user
    for (const user of users) {
      // Calculate ROI for user's bot
      const amount = parseFloat(user.bot.amount);
      const roi = parseFloat(user.bot.roi);

      if (isNaN(amount) || isNaN(roi)) {
        console.error(`Invalid amount or ROI for user: ${user._id}`);
        continue; // Skip this user and move to the next one
      }

      if (roi === 0) {
        console.error(`ROI is zero for user: ${user._id}`);
        continue; // Skip this user and move to the next one
      }

      const botROI = (amount * (roi / 100)) / 5; // Convert botROI to number

      if (isNaN(botROI)) {
        console.error(`Failed to calculate botROI for user: ${user._id}`);
        continue; // Skip this user and move to the next one
      }

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
