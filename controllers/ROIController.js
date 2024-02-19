import User from "../models/User.js";

export const ROI = async (req, res) => {
  try {
    // Find subscribed users in batches
    const batchSize = 100; // Define batch size
    let offset = 0;
    let batchUsers;

    do {
      batchUsers = await User.find({ subscribed: true, role: "user" })
        .skip(offset)
        .limit(batchSize);

      // Process batch of users in parallel
      await Promise.all(
        batchUsers.map(async (user) => {
          try {
            // Calculate ROI for user's bot
            const amount = parseFloat(user.bot.amount);
            const roi = parseFloat(user.bot.roi);

            if (isNaN(amount) || isNaN(roi) || roi === 0) {
              console.error(`Invalid amount or ROI for user: ${user._id}`);
              return; // Skip this user and move to the next one
            }

            const botROI = (amount * (roi / 100)) / 5; // Convert botROI to number

            if (isNaN(botROI)) {
              console.error(`Failed to calculate botROI for user: ${user._id}`);
              return; // Skip this user and move to the next one
            }

            // Update user's total ROI
            user.totalRoi += botROI;
            user.roi += botROI;

            // Save changes to the database
            await user.save();
          } catch (error) {
            console.error(`Error processing user: ${user._id}`, error);
          }
        })
      );

      offset += batchSize;
    } while (batchUsers.length === batchSize);

    // Respond with success message
    console.log("ROI updated successfully");
    return;
  } catch (error) {
    // Handle errors
    console.error("Error updating ROI:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
