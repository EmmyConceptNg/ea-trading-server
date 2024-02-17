import bcrypt from "bcrypt";
import User from "../../models/User.js";

export const changePassword = async (req, res) => {
  const { oldPassword, password, confirmPassword, userId } = req.body;

  try {
    const user = await User.findOne({ _id: userId });

    if (user) {
      // Compare the oldPassword with the hashed password stored in the database
      const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

      if (isPasswordMatch) {
        // Old password matches
        // Now you can hash the new password and update the user's password in the database
        // Make sure to validate the new password and confirmPassword before updating

        if (password !== confirmPassword) {
          res
            .status(400)
            .json({
              error:
                "Please ensure that the new password is correct and confirmed",
            });
        } else {
          // Hash the new password
          const hashedPassword = await bcrypt.hash(password, 10); // You can adjust the salt rounds as needed

          // Update the user's password in the database
          user.password = hashedPassword;
          await user.save();

          res.status(200).json({ message: "Password updated successfully" });
        }
      } else {
        // Old password doesn't match
        res.status(400).json({ error: "Old password is incorrect" });
      }
    } else {
      res.status(400).json({ error: "Could not find user" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
