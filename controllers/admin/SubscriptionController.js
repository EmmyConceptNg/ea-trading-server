import Subscription from "../../models/Subscription.js";
import User from "../../models/User.js";


export const index = (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  // Query to count total subsriptions
  Subscription.countDocuments({ })
    .then((totalSubscriptions) => {
      // Calculate total pages
      const totalPages = Math.ceil(totalSubscriptions / limit);

      // Query to find subsriptions for the current page
      Subscription.find({})
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .then((subscriptions) => {
          res
            .status(200)
            .json({ subscriptions, currentPage: page, totalPages });
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
    const { userId, subscriptionId } = req.body;

    const subscription = await Subscription.findOne({ _id: subscriptionId });
    if (!subscription) {
      return res.status(400).json({ error: "Could not find subscription" });
    }

    const updatedSubscription = await Subscription.findOneAndUpdate(
      { _id: subscriptionId },
      { verified: !subscription.verified },
      { new: true }
    );

   
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { subscribed: updatedSubscription.verified },
      { new: true }
    );

    

    if (user.subscribed && user.referral) {
      const referee = await User.findOne({ referralCode: user.referral });
      if (!referee.referralPaid) {
        referee.referralEarned += 50;
        referee.roi += 50;
        referee.referralCount += 1;
        referee.referralPaid = true;
        await referee.save();
      }
    }
    return res
      .status(200)
      .json({
        message: "Subscription status changed",
        subscription: updatedSubscription,
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
