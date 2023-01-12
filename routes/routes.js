const express = require('express');
const router = express.Router();
module.exports = router;
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');


router.route('/getallusers').get(userController.getallUsers);
router.route('/getuserdetail').post(userController.getUserDetails);
router.route('/getUserbyId/:uid').post(userController.getUserbyId);
router.route('/updateUser').post(userController.updateUser);
router.route('/deleteUser').post(userController.deleteUser);


///////////Authentication Route/////
router.route('/signUp').post(authController.signUp);
router.route('/login').post(authController.login);