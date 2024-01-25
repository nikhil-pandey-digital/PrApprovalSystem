const PullRequest = require("../models/pullRequestModel");
const User = require("../models/userModel");
const Review = require("../models/reviewModel");
const sendEmail = require("../utils/email");

exports.createPullRequest = async (req, res, next) => {
  try {
    const { title, description, prType, approversList } = req.body;
    const requesterId = req.user._id;

    if (!title || !description || !prType || !approversList) {
      return res.status(400).json({
        error:
          "Missing required fields, insufficient data for creating pullRequest",
      });
    }

    const approversUnordered = await User.find({
      email: { $in: approversList },
    });

    //make sure approvers are in the same order as approversList
    const approvers = approversList.map((email) =>
      approversUnordered.find((approver) => approver.email === email)
    );

    if (approvers.length !== approversList.length) {
      return res.status(400).json({
        error: "Invalid approvers, provide valid emails of approvers",
      });
    }

    const approversIds = approvers.map((approver) => approver._id);

    const newPullRequest = await PullRequest.create({
      title,
      description,
      prType,
      requesterId,
      approvers: approversIds.map((approverId) => ({ approverId })),
    });

    // Find the user with requesterId and update their prs array
    await User.findByIdAndUpdate(requesterId, {
      $push: { prs: { prId: newPullRequest._id } },
    });

    // Find the users with approversIds and update their prsToReview array
    await User.updateMany(
      { _id: { $in: approversIds } },
      {
        $push: { prsToReview: { prId: newPullRequest._id } },
      }
    );

    //send email to all the approvers
    const emailSubject = `New Pull Request: ${newPullRequest.title}`;
    const emailText = `A new pull request "${newPullRequest.title}" has been assigned to you. Please review and approve.`;

    const emailPromises = approversList.map((approverEmail) => {
      return sendEmail(approverEmail, emailSubject, emailText);
    });

    Promise.all(emailPromises)
      .then(() => {
        console.log("All emails sent successfully.");

        res.status(201).json({
          message: "pullRequest created Successfully.",
          pullRequest: newPullRequest,
        });
      })
      .catch((error) => {
        console.error("Error sending emails:", error);

        //handle email resending logic //todo

        //send success response
        res.status(201).json({
          message: "pullRequest created Successfully.",
          pullRequest: newPullRequest,
        });
      });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error creating pull request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deletePullRequest = async (req, res, next) => {
  try {
    const { prId } = req.params;
    const userId = req.user._id;

    const pullRequest = await PullRequest.findById(prId);

    if (!pullRequest) {
      return res.status(404).json({ error: "Pull Request not found" });
    }

    if (pullRequest.requesterId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this pull request" });
    }

    //remove the pull request from the requester's prs array
    await User.findByIdAndUpdate(pullRequest.requesterId, {
      $pull: { prs: { prId } },
    });

    //remove the pull request from the approvers' prsToReview array
    await User.updateMany(
      { _id: { $in: pullRequest.approvers.map((a) => a.approverId) } },
      {
        $pull: { prsToReview: { prId } },
      }
    );

    //remove all the reviews associated with the pull request
    await Review.deleteMany({ prId });

    //delete the pull request
    await PullRequest.findByIdAndDelete(prId);

    res.status(204).json({ message: "Pull Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting pull request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updatePullRequest = async (req, res, next) => {
  try {
    const { prId } = req.params;
    const userId = req.user._id;
    const { title, description } = req.body;

    //check if the pull request exists
    const pullRequest = await PullRequest.findById(prId);
    if (!pullRequest) {
      return res.status(404).json({ error: "Pull Request not found" });
    }

    //check if the user is the requester of the pull request
    if (pullRequest.requesterId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this pull request" });
    }

    //update the pull request
    await PullRequest.findByIdAndUpdate(prId, {
      title,
      description,
      updatedAt: Date.now(),
    });

    res.status(200).json({ message: "Pull Request updated successfully" });
  } catch (error) {
    console.error("Error updating pull request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const { prId } = req.params;
    const userId = req.user._id;
    const { comment } = req.body;

    //check if the pull request exists
    const pullRequest = await PullRequest.findById(prId);
    if (!pullRequest) {
      return res.status(404).json({ error: "Pull Request not found" });
    }

    //check if the user is an approver of the pull request
    const approver = pullRequest.approvers.find(
      (approver) => approver.approverId.toString() === userId.toString()
    );
    if (!approver) {
      return res.status(403).json({
        error: "You are not authorized to add comment to this pull request",
      });
    }

    //create the review
    const review = await Review.create({ prId, comment, reviewerId: userId });

    //update the approver's comments array
    await PullRequest.updateOne(
      { _id: prId, "approvers.approverId": userId },
      { $push: { "approvers.$.comments": { reviewId: review._id } } }
    );

    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const { prId } = req.params;
    const userId = req.user._id;

    //check if the pull request exists
    const pullRequest = await PullRequest.findById(prId);
    if (!pullRequest) {
      return res.status(404).json({ error: "Pull Request not found" });
    }

    //get all the reviews associated with the pull request
    const reviews = await Review.find({ prId }).sort({ createdAt: 1 });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addApproval = async (req, res, next) => {
  try {
    const { prId } = req.params;
    const userId = req.user._id;
    const { status } = req.body;//status can be approved or rejected

    //check if the pull request exists
    const pullRequest = await PullRequest.findById(prId);
    if (!pullRequest) {
      return res.status(404).json({ error: "Pull Request not found" });
    }

    //check if the user is an approver of the pull request
    const approver = pullRequest.approvers.find(
      (approver) => approver.approverId.toString() === userId.toString()
    );
    if (!approver) {
      return res.status(403).json({
        error: "You are not authorized to add approval to this pull request",
      });
    }

    //for sequential pull requests, only allow if the approver is the first approver in the approvers array or the previous approver has approved the pull request
    if (pullRequest.prType === "sequential") {
      const approverIndex = pullRequest.approvers.findIndex(
        (approver) => approver.approverId.toString() === userId.toString()
      );

      if (approverIndex !== 0) {
        const previousApprover = pullRequest.approvers[approverIndex - 1];
        if (previousApprover.status !== "approved") {
          return res.status(403).json({
            error:
              "Your turn has not come yet, wait for the previous approver to approve the pull request",
          });
        }
      }
    }

    //update the approver's status
    const updatedPullRequest = await PullRequest.findOneAndUpdate(
      { _id: prId, "approvers.approverId": userId },
      { $set: { "approvers.$.status": status } },
      { new: true } 
    );
    //for sequential pull requests, reject a pull request if any of the approvers rejects it
    if (updatedPullRequest.prType == "sequential") {
      const anyRejected = updatedPullRequest.approvers.some(
        (approver) => approver.status == "rejected"
      );

      if (anyRejected) {
        await PullRequest.findByIdAndUpdate(prId, { status: "rejected" });
      }
    }

    // if all the approvers have approved the pull request, update the pull request's status to approved
    const allApproved = updatedPullRequest.approvers.every(
      (approver) => approver.status == "approved"
    );
   

    if (allApproved) {
      await PullRequest.findByIdAndUpdate(prId, { status: "approved" });
    }

    //if all the approvers have rejected the pull request  then update the pull request's status to rejected
    const allRejected = updatedPullRequest.approvers.every(
      (approver) => approver.status == "rejected"
    );

    if(allRejected) {
      await PullRequest.findByIdAndUpdate(prId, { status: "rejected" });
    }

    res.status(200).json({ message: "Approval added successfully" });
  } catch (error) {
    console.error("Error adding approval:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
