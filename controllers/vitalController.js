import heartRateModel from '../models/heartRateModel.js';
import glucoseModel from '../models/glucoseModel.js';
import weightModel from '../models/weightModel.js';
import sleepModel from '../models/sleepModel.js';
import stepModel from '../models/stepsModel.js';
import pkgs from 'jsonwebtoken';
const { sign } = pkgs;
import dateFormat from 'dateformat';



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
            const createdAt = dateFormat(Date.now(), "dd-mm-yyyy h:MM:ss");
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
        sign.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, user) {
            const weight = await weightModel({ userId: req.body.id });
            res.status(200).json({ success: true, message: weight });
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
export function addWeight(req, res) {
    try {
        sign.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, users) {
            const { weight } = req.body;
            const userId = users.id;
            const createdAt = Date.now();
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
        sign.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, user) {
            const glucose = await glucoseModel({ userId: req.body.id });
            res.status(200).json({ success: true, message: glucose });
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
export function addGlucose(req, res) {
    try {
        verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, users) {
            const { glucose } = req.body;
            const userId = users.id;
            const createdAt = Date.now();
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
        sign.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, user) {
            const sleep = await sleepModel({ userId: req.body.id });
            res.status(200).json({ success: true, message: sleep });
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
export function addSleep(req, res) {
    try {
        sign.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, users) {
            const { sleep } = req.body;
            const userId = users.id;
            const createdAt = Date.now();
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
        sign.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, user) {
            const steps = await stepModel({ userId: req.body.id });
            res.status(200).json({ success: true, message: steps });
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
export function addStep(req, res) {
    try {
        sign.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, users) {
            const { step } = req.body;
            const userId = users.id;
            const createdAt = Date.now();
            var steps = new stepModel({ userId, step, createdAt });
            await steps.save();
            res.status(200).json({
                success: true, message: {
                    message: "Added successfully",
                    steps: steps,
                }
            });
        });
    }
    catch (error) {
        console.log('error', error);
        res.status(400).json({ success: false, message: error.message });
    }

}