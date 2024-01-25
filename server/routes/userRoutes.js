const express = require("express");
const authController = require('../controllers/authController');
const pullRequestController = require('../controllers/pullRequestController');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

//all the protected routes after this middleware
router.use(authController.protect);
router.get('/me',userController.getUserDetail);

//all restricted routes for users only
router.post('/pullRequest', authController.restrictTo('user'), pullRequestController.createPullRequest);
router.delete('/pullRequest/:prId', authController.restrictTo('user'), pullRequestController.deletePullRequest);
router.put('/pullRequest/:prId',authController.restrictTo('user'), pullRequestController.updatePullRequest);

router.get('/pullRequest/:prId/comments', pullRequestController.getComments);

//all the restricted routes for Approvers only after this middleware
router.use(authController.restrictTo('approver'));
 
router.post('/pullRequest/:prId/comments', pullRequestController.addComment);
router.post('/pullRequest/:prId/approvals', pullRequestController.addApproval);

module.exports = router;