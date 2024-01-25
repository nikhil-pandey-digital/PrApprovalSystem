const User = require("../models/userModel");

exports.getUserDetail = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .populate({
        path: "prsToReview.prId",
        model: "PullRequest",
      })
      .populate({
        path: "prs.prId",
        model: "PullRequest",
      });

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
