import User from "../../models/User.js";
import Withdrawal from "../../models/Withdrawal.js";


export const index = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  // Query to count total subsriptions
  Withdrawal.countDocuments({ })
    .then((totalWithdrawals) => {
      // Calculate total pages
      const totalPages = Math.ceil(totalWithdrawals / limit);

      // Query to find subsriptions for the current page
      Withdrawal.find({ })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .then((withdrawals) => {
          res.status(200).json({ withdrawals, currentPage: page, totalPages });
        })
        .catch((error) => {
          res.status(400).json({ error: error.message });
        });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

export const toggleStatus = async (req, res) => {
  try {
    const { userId, withdrawalId, amount } = req.body;

    // Find the withdrawal
    const withdrawal = await Withdrawal.findOne({ _id: withdrawalId });
    if (!withdrawal) {
      return res.status(400).json({ error: "Could not find withdrawal" });
    }

    // Update withdrawal status
    const updatedWithdrawal = await Withdrawal.findOneAndUpdate(
      { _id: withdrawalId },
      { verified: !withdrawal.verified },
      { new: true }
    );

    // If the withdrawal is verified, update user's withdrawal amount and roi
    if (updatedWithdrawal.verified) {
      // Find the user
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(400).json({ error: "Could not find user" });
      }

      // Validate user data
      
      if (isNaN(amount) || isNaN(user.withdrawal) || isNaN(user.roi)) {
        return res.status(400).json({ error: "Invalid user data" });
      }

      // Update user's withdrawal amount and roi
      user.withdrawal = parseFloat(user.withdrawal) + parseFloat(amount);
      user.roi = parseFloat(user.roi) - parseFloat(amount);

      // Save the updated user object
      await user.save();
    }

    return res.status(200).json({
      message: "Withdrawal status changed",
      withdrawal: updatedWithdrawal,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


