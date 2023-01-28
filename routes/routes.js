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
router.route('/getallUsersDuringSignUp').get(userController.getallUsersDuringSignUp);
router.route('/partnerDashboard').get(userController.partnerDashboard);


///////////Admin DashBoard Route/////
router.route('/adminDashboard').get(userController.adminDashboard);

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

/////////// Glucose Route/////
router.route('/addGlucsoe').post(vitalController.addGlucose);
router.route('/getGlucose').post(vitalController.getGlucoseById);

/////////// Weight Route/////
router.route('/addWeight').post(vitalController.addWeight);
router.route('/getWeight').post(vitalController.getWeightById);

/////////// Sleep Route/////
router.route('/addSleep').post(vitalController.addSleep);
router.route('/getSleep').post(vitalController.getSleepById);

/////////// Steps Route/////
router.route('/addSteps').post(vitalController.addStep);
router.route('/getSteps').post(vitalController.getStepById);

