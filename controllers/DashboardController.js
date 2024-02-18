import User from "../models/User.js";

export const index = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });
    if (user) {
      const balance = user.roi + user.bot.amount + user.referralEarned;
      const referralEarned = user.referralEarned; 
      const referralCount = user.referralCount;
      const totalAmount  = user.roi 
      res.status(200).json({
        balance: balance,
        botAmount: user.bot.amount,
        totalRoi: user.totalRoi,
        referralEarned: referralEarned,
        availableRoi: user.roi,
        totalWithdrawal: user.withdrawal,
        referralCount : referralCount,
        totalAmount :totalAmount 
      });
    } else {
      res.status(400).json({ error: "Could not find user" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
