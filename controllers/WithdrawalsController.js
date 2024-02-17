import User from "../models/User.js";
import Withdrawal from "../models/Withdrawal.js";

export const index = (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  // Query to count total subsriptions
  Withdrawal.countDocuments({ userId })
    .then((totalWithdrawals) => {
      // Calculate total pages
      const totalPages = Math.ceil(totalWithdrawals / limit);

      // Query to find subsriptions for the current page
      Withdrawal.find({ userId })
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

export const requestWithdrawal = async (req, res) => {
  const { amount, userId } = req.body;

  try {
    const user = await User.findOne({ _id: userId });
    if (user) {
      

      const pendingWithdrawals = await Withdrawal.findOne({
        userId,
        verified: false,
      });

      if (pendingWithdrawals) {
        return res
          .status(404)
          .json({ error: "You have a pending withdrawal." });
      }
      
      if (user.roi < amount) {
        return res.status(400).json({ error: "Insufficient Balance" });
      }

      

      const withdrawal = Withdrawal.create({
        userId: userId,
        wallet: {
          address: user.wallet.address,
          network: user.wallet.network,
        },
        amount,
      });
      return res
        .status(200)
        .json({
          message:
            "Withdrawal Requested Successfully. Please wait while we approve the withdraw request",
        });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
