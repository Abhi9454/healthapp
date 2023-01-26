const userModel = require('../models/userModel');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
    signUp : async function(req, res){
        try {
            const {firstName,lastName,email,password,userType,phone,organizationName} = req.body;
           let user = await userModel.findOne({email});
           if (user) return res.status(400).json({ success : false, message: "Email Already Exists"});
           user =  new userModel({firstName,lastName,email,password,userType,phone,organizationName})
           const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            const payload = {id: user.id};
            jwt.sign(
                    payload,
                    "healthapp", {
                        expiresIn: '10d'
                    },
                    (err, token) => {
                        if (err) throw err;
                    res.status(200).json({
                    success: true, message : 
                    {
                        token : token,
                        firstName  : user.firstName,
                        lastName  : user.lastName,
                        email : user.email,
                        phoneNumber : user.phone,
                        userType : user.userType,
                        organizationName:user.organizationName
                    }
                    });
                    }
            );
           }
           catch (error) {
            console.log('error',error)
               res.status(400).json({success : false,message: error.message})
           }
    },

    login : async function(req, res){
        console.log('cominerg')
        try {
            const {email,password} = req.body;
           let user = await userModel.findOne({email, active : 1});
           if (user) {
                const validPassword = await bcrypt.compare(password, user.password);
               if(validPassword){
                            const payload = {
                                   id: user.id
                           };
       
                        jwt.sign(
                               payload,
                               "healthapp", {
                                   expiresIn: '10d'
                               },
                           (err, token) => {
                                   if (err) throw err;
                                   //sendEmail("mishra.abhi8888@gmail.com")
                                   res.status(200).json({
                                           success: true, message :
                                               {	
                                                  token : token,
                                                  firstName  : user.firstName,
                                                  lastName  : user.lastName,
                                                  email : user.email,
                                                  id:user._id,
                                                  phoneNumber : user.phone,
                                                  userType : user.userType,
                                                  organizationName : user.organizationName,
                                               }
                                       });
                               }
                       );
               }
               else{
                   return res.status(400).json({
                                       success : false, message: "Invalid email/password"
                               });
               }
                }
            else
                {
                return res.status(400).json({
                   success:false, message:"No user exists"
                    });
                }
           }
           catch (error) {
               res.status(400).json({success : false,message: error.message})
           }
    },
}

