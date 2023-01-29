import heartRateModel, { find } from '../models/heartRateModel.js';
import glucoseModel, { find as _find } from '../models/glucoseModel.js';
import weightModel, { find as __find } from '../models/weightModel.js';
import sleepModel, { find as ___find } from '../models/sleepModel.js';
import stepModel, { find as ____find } from '../models/stepsModel.js';
import { verify } from "jsonwebtoken";
import dateFormat from 'dateformat';



export async function getHeartRateById(req, res) {
    try {
        verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, user) {
            const heartRate = await find({ userId: req.body.id });
            res.status(200).json({ success: true, message: heartRate });
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
export function addHeartRate(req, res) {
    try {
        verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, users) {
            const { heartRate } = req.body;
            const userId = users.id;
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
        verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, user) {
            const weight = await __find({ userId: req.body.id });
            res.status(200).json({ success: true, message: weight });
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
export function addWeight(req, res) {
    try {
        verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, users) {
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
        verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, user) {
            const glucose = await _find({ userId: req.body.id });
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
        verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, user) {
            const sleep = await ___find({ userId: req.body.id });
            res.status(200).json({ success: true, message: sleep });
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
export function addSleep(req, res) {
    try {
        verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, users) {
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
        verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, user) {
            const steps = await ____find({ userId: req.body.id });
            res.status(200).json({ success: true, message: steps });
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
export function addStep(req, res) {
    try {
        verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, users) {
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