import User from "../models/User.js";

export const index = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });
    if (user) {
      const balance = user.roi + user.bot.amount;
      res.status(200).json({
        balance: balance,
        totalRoi: user.totalRoi,
        availableRoi: user.roi,
        totalWithdrawal: user.withdrawal,
      });
    } else {
      res.status(400).json({ error: "Could not find user" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
