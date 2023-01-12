const userModel = require('../models/userModel');



module.exports = {
    getallUsers : async function(req, res) { 
        try{
            const users = await userModel.find({userType : 'patient'}).sort([['_id', -1]]);
            res.status(200).json({success : true, message: users})
        }
        catch (error) {
            res.status(400).json({success : false,message: error.message})
        }
    },
    getUserDetails : async function(req, res) { 
        try{
            const users = await userModel.find({_id : req.body.id});
            res.status(200).json({success : true, message: users})
        }
        catch (error) {
            res.status(400).json({success : false,message: error.message})
        }
    },
}