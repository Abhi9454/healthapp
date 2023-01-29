import { Router } from 'express';
const router = Router();
export default router;
import { addUser, getallUsers, getUserDetails, getUserbyId, updateUser, deleteUser, getState, getCity, getallUsersAssigned, getallUsersDuringSignUp, partnerDashboard, adminDashboard } from '../controllers/userController.js';
import { addDevice, getAllDevices, getDeviceDetailById, updateDevice, deleteDevice } from '../controllers/deviceController.js';
import { signUp, login } from '../controllers/authController.js';
import { addHeartRate, getHeartRateById, addGlucose, getGlucoseById, addWeight, getWeightById, addSleep, getSleepById, addStep, getStepById, getUserVitals } from '../controllers/vitalController.js';

/////////// (Admin/Partner/Patient) Route/////
router.route('/addUser').post(addUser);
router.route('/getallusers').post(getallUsers);
router.route('/getuserdetail').post(getUserDetails);
router.route('/getUserbyId/:uid').post(getUserbyId);
router.route('/updateUser').post(updateUser);
router.route('/deleteUser').post(deleteUser);
router.route('/getstate').get(getState);
router.route('/getcities').post(getCity);
router.route('/getallUsersAssigned').post(getallUsersAssigned);
router.route('/getallUsersDuringSignUp').get(getallUsersDuringSignUp);
router.route('/partnerDashboard').get(partnerDashboard);


///////////Admin DashBoard Route/////
router.route('/adminDashboard').get(adminDashboard);

///////////Authentication Route/////
router.route('/signUp').post(signUp);
router.route('/login').post(login);


/////////// Device Route/////
router.route('/adddevice').post(addDevice);
router.route('/getalldevice').post(getAllDevices);
router.route('/getdevicedetail').post(getDeviceDetailById);
router.route('/updatedevice').post(updateDevice);
router.route('/deletedevice').post(deleteDevice);



/////////// Heart Rate Route/////
router.route('/addHeartRate').post(addHeartRate);
router.route('/getHeartRate').post(getHeartRateById);

/////////// Glucose Route/////
router.route('/addGlucose').post(addGlucose);
router.route('/getGlucose').post(getGlucoseById);

/////////// Weight Route/////
router.route('/addWeight').post(addWeight);
router.route('/getWeight').post(getWeightById);

/////////// Sleep Route/////
router.route('/addSleep').post(addSleep);
router.route('/getSleep').post(getSleepById);

/////////// Steps Route/////
router.route('/addSteps').post(addStep);
router.route('/getSteps').post(getStepById);


/////////// Get User Route/////
router.route('/getUserVital').post(getUserVitals);

