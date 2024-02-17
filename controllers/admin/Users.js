import User from "../../models/User.js";

export const index = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  // Query to count total users
  User.countDocuments({ role: "user" })
    .then((totalUsers) => {
      // Calculate total pages
      const totalPages = Math.ceil(totalUsers / limit);

      // Query to find users for the current page
      User.find({ role: "user" })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .then((users) => {
          res.status(200).json({ users, currentPage: page, totalPages });
        })
        .catch((error) => {
          res.status(400).json({ error: error.message });
        });
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

export const show = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => res.status(200).json({ user: user }))
    .catch((error) => res.status(500).json({ error: error.message }));
};

export const accountStatus = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findOne({ _id: userId });

  if (user) {
    User.findOneAndUpdate(
      { _id: userId },
      { verified: !user.verified },
      { new: true }
    )
      .then((user) => {
        res.status(200).json({ message: "user status changed", user: user });
      })
      .catch((error) => res.status(500).json({ error: error.message }));
  } else {
    res.status(400).json({ error: "Could not find user" });
  }
};
