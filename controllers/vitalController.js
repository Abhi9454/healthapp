const heartRateModel = require('../models/heartRateModel');
const glucoseModel = require('../models/glucoseModel');
const temperatureModel = require('../models/stepsModel');
const jwt = require("jsonwebtoken")



module.exports = {
    getHeartRateById : async function(req, res) { 
        try{
            jwt.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function(err, user){
            const heartRate = await heartRateModel.find({userId : user.id});
            res.status(200).json({success : true, message: heartRate})
        })
        }
        catch (error) {
            res.status(400).json({success : false,message: error.message})
        }
    },
    addHeartRate:function(req,res){
        try {
            jwt.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function(err, users){
                const {heartRate} = req.body      
                const userId = users.id    
                var heart =  new heartRateModel({userId,heartRate})
                await heart.save();
                res.status(200).json({status:false,message:
                    {	
                        message : "Added successfully",
                        device  : heart,
                    }})
                })
           }
           catch (error) {
            console.log('error',error)
               res.status(400).json({success : false,message: error.message})
           }
           
    },
    getTemperatureById : async function(req, res) { 
        try{
            jwt.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function(err, user){
            const temperature = await temperatureModel.find({userId : user.id});
            res.status(200).json({success : true, message: temperature})
        })
        }
        catch (error) {
            res.status(400).json({success : false,message: error.message})
        }
    },
    addTemperature:function(req,res){
        try {
            jwt.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function(err, users){
                const {userId,temperature} = req.body          
                var temp =  new temperature({userId,temperature})
                await temp.save();
                res.status(200).json({status:false,message:
                    {	
                        message : "Added successfully",
                        device  : temp,
                    }})
                })
           }
           catch (error) {
            console.log('error',error)
               res.status(400).json({success : false,message: error.message})
           }
           
    },

    getGlucoseById : async function(req, res) { 
        try{
            jwt.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function(err, user){
            const glucose = await glucoseModel.find({userId : user.id});
            res.status(200).json({success : true, message: glucose})
        })
        }
        catch (error) {
            res.status(400).json({success : false,message: error.message})
        }
    },
    addGlucose:function(req,res){
        try {
            jwt.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function(err, users){
                const {userId,glucose} = req.body          
                var gluc =  new glucoseModel({userId,glucose})
                await gluc.save();
                res.status(200).json({status:false,message:
                    {	
                        message : "Added successfully",
                        device  : gluc,
                    }})
                })
           }
           catch (error) {
            console.log('error',error)
               res.status(400).json({success : false,message: error.message})
           }
           
    },
}