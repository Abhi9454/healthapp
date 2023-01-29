import deviceModel from '../models/deviceModel.js';
import { verify } from "jsonwebtoken";



export async function getAllDevices(req, res) {
    try {
        const devices = await deviceModel.find({}).sort([['_id', -1]]);
        res.status(200).json({ success: true, message: devices });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
export async function getDeviceDetailById(req, res) {
    try {
        verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, user) {
            const device = await deviceModel.findOne({ _id: req.body.id });
            res.status(200).json({ success: true, message: device });
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
export function addDevice(req, res) {
    try {
        verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, users) {
            const { name, modelName, modelId, partnerId } = req.body;
            let device = await deviceModel.findOne({ modelId });
            if (device)
                return res.status(400).json({ success: false, message: "Device Already added" });
            device = new deviceModel({ name, modelName, modelId, partnerId });
            await device.save();
            res.status(200).json({
                status: false, message: {
                    message: "Added User Successfully",
                    device: device,
                }
            });
        });
    }
    catch (error) {
        console.log('error', error);
        res.status(400).json({ success: false, message: error.message });
    }

}
export function updateDevice(req, res) {
    try {
        verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, users) {
            const { name, modelName, modelId, partnerId, id } = req.body;
            let device = await deviceModel.findOne({ _id: id });
            if (!device)
                return res.status(400).json({ status: false, message: "No Device Exist" });
            device = await deviceModel.findOneAndUpdate({ _id: id }, {
                name: name,
                modelName: modelName,
                modelId: modelId,
                partnerId: partnerId
            }, {
                new: true
            });
            await device.save();
            res.status(200).json({
                status: false, message: {
                    message: "Updated Device Successfully",
                    device: device,
                }
            });
        });
    }
    catch (err) {
        return res.status(400).json({ status: false, message: err.message });
    }
}
export function deleteDevice(req, res) {
    try {
        verify(req.headers.authorization.split(' ')[1], 'healthapp', async function (err, users) {
            const { id } = req.body;
            let device = await deviceModel.findOne({ _id: id });
            if (!device)
                return res.status(400).json({ status: false, message: "No Device Exist" });
            device = await deviceModel.findByIdAndDelete({ _id: req.body.id }, function (errorDelete, response) {
                if (errorDelete)
                    res.status(400).json({ success: false, message: errorDelete.message });
                else
                    res.status(200).json({ success: true, message: 'Device Deleted' });
            });
        });
    }
    catch (err) {
        return res.status(400).json({ status: false, message: err.message });
    }
}