const express = require('express');
const router = express.Router();
module.exports = router;
const userController = require('../controllers/userController');
const deviceController = require('../controllers/deviceController');
const authController = require('../controllers/authController');
const vitalController = require('../controllers/vitalController');

/////////// (Admin/Partner/Patient) Route/////
router.route('/addUser').post(userController.addUser);
router.route('/getallusers').post(userController.getallUsers);
router.route('/getuserdetail').post(userController.getUserDetails);
router.route('/getUserbyId/:uid').post(userController.getUserbyId);
router.route('/updateUser').post(userController.updateUser);
router.route('/deleteUser').post(userController.deleteUser);
router.route('/getstate').get(userController.getState);
router.route('/getcities').post(userController.getCity);
router.route('/getallUsersAssigned').post(userController.getallUsersAssigned);


///////////Authentication Route/////
router.route('/signUp').post(authController.signUp);
router.route('/login').post(authController.login);


/////////// Device Route/////
router.route('/adddevice').post(deviceController.addDevice);
router.route('/getalldevice').post(deviceController.getAllDevices);
router.route('/getdevicedetail').post(deviceController.getDeviceDetailById);
router.route('/updatedevice').post(deviceController.updateDevice);
router.route('/deletedevice').post(deviceController.deleteDevice);



/////////// Heart Rate Route/////
router.route('/addHeartRate').post(vitalController.addHeartRate);
router.route('/getHeartRate').post(vitalController.getHeartRateById);
router.route('/getdevicedetail').post(deviceController.getDeviceDetailById);
router.route('/updatedevice').post(deviceController.updateDevice);
router.route('/deletedevice').post(deviceController.deleteDevice);

