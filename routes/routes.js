const express = require('express');
const router = express.Router();
module.exports = router;
const userController = require('../controllers/userController');


router.route('/getallusers').get(userController.getallUsers);
router.route('/getuserdetail').post(userController.getUserDetails);