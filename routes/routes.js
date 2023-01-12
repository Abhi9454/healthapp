const express = require('express');
const router = express.Router();
module.exports = router;
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');


router.route('/getallusers').get(userController.getallUsers);
router.route('/getuserdetail').post(userController.getUserDetails);


router.route('/signUp').get(authController.signUp);
router.route('/login').post(authController.login);