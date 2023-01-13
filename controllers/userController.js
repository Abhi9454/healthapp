const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken")



module.exports = {
    getallUsers : async function(req, res) { 
        try{
            const {type} = req.body
            jwt.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function(err, user){
                const users = await userModel.find({userType : type}).sort([['_id', -1]]);
                res.status(200).json({success : true, message: users})
            })
        }
        catch (error) {
            res.status(400).json({success : false,message: error.message})
        }
    },
    getUserDetails : async function(req, res) { 
        try{
            jwt.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function(err, user){
            const users = await userModel.find({_id : req.body.id});
            res.status(200).json({success : true, message: users})
        })
        }
        catch (error) {
            res.status(400).json({success : false,message: error.message})
        }
    },
    getUserbyId:function(req,res){
        try{
            jwt.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function(err, user){
                const data = await userModel.findOne({_id:req.params.uid})
                if(!data) return res.status(400).json({status:false,message:"User Does not Exist"})
                res.status(200).json({success:true,message:
                    {	
                        user  : data,
                     }})
            })
        }
        catch(err){
            return res.status(400).json({status:false,message:err.message})
        }
    },
    addUser:function(req,res){
        try {
            jwt.verify(req.headers.authorization.split(' ')[1], 'test', async function(err, users){
                const {firstName,lastName,sex,phone,email,dob,userType,healthActivity,profileImageUrl,description,
                    coverImageUrl,category,address,city,state,country,active,pincode,partnerId,deviceId} = req.body          
                 let user = await userModel.findOne({email});
           if (user) return res.status(400).json({ success : false, message: "Email Already Exists"});
           user =  new userModel({firstName,lastName,sex,phone,email,dob,userType,healthActivity,profileImageUrl,description,
            coverImageUrl,category,address,city,state,country,active,pincode,partnerId,deviceId})
           const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            res.status(200).json({status:false,message:
                {	
                    message : "Added User Successfully",
                    user  : user,
                 }})
            
                })
           }
           catch (error) {
            console.log('error',error)
               res.status(400).json({success : false,message: error.message})
           }
           
    },
    updateUser: function(req,res){
        try {
            jwt.verify(req.headers.authorization.split(' ')[1], 'test', async function(err, users){
                const {firstName,lastName,sex,phone,email,dob,userType,healthActivity,profileImageUrl,description,
                    coverImageUrl,category,address,city,state,country,active,pincode,partnerId,deviceId} = req.body
                let user = await userModel.findOne({_id:id}) 
                if(!Branch) return  res.status(200).json({status:false,message: "No User Exist"})
                Branch = await userModel.findOneAndUpdate({_id:id},{
                    firstName:firstName
                    ,lastName:lastName
                    ,sex:sex
                    ,phone:phone
                    ,email:email
                    ,dob:dob
                    ,userType:userType
                    ,healthActivity:healthActivity
                    ,profileImageUrl:profileImageUrl
                    ,description:description
                    ,coverImageUrl:coverImageUrl
                    ,category:category
                    ,address:address
                    ,city:city
                    ,state:state
                    ,country:country
                    ,active:active
                    ,pincode:pincode
                    ,partnerId:partnerId
                    ,deviceId:deviceId
                },{
                    new:true
                })
                await user.save();
                let person = await userModel.findOne({_id:userId}) 
                console.log('person',person)
                res.status(200).json({status:false,message:
                    {	
                        message : "Updated User Successfully",
                        user  : user,
                     }})
            })
        } 
        catch(err){
            return res.status(400).json({status:false,message:err.message})
        }
    },

    deleteUser: function(req,res){
        try {
            jwt.verify(req.headers.authorization.split(' ')[1], 'test', async function(err, users){
                const {id} = req.body
                let user = await userModel.findOne({_id:id}) 
                if(!user) return  res.status(200).json({status:false,message: "No User Exist"})
                user = await userModel.findByIdAndDelete({_id : req.body.id} , function(errorDelete, response){
                    if (errorDelete) res.status(400).json({success : false,message: errorDelete.message});
                    else res.status(200).json({success : true, message: 'User Deleted'})
                });
            })
        } 
        catch(err){
           return res.status(400).json({status:false,message:err.message})
        }
    },
}