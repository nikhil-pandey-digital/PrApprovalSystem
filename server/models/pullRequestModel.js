const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pullRequestSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  prType:{
    type: String,
    enum: ['sequential', 'parallel'],
    required: true,
  },
  approvers: [
    {
      approverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      comments: [
        {
          reviewId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
          },
        },
      ],
    },
  ],
  status: {
    type: String,
    enum: ['open', 'approved', 'rejected'],
    default: 'open',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});


const PullRequest = mongoose.model('PullRequest', pullRequestSchema);

module.exports = PullRequest;
