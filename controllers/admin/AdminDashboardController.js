import User from "../../models/User.js";

export const index = async (req, res) => {
  const { userId } = req.params;

  try {
    // Count total users
    const totalUsers = await User.countDocuments({role :'user'});

    // Fetch balance for subscribed users
    const balance = await User.aggregate([
      { $match: { subscribed: true } }, // Match subscribed users
      { $group: { _id: null, totalAmount: { $sum: "$bot.amount" } } }, // Sum bot amount for subscribed users
    ]);

    // Extract balance from result
    const subscribedBalance = balance.length > 0 ? balance[0].totalAmount : 0;

    // Fetch total withdrawal amount for subscribed users
    const withdrawal = await User.aggregate([
      { $match: { subscribed: true } }, // Match subscribed users
      { $group: { _id: null, totalAmount: { $sum: "$withdrawal" } } }, // Sum withdrawal amount for subscribed users
    ]);

    // Extract total withdrawal amount from result
    const totalWithdrawal =
      withdrawal.length > 0 ? withdrawal[0].totalAmount : 0;

    res.status(200).json({
      users: totalUsers,
      balance: subscribedBalance,
      withdrawal: totalWithdrawal,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
