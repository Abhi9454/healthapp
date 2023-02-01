import heartRateModel from '../models/heartRateModel.js';
import glucoseModel from '../models/glucoseModel.js';
import weightModel from '../models/weightModel.js';
import sleepModel from '../models/sleepModel.js';
import stepModel from '../models/stepsModel.js';
import userModel from '../models/userModel.js';
import pkgs from 'jsonwebtoken';
const { sign } = pkgs;
import dateFormat from 'dateformat';


export async function getUserVitals(req, res) {
    try {
        sign(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, user) {
            var users = await userModel.find({ _id: req.body.id });
            const heartRate = await heartRateModel.find({ userId: req.body.id }).sort([['_id', -1]]).limit(1);
            const weight = await weightModel.find({ userId: req.body.id }).sort([['_id', -1]]).limit(1);
            const glucose = await glucoseModel.find({ userId: req.body.id }).sort([['_id', -1]]).limit(1);
            const sleep = await sleepModel.find({ userId: req.body.id }).sort([['_id', -1]]).limit(1);
            const steps = await stepModel.find({ userId: req.body.id }).sort([['_id', -1]]).limit(1);
            res.status(200).json({ success: true, user: users , heartRate : heartRate, weight : weight,
                glucose: glucose, sleep : sleep, steps : steps});
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
export async function getEmergencyVital(req, res) {
    try {
        sign(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, user) {
            var userDetails = await userModel.find({partnerId : req.body.id }).select('_id')
            for(var x = 0 ; x < userDetails.length ; x++){
                var heartRate = await heartRateModel.find({ $or: [ { heartRate: { $lt: 60 } }, { heartRate: { $gt: 95 } } ] }, 
                    { $and: [ { userId: userDetails[x]._id}]}).sort([['_id', -1]]).lean();
                var glucose = await glucoseModel.find({ $or: [ { glucose: { $lt: 100 } }, { glucose: { $gt: 125 } } ] },
                    { $and: [ { userId: userDetails[x]._id}]}).sort([['_id', -1]]).lean();
                if(heartRate.length > 0){
                    for (var i = 0; i < heartRate.length; i++) {
                        if (heartRate[i].userId != null) {
                            var userDetail = await userModel.findOne({ _id: heartRate[i].userId}).select("firstName")
                            .select("lastName").select("phone").select("email").select("profileImageUrl").select("address").select("city")
                            .select("state").select("country").select('gender');
                            heartRate[i].userDetail = userDetail;
                        }
                    }
                }
                if(glucose.length > 0){
                    for (var i = 0; i < glucose.length; i++) {
                        if (glucose[i].userId != null) {
                            var userDetail = await userModel.findOne({ _id: glucose[i].userId, partnerId : req.body.id }).select("firstName")
                            .select("lastName").select("phone").select("email").select("profileImageUrl").select("address").select("city")
                            .select("state").select("country").select('gender');
                            glucose[i].partner = userDetail;
                        }
                    }
                }
            }
            res.status(200).json({ success: true, heartRate: heartRate , glucose : glucose});
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
export async function getHeartRateById(req, res) {
    try {
        sign(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, user) {
            const heartRate = await heartRateModel.find({ userId: req.body.id });
            res.status(200).json({ success: true, message: heartRate });
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
export function addHeartRate(req, res) {
    try {
        sign(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, users) {
            const {userId, heartRate } = req.body;
            const createdAt = dateFormat(Date.now(), "dd-mm-yyyy hh:MM:ss TT");
            var heart = new heartRateModel({ userId, heartRate, createdAt });
            await heart.save();
            res.status(200).json({
                success: true, message: {
                    message: "Added successfully",
                    heart: heart,
                }
            });
        });
    }
    catch (error) {
        console.log('error', error);
        res.status(400).json({ success: false, message: error.message });
    }

}
export async function getWeightById(req, res) {
    try {
        sign(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, user) {
            const weight = await weightModel.find({ userId: req.body.id });
            res.status(200).json({ success: true, message: weight });
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
export function addWeight(req, res) {
    try {
        sign(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, users) {
            const { userId,weight } = req.body;
            const createdAt = dateFormat(Date.now(), "dd-mm-yyyy hh:MM:ss TT");
            var weightDetail = new weightModel({ userId, weight, createdAt });
            await weightDetail.save();
            res.status(200).json({
                success: true, message: {
                    message: "Added successfully",
                    device: weightDetail,
                }
            });
        });
    }
    catch (error) {
        console.log('error', error);
        res.status(400).json({ success: false, message: error.message });
    }

}
export async function getGlucoseById(req, res) {
    try {
        sign(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, user) {
            const glucose = await glucoseModel.find({ userId: req.body.id });
            res.status(200).json({ success: true, message: glucose });
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
export function addGlucose(req, res) {
    try {
        sign(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, users) {
            const { userId, glucose } = req.body;
            const createdAt = dateFormat(Date.now(), "dd-mm-yyyy hh:MM:ss TT");
            var gluc = new glucoseModel({ userId, glucose, createdAt });
            await gluc.save();
            res.status(200).json({
                success: true, message: {
                    message: "Added successfully",
                    device: gluc,
                }
            });
        });
    }
    catch (error) {
        console.log('error', error);
        res.status(400).json({ success: false, message: error.message });
    }

}
export async function getSleepById(req, res) {
    try {
        sign(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, user) {
            const sleep = await sleepModel.find({ userId: req.body.id });
            res.status(200).json({ success: true, message: sleep });
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
export function addSleep(req, res) {
    try {
        sign(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, users) {
            const { userId, sleep } = req.body;
            const createdAt = dateFormat(Date.now(), "dd-mm-yyyy hh:MM:ss TT");
            var sleeps = new sleepModel({ userId, sleep, createdAt });
            await sleeps.save();
            res.status(200).json({
                success: true, message: {
                    message: "Added successfully",
                    sleep: sleeps,
                }
            });
        });
    }
    catch (error) {
        console.log('error', error);
        res.status(400).json({ success: false, message: error.message });
    }

}
export async function getStepById(req, res) {
    try {
        sign(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, user) {
            const steps = await stepModel.find({ userId: req.body.id });
            res.status(200).json({ success: true, message: steps });
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
export function addStep(req, res) {
    try {
        sign(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, users) {
            const { userId, steps } = req.body;
            const createdAt = dateFormat(Date.now(), "dd-mm-yyyy hh:MM:ss TT");
            var step = new stepModel({ userId, steps, createdAt });
            await step.save();
            res.status(200).json({
                success: true, message: {
                    message: "Added successfully",
                    steps: step,
                }
            });
        });
    }
    catch (error) {
        console.log('error', error);
        res.status(400).json({ success: false, message: error.message });
    }

}