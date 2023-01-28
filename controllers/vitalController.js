const heartRateModel = require('../models/heartRateModel');
const glucoseModel = require('../models/glucoseModel');
const weightModel = require('../models/weightModel');
const sleepModel = require('../models/sleepModel');
const stepModel = require('../models/stepModel');
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
    getWeightById : async function(req, res) { 
        try{
            jwt.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function(err, user){
            const weight = await weightModel.find({userId : user.id});
            res.status(200).json({success : true, message: weight})
        })
        }
        catch (error) {
            res.status(400).json({success : false,message: error.message})
        }
    },
    addWeight:function(req,res){
        try {
            jwt.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function(err, users){
                const {weight} = req.body  
                const userId = users.id          
                var weightDetail =  new weightModel({userId,weight})
                await weightDetail.save();
                res.status(200).json({status:false,message:
                    {	
                        message : "Added successfully",
                        device  : weightDetail,
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
                const {glucose} = req.body  
                const userId = users.id          
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

    getSleepById : async function(req, res) { 
        try{
            jwt.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function(err, user){
            const sleep = await sleepModel.find({userId : user.id});
            res.status(200).json({success : true, message: sleep})
        })
        }
        catch (error) {
            res.status(400).json({success : false,message: error.message})
        }
    },
    addSleep:function(req,res){
        try {
            jwt.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function(err, users){
                const {sleep} = req.body  
                const userId = users.id          
                var sleeps =  new sleepModel({userId,sleep})
                await sleeps.save();
                res.status(200).json({status:false,message:
                    {	
                        message : "Added successfully",
                        sleep  : sleeps,
                    }})
                })
           }
           catch (error) {
            console.log('error',error)
               res.status(400).json({success : false,message: error.message})
           }
           
    },

    getStepById : async function(req, res) { 
        try{
            jwt.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function(err, user){
            const steps = await stepModel.find({userId : user.id});
            res.status(200).json({success : true, message: steps})
        })
        }
        catch (error) {
            res.status(400).json({success : false,message: error.message})
        }
    },
    addStep:function(req,res){
        try {
            jwt.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function(err, users){
                const {step} = req.body  
                const userId = users.id          
                var steps =  new stepModel({userId,step})
                await steps.save();
                res.status(200).json({status:false,message:
                    {	
                        message : "Added successfully",
                        steps  : steps,
                    }})
                })
           }
           catch (error) {
            console.log('error',error)
               res.status(400).json({success : false,message: error.message})
           }
           
    },
}