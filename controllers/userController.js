const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");



module.exports = {
    getallUsers : async function(req, res) { 
        try{
            const {type} = req.body
            jwt.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function(err, user){
                var users = await userModel.find({userType : type}).sort([['_id', -1]]).lean();
                if(type == 2){
                    for(var i = 0 ; i < users.length ; i++){
                        if(users[i].partnerId != null){
                            var partner = await userModel.findOne({_id:users[i].partnerId})
                            users[i].partner = partner
                        }
                    }
                }
                res.status(200).json({success : true, message: users})
            })
        }
        catch (error) {
            res.status(400).json({success : false,message: error.message})
        }
    },
    getallUsersAssigned : async function(req, res) { 
        try{
            const {id} = req.body
            jwt.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function(err, user){
                const users = await userModel.find({partnerId : id}).sort([['_id', -1]]);
               

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
            const users = await userModel.findOne({_id : req.body.id});
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
            jwt.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function(err, users){
                const {firstName,lastName,gender,phone,email,dob,address,city,state,country,active,pincode,userType,partnerId,deviceId,organizationName,password} = req.body          
                let user = await userModel.findOne({email});
                let partner = '';
                if(userType === 2){
                     partner = await userModel.findOne({_id:partnerId}) 
                    console.log('paer',partner)
                }
                if (user) return res.status(400).json({ success : false, message: "Email Already Exists"});
                user =  new userModel({firstName,lastName,gender,phone,email,userType,dob,address,city,state,country,active,pincode,partnerId,deviceId,organizationName})
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
                await user.save();
                if(userType === 2){
                    res.status(200).json({status:false,message:
                        {	
                            message : "Added User Successfully",
                            user  : user,
                            partner:partner
                        }})
                }
                if(userType === 1 || userType === 0){
                    res.status(200).json({status:false,message:
                        {	
                            message : "Added User Successfully",
                            user  : user,
                        }})
                }
              
                })
           }
           catch (error) {
            console.log('error',error)
               res.status(400).json({success : false,message: error.message})
           }
           
    },
    updateUser: function(req,res){
        try {
            jwt.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function(err, users){
                const {firstName,lastName,gender,phone,email,dob,userType,healthActivity,profileImageUrl,description,
                    coverImageUrl,category,address,city,password,state,country,active,pincode,organizationName,partnerId,deviceId,id} = req.body
                let user = await userModel.findOne({_id:id}) 
                if(!user) return  res.status(400).json({status:false,message: "No User Exist"})
                user = await userModel.findOneAndUpdate({_id:id},{
                    firstName:firstName
                    ,lastName:lastName
                    ,gender:gender
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
                    ,password:password
                    ,organizationName:organizationName
                    ,partnerId:partnerId
                    ,deviceId:deviceId 
                },{
                    new:true
                })
                await user.save();
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
            jwt.verify(req.headers.authorization.split(' ')[1], 'healthapp', async function(err, users){
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
    getState : async function(req, res){
        try{
            var stateList = [
            {
                "state_name": "Andaman and Nicobar Islands"
            },
            {
                "state_name": "Andhra Pradesh"
            },
            {
                "state_name": "Arunachal Pradesh"
            },
            {
                "state_name": "Assam"
            },
            {
                "state_name": "Bihar"
            },
            {
                "state_name": "Chandigarh"
            },
            {
                "state_name": "Chhattisgarh"
            },
            {
                "state_name": "Dadra and Nagar Haveli"
            },
            {
                "state_name": "Daman and Diu"
            },
            {
                "state_name": "Delhi"
            },
            {
                "state_name": "Goa"
            },
            {
                "state_name": "Gujarat"
            },
            {
                "state_name": "Haryana"
            },
            {
                "state_name": "Himachal Pradesh"
            },
            {
                "state_name": "Jammu and Kashmir"
            },
            {
                "state_name": "Jharkhand"
            },
            {
                "state_name": "Karnataka"
            },
            {
                "state_name": "Kerala"
            },
            {
                "state_name": "Ladakh"
            },
            {
                "state_name": "Lakshadweep"
            },
            {
                "state_name": "Madhya Pradesh"
            },
            {
                "state_name": "Maharashtra"
            },
            {
                "state_name": "Manipur"
            },
            {
                "state_name": "Meghalaya"
            },
            {
                "state_name": "Mizoram"
            },
            {
                "state_name": "Nagaland"
            },
            {
                "state_name": "Odisha"
            },
            {
                "state_name": "Pondicherry"
            },
            {
                "state_name": "Punjab"
            },
            {
                "state_name": "Rajasthan"
            },
            {
                "state_name": "Sikkim"
            },
            {
                "state_name": "Tamil Nadu"
            },
            {
                "state_name": "Telangana"
            },
            {
                "state_name": "Tripura"
            },
            {
                "state_name": "Uttar Pradesh"
            },
            {
                "state_name": "Uttarakhand"
            },
            {
                "state_name": "West Bengal"
            }]
            res.status(200).json({success : true ,message: stateList})
        }
        catch (error) {
            res.status(200).json({success : false,message: error.message})
        }
    },
    getCity : async function(req, res){
        try{
            var andaman = [
                {
                    "city_name": "Bombuflat"
                },
                {
                    "city_name": "Garacharma"
                },
                {
                    "city_name": "Port Blair"
                },
                {
                    "city_name": "Rangat"
                }
            ]
            var Maharashtra = [
                {
                    "city_name": "Achalpur"
                },
                {
                    "city_name": "Andheri"
                },
                {
                    "city_name": "Ahmadnagar Cantonment"
                },
                {
                    "city_name": "Ahmadpur"
                },
                {
                    "city_name": "Ahmednagar"
                },
                {
                    "city_name": "Ajra"
                },
                {
                    "city_name": "Akalkot"
                },
                {
                    "city_name": "Akkalkuwa"
                },
                {
                    "city_name": "Akola"
                },
                {
                    "city_name": "Akot"
                },
                {
                    "city_name": "Alandi"
                },
                {
                    "city_name": "Alibag"
                },
                {
                    "city_name": "Allapalli"
                },
                {
                    "city_name": "Alore"
                },
                {
                    "city_name": "Amalner"
                },
                {
                    "city_name": "Ambad"
                },
                {
                    "city_name": "Ambajogai"
                },
                {
                    "city_name": "Ambernath"
                },
                {
                    "city_name": "Ambivali Tarf Wankhal"
                },
                {
                    "city_name": "Amgaon"
                },
                {
                    "city_name": "Amravati"
                },
                {
                    "city_name": "Anjangaon"
                },
                {
                    "city_name": "Arvi"
                },
                {
                    "city_name": "Ashta"
                },
                {
                    "city_name": "Ashti"
                },
                {
                    "city_name": "Aurangabad"
                },
                {
                    "city_name": "Aurangabad Cantonment"
                },
                {
                    "city_name": "Ausa"
                },
                {
                    "city_name": "Babhulgaon"
                },
                {
                    "city_name": "Badlapur"
                },
                {
                    "city_name": "Balapur"
                },
                {
                    "city_name": "Ballarpur"
                },
                {
                    "city_name": "Baramati"
                },
                {
                    "city_name": "Barshi"
                },
                {
                    "city_name": "Basmat"
                },
                {
                    "city_name": "Beed"
                },
                {
                    "city_name": "Bhadravati"
                },
                {
                    "city_name": "Bhagur"
                },
                {
                    "city_name": "Bhandara"
                },
                {
                    "city_name": "Bhigvan"
                },
                {
                    "city_name": "Bhingar"
                },
                {
                    "city_name": "Bhiwandi"
                },
                {
                    "city_name": "Bhokhardan"
                },
                {
                    "city_name": "Bhor"
                },
                {
                    "city_name": "Bhosari"
                },
                {
                    "city_name": "Bhum"
                },
                {
                    "city_name": "Bhusawal"
                },
                {
                    "city_name": "Bid"
                },
                {
                    "city_name": "Biloli"
                },
                {
                    "city_name": "Birwadi"
                },
                {
                    "city_name": "Boisar"
                },
                {
                    "city_name": "Bop Khel"
                },
                {
                    "city_name": "Brahmapuri"
                },
                {
                    "city_name": "Budhgaon"
                },
                {
                    "city_name": "Buldana"
                },
                {
                    "city_name": "Buldhana"
                },
                {
                    "city_name": "Butibori"
                },
                {
                    "city_name": "Chakan"
                },
                {
                    "city_name": "Chalisgaon"
                },
                {
                    "city_name": "Chandrapur"
                },
                {
                    "city_name": "Chandur"
                },
                {
                    "city_name": "Chandur Bazar"
                },
                {
                    "city_name": "Chandvad"
                },
                {
                    "city_name": "Chicholi"
                },
                {
                    "city_name": "Chikhala"
                },
                {
                    "city_name": "Chikhaldara"
                },
                {
                    "city_name": "Chikhli"
                },
                {
                    "city_name": "Chinchani"
                },
                {
                    "city_name": "Chinchwad"
                },
                {
                    "city_name": "Chiplun"
                },
                {
                    "city_name": "Chopda"
                },
                {
                    "city_name": "Dabhol"
                },
                {
                    "city_name": "Dahance"
                },
                {
                    "city_name": "Dahanu"
                },
                {
                    "city_name": "Daharu"
                },
                {
                    "city_name": "Dapoli Camp"
                },
                {
                    "city_name": "Darwa"
                },
                {
                    "city_name": "Daryapur"
                },
                {
                    "city_name": "Dattapur"
                },
                {
                    "city_name": "Daund"
                },
                {
                    "city_name": "Davlameti"
                },
                {
                    "city_name": "Deglur"
                },
                {
                    "city_name": "Dehu Road"
                },
                {
                    "city_name": "Deolali"
                },
                {
                    "city_name": "Deolali Pravara"
                },
                {
                    "city_name": "Deoli"
                },
                {
                    "city_name": "Desaiganj"
                },
                {
                    "city_name": "Deulgaon Raja"
                },
                {
                    "city_name": "Dewhadi"
                },
                {
                    "city_name": "Dharangaon"
                },
                {
                    "city_name": "Dharmabad"
                },
                {
                    "city_name": "Dharur"
                },
                {
                    "city_name": "Dhatau"
                },
                {
                    "city_name": "Dhule"
                },
                {
                    "city_name": "Digdoh"
                },
                {
                    "city_name": "Diglur"
                },
                {
                    "city_name": "Digras"
                },
                {
                    "city_name": "Dombivli"
                },
                {
                    "city_name": "Dondaicha"
                },
                {
                    "city_name": "Dudhani"
                },
                {
                    "city_name": "Durgapur"
                },
                {
                    "city_name": "Dyane"
                },
                {
                    "city_name": "Edandol"
                },
                {
                    "city_name": "Eklahare"
                },
                {
                    "city_name": "Faizpur"
                },
                {
                    "city_name": "Fekari"
                },
                {
                    "city_name": "Gadchiroli"
                },
                {
                    "city_name": "Gadhinghaj"
                },
                {
                    "city_name": "Gandhi Nagar"
                },
                {
                    "city_name": "Ganeshpur"
                },
                {
                    "city_name": "Gangakher"
                },
                {
                    "city_name": "Gangapur"
                },
                {
                    "city_name": "Gevrai"
                },
                {
                    "city_name": "Ghatanji"
                },
                {
                    "city_name": "Ghoti"
                },
                {
                    "city_name": "Ghugus"
                },
                {
                    "city_name": "Ghulewadi"
                },
                {
                    "city_name": "Godoli"
                },
                {
                    "city_name": "Gondia"
                },
                {
                    "city_name": "Guhagar"
                },
                {
                    "city_name": "Hadgaon"
                },
                {
                    "city_name": "Harnai Beach"
                },
                {
                    "city_name": "Hinganghat"
                },
                {
                    "city_name": "Hingoli"
                },
                {
                    "city_name": "Hupari"
                },
                {
                    "city_name": "Ichalkaranji"
                },
                {
                    "city_name": "Igatpuri"
                },
                {
                    "city_name": "Indapur"
                },
                {
                    "city_name": "Jaisinghpur"
                },
                {
                    "city_name": "Jalgaon"
                },
                {
                    "city_name": "Jalna"
                },
                {
                    "city_name": "Jamkhed"
                },
                {
                    "city_name": "Jawhar"
                },
                {
                    "city_name": "Jaysingpur"
                },
                {
                    "city_name": "Jejuri"
                },
                {
                    "city_name": "Jintur"
                },
                {
                    "city_name": "Junnar"
                },
                {
                    "city_name": "Kabnur"
                },
                {
                    "city_name": "Kagal"
                },
                {
                    "city_name": "Kalamb"
                },
                {
                    "city_name": "Kalamnuri"
                },
                {
                    "city_name": "Kalas"
                },
                {
                    "city_name": "Kalmeshwar"
                },
                {
                    "city_name": "Kalundre"
                },
                {
                    "city_name": "Kalyan"
                },
                {
                    "city_name": "Kamthi"
                },
                {
                    "city_name": "Kamthi Cantonment"
                },
                {
                    "city_name": "Kandari"
                },
                {
                    "city_name": "Kandhar"
                },
                {
                    "city_name": "Kandri"
                },
                {
                    "city_name": "Kandri II"
                },
                {
                    "city_name": "Kanhan"
                },
                {
                    "city_name": "Kankavli"
                },
                {
                    "city_name": "Kannad"
                },
                {
                    "city_name": "Karad"
                },
                {
                    "city_name": "Karanja"
                },
                {
                    "city_name": "Karanje Tarf"
                },
                {
                    "city_name": "Karivali"
                },
                {
                    "city_name": "Karjat"
                },
                {
                    "city_name": "Karmala"
                },
                {
                    "city_name": "Kasara Budruk"
                },
                {
                    "city_name": "Katai"
                },
                {
                    "city_name": "Katkar"
                },
                {
                    "city_name": "Katol"
                },
                {
                    "city_name": "Kegaon"
                },
                {
                    "city_name": "Khadkale"
                },
                {
                    "city_name": "Khadki"
                },
                {
                    "city_name": "Khamgaon"
                },
                {
                    "city_name": "Khapa"
                },
                {
                    "city_name": "Kharadi"
                },
                {
                    "city_name": "Kharakvasla"
                },
                {
                    "city_name": "Khed"
                },
                {
                    "city_name": "Kherdi"
                },
                {
                    "city_name": "Khoni"
                },
                {
                    "city_name": "Khopoli"
                },
                {
                    "city_name": "Khuldabad"
                },
                {
                    "city_name": "Kinwat"
                },
                {
                    "city_name": "Kodoli"
                },
                {
                    "city_name": "Kolhapur"
                },
                {
                    "city_name": "Kon"
                },
                {
                    "city_name": "Kondumal"
                },
                {
                    "city_name": "Kopargaon"
                },
                {
                    "city_name": "Kopharad"
                },
                {
                    "city_name": "Koradi"
                },
                {
                    "city_name": "Koregaon"
                },
                {
                    "city_name": "Korochi"
                },
                {
                    "city_name": "Kudal"
                },
                {
                    "city_name": "Kundaim"
                },
                {
                    "city_name": "Kundalwadi"
                },
                {
                    "city_name": "Kurandvad"
                },
                {
                    "city_name": "Kurduvadi"
                },
                {
                    "city_name": "Kusgaon Budruk"
                },
                {
                    "city_name": "Lanja"
                },
                {
                    "city_name": "Lasalgaon"
                },
                {
                    "city_name": "Latur"
                },
                {
                    "city_name": "Loha"
                },
                {
                    "city_name": "Lohegaon"
                },
                {
                    "city_name": "Lonar"
                },
                {
                    "city_name": "Lonavala"
                },
                {
                    "city_name": "Madhavnagar"
                },
                {
                    "city_name": "Mahabaleshwar"
                },
                {
                    "city_name": "Mahad"
                },
                {
                    "city_name": "Mahadula"
                },
                {
                    "city_name": "Maindargi"
                },
                {
                    "city_name": "Majalgaon"
                },
                {
                    "city_name": "Malegaon"
                },
                {
                    "city_name": "Malgaon"
                },
                {
                    "city_name": "Malkapur"
                },
                {
                    "city_name": "Malwan"
                },
                {
                    "city_name": "Manadur"
                },
                {
                    "city_name": "Manchar"
                },
                {
                    "city_name": "Mangalvedhe"
                },
                {
                    "city_name": "Mangrul Pir"
                },
                {
                    "city_name": "Manmad"
                },
                {
                    "city_name": "Manor"
                },
                {
                    "city_name": "Mansar"
                },
                {
                    "city_name": "Manwath"
                },
                {
                    "city_name": "Mapuca"
                },
                {
                    "city_name": "Matheran"
                },
                {
                    "city_name": "Mehkar"
                },
                {
                    "city_name": "Mhasla"
                },
                {
                    "city_name": "Mhaswad"
                },
                {
                    "city_name": "Mira Bhayandar"
                },
                {
                    "city_name": "Miraj"
                },
                {
                    "city_name": "Mohpa"
                },
                {
                    "city_name": "Mohpada"
                },
                {
                    "city_name": "Moram"
                },
                {
                    "city_name": "Morshi"
                },
                {
                    "city_name": "Mowad"
                },
                {
                    "city_name": "Mudkhed"
                },
                {
                    "city_name": "Mukhed"
                },
                {
                    "city_name": "Mul"
                },
                {
                    "city_name": "Mulshi"
                },
                {
                    "city_name": "Mumbai"
                },
                {
                    "city_name": "Murbad"
                },
                {
                    "city_name": "Murgud"
                },
                {
                    "city_name": "Murtijapur"
                },
                {
                    "city_name": "Murud"
                },
                {
                    "city_name": "Nachane"
                },
                {
                    "city_name": "Nagardeole"
                },
                {
                    "city_name": "Nagothane"
                },
                {
                    "city_name": "Nagpur"
                },
                {
                    "city_name": "Nakoda"
                },
                {
                    "city_name": "Nalasopara"
                },
                {
                    "city_name": "Naldurg"
                },
                {
                    "city_name": "Nanded"
                },
                {
                    "city_name": "Nandgaon"
                },
                {
                    "city_name": "Nandura"
                },
                {
                    "city_name": "Nandurbar"
                },
                {
                    "city_name": "Narkhed"
                },
                {
                    "city_name": "Nashik"
                },
                {
                    "city_name": "Navapur"
                },
                {
                    "city_name": "Navi Mumbai"
                },
                {
                    "city_name": "Navi Mumbai Panvel"
                },
                {
                    "city_name": "Neral"
                },
                {
                    "city_name": "Nigdi"
                },
                {
                    "city_name": "Nilanga"
                },
                {
                    "city_name": "Nildoh"
                },
                {
                    "city_name": "Nimbhore"
                },
                {
                    "city_name": "Ojhar"
                },
                {
                    "city_name": "Osmanabad"
                },
                {
                    "city_name": "Pachgaon"
                },
                {
                    "city_name": "Pachora"
                },
                {
                    "city_name": "Padagha"
                },
                {
                    "city_name": "Paithan"
                },
                {
                    "city_name": "Palghar"
                },
                {
                    "city_name": "Pali"
                },
                {
                    "city_name": "Panchgani"
                },
                {
                    "city_name": "Pandhakarwada"
                },
                {
                    "city_name": "Pandharpur"
                },
                {
                    "city_name": "Panhala"
                },
                {
                    "city_name": "Panvel"
                },
                {
                    "city_name": "Paranda"
                },
                {
                    "city_name": "Parbhani"
                },
                {
                    "city_name": "Parli"
                },
                {
                    "city_name": "Parola"
                },
                {
                    "city_name": "Partur"
                },
                {
                    "city_name": "Pasthal"
                },
                {
                    "city_name": "Patan"
                },
                {
                    "city_name": "Pathardi"
                },
                {
                    "city_name": "Pathri"
                },
                {
                    "city_name": "Patur"
                },
                {
                    "city_name": "Pawni"
                },
                {
                    "city_name": "Pen"
                },
                {
                    "city_name": "Pethumri"
                },
                {
                    "city_name": "Phaltan"
                },
                {
                    "city_name": "Pimpri"
                },
                {
                    "city_name": "Poladpur"
                },
                {
                    "city_name": "Pulgaon"
                },
                {
                    "city_name": "Pune"
                },
                {
                    "city_name": "Pune Cantonment"
                },
                {
                    "city_name": "Purna"
                },
                {
                    "city_name": "Purushottamnagar"
                },
                {
                    "city_name": "Pusad"
                },
                {
                    "city_name": "Rahimatpur"
                },
                {
                    "city_name": "Rahta Pimplas"
                },
                {
                    "city_name": "Rahuri"
                },
                {
                    "city_name": "Raigad"
                },
                {
                    "city_name": "Rajapur"
                },
                {
                    "city_name": "Rajgurunagar"
                },
                {
                    "city_name": "Rajur"
                },
                {
                    "city_name": "Rajura"
                },
                {
                    "city_name": "Ramtek"
                },
                {
                    "city_name": "Ratnagiri"
                },
                {
                    "city_name": "Ravalgaon"
                },
                {
                    "city_name": "Raver"
                },
                {
                    "city_name": "Revadanda"
                },
                {
                    "city_name": "Risod"
                },
                {
                    "city_name": "Roha Ashtami"
                },
                {
                    "city_name": "Sakri"
                },
                {
                    "city_name": "Sandor"
                },
                {
                    "city_name": "Sangamner"
                },
                {
                    "city_name": "Sangli"
                },
                {
                    "city_name": "Sangole"
                },
                {
                    "city_name": "Sasti"
                },
                {
                    "city_name": "Sasvad"
                },
                {
                    "city_name": "Satana"
                },
                {
                    "city_name": "Satara"
                },
                {
                    "city_name": "Savantvadi"
                },
                {
                    "city_name": "Savda"
                },
                {
                    "city_name": "Savner"
                },
                {
                    "city_name": "Sawari Jawharnagar"
                },
                {
                    "city_name": "Selu"
                },
                {
                    "city_name": "Shahada"
                },
                {
                    "city_name": "Shahapur"
                },
                {
                    "city_name": "Shegaon"
                },
                {
                    "city_name": "Shelar"
                },
                {
                    "city_name": "Shendurjana"
                },
                {
                    "city_name": "Shirdi"
                },
                {
                    "city_name": "Shirgaon"
                },
                {
                    "city_name": "Shirpur"
                },
                {
                    "city_name": "Shirur"
                },
                {
                    "city_name": "Shirwal"
                },
                {
                    "city_name": "Shivatkar"
                },
                {
                    "city_name": "Shrigonda"
                },
                {
                    "city_name": "Shrirampur"
                },
                {
                    "city_name": "Shrirampur Rural"
                },
                {
                    "city_name": "Sillewada"
                },
                {
                    "city_name": "Sillod"
                },
                {
                    "city_name": "Sindhudurg"
                },
                {
                    "city_name": "Sindi"
                },
                {
                    "city_name": "Sindi Turf Hindnagar"
                },
                {
                    "city_name": "Sindkhed Raja"
                },
                {
                    "city_name": "Singnapur"
                },
                {
                    "city_name": "Sinnar"
                },
                {
                    "city_name": "Sirur"
                },
                {
                    "city_name": "Sitasawangi"
                },
                {
                    "city_name": "Solapur"
                },
                {
                    "city_name": "Sonai"
                },
                {
                    "city_name": "Sonegaon"
                },
                {
                    "city_name": "Soyagaon"
                },
                {
                    "city_name": "Srivardhan"
                },
                {
                    "city_name": "Surgana"
                },
                {
                    "city_name": "Talegaon Dabhade"
                },
                {
                    "city_name": "Taloda"
                },
                {
                    "city_name": "Taloja"
                },
                {
                    "city_name": "Talwade"
                },
                {
                    "city_name": "Tarapur"
                },
                {
                    "city_name": "Tasgaon"
                },
                {
                    "city_name": "Tathavade"
                },
                {
                    "city_name": "Tekadi"
                },
                {
                    "city_name": "Telhara"
                },
                {
                    "city_name": "Thane"
                },
                {
                    "city_name": "Tirira"
                },
                {
                    "city_name": "Totaladoh"
                },
                {
                    "city_name": "Trimbak"
                },
                {
                    "city_name": "Tuljapur"
                },
                {
                    "city_name": "Tumsar"
                },
                {
                    "city_name": "Uchgaon"
                },
                {
                    "city_name": "Udgir"
                },
                {
                    "city_name": "Ulhasnagar"
                },
                {
                    "city_name": "Umarga"
                },
                {
                    "city_name": "Umarkhed"
                },
                {
                    "city_name": "Umarsara"
                },
                {
                    "city_name": "Umbar Pada Nandade"
                },
                {
                    "city_name": "Umred"
                },
                {
                    "city_name": "Umri Pragane Balapur"
                },
                {
                    "city_name": "Uran"
                },
                {
                    "city_name": "Uran Islampur"
                },
                {
                    "city_name": "Utekhol"
                },
                {
                    "city_name": "Vada"
                },
                {
                    "city_name": "Vadgaon"
                },
                {
                    "city_name": "Vadgaon Kasba"
                },
                {
                    "city_name": "Vaijapur"
                },
                {
                    "city_name": "Vanvadi"
                },
                {
                    "city_name": "Varangaon"
                },
                {
                    "city_name": "Vasai"
                },
                {
                    "city_name": "Vasantnagar"
                },
                {
                    "city_name": "Vashind"
                },
                {
                    "city_name": "Vengurla"
                },
                {
                    "city_name": "Virar"
                },
                {
                    "city_name": "Visapur"
                },
                {
                    "city_name": "Vite"
                },
                {
                    "city_name": "Vithalwadi"
                },
                {
                    "city_name": "Wadi"
                },
                {
                    "city_name": "Waghapur"
                },
                {
                    "city_name": "Wai"
                },
                {
                    "city_name": "Wajegaon"
                },
                {
                    "city_name": "Walani"
                },
                {
                    "city_name": "Wanadongri"
                },
                {
                    "city_name": "Wani"
                },
                {
                    "city_name": "Wardha"
                },
                {
                    "city_name": "Warora"
                },
                {
                    "city_name": "Warthi"
                },
                {
                    "city_name": "Warud"
                },
                {
                    "city_name": "Washim"
                },
                {
                    "city_name": "Yaval"
                },
                {
                    "city_name": "Yavatmal"
                },
                {
                    "city_name": "Yeola"
                },
                {
                    "city_name": "Yerkheda"
                }
            ]
            var andhra = [
                {
                    "city_name": "Addanki"
                },
                {
                    "city_name": "Adivivaram"
                },
                {
                    "city_name": "Adoni"
                },
                {
                    "city_name": "Aganampudi"
                },
                {
                    "city_name": "Ajjaram"
                },
                {
                    "city_name": "Akividu"
                },
                {
                    "city_name": "Akkarampalle"
                },
                {
                    "city_name": "Akkayapalle"
                },
                {
                    "city_name": "Akkireddipalem"
                },
                {
                    "city_name": "Alampur"
                },
                {
                    "city_name": "Amalapuram"
                },
                {
                    "city_name": "Amudalavalasa"
                },
                {
                    "city_name": "Amur"
                },
                {
                    "city_name": "Anakapalle"
                },
                {
                    "city_name": "Anantapur"
                },
                {
                    "city_name": "Andole"
                },
                {
                    "city_name": "Atmakur"
                },
                {
                    "city_name": "Attili"
                },
                {
                    "city_name": "Avanigadda"
                },
                {
                    "city_name": "Badepalli"
                },
                {
                    "city_name": "Badvel"
                },
                {
                    "city_name": "Balapur"
                },
                {
                    "city_name": "Bandarulanka"
                },
                {
                    "city_name": "Banganapalle"
                },
                {
                    "city_name": "Bapatla"
                },
                {
                    "city_name": "Bapulapadu"
                },
                {
                    "city_name": "Belampalli"
                },
                {
                    "city_name": "Bestavaripeta"
                },
                {
                    "city_name": "Betamcherla"
                },
                {
                    "city_name": "Bhattiprolu"
                },
                {
                    "city_name": "Bhimavaram"
                },
                {
                    "city_name": "Bhimunipatnam"
                },
                {
                    "city_name": "Bobbili"
                },
                {
                    "city_name": "Bombuflat"
                },
                {
                    "city_name": "Bommuru"
                },
                {
                    "city_name": "Bugganipalle"
                },
                {
                    "city_name": "Challapalle"
                },
                {
                    "city_name": "Chandur"
                },
                {
                    "city_name": "Chatakonda"
                },
                {
                    "city_name": "Chemmumiahpet"
                },
                {
                    "city_name": "Chidiga"
                },
                {
                    "city_name": "Chilakaluripet"
                },
                {
                    "city_name": "Chimakurthy"
                },
                {
                    "city_name": "Chinagadila"
                },
                {
                    "city_name": "Chinagantyada"
                },
                {
                    "city_name": "Chinnachawk"
                },
                {
                    "city_name": "Chintalavalasa"
                },
                {
                    "city_name": "Chipurupalle"
                },
                {
                    "city_name": "Chirala"
                },
                {
                    "city_name": "Chittoor"
                },
                {
                    "city_name": "Chodavaram"
                },
                {
                    "city_name": "Choutuppal"
                },
                {
                    "city_name": "Chunchupalle"
                },
                {
                    "city_name": "Cuddapah"
                },
                {
                    "city_name": "Cumbum"
                },
                {
                    "city_name": "Darnakal"
                },
                {
                    "city_name": "Dasnapur"
                },
                {
                    "city_name": "Dauleshwaram"
                },
                {
                    "city_name": "Dharmavaram"
                },
                {
                    "city_name": "Dhone"
                },
                {
                    "city_name": "Dommara Nandyal"
                },
                {
                    "city_name": "Dowlaiswaram"
                },
                {
                    "city_name": "East Godavari Dist."
                },
                {
                    "city_name": "Eddumailaram"
                },
                {
                    "city_name": "Edulapuram"
                },
                {
                    "city_name": "Ekambara kuppam"
                },
                {
                    "city_name": "Eluru"
                },
                {
                    "city_name": "Enikapadu"
                },
                {
                    "city_name": "Fakirtakya"
                },
                {
                    "city_name": "Farrukhnagar"
                },
                {
                    "city_name": "Gaddiannaram"
                },
                {
                    "city_name": "Gajapathinagaram"
                },
                {
                    "city_name": "Gajularega"
                },
                {
                    "city_name": "Gajuvaka"
                },
                {
                    "city_name": "Gannavaram"
                },
                {
                    "city_name": "Garacharma"
                },
                {
                    "city_name": "Garimellapadu"
                },
                {
                    "city_name": "Giddalur"
                },
                {
                    "city_name": "Godavarikhani"
                },
                {
                    "city_name": "Gopalapatnam"
                },
                {
                    "city_name": "Gopalur"
                },
                {
                    "city_name": "Gorrekunta"
                },
                {
                    "city_name": "Gudivada"
                },
                {
                    "city_name": "Gudur"
                },
                {
                    "city_name": "Guntakal"
                },
                {
                    "city_name": "Guntur"
                },
                {
                    "city_name": "Guti"
                },
                {
                    "city_name": "Hindupur"
                },
                {
                    "city_name": "Hukumpeta"
                },
                {
                    "city_name": "Ichchapuram"
                },
                {
                    "city_name": "Isnapur"
                },
                {
                    "city_name": "Jaggayyapeta"
                },
                {
                    "city_name": "Jallaram Kamanpur"
                },
                {
                    "city_name": "Jammalamadugu"
                },
                {
                    "city_name": "Jangampalli"
                },
                {
                    "city_name": "Jarjapupeta"
                },
                {
                    "city_name": "Kadiri"
                },
                {
                    "city_name": "Kaikalur"
                },
                {
                    "city_name": "Kakinada"
                },
                {
                    "city_name": "Kallur"
                },
                {
                    "city_name": "Kalyandurg"
                },
                {
                    "city_name": "Kamalapuram"
                },
                {
                    "city_name": "Kamareddi"
                },
                {
                    "city_name": "Kanapaka"
                },
                {
                    "city_name": "Kanigiri"
                },
                {
                    "city_name": "Kanithi"
                },
                {
                    "city_name": "Kankipadu"
                },
                {
                    "city_name": "Kantabamsuguda"
                },
                {
                    "city_name": "Kanuru"
                },
                {
                    "city_name": "Karnul"
                },
                {
                    "city_name": "Katheru"
                },
                {
                    "city_name": "Kavali"
                },
                {
                    "city_name": "Kazipet"
                },
                {
                    "city_name": "Khanapuram Haveli"
                },
                {
                    "city_name": "Kodar"
                },
                {
                    "city_name": "Kollapur"
                },
                {
                    "city_name": "Kondapalem"
                },
                {
                    "city_name": "Kondapalle"
                },
                {
                    "city_name": "Kondukur"
                },
                {
                    "city_name": "Kosgi"
                },
                {
                    "city_name": "Kothavalasa"
                },
                {
                    "city_name": "Kottapalli"
                },
                {
                    "city_name": "Kovur"
                },
                {
                    "city_name": "Kovurpalle"
                },
                {
                    "city_name": "Kovvur"
                },
                {
                    "city_name": "Krishna"
                },
                {
                    "city_name": "Kuppam"
                },
                {
                    "city_name": "Kurmannapalem"
                },
                {
                    "city_name": "Kurnool"
                },
                {
                    "city_name": "Lakshettipet"
                },
                {
                    "city_name": "Lalbahadur Nagar"
                },
                {
                    "city_name": "Machavaram"
                },
                {
                    "city_name": "Macherla"
                },
                {
                    "city_name": "Machilipatnam"
                },
                {
                    "city_name": "Madanapalle"
                },
                {
                    "city_name": "Madaram"
                },
                {
                    "city_name": "Madhuravada"
                },
                {
                    "city_name": "Madikonda"
                },
                {
                    "city_name": "Madugule"
                },
                {
                    "city_name": "Mahabubnagar"
                },
                {
                    "city_name": "Mahbubabad"
                },
                {
                    "city_name": "Malkajgiri"
                },
                {
                    "city_name": "Mamilapalle"
                },
                {
                    "city_name": "Mancheral"
                },
                {
                    "city_name": "Mandapeta"
                },
                {
                    "city_name": "Mandasa"
                },
                {
                    "city_name": "Mangalagiri"
                },
                {
                    "city_name": "Manthani"
                },
                {
                    "city_name": "Markapur"
                },
                {
                    "city_name": "Marturu"
                },
                {
                    "city_name": "Metpalli"
                },
                {
                    "city_name": "Mindi"
                },
                {
                    "city_name": "Mirpet"
                },
                {
                    "city_name": "Moragudi"
                },
                {
                    "city_name": "Mothugudam"
                },
                {
                    "city_name": "Nagari"
                },
                {
                    "city_name": "Nagireddipalle"
                },
                {
                    "city_name": "Nandigama"
                },
                {
                    "city_name": "Nandikotkur"
                },
                {
                    "city_name": "Nandyal"
                },
                {
                    "city_name": "Narasannapeta"
                },
                {
                    "city_name": "Narasapur"
                },
                {
                    "city_name": "Narasaraopet"
                },
                {
                    "city_name": "Narayanavanam"
                },
                {
                    "city_name": "Narsapur"
                },
                {
                    "city_name": "Narsingi"
                },
                {
                    "city_name": "Narsipatnam"
                },
                {
                    "city_name": "Naspur"
                },
                {
                    "city_name": "Nathayyapalem"
                },
                {
                    "city_name": "Nayudupeta"
                },
                {
                    "city_name": "Nelimaria"
                },
                {
                    "city_name": "Nellore"
                },
                {
                    "city_name": "Nidadavole"
                },
                {
                    "city_name": "Nuzvid"
                },
                {
                    "city_name": "Omerkhan daira"
                },
                {
                    "city_name": "Ongole"
                },
                {
                    "city_name": "Osmania University"
                },
                {
                    "city_name": "Pakala"
                },
                {
                    "city_name": "Palakole"
                },
                {
                    "city_name": "Palakurthi"
                },
                {
                    "city_name": "Palasa"
                },
                {
                    "city_name": "Palempalle"
                },
                {
                    "city_name": "Palkonda"
                },
                {
                    "city_name": "Palmaner"
                },
                {
                    "city_name": "Pamur"
                },
                {
                    "city_name": "Panjim"
                },
                {
                    "city_name": "Papampeta"
                },
                {
                    "city_name": "Parasamba"
                },
                {
                    "city_name": "Parvatipuram"
                },
                {
                    "city_name": "Patancheru"
                },
                {
                    "city_name": "Payakaraopet"
                },
                {
                    "city_name": "Pedagantyada"
                },
                {
                    "city_name": "Pedana"
                },
                {
                    "city_name": "Peddapuram"
                },
                {
                    "city_name": "Pendurthi"
                },
                {
                    "city_name": "Penugonda"
                },
                {
                    "city_name": "Penukonda"
                },
                {
                    "city_name": "Phirangipuram"
                },
                {
                    "city_name": "Pithapuram"
                },
                {
                    "city_name": "Ponnur"
                },
                {
                    "city_name": "Port Blair"
                },
                {
                    "city_name": "Pothinamallayyapalem"
                },
                {
                    "city_name": "Prakasam"
                },
                {
                    "city_name": "Prasadampadu"
                },
                {
                    "city_name": "Prasantinilayam"
                },
                {
                    "city_name": "Proddatur"
                },
                {
                    "city_name": "Pulivendla"
                },
                {
                    "city_name": "Punganuru"
                },
                {
                    "city_name": "Puttur"
                },
                {
                    "city_name": "Qutubullapur"
                },
                {
                    "city_name": "Rajahmundry"
                },
                {
                    "city_name": "Rajamahendri"
                },
                {
                    "city_name": "Rajampet"
                },
                {
                    "city_name": "Rajendranagar"
                },
                {
                    "city_name": "Rajoli"
                },
                {
                    "city_name": "Ramachandrapuram"
                },
                {
                    "city_name": "Ramanayyapeta"
                },
                {
                    "city_name": "Ramapuram"
                },
                {
                    "city_name": "Ramarajupalli"
                },
                {
                    "city_name": "Ramavarappadu"
                },
                {
                    "city_name": "Rameswaram"
                },
                {
                    "city_name": "Rampachodavaram"
                },
                {
                    "city_name": "Ravulapalam"
                },
                {
                    "city_name": "Rayachoti"
                },
                {
                    "city_name": "Rayadrug"
                },
                {
                    "city_name": "Razam"
                },
                {
                    "city_name": "Razole"
                },
                {
                    "city_name": "Renigunta"
                },
                {
                    "city_name": "Repalle"
                },
                {
                    "city_name": "Rishikonda"
                },
                {
                    "city_name": "Salur"
                },
                {
                    "city_name": "Samalkot"
                },
                {
                    "city_name": "Sattenapalle"
                },
                {
                    "city_name": "Seetharampuram"
                },
                {
                    "city_name": "Serilungampalle"
                },
                {
                    "city_name": "Shankarampet"
                },
                {
                    "city_name": "Shar"
                },
                {
                    "city_name": "Singarayakonda"
                },
                {
                    "city_name": "Sirpur"
                },
                {
                    "city_name": "Sirsilla"
                },
                {
                    "city_name": "Sompeta"
                },
                {
                    "city_name": "Sriharikota"
                },
                {
                    "city_name": "Srikakulam"
                },
                {
                    "city_name": "Srikalahasti"
                },
                {
                    "city_name": "Sriramnagar"
                },
                {
                    "city_name": "Sriramsagar"
                },
                {
                    "city_name": "Srisailam"
                },
                {
                    "city_name": "Srisailamgudem Devasthanam"
                },
                {
                    "city_name": "Sulurpeta"
                },
                {
                    "city_name": "Suriapet"
                },
                {
                    "city_name": "Suryaraopet"
                },
                {
                    "city_name": "Tadepalle"
                },
                {
                    "city_name": "Tadepalligudem"
                },
                {
                    "city_name": "Tadpatri"
                },
                {
                    "city_name": "Tallapalle"
                },
                {
                    "city_name": "Tanuku"
                },
                {
                    "city_name": "Tekkali"
                },
                {
                    "city_name": "Tenali"
                },
                {
                    "city_name": "Tigalapahad"
                },
                {
                    "city_name": "Tiruchanur"
                },
                {
                    "city_name": "Tirumala"
                },
                {
                    "city_name": "Tirupati"
                },
                {
                    "city_name": "Tirvuru"
                },
                {
                    "city_name": "Trimulgherry"
                },
                {
                    "city_name": "Tuni"
                },
                {
                    "city_name": "Turangi"
                },
                {
                    "city_name": "Ukkayapalli"
                },
                {
                    "city_name": "Ukkunagaram"
                },
                {
                    "city_name": "Uppal Kalan"
                },
                {
                    "city_name": "Upper Sileru"
                },
                {
                    "city_name": "Uravakonda"
                },
                {
                    "city_name": "Vadlapudi"
                },
                {
                    "city_name": "Vaparala"
                },
                {
                    "city_name": "Vemalwada"
                },
                {
                    "city_name": "Venkatagiri"
                },
                {
                    "city_name": "Venkatapuram"
                },
                {
                    "city_name": "Vepagunta"
                },
                {
                    "city_name": "Vetapalem"
                },
                {
                    "city_name": "Vijayapuri"
                },
                {
                    "city_name": "Vijayapuri South"
                },
                {
                    "city_name": "Vijayawada"
                },
                {
                    "city_name": "Vinukonda"
                },
                {
                    "city_name": "Visakhapatnam"
                },
                {
                    "city_name": "Vizianagaram"
                },
                {
                    "city_name": "Vuyyuru"
                },
                {
                    "city_name": "Wanparti"
                },
                {
                    "city_name": "West Godavari Dist."
                },
                {
                    "city_name": "Yadagirigutta"
                },
                {
                    "city_name": "Yarada"
                },
                {
                    "city_name": "Yellamanchili"
                },
                {
                    "city_name": "Yemmiganur"
                },
                {
                    "city_name": "Yenamalakudru"
                },
                {
                    "city_name": "Yendada"
                },
                {
                    "city_name": "Yerraguntla"
                }
            ]
            var arunchal = [
                {
                    "city_name": "Along"
                },
                {
                    "city_name": "Basar"
                },
                {
                    "city_name": "Bondila"
                },
                {
                    "city_name": "Changlang"
                },
                {
                    "city_name": "Daporijo"
                },
                {
                    "city_name": "Deomali"
                },
                {
                    "city_name": "Itanagar"
                },
                {
                    "city_name": "Jairampur"
                },
                {
                    "city_name": "Khonsa"
                },
                {
                    "city_name": "Naharlagun"
                },
                {
                    "city_name": "Namsai"
                },
                {
                    "city_name": "Pasighat"
                },
                {
                    "city_name": "Roing"
                },
                {
                    "city_name": "Seppa"
                },
                {
                    "city_name": "Tawang"
                },
                {
                    "city_name": "Tezu"
                },
                {
                    "city_name": "Ziro"
                }
            ]
            var assam = [
                {
                    "city_name": "Abhayapuri"
                },
                {
                    "city_name": "Ambikapur"
                },
                {
                    "city_name": "Amguri"
                },
                {
                    "city_name": "Anand Nagar"
                },
                {
                    "city_name": "Badarpur"
                },
                {
                    "city_name": "Badarpur Railway Town"
                },
                {
                    "city_name": "Bahbari Gaon"
                },
                {
                    "city_name": "Bamun Sualkuchi"
                },
                {
                    "city_name": "Barbari"
                },
                {
                    "city_name": "Barpathar"
                },
                {
                    "city_name": "Barpeta"
                },
                {
                    "city_name": "Barpeta Road"
                },
                {
                    "city_name": "Basugaon"
                },
                {
                    "city_name": "Bihpuria"
                },
                {
                    "city_name": "Bijni"
                },
                {
                    "city_name": "Bilasipara"
                },
                {
                    "city_name": "Biswanath Chariali"
                },
                {
                    "city_name": "Bohori"
                },
                {
                    "city_name": "Bokajan"
                },
                {
                    "city_name": "Bokokhat"
                },
                {
                    "city_name": "Bongaigaon"
                },
                {
                    "city_name": "Bongaigaon Petro-chemical Town"
                },
                {
                    "city_name": "Borgolai"
                },
                {
                    "city_name": "Chabua"
                },
                {
                    "city_name": "Chandrapur Bagicha"
                },
                {
                    "city_name": "Chapar"
                },
                {
                    "city_name": "Chekonidhara"
                },
                {
                    "city_name": "Choto Haibor"
                },
                {
                    "city_name": "Dergaon"
                },
                {
                    "city_name": "Dharapur"
                },
                {
                    "city_name": "Dhekiajuli"
                },
                {
                    "city_name": "Dhemaji"
                },
                {
                    "city_name": "Dhing"
                },
                {
                    "city_name": "Dhubri"
                },
                {
                    "city_name": "Dhuburi"
                },
                {
                    "city_name": "Dibrugarh"
                },
                {
                    "city_name": "Digboi"
                },
                {
                    "city_name": "Digboi Oil Town"
                },
                {
                    "city_name": "Dimaruguri"
                },
                {
                    "city_name": "Diphu"
                },
                {
                    "city_name": "Dispur"
                },
                {
                    "city_name": "Doboka"
                },
                {
                    "city_name": "Dokmoka"
                },
                {
                    "city_name": "Donkamokan"
                },
                {
                    "city_name": "Duliagaon"
                },
                {
                    "city_name": "Duliajan"
                },
                {
                    "city_name": "Duliajan No.1"
                },
                {
                    "city_name": "Dum Duma"
                },
                {
                    "city_name": "Durga Nagar"
                },
                {
                    "city_name": "Gauripur"
                },
                {
                    "city_name": "Goalpara"
                },
                {
                    "city_name": "Gohpur"
                },
                {
                    "city_name": "Golaghat"
                },
                {
                    "city_name": "Golakganj"
                },
                {
                    "city_name": "Gossaigaon"
                },
                {
                    "city_name": "Guwahati"
                },
                {
                    "city_name": "Haflong"
                },
                {
                    "city_name": "Hailakandi"
                },
                {
                    "city_name": "Hamren"
                },
                {
                    "city_name": "Hauli"
                },
                {
                    "city_name": "Hauraghat"
                },
                {
                    "city_name": "Hojai"
                },
                {
                    "city_name": "Jagiroad"
                },
                {
                    "city_name": "Jagiroad Paper Mill"
                },
                {
                    "city_name": "Jogighopa"
                },
                {
                    "city_name": "Jonai Bazar"
                },
                {
                    "city_name": "Jorhat"
                },
                {
                    "city_name": "Kampur Town"
                },
                {
                    "city_name": "Kamrup"
                },
                {
                    "city_name": "Kanakpur"
                },
                {
                    "city_name": "Karimganj"
                },
                {
                    "city_name": "Kharijapikon"
                },
                {
                    "city_name": "Kharupetia"
                },
                {
                    "city_name": "Kochpara"
                },
                {
                    "city_name": "Kokrajhar"
                },
                {
                    "city_name": "Kumar Kaibarta Gaon"
                },
                {
                    "city_name": "Lakhimpur"
                },
                {
                    "city_name": "Lakhipur"
                },
                {
                    "city_name": "Lala"
                },
                {
                    "city_name": "Lanka"
                },
                {
                    "city_name": "Lido Tikok"
                },
                {
                    "city_name": "Lido Town"
                },
                {
                    "city_name": "Lumding"
                },
                {
                    "city_name": "Lumding Railway Colony"
                },
                {
                    "city_name": "Mahur"
                },
                {
                    "city_name": "Maibong"
                },
                {
                    "city_name": "Majgaon"
                },
                {
                    "city_name": "Makum"
                },
                {
                    "city_name": "Mangaldai"
                },
                {
                    "city_name": "Mankachar"
                },
                {
                    "city_name": "Margherita"
                },
                {
                    "city_name": "Mariani"
                },
                {
                    "city_name": "Marigaon"
                },
                {
                    "city_name": "Moran"
                },
                {
                    "city_name": "Moranhat"
                },
                {
                    "city_name": "Nagaon"
                },
                {
                    "city_name": "Naharkatia"
                },
                {
                    "city_name": "Nalbari"
                },
                {
                    "city_name": "Namrup"
                },
                {
                    "city_name": "Naubaisa Gaon"
                },
                {
                    "city_name": "Nazira"
                },
                {
                    "city_name": "New Bongaigaon Railway Colony"
                },
                {
                    "city_name": "Niz-Hajo"
                },
                {
                    "city_name": "North Guwahati"
                },
                {
                    "city_name": "Numaligarh"
                },
                {
                    "city_name": "Palasbari"
                },
                {
                    "city_name": "Panchgram"
                },
                {
                    "city_name": "Pathsala"
                },
                {
                    "city_name": "Raha"
                },
                {
                    "city_name": "Rangapara"
                },
                {
                    "city_name": "Rangia"
                },
                {
                    "city_name": "Salakati"
                },
                {
                    "city_name": "Sapatgram"
                },
                {
                    "city_name": "Sarthebari"
                },
                {
                    "city_name": "Sarupathar"
                },
                {
                    "city_name": "Sarupathar Bengali"
                },
                {
                    "city_name": "Senchoagaon"
                },
                {
                    "city_name": "Sibsagar"
                },
                {
                    "city_name": "Silapathar"
                },
                {
                    "city_name": "Silchar"
                },
                {
                    "city_name": "Silchar Part-X"
                },
                {
                    "city_name": "Sonari"
                },
                {
                    "city_name": "Sorbhog"
                },
                {
                    "city_name": "Sualkuchi"
                },
                {
                    "city_name": "Tangla"
                },
                {
                    "city_name": "Tezpur"
                },
                {
                    "city_name": "Tihu"
                },
                {
                    "city_name": "Tinsukia"
                },
                {
                    "city_name": "Titabor"
                },
                {
                    "city_name": "Udalguri"
                },
                {
                    "city_name": "Umrangso"
                },
                {
                    "city_name": "Uttar Krishnapur Part-I"
                }
            ]
            var bihar = [
                {
                    "city_name": "Amarpur"
                },
                {
                    "city_name": "Ara"
                },
                {
                    "city_name": "Araria"
                },
                {
                    "city_name": "Areraj"
                },
                {
                    "city_name": "Asarganj"
                },
                {
                    "city_name": "Aurangabad"
                },
                {
                    "city_name": "Bagaha"
                },
                {
                    "city_name": "Bahadurganj"
                },
                {
                    "city_name": "Bairgania"
                },
                {
                    "city_name": "Bakhtiyarpur"
                },
                {
                    "city_name": "Banka"
                },
                {
                    "city_name": "Banmankhi"
                },
                {
                    "city_name": "Bar Bigha"
                },
                {
                    "city_name": "Barauli"
                },
                {
                    "city_name": "Barauni Oil Township"
                },
                {
                    "city_name": "Barh"
                },
                {
                    "city_name": "Barhiya"
                },
                {
                    "city_name": "Bariapur"
                },
                {
                    "city_name": "Baruni"
                },
                {
                    "city_name": "Begusarai"
                },
                {
                    "city_name": "Behea"
                },
                {
                    "city_name": "Belsand"
                },
                {
                    "city_name": "Bettiah"
                },
                {
                    "city_name": "Bhabua"
                },
                {
                    "city_name": "Bhagalpur"
                },
                {
                    "city_name": "Bhimnagar"
                },
                {
                    "city_name": "Bhojpur"
                },
                {
                    "city_name": "Bihar"
                },
                {
                    "city_name": "Bihar Sharif"
                },
                {
                    "city_name": "Bihariganj"
                },
                {
                    "city_name": "Bikramganj"
                },
                {
                    "city_name": "Birpur"
                },
                {
                    "city_name": "Bodh Gaya"
                },
                {
                    "city_name": "Buxar"
                },
                {
                    "city_name": "Chakia"
                },
                {
                    "city_name": "Chanpatia"
                },
                {
                    "city_name": "Chhapra"
                },
                {
                    "city_name": "Chhatapur"
                },
                {
                    "city_name": "Colgong"
                },
                {
                    "city_name": "Dalsingh Sarai"
                },
                {
                    "city_name": "Darbhanga"
                },
                {
                    "city_name": "Daudnagar"
                },
                {
                    "city_name": "Dehri"
                },
                {
                    "city_name": "Dhaka"
                },
                {
                    "city_name": "Dighwara"
                },
                {
                    "city_name": "Dinapur"
                },
                {
                    "city_name": "Dinapur Cantonment"
                },
                {
                    "city_name": "Dumra"
                },
                {
                    "city_name": "Dumraon"
                },
                {
                    "city_name": "Fatwa"
                },
                {
                    "city_name": "Forbesganj"
                },
                {
                    "city_name": "Gaya"
                },
                {
                    "city_name": "Gazipur"
                },
                {
                    "city_name": "Ghoghardiha"
                },
                {
                    "city_name": "Gogri Jamalpur"
                },
                {
                    "city_name": "Gopalganj"
                },
                {
                    "city_name": "Habibpur"
                },
                {
                    "city_name": "Hajipur"
                },
                {
                    "city_name": "Hasanpur"
                },
                {
                    "city_name": "Hazaribagh"
                },
                {
                    "city_name": "Hilsa"
                },
                {
                    "city_name": "Hisua"
                },
                {
                    "city_name": "Islampur"
                },
                {
                    "city_name": "Jagdispur"
                },
                {
                    "city_name": "Jahanabad"
                },
                {
                    "city_name": "Jamalpur"
                },
                {
                    "city_name": "Jamhaur"
                },
                {
                    "city_name": "Jamui"
                },
                {
                    "city_name": "Janakpur Road"
                },
                {
                    "city_name": "Janpur"
                },
                {
                    "city_name": "Jaynagar"
                },
                {
                    "city_name": "Jha Jha"
                },
                {
                    "city_name": "Jhanjharpur"
                },
                {
                    "city_name": "Jogbani"
                },
                {
                    "city_name": "Kanti"
                },
                {
                    "city_name": "Kasba"
                },
                {
                    "city_name": "Kataiya"
                },
                {
                    "city_name": "Katihar"
                },
                {
                    "city_name": "Khagaria"
                },
                {
                    "city_name": "Khagaul"
                },
                {
                    "city_name": "Kharagpur"
                },
                {
                    "city_name": "Khusrupur"
                },
                {
                    "city_name": "Kishanganj"
                },
                {
                    "city_name": "Koath"
                },
                {
                    "city_name": "Koilwar"
                },
                {
                    "city_name": "Lakhisarai"
                },
                {
                    "city_name": "Lalganj"
                },
                {
                    "city_name": "Lauthaha"
                },
                {
                    "city_name": "Madhepura"
                },
                {
                    "city_name": "Madhubani"
                },
                {
                    "city_name": "Maharajganj"
                },
                {
                    "city_name": "Mahnar Bazar"
                },
                {
                    "city_name": "Mairwa"
                },
                {
                    "city_name": "Makhdumpur"
                },
                {
                    "city_name": "Maner"
                },
                {
                    "city_name": "Manihari"
                },
                {
                    "city_name": "Marhaura"
                },
                {
                    "city_name": "Masaurhi"
                },
                {
                    "city_name": "Mirganj"
                },
                {
                    "city_name": "Mohiuddinagar"
                },
                {
                    "city_name": "Mokama"
                },
                {
                    "city_name": "Motihari"
                },
                {
                    "city_name": "Motipur"
                },
                {
                    "city_name": "Munger"
                },
                {
                    "city_name": "Murliganj"
                },
                {
                    "city_name": "Muzaffarpur"
                },
                {
                    "city_name": "Nabinagar"
                },
                {
                    "city_name": "Narkatiaganj"
                },
                {
                    "city_name": "Nasriganj"
                },
                {
                    "city_name": "Natwar"
                },
                {
                    "city_name": "Naugachhia"
                },
                {
                    "city_name": "Nawada"
                },
                {
                    "city_name": "Nirmali"
                },
                {
                    "city_name": "Nokha"
                },
                {
                    "city_name": "Paharpur"
                },
                {
                    "city_name": "Patna"
                },
                {
                    "city_name": "Phulwari"
                },
                {
                    "city_name": "Piro"
                },
                {
                    "city_name": "Purnia"
                },
                {
                    "city_name": "Pusa"
                },
                {
                    "city_name": "Rafiganj"
                },
                {
                    "city_name": "Raghunathpur"
                },
                {
                    "city_name": "Rajgir"
                },
                {
                    "city_name": "Ramnagar"
                },
                {
                    "city_name": "Raxaul"
                },
                {
                    "city_name": "Revelganj"
                },
                {
                    "city_name": "Rusera"
                },
                {
                    "city_name": "Sagauli"
                },
                {
                    "city_name": "Saharsa"
                },
                {
                    "city_name": "Samastipur"
                },
                {
                    "city_name": "Sasaram"
                },
                {
                    "city_name": "Shahpur"
                },
                {
                    "city_name": "Shaikhpura"
                },
                {
                    "city_name": "Sherghati"
                },
                {
                    "city_name": "Shivhar"
                },
                {
                    "city_name": "Silao"
                },
                {
                    "city_name": "Sitamarhi"
                },
                {
                    "city_name": "Siwan"
                },
                {
                    "city_name": "Sonepur"
                },
                {
                    "city_name": "Sultanganj"
                },
                {
                    "city_name": "Supaul"
                },
                {
                    "city_name": "Teghra"
                },
                {
                    "city_name": "Tekari"
                },
                {
                    "city_name": "Thakurganj"
                },
                {
                    "city_name": "Vaishali"
                },
                {
                    "city_name": "Waris Aliganj"
                }
            ]

            var chattisgarh = [
                {
                    "city_name": "Ahiwara"
                },
                {
                    "city_name": "Akaltara"
                },
                {
                    "city_name": "Ambagarh Chauki"
                },
                {
                    "city_name": "Ambikapur"
                },
                {
                    "city_name": "Arang"
                },
                {
                    "city_name": "Bade Bacheli"
                },
                {
                    "city_name": "Bagbahara"
                },
                {
                    "city_name": "Baikunthpur"
                },
                {
                    "city_name": "Balod"
                },
                {
                    "city_name": "Baloda"
                },
                {
                    "city_name": "Baloda Bazar"
                },
                {
                    "city_name": "Banarsi"
                },
                {
                    "city_name": "Basna"
                },
                {
                    "city_name": "Bemetra"
                },
                {
                    "city_name": "Bhanpuri"
                },
                {
                    "city_name": "Bhatapara"
                },
                {
                    "city_name": "Bhatgaon"
                },
                {
                    "city_name": "Bhilai"
                },
                {
                    "city_name": "Bilaspur"
                },
                {
                    "city_name": "Bilha"
                },
                {
                    "city_name": "Birgaon"
                },
                {
                    "city_name": "Bodri"
                },
                {
                    "city_name": "Champa"
                },
                {
                    "city_name": "Charcha"
                },
                {
                    "city_name": "Charoda"
                },
                {
                    "city_name": "Chhuikhadan"
                },
                {
                    "city_name": "Chirmiri"
                },
                {
                    "city_name": "Dantewada"
                },
                {
                    "city_name": "Deori"
                },
                {
                    "city_name": "Dhamdha"
                },
                {
                    "city_name": "Dhamtari"
                },
                {
                    "city_name": "Dharamjaigarh"
                },
                {
                    "city_name": "Dipka"
                },
                {
                    "city_name": "Doman Hill Colliery"
                },
                {
                    "city_name": "Dongargaon"
                },
                {
                    "city_name": "Dongragarh"
                },
                {
                    "city_name": "Durg"
                },
                {
                    "city_name": "Frezarpur"
                },
                {
                    "city_name": "Gandai"
                },
                {
                    "city_name": "Gariaband"
                },
                {
                    "city_name": "Gaurela"
                },
                {
                    "city_name": "Gelhapani"
                },
                {
                    "city_name": "Gharghoda"
                },
                {
                    "city_name": "Gidam"
                },
                {
                    "city_name": "Gobra Nawapara"
                },
                {
                    "city_name": "Gogaon"
                },
                {
                    "city_name": "Hatkachora"
                },
                {
                    "city_name": "Jagdalpur"
                },
                {
                    "city_name": "Jamui"
                },
                {
                    "city_name": "Jashpurnagar"
                },
                {
                    "city_name": "Jhagrakhand"
                },
                {
                    "city_name": "Kanker"
                },
                {
                    "city_name": "Katghora"
                },
                {
                    "city_name": "Kawardha"
                },
                {
                    "city_name": "Khairagarh"
                },
                {
                    "city_name": "Khamhria"
                },
                {
                    "city_name": "Kharod"
                },
                {
                    "city_name": "Kharsia"
                },
                {
                    "city_name": "Khonga Pani"
                },
                {
                    "city_name": "Kirandu"
                },
                {
                    "city_name": "Kirandul"
                },
                {
                    "city_name": "Kohka"
                },
                {
                    "city_name": "Kondagaon"
                },
                {
                    "city_name": "Korba"
                },
                {
                    "city_name": "Korea"
                },
                {
                    "city_name": "Koria Block"
                },
                {
                    "city_name": "Kota"
                },
                {
                    "city_name": "Kumhari"
                },
                {
                    "city_name": "Kumud Katta"
                },
                {
                    "city_name": "Kurasia"
                },
                {
                    "city_name": "Kurud"
                },
                {
                    "city_name": "Lingiyadih"
                },
                {
                    "city_name": "Lormi"
                },
                {
                    "city_name": "Mahasamund"
                },
                {
                    "city_name": "Mahendragarh"
                },
                {
                    "city_name": "Mehmand"
                },
                {
                    "city_name": "Mongra"
                },
                {
                    "city_name": "Mowa"
                },
                {
                    "city_name": "Mungeli"
                },
                {
                    "city_name": "Nailajanjgir"
                },
                {
                    "city_name": "Namna Kalan"
                },
                {
                    "city_name": "Naya Baradwar"
                },
                {
                    "city_name": "Pandariya"
                },
                {
                    "city_name": "Patan"
                },
                {
                    "city_name": "Pathalgaon"
                },
                {
                    "city_name": "Pendra"
                },
                {
                    "city_name": "Phunderdihari"
                },
                {
                    "city_name": "Pithora"
                },
                {
                    "city_name": "Raigarh"
                },
                {
                    "city_name": "Raipur"
                },
                {
                    "city_name": "Rajgamar"
                },
                {
                    "city_name": "Rajhara"
                },
                {
                    "city_name": "Rajnandgaon"
                },
                {
                    "city_name": "Ramanuj Ganj"
                },
                {
                    "city_name": "Ratanpur"
                },
                {
                    "city_name": "Sakti"
                },
                {
                    "city_name": "Saraipali"
                },
                {
                    "city_name": "Sarajpur"
                },
                {
                    "city_name": "Sarangarh"
                },
                {
                    "city_name": "Shivrinarayan"
                },
                {
                    "city_name": "Simga"
                },
                {
                    "city_name": "Sirgiti"
                },
                {
                    "city_name": "Takhatpur"
                },
                {
                    "city_name": "Telgaon"
                },
                {
                    "city_name": "Tildanewra"
                },
                {
                    "city_name": "Urla"
                },
                {
                    "city_name": "Vishrampur"
                }
            ]

            var dadarNagar = [
                {
                    "city_name": "Amli"
                },
                {
                    "city_name": "Silvassa"
                }
            ]

            var daman = [
                {
                    "city_name": "Daman"
                },
                {
                    "city_name": "Diu"
                }
            ]

            var delhi = [
                {
                    "city_name": "Delhi"
                },
                {
                    "city_name": "New Delhi"
                }
            ]

            var goa = [
                {
                    "city_name": "Aldona"
                },
                {
                    "city_name": "Altinho"
                },
                {
                    "city_name": "Aquem"
                },
                {
                    "city_name": "Arpora"
                },
                {
                    "city_name": "Bambolim"
                },
                {
                    "city_name": "Bandora"
                },
                {
                    "city_name": "Bardez"
                },
                {
                    "city_name": "Benaulim"
                },
                {
                    "city_name": "Betora"
                },
                {
                    "city_name": "Bicholim"
                },
                {
                    "city_name": "Calapor"
                },
                {
                    "city_name": "Candolim"
                },
                {
                    "city_name": "Caranzalem"
                },
                {
                    "city_name": "Carapur"
                },
                {
                    "city_name": "Chicalim"
                },
                {
                    "city_name": "Chimbel"
                },
                {
                    "city_name": "Chinchinim"
                },
                {
                    "city_name": "Colvale"
                },
                {
                    "city_name": "Corlim"
                },
                {
                    "city_name": "Cortalim"
                },
                {
                    "city_name": "Cuncolim"
                },
                {
                    "city_name": "Curchorem"
                },
                {
                    "city_name": "Curti"
                },
                {
                    "city_name": "Davorlim"
                },
                {
                    "city_name": "Dona Paula"
                },
                {
                    "city_name": "Goa"
                },
                {
                    "city_name": "Guirim"
                },
                {
                    "city_name": "Jua"
                },
                {
                    "city_name": "Kalangat"
                },
                {
                    "city_name": "Kankon"
                },
                {
                    "city_name": "Kundaim"
                },
                {
                    "city_name": "Loutulim"
                },
                {
                    "city_name": "Madgaon"
                },
                {
                    "city_name": "Mapusa"
                },
                {
                    "city_name": "Margao"
                },
                {
                    "city_name": "Margaon"
                },
                {
                    "city_name": "Miramar"
                },
                {
                    "city_name": "Morjim"
                },
                {
                    "city_name": "Mormugao"
                },
                {
                    "city_name": "Navelim"
                },
                {
                    "city_name": "Pale"
                },
                {
                    "city_name": "Panaji"
                },
                {
                    "city_name": "Parcem"
                },
                {
                    "city_name": "Parra"
                },
                {
                    "city_name": "Penha de Franca"
                },
                {
                    "city_name": "Pernem"
                },
                {
                    "city_name": "Pilerne"
                },
                {
                    "city_name": "Pissurlem"
                },
                {
                    "city_name": "Ponda"
                },
                {
                    "city_name": "Porvorim"
                },
                {
                    "city_name": "Quepem"
                },
                {
                    "city_name": "Queula"
                },
                {
                    "city_name": "Raia"
                },
                {
                    "city_name": "Reis Magos"
                },
                {
                    "city_name": "Salcette"
                },
                {
                    "city_name": "Saligao"
                },
                {
                    "city_name": "Sancoale"
                },
                {
                    "city_name": "Sanguem"
                },
                {
                    "city_name": "Sanquelim"
                },
                {
                    "city_name": "Sanvordem"
                },
                {
                    "city_name": "Sao Jose-de-Areal"
                },
                {
                    "city_name": "Sattari"
                },
                {
                    "city_name": "Serula"
                },
                {
                    "city_name": "Sinquerim"
                },
                {
                    "city_name": "Siolim"
                },
                {
                    "city_name": "Taleigao"
                },
                {
                    "city_name": "Tivim"
                },
                {
                    "city_name": "Valpoi"
                },
                {
                    "city_name": "Varca"
                },
                {
                    "city_name": "Vasco"
                },
                {
                    "city_name": "Verna"
                }
            ]

            var gujrat = [
                {
                    "city_name": "Abrama"
                },
                {
                    "city_name": "Adalaj"
                },
                {
                    "city_name": "Adityana"
                },
                {
                    "city_name": "Advana"
                },
                {
                    "city_name": "Ahmedabad"
                },
                {
                    "city_name": "Ahwa"
                },
                {
                    "city_name": "Alang"
                },
                {
                    "city_name": "Ambaji"
                },
                {
                    "city_name": "Ambaliyasan"
                },
                {
                    "city_name": "Amod"
                },
                {
                    "city_name": "Amreli"
                },
                {
                    "city_name": "Amroli"
                },
                {
                    "city_name": "Anand"
                },
                {
                    "city_name": "Andada"
                },
                {
                    "city_name": "Anjar"
                },
                {
                    "city_name": "Anklav"
                },
                {
                    "city_name": "Ankleshwar"
                },
                {
                    "city_name": "Anklesvar INA"
                },
                {
                    "city_name": "Antaliya"
                },
                {
                    "city_name": "Arambhada"
                },
                {
                    "city_name": "Asarma"
                },
                {
                    "city_name": "Atul"
                },
                {
                    "city_name": "Babra"
                },
                {
                    "city_name": "Bag-e-Firdosh"
                },
                {
                    "city_name": "Bagasara"
                },
                {
                    "city_name": "Bahadarpar"
                },
                {
                    "city_name": "Bajipura"
                },
                {
                    "city_name": "Bajva"
                },
                {
                    "city_name": "Balasinor"
                },
                {
                    "city_name": "Banaskantha"
                },
                {
                    "city_name": "Bansda"
                },
                {
                    "city_name": "Bantva"
                },
                {
                    "city_name": "Bardoli"
                },
                {
                    "city_name": "Barwala"
                },
                {
                    "city_name": "Bayad"
                },
                {
                    "city_name": "Bechar"
                },
                {
                    "city_name": "Bedi"
                },
                {
                    "city_name": "Beyt"
                },
                {
                    "city_name": "Bhachau"
                },
                {
                    "city_name": "Bhanvad"
                },
                {
                    "city_name": "Bharuch"
                },
                {
                    "city_name": "Bharuch INA"
                },
                {
                    "city_name": "Bhavnagar"
                },
                {
                    "city_name": "Bhayavadar"
                },
                {
                    "city_name": "Bhestan"
                },
                {
                    "city_name": "Bhuj"
                },
                {
                    "city_name": "Bilimora"
                },
                {
                    "city_name": "Bilkha"
                },
                {
                    "city_name": "Billimora"
                },
                {
                    "city_name": "Bodakdev"
                },
                {
                    "city_name": "Bodeli"
                },
                {
                    "city_name": "Bopal"
                },
                {
                    "city_name": "Boria"
                },
                {
                    "city_name": "Boriavi"
                },
                {
                    "city_name": "Borsad"
                },
                {
                    "city_name": "Botad"
                },
                {
                    "city_name": "Cambay"
                },
                {
                    "city_name": "Chaklasi"
                },
                {
                    "city_name": "Chala"
                },
                {
                    "city_name": "Chalala"
                },
                {
                    "city_name": "Chalthan"
                },
                {
                    "city_name": "Chanasma"
                },
                {
                    "city_name": "Chandisar"
                },
                {
                    "city_name": "Chandkheda"
                },
                {
                    "city_name": "Chanod"
                },
                {
                    "city_name": "Chaya"
                },
                {
                    "city_name": "Chenpur"
                },
                {
                    "city_name": "Chhapi"
                },
                {
                    "city_name": "Chhaprabhatha"
                },
                {
                    "city_name": "Chhatral"
                },
                {
                    "city_name": "Chhota Udepur"
                },
                {
                    "city_name": "Chikhli"
                },
                {
                    "city_name": "Chiloda"
                },
                {
                    "city_name": "Chorvad"
                },
                {
                    "city_name": "Chotila"
                },
                {
                    "city_name": "Dabhoi"
                },
                {
                    "city_name": "Dadara"
                },
                {
                    "city_name": "Dahod"
                },
                {
                    "city_name": "Dakor"
                },
                {
                    "city_name": "Damnagar"
                },
                {
                    "city_name": "Deesa"
                },
                {
                    "city_name": "Delvada"
                },
                {
                    "city_name": "Devgadh Baria"
                },
                {
                    "city_name": "Devsar"
                },
                {
                    "city_name": "Dhandhuka"
                },
                {
                    "city_name": "Dhanera"
                },
                {
                    "city_name": "Dhangdhra"
                },
                {
                    "city_name": "Dhansura"
                },
                {
                    "city_name": "Dharampur"
                },
                {
                    "city_name": "Dhari"
                },
                {
                    "city_name": "Dhola"
                },
                {
                    "city_name": "Dholka"
                },
                {
                    "city_name": "Dholka Rural"
                },
                {
                    "city_name": "Dhoraji"
                },
                {
                    "city_name": "Dhrangadhra"
                },
                {
                    "city_name": "Dhrol"
                },
                {
                    "city_name": "Dhuva"
                },
                {
                    "city_name": "Dhuwaran"
                },
                {
                    "city_name": "Digvijaygram"
                },
                {
                    "city_name": "Disa"
                },
                {
                    "city_name": "Dungar"
                },
                {
                    "city_name": "Dungarpur"
                },
                {
                    "city_name": "Dungra"
                },
                {
                    "city_name": "Dwarka"
                },
                {
                    "city_name": "Flelanganj"
                },
                {
                    "city_name": "Gadhda"
                },
                {
                    "city_name": "Gandevi"
                },
                {
                    "city_name": "Gandhidham"
                },
                {
                    "city_name": "Gandhinagar"
                },
                {
                    "city_name": "Gariadhar"
                },
                {
                    "city_name": "Ghogha"
                },
                {
                    "city_name": "Godhra"
                },
                {
                    "city_name": "Gondal"
                },
                {
                    "city_name": "GSFC Complex"
                },
                {
                    "city_name": "Hajira INA"
                },
                {
                    "city_name": "Halol"
                },
                {
                    "city_name": "Halvad"
                },
                {
                    "city_name": "Hansot"
                },
                {
                    "city_name": "Harij"
                },
                {
                    "city_name": "Himatnagar"
                },
                {
                    "city_name": "Ichchhapor"
                },
                {
                    "city_name": "Idar"
                },
                {
                    "city_name": "Jafrabad"
                },
                {
                    "city_name": "Jalalpore"
                },
                {
                    "city_name": "Jambusar"
                },
                {
                    "city_name": "Jamjodhpur"
                },
                {
                    "city_name": "Jamnagar"
                },
                {
                    "city_name": "Jasdan"
                },
                {
                    "city_name": "Jawaharnagar"
                },
                {
                    "city_name": "Jetalsar"
                },
                {
                    "city_name": "Jetpur"
                },
                {
                    "city_name": "Jodiya"
                },
                {
                    "city_name": "Joshipura"
                },
                {
                    "city_name": "Junagadh"
                },
                {
                    "city_name": "Kadi"
                },
                {
                    "city_name": "Kadodara"
                },
                {
                    "city_name": "Kalavad"
                },
                {
                    "city_name": "Kali"
                },
                {
                    "city_name": "Kaliawadi"
                },
                {
                    "city_name": "Kalol"
                },
                {
                    "city_name": "Kalol INA"
                },
                {
                    "city_name": "Kandla"
                },
                {
                    "city_name": "Kanjari"
                },
                {
                    "city_name": "Kanodar"
                },
                {
                    "city_name": "Kapadwanj"
                },
                {
                    "city_name": "Karachiya"
                },
                {
                    "city_name": "Karamsad"
                },
                {
                    "city_name": "Karjan"
                },
                {
                    "city_name": "Kathial"
                },
                {
                    "city_name": "Kathor"
                },
                {
                    "city_name": "Katpar"
                },
                {
                    "city_name": "Kavant"
                },
                {
                    "city_name": "Keshod"
                },
                {
                    "city_name": "Kevadiya"
                },
                {
                    "city_name": "Khambhaliya"
                },
                {
                    "city_name": "Khambhat"
                },
                {
                    "city_name": "Kharaghoda"
                },
                {
                    "city_name": "Khed Brahma"
                },
                {
                    "city_name": "Kheda"
                },
                {
                    "city_name": "Kheralu"
                },
                {
                    "city_name": "Kodinar"
                },
                {
                    "city_name": "Kosamba"
                },
                {
                    "city_name": "Kundla"
                },
                {
                    "city_name": "Kutch"
                },
                {
                    "city_name": "Kutiyana"
                },
                {
                    "city_name": "Lakhtar"
                },
                {
                    "city_name": "Lalpur"
                },
                {
                    "city_name": "Lambha"
                },
                {
                    "city_name": "Lathi"
                },
                {
                    "city_name": "Limbdi"
                },
                {
                    "city_name": "Limla"
                },
                {
                    "city_name": "Lunavada"
                },
                {
                    "city_name": "Madhapar"
                },
                {
                    "city_name": "Maflipur"
                },
                {
                    "city_name": "Mahemdavad"
                },
                {
                    "city_name": "Mahudha"
                },
                {
                    "city_name": "Mahuva"
                },
                {
                    "city_name": "Mahuvar"
                },
                {
                    "city_name": "Makarba"
                },
                {
                    "city_name": "Makarpura"
                },
                {
                    "city_name": "Makassar"
                },
                {
                    "city_name": "Maktampur"
                },
                {
                    "city_name": "Malia"
                },
                {
                    "city_name": "Malpur"
                },
                {
                    "city_name": "Manavadar"
                },
                {
                    "city_name": "Mandal"
                },
                {
                    "city_name": "Mandvi"
                },
                {
                    "city_name": "Mangrol"
                },
                {
                    "city_name": "Mansa"
                },
                {
                    "city_name": "Meghraj"
                },
                {
                    "city_name": "Mehsana"
                },
                {
                    "city_name": "Mendarla"
                },
                {
                    "city_name": "Mithapur"
                },
                {
                    "city_name": "Modasa"
                },
                {
                    "city_name": "Mogravadi"
                },
                {
                    "city_name": "Morbi"
                },
                {
                    "city_name": "Morvi"
                },
                {
                    "city_name": "Mundra"
                },
                {
                    "city_name": "Nadiad"
                },
                {
                    "city_name": "Naliya"
                },
                {
                    "city_name": "Nanakvada"
                },
                {
                    "city_name": "Nandej"
                },
                {
                    "city_name": "Nandesari"
                },
                {
                    "city_name": "Nandesari INA"
                },
                {
                    "city_name": "Naroda"
                },
                {
                    "city_name": "Navagadh"
                },
                {
                    "city_name": "Navagam Ghed"
                },
                {
                    "city_name": "Navsari"
                },
                {
                    "city_name": "Ode"
                },
                {
                    "city_name": "Okaf"
                },
                {
                    "city_name": "Okha"
                },
                {
                    "city_name": "Olpad"
                },
                {
                    "city_name": "Paddhari"
                },
                {
                    "city_name": "Padra"
                },
                {
                    "city_name": "Palanpur"
                },
                {
                    "city_name": "Palej"
                },
                {
                    "city_name": "Pali"
                },
                {
                    "city_name": "Palitana"
                },
                {
                    "city_name": "Paliyad"
                },
                {
                    "city_name": "Pandesara"
                },
                {
                    "city_name": "Panoli"
                },
                {
                    "city_name": "Pardi"
                },
                {
                    "city_name": "Parnera"
                },
                {
                    "city_name": "Parvat"
                },
                {
                    "city_name": "Patan"
                },
                {
                    "city_name": "Patdi"
                },
                {
                    "city_name": "Petlad"
                },
                {
                    "city_name": "Petrochemical Complex"
                },
                {
                    "city_name": "Porbandar"
                },
                {
                    "city_name": "Prantij"
                },
                {
                    "city_name": "Radhanpur"
                },
                {
                    "city_name": "Raiya"
                },
                {
                    "city_name": "Rajkot"
                },
                {
                    "city_name": "Rajpipla"
                },
                {
                    "city_name": "Rajula"
                },
                {
                    "city_name": "Ramod"
                },
                {
                    "city_name": "Ranavav"
                },
                {
                    "city_name": "Ranoli"
                },
                {
                    "city_name": "Rapar"
                },
                {
                    "city_name": "Sahij"
                },
                {
                    "city_name": "Salaya"
                },
                {
                    "city_name": "Sanand"
                },
                {
                    "city_name": "Sankheda"
                },
                {
                    "city_name": "Santrampur"
                },
                {
                    "city_name": "Saribujrang"
                },
                {
                    "city_name": "Sarigam INA"
                },
                {
                    "city_name": "Sayan"
                },
                {
                    "city_name": "Sayla"
                },
                {
                    "city_name": "Shahpur"
                },
                {
                    "city_name": "Shahwadi"
                },
                {
                    "city_name": "Shapar"
                },
                {
                    "city_name": "Shivrajpur"
                },
                {
                    "city_name": "Siddhapur"
                },
                {
                    "city_name": "Sidhpur"
                },
                {
                    "city_name": "Sihor"
                },
                {
                    "city_name": "Sika"
                },
                {
                    "city_name": "Singarva"
                },
                {
                    "city_name": "Sinor"
                },
                {
                    "city_name": "Sojitra"
                },
                {
                    "city_name": "Sola"
                },
                {
                    "city_name": "Songadh"
                },
                {
                    "city_name": "Suraj Karadi"
                },
                {
                    "city_name": "Surat"
                },
                {
                    "city_name": "Surendranagar"
                },
                {
                    "city_name": "Talaja"
                },
                {
                    "city_name": "Talala"
                },
                {
                    "city_name": "Talod"
                },
                {
                    "city_name": "Tankara"
                },
                {
                    "city_name": "Tarsali"
                },
                {
                    "city_name": "Thangadh"
                },
                {
                    "city_name": "Tharad"
                },
                {
                    "city_name": "Thasra"
                },
                {
                    "city_name": "Udyognagar"
                },
                {
                    "city_name": "Ukai"
                },
                {
                    "city_name": "Umbergaon"
                },
                {
                    "city_name": "Umbergaon INA"
                },
                {
                    "city_name": "Umrala"
                },
                {
                    "city_name": "Umreth"
                },
                {
                    "city_name": "Un"
                },
                {
                    "city_name": "Una"
                },
                {
                    "city_name": "Unjha"
                },
                {
                    "city_name": "Upleta"
                },
                {
                    "city_name": "Utran"
                },
                {
                    "city_name": "Uttarsanda"
                },
                {
                    "city_name": "V.U. Nagar"
                },
                {
                    "city_name": "V.V. Nagar"
                },
                {
                    "city_name": "Vadia"
                },
                {
                    "city_name": "Vadla"
                },
                {
                    "city_name": "Vadnagar"
                },
                {
                    "city_name": "Vadodara"
                },
                {
                    "city_name": "Vaghodia INA"
                },
                {
                    "city_name": "Valbhipur"
                },
                {
                    "city_name": "Vallabh Vidyanagar"
                },
                {
                    "city_name": "Valsad"
                },
                {
                    "city_name": "Valsad INA"
                },
                {
                    "city_name": "Vanthali"
                },
                {
                    "city_name": "Vapi"
                },
                {
                    "city_name": "Vapi INA"
                },
                {
                    "city_name": "Vartej"
                },
                {
                    "city_name": "Vasad"
                },
                {
                    "city_name": "Vasna Borsad INA"
                },
                {
                    "city_name": "Vaso"
                },
                {
                    "city_name": "Veraval"
                },
                {
                    "city_name": "Vidyanagar"
                },
                {
                    "city_name": "Vijalpor"
                },
                {
                    "city_name": "Vijapur"
                },
                {
                    "city_name": "Vinchhiya"
                },
                {
                    "city_name": "Vinzol"
                },
                {
                    "city_name": "Virpur"
                },
                {
                    "city_name": "Visavadar"
                },
                {
                    "city_name": "Visnagar"
                },
                {
                    "city_name": "Vyara"
                },
                {
                    "city_name": "Wadhwan"
                },
                {
                    "city_name": "Waghai"
                },
                {
                    "city_name": "Waghodia"
                },
                {
                    "city_name": "Wankaner"
                },
                {
                    "city_name": "Zalod"
                }
            ]

            var haryana = [
                {
                    "city_name": "Ambala"
                },
                {
                    "city_name": "Ambala Cantt"
                },
                {
                    "city_name": "Asan Khurd"
                },
                {
                    "city_name": "Asandh"
                },
                {
                    "city_name": "Ateli"
                },
                {
                    "city_name": "Babiyal"
                },
                {
                    "city_name": "Bahadurgarh"
                },
                {
                    "city_name": "Ballabgarh"
                },
                {
                    "city_name": "Barwala"
                },
                {
                    "city_name": "Bawal"
                },
                {
                    "city_name": "Bawani Khera"
                },
                {
                    "city_name": "Beri"
                },
                {
                    "city_name": "Bhiwani"
                },
                {
                    "city_name": "Bilaspur"
                },
                {
                    "city_name": "Buria"
                },
                {
                    "city_name": "Charkhi Dadri"
                },
                {
                    "city_name": "Chhachhrauli"
                },
                {
                    "city_name": "Chita"
                },
                {
                    "city_name": "Dabwali"
                },
                {
                    "city_name": "Dharuhera"
                },
                {
                    "city_name": "Dundahera"
                },
                {
                    "city_name": "Ellenabad"
                },
                {
                    "city_name": "Farakhpur"
                },
                {
                    "city_name": "Faridabad"
                },
                {
                    "city_name": "Farrukhnagar"
                },
                {
                    "city_name": "Fatehabad"
                },
                {
                    "city_name": "Firozpur Jhirka"
                },
                {
                    "city_name": "Gannaur"
                },
                {
                    "city_name": "Ghraunda"
                },
                {
                    "city_name": "Gohana"
                },
                {
                    "city_name": "Gurgaon"
                },
                {
                    "city_name": "Haileymandi"
                },
                {
                    "city_name": "Hansi"
                },
                {
                    "city_name": "Hasanpur"
                },
                {
                    "city_name": "Hathin"
                },
                {
                    "city_name": "Hisar"
                },
                {
                    "city_name": "Hissar"
                },
                {
                    "city_name": "Hodal"
                },
                {
                    "city_name": "Indri"
                },
                {
                    "city_name": "Jagadhri"
                },
                {
                    "city_name": "Jakhal Mandi"
                },
                {
                    "city_name": "Jhajjar"
                },
                {
                    "city_name": "Jind"
                },
                {
                    "city_name": "Julana"
                },
                {
                    "city_name": "Kaithal"
                },
                {
                    "city_name": "Kalanur"
                },
                {
                    "city_name": "Kalanwali"
                },
                {
                    "city_name": "Kalayat"
                },
                {
                    "city_name": "Kalka"
                },
                {
                    "city_name": "Kanina"
                },
                {
                    "city_name": "Kansepur"
                },
                {
                    "city_name": "Kardhan"
                },
                {
                    "city_name": "Karnal"
                },
                {
                    "city_name": "Kharkhoda"
                },
                {
                    "city_name": "Kheri Sampla"
                },
                {
                    "city_name": "Kundli"
                },
                {
                    "city_name": "Kurukshetra"
                },
                {
                    "city_name": "Ladrawan"
                },
                {
                    "city_name": "Ladwa"
                },
                {
                    "city_name": "Loharu"
                },
                {
                    "city_name": "Maham"
                },
                {
                    "city_name": "Mahendragarh"
                },
                {
                    "city_name": "Mustafabad"
                },
                {
                    "city_name": "Nagai Chaudhry"
                },
                {
                    "city_name": "Narayangarh"
                },
                {
                    "city_name": "Narnaul"
                },
                {
                    "city_name": "Narnaund"
                },
                {
                    "city_name": "Narwana"
                },
                {
                    "city_name": "Nilokheri"
                },
                {
                    "city_name": "Nuh"
                },
                {
                    "city_name": "Palwal"
                },
                {
                    "city_name": "Panchkula"
                },
                {
                    "city_name": "Panipat"
                },
                {
                    "city_name": "Panipat Taraf Ansar"
                },
                {
                    "city_name": "Panipat Taraf Makhdum Zadgan"
                },
                {
                    "city_name": "Panipat Taraf Rajputan"
                },
                {
                    "city_name": "Pehowa"
                },
                {
                    "city_name": "Pinjaur"
                },
                {
                    "city_name": "Punahana"
                },
                {
                    "city_name": "Pundri"
                },
                {
                    "city_name": "Radaur"
                },
                {
                    "city_name": "Raipur Rani"
                },
                {
                    "city_name": "Rania"
                },
                {
                    "city_name": "Ratiya"
                },
                {
                    "city_name": "Rewari"
                },
                {
                    "city_name": "Rohtak"
                },
                {
                    "city_name": "Ropar"
                },
                {
                    "city_name": "Sadauri"
                },
                {
                    "city_name": "Safidon"
                },
                {
                    "city_name": "Samalkha"
                },
                {
                    "city_name": "Sankhol"
                },
                {
                    "city_name": "Sasauli"
                },
                {
                    "city_name": "Shahabad"
                },
                {
                    "city_name": "Sirsa"
                },
                {
                    "city_name": "Siwani"
                },
                {
                    "city_name": "Sohna"
                },
                {
                    "city_name": "Sonipat"
                },
                {
                    "city_name": "Sukhrali"
                },
                {
                    "city_name": "Taoru"
                },
                {
                    "city_name": "Taraori"
                },
                {
                    "city_name": "Tauru"
                },
                {
                    "city_name": "Thanesar"
                },
                {
                    "city_name": "Tilpat"
                },
                {
                    "city_name": "Tohana"
                },
                {
                    "city_name": "Tosham"
                },
                {
                    "city_name": "Uchana"
                },
                {
                    "city_name": "Uklana Mandi"
                },
                {
                    "city_name": "Uncha Siwana"
                },
                {
                    "city_name": "Yamunanagar"
                }
            ]

            var himachal = [
                {
                    "city_name": "Arki"
                },
                {
                    "city_name": "Baddi"
                },
                {
                    "city_name": "Bakloh"
                },
                {
                    "city_name": "Banjar"
                },
                {
                    "city_name": "Bhota"
                },
                {
                    "city_name": "Bhuntar"
                },
                {
                    "city_name": "Bilaspur"
                },
                {
                    "city_name": "Chamba"
                },
                {
                    "city_name": "Chaupal"
                },
                {
                    "city_name": "Chuari Khas"
                },
                {
                    "city_name": "Dagshai"
                },
                {
                    "city_name": "Dalhousie"
                },
                {
                    "city_name": "Dalhousie Cantonment"
                },
                {
                    "city_name": "Damtal"
                },
                {
                    "city_name": "Daulatpur"
                },
                {
                    "city_name": "Dera Gopipur"
                },
                {
                    "city_name": "Dhalli"
                },
                {
                    "city_name": "Dharamshala"
                },
                {
                    "city_name": "Gagret"
                },
                {
                    "city_name": "Ghamarwin"
                },
                {
                    "city_name": "Hamirpur"
                },
                {
                    "city_name": "Jawala Mukhi"
                },
                {
                    "city_name": "Jogindarnagar"
                },
                {
                    "city_name": "Jubbal"
                },
                {
                    "city_name": "Jutogh"
                },
                {
                    "city_name": "Kala Amb"
                },
                {
                    "city_name": "Kalpa"
                },
                {
                    "city_name": "Kangra"
                },
                {
                    "city_name": "Kasauli"
                },
                {
                    "city_name": "Kot Khai"
                },
                {
                    "city_name": "Kullu"
                },
                {
                    "city_name": "Kulu"
                },
                {
                    "city_name": "Manali"
                },
                {
                    "city_name": "Mandi"
                },
                {
                    "city_name": "Mant Khas"
                },
                {
                    "city_name": "Mehatpur Basdehra"
                },
                {
                    "city_name": "Nadaun"
                },
                {
                    "city_name": "Nagrota"
                },
                {
                    "city_name": "Nahan"
                },
                {
                    "city_name": "Naina Devi"
                },
                {
                    "city_name": "Nalagarh"
                },
                {
                    "city_name": "Narkanda"
                },
                {
                    "city_name": "Nurpur"
                },
                {
                    "city_name": "Palampur"
                },
                {
                    "city_name": "Pandoh"
                },
                {
                    "city_name": "Paonta Sahib"
                },
                {
                    "city_name": "Parwanoo"
                },
                {
                    "city_name": "Parwanu"
                },
                {
                    "city_name": "Rajgarh"
                },
                {
                    "city_name": "Rampur"
                },
                {
                    "city_name": "Rawalsar"
                },
                {
                    "city_name": "Rohru"
                },
                {
                    "city_name": "Sabathu"
                },
                {
                    "city_name": "Santokhgarh"
                },
                {
                    "city_name": "Sarahan"
                },
                {
                    "city_name": "Sarka Ghat"
                },
                {
                    "city_name": "Seoni"
                },
                {
                    "city_name": "Shimla"
                },
                {
                    "city_name": "Sirmaur"
                },
                {
                    "city_name": "Solan"
                },
                {
                    "city_name": "Solon"
                },
                {
                    "city_name": "Sundarnagar"
                },
                {
                    "city_name": "Sundernagar"
                },
                {
                    "city_name": "Talai"
                },
                {
                    "city_name": "Theog"
                },
                {
                    "city_name": "Tira Sujanpur"
                },
                {
                    "city_name": "Una"
                },
                {
                    "city_name": "Yol"
                }
            ]

            var jammu = [
                {
                    "city_name": "Achabal"
                },
                {
                    "city_name": "Akhnur"
                },
                {
                    "city_name": "Anantnag"
                },
                {
                    "city_name": "Arnia"
                },
                {
                    "city_name": "Awantipora"
                },
                {
                    "city_name": "Badami Bagh"
                },
                {
                    "city_name": "Bandipur"
                },
                {
                    "city_name": "Banihal"
                },
                {
                    "city_name": "Baramula"
                },
                {
                    "city_name": "Baramulla"
                },
                {
                    "city_name": "Bari Brahmana"
                },
                {
                    "city_name": "Bashohli"
                },
                {
                    "city_name": "Batote"
                },
                {
                    "city_name": "Bhaderwah"
                },
                {
                    "city_name": "Bijbiara"
                },
                {
                    "city_name": "Billawar"
                },
                {
                    "city_name": "Birwah"
                },
                {
                    "city_name": "Bishna"
                },
                {
                    "city_name": "Budgam"
                },
                {
                    "city_name": "Charari Sharief"
                },
                {
                    "city_name": "Chenani"
                },
                {
                    "city_name": "Doda"
                },
                {
                    "city_name": "Duru-Verinag"
                },
                {
                    "city_name": "Gandarbat"
                },
                {
                    "city_name": "Gho Manhasan"
                },
                {
                    "city_name": "Gorah Salathian"
                },
                {
                    "city_name": "Gulmarg"
                },
                {
                    "city_name": "Hajan"
                },
                {
                    "city_name": "Handwara"
                },
                {
                    "city_name": "Hiranagar"
                },
                {
                    "city_name": "Jammu"
                },
                {
                    "city_name": "Jammu Cantonment"
                },
                {
                    "city_name": "Jammu Tawi"
                },
                {
                    "city_name": "Jourian"
                },
                {
                    "city_name": "Kargil"
                },
                {
                    "city_name": "Kathua"
                },
                {
                    "city_name": "Katra"
                },
                {
                    "city_name": "Khan Sahib"
                },
                {
                    "city_name": "Khour"
                },
                {
                    "city_name": "Khrew"
                },
                {
                    "city_name": "Kishtwar"
                },
                {
                    "city_name": "Kud"
                },
                {
                    "city_name": "Kukernag"
                },
                {
                    "city_name": "Kulgam"
                },
                {
                    "city_name": "Kunzer"
                },
                {
                    "city_name": "Kupwara"
                },
                {
                    "city_name": "Lakhenpur"
                },
                {
                    "city_name": "Leh"
                },
                {
                    "city_name": "Magam"
                },
                {
                    "city_name": "Mattan"
                },
                {
                    "city_name": "Naushehra"
                },
                {
                    "city_name": "Pahalgam"
                },
                {
                    "city_name": "Pampore"
                },
                {
                    "city_name": "Parole"
                },
                {
                    "city_name": "Pattan"
                },
                {
                    "city_name": "Pulwama"
                },
                {
                    "city_name": "Punch"
                },
                {
                    "city_name": "Qazigund"
                },
                {
                    "city_name": "Rajauri"
                },
                {
                    "city_name": "Ramban"
                },
                {
                    "city_name": "Ramgarh"
                },
                {
                    "city_name": "Ramnagar"
                },
                {
                    "city_name": "Ranbirsingh Pora"
                },
                {
                    "city_name": "Reasi"
                },
                {
                    "city_name": "Rehambal"
                },
                {
                    "city_name": "Samba"
                },
                {
                    "city_name": "Shupiyan"
                },
                {
                    "city_name": "Sopur"
                },
                {
                    "city_name": "Srinagar"
                },
                {
                    "city_name": "Sumbal"
                },
                {
                    "city_name": "Sunderbani"
                },
                {
                    "city_name": "Talwara"
                },
                {
                    "city_name": "Thanamandi"
                },
                {
                    "city_name": "Tral"
                },
                {
                    "city_name": "Udhampur"
                },
                {
                    "city_name": "Uri"
                },
                {
                    "city_name": "Vijaypur"
                }
            ]

            var jharkhand = [
                {
                    "city_name": "Adityapur"
                },
                {
                    "city_name": "Amlabad"
                },
                {
                    "city_name": "Angarpathar"
                },
                {
                    "city_name": "Ara"
                },
                {
                    "city_name": "Babua Kalan"
                },
                {
                    "city_name": "Bagbahra"
                },
                {
                    "city_name": "Baliapur"
                },
                {
                    "city_name": "Baliari"
                },
                {
                    "city_name": "Balkundra"
                },
                {
                    "city_name": "Bandhgora"
                },
                {
                    "city_name": "Barajamda"
                },
                {
                    "city_name": "Barhi"
                },
                {
                    "city_name": "Barka Kana"
                },
                {
                    "city_name": "Barki Saraiya"
                },
                {
                    "city_name": "Barughutu"
                },
                {
                    "city_name": "Barwadih"
                },
                {
                    "city_name": "Basaria"
                },
                {
                    "city_name": "Basukinath"
                },
                {
                    "city_name": "Bermo"
                },
                {
                    "city_name": "Bhagatdih"
                },
                {
                    "city_name": "Bhaurah"
                },
                {
                    "city_name": "Bhojudih"
                },
                {
                    "city_name": "Bhuli"
                },
                {
                    "city_name": "Bokaro"
                },
                {
                    "city_name": "Borio Bazar"
                },
                {
                    "city_name": "Bundu"
                },
                {
                    "city_name": "Chaibasa"
                },
                {
                    "city_name": "Chaitudih"
                },
                {
                    "city_name": "Chakradharpur"
                },
                {
                    "city_name": "Chakulia"
                },
                {
                    "city_name": "Chandaur"
                },
                {
                    "city_name": "Chandil"
                },
                {
                    "city_name": "Chandrapura"
                },
                {
                    "city_name": "Chas"
                },
                {
                    "city_name": "Chatra"
                },
                {
                    "city_name": "Chhatatanr"
                },
                {
                    "city_name": "Chhotaputki"
                },
                {
                    "city_name": "Chiria"
                },
                {
                    "city_name": "Chirkunda"
                },
                {
                    "city_name": "Churi"
                },
                {
                    "city_name": "Daltenganj"
                },
                {
                    "city_name": "Danguwapasi"
                },
                {
                    "city_name": "Dari"
                },
                {
                    "city_name": "Deoghar"
                },
                {
                    "city_name": "Deorikalan"
                },
                {
                    "city_name": "Devghar"
                },
                {
                    "city_name": "Dhanbad"
                },
                {
                    "city_name": "Dhanwar"
                },
                {
                    "city_name": "Dhaunsar"
                },
                {
                    "city_name": "Dugda"
                },
                {
                    "city_name": "Dumarkunda"
                },
                {
                    "city_name": "Dumka"
                },
                {
                    "city_name": "Egarkunr"
                },
                {
                    "city_name": "Gadhra"
                },
                {
                    "city_name": "Garwa"
                },
                {
                    "city_name": "Ghatsila"
                },
                {
                    "city_name": "Ghorabandha"
                },
                {
                    "city_name": "Gidi"
                },
                {
                    "city_name": "Giridih"
                },
                {
                    "city_name": "Gobindpur"
                },
                {
                    "city_name": "Godda"
                },
                {
                    "city_name": "Godhar"
                },
                {
                    "city_name": "Golphalbari"
                },
                {
                    "city_name": "Gomoh"
                },
                {
                    "city_name": "Gua"
                },
                {
                    "city_name": "Gumia"
                },
                {
                    "city_name": "Gumla"
                },
                {
                    "city_name": "Haludbani"
                },
                {
                    "city_name": "Hazaribag"
                },
                {
                    "city_name": "Hesla"
                },
                {
                    "city_name": "Husainabad"
                },
                {
                    "city_name": "Isri"
                },
                {
                    "city_name": "Jadugora"
                },
                {
                    "city_name": "Jagannathpur"
                },
                {
                    "city_name": "Jamadoba"
                },
                {
                    "city_name": "Jamshedpur"
                },
                {
                    "city_name": "Jamtara"
                },
                {
                    "city_name": "Jarangdih"
                },
                {
                    "city_name": "Jaridih"
                },
                {
                    "city_name": "Jasidih"
                },
                {
                    "city_name": "Jena"
                },
                {
                    "city_name": "Jharia"
                },
                {
                    "city_name": "Jharia Khas"
                },
                {
                    "city_name": "Jhinkpani"
                },
                {
                    "city_name": "Jhumri Tilaiya"
                },
                {
                    "city_name": "Jorapokhar"
                },
                {
                    "city_name": "Jugsalai"
                },
                {
                    "city_name": "Kailudih"
                },
                {
                    "city_name": "Kalikapur"
                },
                {
                    "city_name": "Kandra"
                },
                {
                    "city_name": "Kanke"
                },
                {
                    "city_name": "Katras"
                },
                {
                    "city_name": "Kedla"
                },
                {
                    "city_name": "Kenduadih"
                },
                {
                    "city_name": "Kharkhari"
                },
                {
                    "city_name": "Kharsawan"
                },
                {
                    "city_name": "Khelari"
                },
                {
                    "city_name": "Khunti"
                },
                {
                    "city_name": "Kiri Buru"
                },
                {
                    "city_name": "Kiriburu"
                },
                {
                    "city_name": "Kodarma"
                },
                {
                    "city_name": "Kuju"
                },
                {
                    "city_name": "Kurpania"
                },
                {
                    "city_name": "Kustai"
                },
                {
                    "city_name": "Lakarka"
                },
                {
                    "city_name": "Lapanga"
                },
                {
                    "city_name": "Latehar"
                },
                {
                    "city_name": "Lohardaga"
                },
                {
                    "city_name": "Loiya"
                },
                {
                    "city_name": "Loyabad"
                },
                {
                    "city_name": "Madhupur"
                },
                {
                    "city_name": "Mahesh Mundi"
                },
                {
                    "city_name": "Maithon"
                },
                {
                    "city_name": "Malkera"
                },
                {
                    "city_name": "Mango"
                },
                {
                    "city_name": "Manoharpur"
                },
                {
                    "city_name": "Marma"
                },
                {
                    "city_name": "Meghahatuburu Forest village"
                },
                {
                    "city_name": "Mera"
                },
                {
                    "city_name": "Meru"
                },
                {
                    "city_name": "Mihijam"
                },
                {
                    "city_name": "Mugma"
                },
                {
                    "city_name": "Muri"
                },
                {
                    "city_name": "Mushabani"
                },
                {
                    "city_name": "Nagri Kalan"
                },
                {
                    "city_name": "Netarhat"
                },
                {
                    "city_name": "Nirsa"
                },
                {
                    "city_name": "Noamundi"
                },
                {
                    "city_name": "Okni"
                },
                {
                    "city_name": "Orla"
                },
                {
                    "city_name": "Pakaur"
                },
                {
                    "city_name": "Palamau"
                },
                {
                    "city_name": "Palawa"
                },
                {
                    "city_name": "Panchet"
                },
                {
                    "city_name": "Panrra"
                },
                {
                    "city_name": "Paratdih"
                },
                {
                    "city_name": "Pathardih"
                },
                {
                    "city_name": "Patratu"
                },
                {
                    "city_name": "Phusro"
                },
                {
                    "city_name": "Pondar Kanali"
                },
                {
                    "city_name": "Rajmahal"
                },
                {
                    "city_name": "Ramgarh"
                },
                {
                    "city_name": "Ranchi"
                },
                {
                    "city_name": "Ray"
                },
                {
                    "city_name": "Rehla"
                },
                {
                    "city_name": "Religara"
                },
                {
                    "city_name": "Rohraband"
                },
                {
                    "city_name": "Sahibganj"
                },
                {
                    "city_name": "Sahnidih"
                },
                {
                    "city_name": "Saraidhela"
                },
                {
                    "city_name": "Saraikela"
                },
                {
                    "city_name": "Sarjamda"
                },
                {
                    "city_name": "Saunda"
                },
                {
                    "city_name": "Sewai"
                },
                {
                    "city_name": "Sijhua"
                },
                {
                    "city_name": "Sijua"
                },
                {
                    "city_name": "Simdega"
                },
                {
                    "city_name": "Sindari"
                },
                {
                    "city_name": "Sinduria"
                },
                {
                    "city_name": "Sini"
                },
                {
                    "city_name": "Sirka"
                },
                {
                    "city_name": "Siuliban"
                },
                {
                    "city_name": "Surubera"
                },
                {
                    "city_name": "Tati"
                },
                {
                    "city_name": "Tenudam"
                },
                {
                    "city_name": "Tisra"
                },
                {
                    "city_name": "Topa"
                },
                {
                    "city_name": "Topchanchi"
                }
            ]

            var karnataka = [
                {
                    "city_name": "Adityanagar"
                },
                {
                    "city_name": "Adityapatna"
                },
                {
                    "city_name": "Afzalpur"
                },
                {
                    "city_name": "Ajjampur"
                },
                {
                    "city_name": "Aland"
                },
                {
                    "city_name": "Almatti Sitimani"
                },
                {
                    "city_name": "Alnavar"
                },
                {
                    "city_name": "Alur"
                },
                {
                    "city_name": "Ambikanagara"
                },
                {
                    "city_name": "Anekal"
                },
                {
                    "city_name": "Ankola"
                },
                {
                    "city_name": "Annigeri"
                },
                {
                    "city_name": "Arkalgud"
                },
                {
                    "city_name": "Arsikere"
                },
                {
                    "city_name": "Athni"
                },
                {
                    "city_name": "Aurad"
                },
                {
                    "city_name": "Badagavettu"
                },
                {
                    "city_name": "Badami"
                },
                {
                    "city_name": "Bagalkot"
                },
                {
                    "city_name": "Bagepalli"
                },
                {
                    "city_name": "Bailhongal"
                },
                {
                    "city_name": "Baindur"
                },
                {
                    "city_name": "Bajala"
                },
                {
                    "city_name": "Bajpe"
                },
                {
                    "city_name": "Banavar"
                },
                {
                    "city_name": "Bangarapet"
                },
                {
                    "city_name": "Bankapura"
                },
                {
                    "city_name": "Bannur"
                },
                {
                    "city_name": "Bantwal"
                },
                {
                    "city_name": "Basavakalyan"
                },
                {
                    "city_name": "Basavana Bagevadi"
                },
                {
                    "city_name": "Belagula"
                },
                {
                    "city_name": "Belakavadiq"
                },
                {
                    "city_name": "Belgaum"
                },
                {
                    "city_name": "Belgaum Cantonment"
                },
                {
                    "city_name": "Bellary"
                },
                {
                    "city_name": "Belluru"
                },
                {
                    "city_name": "Beltangadi"
                },
                {
                    "city_name": "Belur"
                },
                {
                    "city_name": "Belvata"
                },
                {
                    "city_name": "Bengaluru"
                },
                {
                    "city_name": "Bhadravati"
                },
                {
                    "city_name": "Bhalki"
                },
                {
                    "city_name": "Bhatkal"
                },
                {
                    "city_name": "Bhimarayanagudi"
                },
                {
                    "city_name": "Bhogadi"
                },
                {
                    "city_name": "Bidar"
                },
                {
                    "city_name": "Bijapur"
                },
                {
                    "city_name": "Bilgi"
                },
                {
                    "city_name": "Birur"
                },
                {
                    "city_name": "Bommanahalli"
                },
                {
                    "city_name": "Bommasandra"
                },
                {
                    "city_name": "Byadgi"
                },
                {
                    "city_name": "Byatarayanapura"
                },
                {
                    "city_name": "Chakranagar Colony"
                },
                {
                    "city_name": "Challakere"
                },
                {
                    "city_name": "Chamrajnagar"
                },
                {
                    "city_name": "Chamundi Betta"
                },
                {
                    "city_name": "Channagiri"
                },
                {
                    "city_name": "Channapatna"
                },
                {
                    "city_name": "Channarayapatna"
                },
                {
                    "city_name": "Chickballapur"
                },
                {
                    "city_name": "Chik Ballapur"
                },
                {
                    "city_name": "Chikkaballapur"
                },
                {
                    "city_name": "Chikmagalur"
                },
                {
                    "city_name": "Chiknayakanhalli"
                },
                {
                    "city_name": "Chikodi"
                },
                {
                    "city_name": "Chincholi"
                },
                {
                    "city_name": "Chintamani"
                },
                {
                    "city_name": "Chitaguppa"
                },
                {
                    "city_name": "Chitapur"
                },
                {
                    "city_name": "Chitradurga"
                },
                {
                    "city_name": "Coorg"
                },
                {
                    "city_name": "Dandeli"
                },
                {
                    "city_name": "Dargajogihalli"
                },
                {
                    "city_name": "Dasarahalli"
                },
                {
                    "city_name": "Davangere"
                },
                {
                    "city_name": "Devadurga"
                },
                {
                    "city_name": "Devagiri"
                },
                {
                    "city_name": "Devanhalli"
                },
                {
                    "city_name": "Dharwar"
                },
                {
                    "city_name": "Dhupdal"
                },
                {
                    "city_name": "Dod Ballapur"
                },
                {
                    "city_name": "Donimalai"
                },
                {
                    "city_name": "Gadag"
                },
                {
                    "city_name": "Gajendragarh"
                },
                {
                    "city_name": "Ganeshgudi"
                },
                {
                    "city_name": "Gangawati"
                },
                {
                    "city_name": "Gangoli"
                },
                {
                    "city_name": "Gauribidanur"
                },
                {
                    "city_name": "Gokak"
                },
                {
                    "city_name": "Gokak Falls"
                },
                {
                    "city_name": "Gonikoppal"
                },
                {
                    "city_name": "Gorur"
                },
                {
                    "city_name": "Gottikere"
                },
                {
                    "city_name": "Gubbi"
                },
                {
                    "city_name": "Gudibanda"
                },
                {
                    "city_name": "Gulbarga"
                },
                {
                    "city_name": "Guledgudda"
                },
                {
                    "city_name": "Gundlupet"
                },
                {
                    "city_name": "Gurmatkal"
                },
                {
                    "city_name": "Haliyal"
                },
                {
                    "city_name": "Hangal"
                },
                {
                    "city_name": "Harihar"
                },
                {
                    "city_name": "Harpanahalli"
                },
                {
                    "city_name": "Hassan"
                },
                {
                    "city_name": "Hatti"
                },
                {
                    "city_name": "Hatti Gold Mines"
                },
                {
                    "city_name": "Haveri"
                },
                {
                    "city_name": "Hebbagodi"
                },
                {
                    "city_name": "Hebbalu"
                },
                {
                    "city_name": "Hebri"
                },
                {
                    "city_name": "Heggadadevanakote"
                },
                {
                    "city_name": "Herohalli"
                },
                {
                    "city_name": "Hidkal"
                },
                {
                    "city_name": "Hindalgi"
                },
                {
                    "city_name": "Hirekerur"
                },
                {
                    "city_name": "Hiriyur"
                },
                {
                    "city_name": "Holalkere"
                },
                {
                    "city_name": "Hole Narsipur"
                },
                {
                    "city_name": "Homnabad"
                },
                {
                    "city_name": "Honavar"
                },
                {
                    "city_name": "Honnali"
                },
                {
                    "city_name": "Hosakote"
                },
                {
                    "city_name": "Hosanagara"
                },
                {
                    "city_name": "Hosangadi"
                },
                {
                    "city_name": "Hosdurga"
                },
                {
                    "city_name": "Hoskote"
                },
                {
                    "city_name": "Hospet"
                },
                {
                    "city_name": "Hubli"
                },
                {
                    "city_name": "Hukeri"
                },
                {
                    "city_name": "Hunasagi"
                },
                {
                    "city_name": "Hunasamaranahalli"
                },
                {
                    "city_name": "Hungund"
                },
                {
                    "city_name": "Hunsur"
                },
                {
                    "city_name": "Huvina Hadagalli"
                },
                {
                    "city_name": "Ilkal"
                },
                {
                    "city_name": "Indi"
                },
                {
                    "city_name": "Jagalur"
                },
                {
                    "city_name": "Jamkhandi"
                },
                {
                    "city_name": "Jevargi"
                },
                {
                    "city_name": "Jog Falls"
                },
                {
                    "city_name": "Kabini Colony"
                },
                {
                    "city_name": "Kadur"
                },
                {
                    "city_name": "Kalghatgi"
                },
                {
                    "city_name": "Kamalapuram"
                },
                {
                    "city_name": "Kampli"
                },
                {
                    "city_name": "Kanakapura"
                },
                {
                    "city_name": "Kangrali BK"
                },
                {
                    "city_name": "Kangrali KH"
                },
                {
                    "city_name": "Kannur"
                },
                {
                    "city_name": "Karkala"
                },
                {
                    "city_name": "Karwar"
                },
                {
                    "city_name": "Kemminja"
                },
                {
                    "city_name": "Kengeri"
                },
                {
                    "city_name": "Kerur"
                },
                {
                    "city_name": "Khanapur"
                },
                {
                    "city_name": "Kodigenahalli"
                },
                {
                    "city_name": "Kodiyal"
                },
                {
                    "city_name": "Kodlipet"
                },
                {
                    "city_name": "Kolar"
                },
                {
                    "city_name": "Kollegal"
                },
                {
                    "city_name": "Konanakunte"
                },
                {
                    "city_name": "Konanur"
                },
                {
                    "city_name": "Konnur"
                },
                {
                    "city_name": "Koppa"
                },
                {
                    "city_name": "Koppal"
                },
                {
                    "city_name": "Koratagere"
                },
                {
                    "city_name": "Kotekara"
                },
                {
                    "city_name": "Kothnur"
                },
                {
                    "city_name": "Kotturu"
                },
                {
                    "city_name": "Krishnapura"
                },
                {
                    "city_name": "Krishnarajanagar"
                },
                {
                    "city_name": "Krishnarajapura"
                },
                {
                    "city_name": "Krishnarajasagara"
                },
                {
                    "city_name": "Krishnarajpet"
                },
                {
                    "city_name": "Kudchi"
                },
                {
                    "city_name": "Kudligi"
                },
                {
                    "city_name": "Kudremukh"
                },
                {
                    "city_name": "Kumsi"
                },
                {
                    "city_name": "Kumta"
                },
                {
                    "city_name": "Kundapura"
                },
                {
                    "city_name": "Kundgol"
                },
                {
                    "city_name": "Kunigal"
                },
                {
                    "city_name": "Kurgunta"
                },
                {
                    "city_name": "Kushalnagar"
                },
                {
                    "city_name": "Kushtagi"
                },
                {
                    "city_name": "Kyathanahalli"
                },
                {
                    "city_name": "Lakshmeshwar"
                },
                {
                    "city_name": "Lingsugur"
                },
                {
                    "city_name": "Londa"
                },
                {
                    "city_name": "Maddur"
                },
                {
                    "city_name": "Madhugiri"
                },
                {
                    "city_name": "Madikeri"
                },
                {
                    "city_name": "Magadi"
                },
                {
                    "city_name": "Magod Falls"
                },
                {
                    "city_name": "Mahadeswara Hills"
                },
                {
                    "city_name": "Mahadevapura"
                },
                {
                    "city_name": "Mahalingpur"
                },
                {
                    "city_name": "Maisuru"
                },
                {
                    "city_name": "Maisuru Cantonment"
                },
                {
                    "city_name": "Malavalli"
                },
                {
                    "city_name": "Mallar"
                },
                {
                    "city_name": "Malpe"
                },
                {
                    "city_name": "Malur"
                },
                {
                    "city_name": "Manchenahalli"
                },
                {
                    "city_name": "Mandya"
                },
                {
                    "city_name": "Mangalore"
                },
                {
                    "city_name": "Mangaluru"
                },
                {
                    "city_name": "Manipal"
                },
                {
                    "city_name": "Manvi"
                },
                {
                    "city_name": "Maski"
                },
                {
                    "city_name": "Mastikatte Colony"
                },
                {
                    "city_name": "Mayakonda"
                },
                {
                    "city_name": "Melukote"
                },
                {
                    "city_name": "Molakalmuru"
                },
                {
                    "city_name": "Mudalgi"
                },
                {
                    "city_name": "Mudbidri"
                },
                {
                    "city_name": "Muddebihal"
                },
                {
                    "city_name": "Mudgal"
                },
                {
                    "city_name": "Mudhol"
                },
                {
                    "city_name": "Mudigere"
                },
                {
                    "city_name": "Mudushedde"
                },
                {
                    "city_name": "Mulbagal"
                },
                {
                    "city_name": "Mulgund"
                },
                {
                    "city_name": "Mulki"
                },
                {
                    "city_name": "Mulur"
                },
                {
                    "city_name": "Mundargi"
                },
                {
                    "city_name": "Mundgod"
                },
                {
                    "city_name": "Munirabad"
                },
                {
                    "city_name": "Munnur"
                },
                {
                    "city_name": "Murudeshwara"
                },
                {
                    "city_name": "Mysore"
                },
                {
                    "city_name": "Nagamangala"
                },
                {
                    "city_name": "Nanjangud"
                },
                {
                    "city_name": "Naragund"
                },
                {
                    "city_name": "Narasimharajapura"
                },
                {
                    "city_name": "Naravi"
                },
                {
                    "city_name": "Narayanpur"
                },
                {
                    "city_name": "Naregal"
                },
                {
                    "city_name": "Navalgund"
                },
                {
                    "city_name": "Nelmangala"
                },
                {
                    "city_name": "Nipani"
                },
                {
                    "city_name": "Nitte"
                },
                {
                    "city_name": "Nyamati"
                },
                {
                    "city_name": "Padu"
                },
                {
                    "city_name": "Pandavapura"
                },
                {
                    "city_name": "Pattanagere"
                },
                {
                    "city_name": "Pavagada"
                },
                {
                    "city_name": "Piriyapatna"
                },
                {
                    "city_name": "Ponnampet"
                },
                {
                    "city_name": "Puttur"
                },
                {
                    "city_name": "Rabkavi"
                },
                {
                    "city_name": "Raichur"
                },
                {
                    "city_name": "Ramanagaram"
                },
                {
                    "city_name": "Ramdurg"
                },
                {
                    "city_name": "Ranibennur"
                },
                {
                    "city_name": "Raybag"
                },
                {
                    "city_name": "Robertsonpet"
                },
                {
                    "city_name": "Ron"
                },
                {
                    "city_name": "Sadalgi"
                },
                {
                    "city_name": "Sagar"
                },
                {
                    "city_name": "Sakleshpur"
                },
                {
                    "city_name": "Saligram"
                },
                {
                    "city_name": "Sandur"
                },
                {
                    "city_name": "Sanivarsante"
                },
                {
                    "city_name": "Sankeshwar"
                },
                {
                    "city_name": "Sargur"
                },
                {
                    "city_name": "Sathyamangala"
                },
                {
                    "city_name": "Saundatti Yellamma"
                },
                {
                    "city_name": "Savanur"
                },
                {
                    "city_name": "Sedam"
                },
                {
                    "city_name": "Shahabad"
                },
                {
                    "city_name": "Shahabad A.C.C."
                },
                {
                    "city_name": "Shahapur"
                },
                {
                    "city_name": "Shahpur"
                },
                {
                    "city_name": "Shaktinagar"
                },
                {
                    "city_name": "Shiggaon"
                },
                {
                    "city_name": "Shikarpur"
                },
                {
                    "city_name": "Shimoga"
                },
                {
                    "city_name": "Shirhatti"
                },
                {
                    "city_name": "Shorapur"
                },
                {
                    "city_name": "Shravanabelagola"
                },
                {
                    "city_name": "Shrirangapattana"
                },
                {
                    "city_name": "Siddapur"
                },
                {
                    "city_name": "Sidlaghatta"
                },
                {
                    "city_name": "Sindgi"
                },
                {
                    "city_name": "Sindhnur"
                },
                {
                    "city_name": "Sira"
                },
                {
                    "city_name": "Sirakoppa"
                },
                {
                    "city_name": "Sirsi"
                },
                {
                    "city_name": "Siruguppa"
                },
                {
                    "city_name": "Someshwar"
                },
                {
                    "city_name": "Somvarpet"
                },
                {
                    "city_name": "Sorab"
                },
                {
                    "city_name": "Sringeri"
                },
                {
                    "city_name": "Srinivaspur"
                },
                {
                    "city_name": "Sulya"
                },
                {
                    "city_name": "Suntikopa"
                },
                {
                    "city_name": "Talikota"
                },
                {
                    "city_name": "Tarikera"
                },
                {
                    "city_name": "Tekkalakota"
                },
                {
                    "city_name": "Terdal"
                },
                {
                    "city_name": "Thokur"
                },
                {
                    "city_name": "Thumbe"
                },
                {
                    "city_name": "Tiptur"
                },
                {
                    "city_name": "Tirthahalli"
                },
                {
                    "city_name": "Tirumakudal Narsipur"
                },
                {
                    "city_name": "Tonse"
                },
                {
                    "city_name": "Tumkur"
                },
                {
                    "city_name": "Turuvekere"
                },
                {
                    "city_name": "Udupi"
                },
                {
                    "city_name": "Ullal"
                },
                {
                    "city_name": "Uttarahalli"
                },
                {
                    "city_name": "Venkatapura"
                },
                {
                    "city_name": "Vijayapura"
                },
                {
                    "city_name": "Virarajendrapet"
                },
                {
                    "city_name": "Wadi"
                },
                {
                    "city_name": "Wadi A.C.C."
                },
                {
                    "city_name": "Yadgir"
                },
                {
                    "city_name": "Yelahanka"
                },
                {
                    "city_name": "Yelandur"
                },
                {
                    "city_name": "Yelbarga"
                },
                {
                    "city_name": "Yellapur"
                },
                {
                    "city_name": "Yenagudde"
                }
            ]

            var kerala = [
                {
                    "city_name": "Adimaly"
                },
                {
                    "city_name": "Adoor"
                },
                {
                    "city_name": "Adur"
                },
                {
                    "city_name": "Akathiyur"
                },
                {
                    "city_name": "Alangad"
                },
                {
                    "city_name": "Alappuzha"
                },
                {
                    "city_name": "Aluva"
                },
                {
                    "city_name": "Ancharakandy"
                },
                {
                    "city_name": "Angamaly"
                },
                {
                    "city_name": "Aroor"
                },
                {
                    "city_name": "Arukutti"
                },
                {
                    "city_name": "Attingal"
                },
                {
                    "city_name": "Avinissery"
                },
                {
                    "city_name": "Azhikode North"
                },
                {
                    "city_name": "Azhikode South"
                },
                {
                    "city_name": "Azhiyur"
                },
                {
                    "city_name": "Balussery"
                },
                {
                    "city_name": "Bangramanjeshwar"
                },
                {
                    "city_name": "Beypur"
                },
                {
                    "city_name": "Brahmakulam"
                },
                {
                    "city_name": "Chala"
                },
                {
                    "city_name": "Chalakudi"
                },
                {
                    "city_name": "Changanacheri"
                },
                {
                    "city_name": "Chauwara"
                },
                {
                    "city_name": "Chavakkad"
                },
                {
                    "city_name": "Chelakkara"
                },
                {
                    "city_name": "Chelora"
                },
                {
                    "city_name": "Chendamangalam"
                },
                {
                    "city_name": "Chengamanad"
                },
                {
                    "city_name": "Chengannur"
                },
                {
                    "city_name": "Cheranallur"
                },
                {
                    "city_name": "Cheriyakadavu"
                },
                {
                    "city_name": "Cherthala"
                },
                {
                    "city_name": "Cherukunnu"
                },
                {
                    "city_name": "Cheruthazham"
                },
                {
                    "city_name": "Cheruvannur"
                },
                {
                    "city_name": "Cheruvattur"
                },
                {
                    "city_name": "Chevvur"
                },
                {
                    "city_name": "Chirakkal"
                },
                {
                    "city_name": "Chittur"
                },
                {
                    "city_name": "Chockli"
                },
                {
                    "city_name": "Churnikkara"
                },
                {
                    "city_name": "Dharmadam"
                },
                {
                    "city_name": "Edappal"
                },
                {
                    "city_name": "Edathala"
                },
                {
                    "city_name": "Elayavur"
                },
                {
                    "city_name": "Elur"
                },
                {
                    "city_name": "Eranholi"
                },
                {
                    "city_name": "Erattupetta"
                },
                {
                    "city_name": "Ernakulam"
                },
                {
                    "city_name": "Eruvatti"
                },
                {
                    "city_name": "Ettumanoor"
                },
                {
                    "city_name": "Feroke"
                },
                {
                    "city_name": "Guruvayur"
                },
                {
                    "city_name": "Haripad"
                },
                {
                    "city_name": "Hosabettu"
                },
                {
                    "city_name": "Idukki"
                },
                {
                    "city_name": "Iringaprom"
                },
                {
                    "city_name": "Irinjalakuda"
                },
                {
                    "city_name": "Iriveri"
                },
                {
                    "city_name": "Kadachira"
                },
                {
                    "city_name": "Kadalundi"
                },
                {
                    "city_name": "Kadamakkudy"
                },
                {
                    "city_name": "Kadirur"
                },
                {
                    "city_name": "Kadungallur"
                },
                {
                    "city_name": "Kakkodi"
                },
                {
                    "city_name": "Kalady"
                },
                {
                    "city_name": "Kalamassery"
                },
                {
                    "city_name": "Kalliasseri"
                },
                {
                    "city_name": "Kalpetta"
                },
                {
                    "city_name": "Kanhangad"
                },
                {
                    "city_name": "Kanhirode"
                },
                {
                    "city_name": "Kanjikkuzhi"
                },
                {
                    "city_name": "Kanjikode"
                },
                {
                    "city_name": "Kanjirappalli"
                },
                {
                    "city_name": "Kannadiparamba"
                },
                {
                    "city_name": "Kannangad"
                },
                {
                    "city_name": "Kannapuram"
                },
                {
                    "city_name": "Kannur"
                },
                {
                    "city_name": "Kannur Cantonment"
                },
                {
                    "city_name": "Karunagappally"
                },
                {
                    "city_name": "Karuvamyhuruthy"
                },
                {
                    "city_name": "Kasaragod"
                },
                {
                    "city_name": "Kasargod"
                },
                {
                    "city_name": "Kattappana"
                },
                {
                    "city_name": "Kayamkulam"
                },
                {
                    "city_name": "Kedamangalam"
                },
                {
                    "city_name": "Kochi"
                },
                {
                    "city_name": "Kodamthuruthu"
                },
                {
                    "city_name": "Kodungallur"
                },
                {
                    "city_name": "Koduvally"
                },
                {
                    "city_name": "Koduvayur"
                },
                {
                    "city_name": "Kokkothamangalam"
                },
                {
                    "city_name": "Kolazhy"
                },
                {
                    "city_name": "Kollam"
                },
                {
                    "city_name": "Komalapuram"
                },
                {
                    "city_name": "Koothattukulam"
                },
                {
                    "city_name": "Koratty"
                },
                {
                    "city_name": "Kothamangalam"
                },
                {
                    "city_name": "Kottarakkara"
                },
                {
                    "city_name": "Kottayam"
                },
                {
                    "city_name": "Kottayam Malabar"
                },
                {
                    "city_name": "Kottuvally"
                },
                {
                    "city_name": "Koyilandi"
                },
                {
                    "city_name": "Kozhikode"
                },
                {
                    "city_name": "Kudappanakunnu"
                },
                {
                    "city_name": "Kudlu"
                },
                {
                    "city_name": "Kumarakom"
                },
                {
                    "city_name": "Kumily"
                },
                {
                    "city_name": "Kunnamangalam"
                },
                {
                    "city_name": "Kunnamkulam"
                },
                {
                    "city_name": "Kurikkad"
                },
                {
                    "city_name": "Kurkkanchery"
                },
                {
                    "city_name": "Kuthuparamba"
                },
                {
                    "city_name": "Kuttakulam"
                },
                {
                    "city_name": "Kuttikkattur"
                },
                {
                    "city_name": "Kuttur"
                },
                {
                    "city_name": "Malappuram"
                },
                {
                    "city_name": "Mallappally"
                },
                {
                    "city_name": "Manjeri"
                },
                {
                    "city_name": "Manjeshwar"
                },
                {
                    "city_name": "Mannancherry"
                },
                {
                    "city_name": "Mannar"
                },
                {
                    "city_name": "Mannarakkat"
                },
                {
                    "city_name": "Maradu"
                },
                {
                    "city_name": "Marathakkara"
                },
                {
                    "city_name": "Marutharod"
                },
                {
                    "city_name": "Mattannur"
                },
                {
                    "city_name": "Mavelikara"
                },
                {
                    "city_name": "Mavilayi"
                },
                {
                    "city_name": "Mavur"
                },
                {
                    "city_name": "Methala"
                },
                {
                    "city_name": "Muhamma"
                },
                {
                    "city_name": "Mulavukad"
                },
                {
                    "city_name": "Mundakayam"
                },
                {
                    "city_name": "Munderi"
                },
                {
                    "city_name": "Munnar"
                },
                {
                    "city_name": "Muthakunnam"
                },
                {
                    "city_name": "Muvattupuzha"
                },
                {
                    "city_name": "Muzhappilangad"
                },
                {
                    "city_name": "Nadapuram"
                },
                {
                    "city_name": "Nadathara"
                },
                {
                    "city_name": "Narath"
                },
                {
                    "city_name": "Nattakam"
                },
                {
                    "city_name": "Nedumangad"
                },
                {
                    "city_name": "Nenmenikkara"
                },
                {
                    "city_name": "New Mahe"
                },
                {
                    "city_name": "Neyyattinkara"
                },
                {
                    "city_name": "Nileshwar"
                },
                {
                    "city_name": "Olavanna"
                },
                {
                    "city_name": "Ottapalam"
                },
                {
                    "city_name": "Ottappalam"
                },
                {
                    "city_name": "Paduvilayi"
                },
                {
                    "city_name": "Palai"
                },
                {
                    "city_name": "Palakkad"
                },
                {
                    "city_name": "Palayad"
                },
                {
                    "city_name": "Palissery"
                },
                {
                    "city_name": "Pallikkunnu"
                },
                {
                    "city_name": "Paluvai"
                },
                {
                    "city_name": "Panniyannur"
                },
                {
                    "city_name": "Pantalam"
                },
                {
                    "city_name": "Panthiramkavu"
                },
                {
                    "city_name": "Panur"
                },
                {
                    "city_name": "Pappinisseri"
                },
                {
                    "city_name": "Parassala"
                },
                {
                    "city_name": "Paravur"
                },
                {
                    "city_name": "Pathanamthitta"
                },
                {
                    "city_name": "Pathanapuram"
                },
                {
                    "city_name": "Pathiriyad"
                },
                {
                    "city_name": "Pattambi"
                },
                {
                    "city_name": "Pattiom"
                },
                {
                    "city_name": "Pavaratty"
                },
                {
                    "city_name": "Payyannur"
                },
                {
                    "city_name": "Peermade"
                },
                {
                    "city_name": "Perakam"
                },
                {
                    "city_name": "Peralasseri"
                },
                {
                    "city_name": "Peringathur"
                },
                {
                    "city_name": "Perinthalmanna"
                },
                {
                    "city_name": "Perole"
                },
                {
                    "city_name": "Perumanna"
                },
                {
                    "city_name": "Perumbaikadu"
                },
                {
                    "city_name": "Perumbavoor"
                },
                {
                    "city_name": "Pinarayi"
                },
                {
                    "city_name": "Piravam"
                },
                {
                    "city_name": "Ponnani"
                },
                {
                    "city_name": "Pottore"
                },
                {
                    "city_name": "Pudukad"
                },
                {
                    "city_name": "Punalur"
                },
                {
                    "city_name": "Puranattukara"
                },
                {
                    "city_name": "Puthunagaram"
                },
                {
                    "city_name": "Puthuppariyaram"
                },
                {
                    "city_name": "Puzhathi"
                },
                {
                    "city_name": "Ramanattukara"
                },
                {
                    "city_name": "Shoranur"
                },
                {
                    "city_name": "Sultans Battery"
                },
                {
                    "city_name": "Sulthan Bathery"
                },
                {
                    "city_name": "Talipparamba"
                },
                {
                    "city_name": "Thaikkad"
                },
                {
                    "city_name": "Thalassery"
                },
                {
                    "city_name": "Thannirmukkam"
                },
                {
                    "city_name": "Theyyalingal"
                },
                {
                    "city_name": "Thiruvalla"
                },
                {
                    "city_name": "Thiruvananthapuram"
                },
                {
                    "city_name": "Thiruvankulam"
                },
                {
                    "city_name": "Thodupuzha"
                },
                {
                    "city_name": "Thottada"
                },
                {
                    "city_name": "Thrippunithura"
                },
                {
                    "city_name": "Thrissur"
                },
                {
                    "city_name": "Tirur"
                },
                {
                    "city_name": "Udma"
                },
                {
                    "city_name": "Vadakara"
                },
                {
                    "city_name": "Vaikam"
                },
                {
                    "city_name": "Valapattam"
                },
                {
                    "city_name": "Vallachira"
                },
                {
                    "city_name": "Varam"
                },
                {
                    "city_name": "Varappuzha"
                },
                {
                    "city_name": "Varkala"
                },
                {
                    "city_name": "Vayalar"
                },
                {
                    "city_name": "Vazhakkala"
                },
                {
                    "city_name": "Venmanad"
                },
                {
                    "city_name": "Villiappally"
                },
                {
                    "city_name": "Wayanad"
                }
            ]

            var ladakh = [
                {
                    "city_name": "Kargil"
                },
                {
                    "city_name": "Leh"
                }
            ]

            var lakshadweep = [
                {
                    "city_name": "Agethi"
                },
                {
                    "city_name": "Amini"
                },
                {
                    "city_name": "Androth Island"
                },
                {
                    "city_name": "Kavaratti"
                },
                {
                    "city_name": "Minicoy"
                }
            ]

            var mp = [
                {
                    "city_name": "Agar"
                },
                {
                    "city_name": "Ajaigarh"
                },
                {
                    "city_name": "Akoda"
                },
                {
                    "city_name": "Akodia"
                },
                {
                    "city_name": "Alampur"
                },
                {
                    "city_name": "Alirajpur"
                },
                {
                    "city_name": "Alot"
                },
                {
                    "city_name": "Amanganj"
                },
                {
                    "city_name": "Amarkantak"
                },
                {
                    "city_name": "Amarpatan"
                },
                {
                    "city_name": "Amarwara"
                },
                {
                    "city_name": "Ambada"
                },
                {
                    "city_name": "Ambah"
                },
                {
                    "city_name": "Amla"
                },
                {
                    "city_name": "Amlai"
                },
                {
                    "city_name": "Anjad"
                },
                {
                    "city_name": "Antri"
                },
                {
                    "city_name": "Anuppur"
                },
                {
                    "city_name": "Aron"
                },
                {
                    "city_name": "Ashoknagar"
                },
                {
                    "city_name": "Ashta"
                },
                {
                    "city_name": "Babai"
                },
                {
                    "city_name": "Bada Malhera"
                },
                {
                    "city_name": "Badagaon"
                },
                {
                    "city_name": "Badagoan"
                },
                {
                    "city_name": "Badarwas"
                },
                {
                    "city_name": "Badawada"
                },
                {
                    "city_name": "Badi"
                },
                {
                    "city_name": "Badkuhi"
                },
                {
                    "city_name": "Badnagar"
                },
                {
                    "city_name": "Badnawar"
                },
                {
                    "city_name": "Badod"
                },
                {
                    "city_name": "Badoda"
                },
                {
                    "city_name": "Badra"
                },
                {
                    "city_name": "Bagh"
                },
                {
                    "city_name": "Bagli"
                },
                {
                    "city_name": "Baihar"
                },
                {
                    "city_name": "Baikunthpur"
                },
                {
                    "city_name": "Bakswaha"
                },
                {
                    "city_name": "Balaghat"
                },
                {
                    "city_name": "Baldeogarh"
                },
                {
                    "city_name": "Bamaniya"
                },
                {
                    "city_name": "Bamhani"
                },
                {
                    "city_name": "Bamor"
                },
                {
                    "city_name": "Bamora"
                },
                {
                    "city_name": "Banda"
                },
                {
                    "city_name": "Bangawan"
                },
                {
                    "city_name": "Bansatar Kheda"
                },
                {
                    "city_name": "Baraily"
                },
                {
                    "city_name": "Barela"
                },
                {
                    "city_name": "Barghat"
                },
                {
                    "city_name": "Bargi"
                },
                {
                    "city_name": "Barhi"
                },
                {
                    "city_name": "Barigarh"
                },
                {
                    "city_name": "Barwaha"
                },
                {
                    "city_name": "Barwani"
                },
                {
                    "city_name": "Basoda"
                },
                {
                    "city_name": "Begamganj"
                },
                {
                    "city_name": "Beohari"
                },
                {
                    "city_name": "Berasia"
                },
                {
                    "city_name": "Betma"
                },
                {
                    "city_name": "Betul"
                },
                {
                    "city_name": "Betul Bazar"
                },
                {
                    "city_name": "Bhainsdehi"
                },
                {
                    "city_name": "Bhamodi"
                },
                {
                    "city_name": "Bhander"
                },
                {
                    "city_name": "Bhanpura"
                },
                {
                    "city_name": "Bharveli"
                },
                {
                    "city_name": "Bhaurasa"
                },
                {
                    "city_name": "Bhavra"
                },
                {
                    "city_name": "Bhedaghat"
                },
                {
                    "city_name": "Bhikangaon"
                },
                {
                    "city_name": "Bhilakhedi"
                },
                {
                    "city_name": "Bhind"
                },
                {
                    "city_name": "Bhitarwar"
                },
                {
                    "city_name": "Bhopal"
                },
                {
                    "city_name": "Bhuibandh"
                },
                {
                    "city_name": "Biaora"
                },
                {
                    "city_name": "Bijawar"
                },
                {
                    "city_name": "Bijeypur"
                },
                {
                    "city_name": "Bijrauni"
                },
                {
                    "city_name": "Bijuri"
                },
                {
                    "city_name": "Bilaua"
                },
                {
                    "city_name": "Bilpura"
                },
                {
                    "city_name": "Bina Railway Colony"
                },
                {
                    "city_name": "Bina-Etawa"
                },
                {
                    "city_name": "Birsinghpur"
                },
                {
                    "city_name": "Boda"
                },
                {
                    "city_name": "Budhni"
                },
                {
                    "city_name": "Burhanpur"
                },
                {
                    "city_name": "Burhar"
                },
                {
                    "city_name": "Chachaura Binaganj"
                },
                {
                    "city_name": "Chakghat"
                },
                {
                    "city_name": "Chandameta Butar"
                },
                {
                    "city_name": "Chanderi"
                },
                {
                    "city_name": "Chandia"
                },
                {
                    "city_name": "Chandla"
                },
                {
                    "city_name": "Chaurai Khas"
                },
                {
                    "city_name": "Chhatarpur"
                },
                {
                    "city_name": "Chhindwara"
                },
                {
                    "city_name": "Chhota Chhindwara"
                },
                {
                    "city_name": "Chichli"
                },
                {
                    "city_name": "Chitrakut"
                },
                {
                    "city_name": "Churhat"
                },
                {
                    "city_name": "Daboh"
                },
                {
                    "city_name": "Dabra"
                },
                {
                    "city_name": "Damoh"
                },
                {
                    "city_name": "Damua"
                },
                {
                    "city_name": "Datia"
                },
                {
                    "city_name": "Deodara"
                },
                {
                    "city_name": "Deori"
                },
                {
                    "city_name": "Deori Khas"
                },
                {
                    "city_name": "Depalpur"
                },
                {
                    "city_name": "Devendranagar"
                },
                {
                    "city_name": "Devhara"
                },
                {
                    "city_name": "Dewas"
                },
                {
                    "city_name": "Dhamnod"
                },
                {
                    "city_name": "Dhana"
                },
                {
                    "city_name": "Dhanpuri"
                },
                {
                    "city_name": "Dhar"
                },
                {
                    "city_name": "Dharampuri"
                },
                {
                    "city_name": "Dighawani"
                },
                {
                    "city_name": "Diken"
                },
                {
                    "city_name": "Dindori"
                },
                {
                    "city_name": "Dola"
                },
                {
                    "city_name": "Dumar Kachhar"
                },
                {
                    "city_name": "Dungariya Chhapara"
                },
                {
                    "city_name": "Gadarwara"
                },
                {
                    "city_name": "Gairatganj"
                },
                {
                    "city_name": "Gandhi Sagar Hydel Colony"
                },
                {
                    "city_name": "Ganjbasoda"
                },
                {
                    "city_name": "Garhakota"
                },
                {
                    "city_name": "Garhi Malhara"
                },
                {
                    "city_name": "Garoth"
                },
                {
                    "city_name": "Gautapura"
                },
                {
                    "city_name": "Ghansor"
                },
                {
                    "city_name": "Ghuwara"
                },
                {
                    "city_name": "Gogaon"
                },
                {
                    "city_name": "Gogapur"
                },
                {
                    "city_name": "Gohad"
                },
                {
                    "city_name": "Gormi"
                },
                {
                    "city_name": "Govindgarh"
                },
                {
                    "city_name": "Guna"
                },
                {
                    "city_name": "Gurh"
                },
                {
                    "city_name": "Gwalior"
                },
                {
                    "city_name": "Hanumana"
                },
                {
                    "city_name": "Harda"
                },
                {
                    "city_name": "Harpalpur"
                },
                {
                    "city_name": "Harrai"
                },
                {
                    "city_name": "Harsud"
                },
                {
                    "city_name": "Hatod"
                },
                {
                    "city_name": "Hatpipalya"
                },
                {
                    "city_name": "Hatta"
                },
                {
                    "city_name": "Hindoria"
                },
                {
                    "city_name": "Hirapur"
                },
                {
                    "city_name": "Hoshangabad"
                },
                {
                    "city_name": "Ichhawar"
                },
                {
                    "city_name": "Iklehra"
                },
                {
                    "city_name": "Indergarh"
                },
                {
                    "city_name": "Indore"
                },
                {
                    "city_name": "Isagarh"
                },
                {
                    "city_name": "Itarsi"
                },
                {
                    "city_name": "Jabalpur"
                },
                {
                    "city_name": "Jabalpur Cantonment"
                },
                {
                    "city_name": "Jabalpur G.C.F"
                },
                {
                    "city_name": "Jaisinghnagar"
                },
                {
                    "city_name": "Jaithari"
                },
                {
                    "city_name": "Jaitwara"
                },
                {
                    "city_name": "Jamai"
                },
                {
                    "city_name": "Jaora"
                },
                {
                    "city_name": "Jatachhapar"
                },
                {
                    "city_name": "Jatara"
                },
                {
                    "city_name": "Jawad"
                },
                {
                    "city_name": "Jawar"
                },
                {
                    "city_name": "Jeronkhalsa"
                },
                {
                    "city_name": "Jhabua"
                },
                {
                    "city_name": "Jhundpura"
                },
                {
                    "city_name": "Jiran"
                },
                {
                    "city_name": "Jirapur"
                },
                {
                    "city_name": "Jobat"
                },
                {
                    "city_name": "Joura"
                },
                {
                    "city_name": "Kailaras"
                },
                {
                    "city_name": "Kaimur"
                },
                {
                    "city_name": "Kakarhati"
                },
                {
                    "city_name": "Kalichhapar"
                },
                {
                    "city_name": "Kanad"
                },
                {
                    "city_name": "Kannod"
                },
                {
                    "city_name": "Kantaphod"
                },
                {
                    "city_name": "Kareli"
                },
                {
                    "city_name": "Karera"
                },
                {
                    "city_name": "Kari"
                },
                {
                    "city_name": "Karnawad"
                },
                {
                    "city_name": "Karrapur"
                },
                {
                    "city_name": "Kasrawad"
                },
                {
                    "city_name": "Katangi"
                },
                {
                    "city_name": "Katni"
                },
                {
                    "city_name": "Kelhauri"
                },
                {
                    "city_name": "Khachrod"
                },
                {
                    "city_name": "Khajuraho"
                },
                {
                    "city_name": "Khamaria"
                },
                {
                    "city_name": "Khand"
                },
                {
                    "city_name": "Khandwa"
                },
                {
                    "city_name": "Khaniyadhana"
                },
                {
                    "city_name": "Khargapur"
                },
                {
                    "city_name": "Khargone"
                },
                {
                    "city_name": "Khategaon"
                },
                {
                    "city_name": "Khetia"
                },
                {
                    "city_name": "Khilchipur"
                },
                {
                    "city_name": "Khirkiya"
                },
                {
                    "city_name": "Khujner"
                },
                {
                    "city_name": "Khurai"
                },
                {
                    "city_name": "Kolaras"
                },
                {
                    "city_name": "Kotar"
                },
                {
                    "city_name": "Kothi"
                },
                {
                    "city_name": "Kotma"
                },
                {
                    "city_name": "Kukshi"
                },
                {
                    "city_name": "Kumbhraj"
                },
                {
                    "city_name": "Kurwai"
                },
                {
                    "city_name": "Lahar"
                },
                {
                    "city_name": "Lakhnadon"
                },
                {
                    "city_name": "Lateri"
                },
                {
                    "city_name": "Laundi"
                },
                {
                    "city_name": "Lidhora Khas"
                },
                {
                    "city_name": "Lodhikheda"
                },
                {
                    "city_name": "Loharda"
                },
                {
                    "city_name": "Machalpur"
                },
                {
                    "city_name": "Madhogarh"
                },
                {
                    "city_name": "Maharajpur"
                },
                {
                    "city_name": "Maheshwar"
                },
                {
                    "city_name": "Mahidpur"
                },
                {
                    "city_name": "Maihar"
                },
                {
                    "city_name": "Majholi"
                },
                {
                    "city_name": "Makronia"
                },
                {
                    "city_name": "Maksi"
                },
                {
                    "city_name": "Malaj Khand"
                },
                {
                    "city_name": "Malanpur"
                },
                {
                    "city_name": "Malhargarh"
                },
                {
                    "city_name": "Manasa"
                },
                {
                    "city_name": "Manawar"
                },
                {
                    "city_name": "Mandav"
                },
                {
                    "city_name": "Mandideep"
                },
                {
                    "city_name": "Mandla"
                },
                {
                    "city_name": "Mandleshwar"
                },
                {
                    "city_name": "Mandsaur"
                },
                {
                    "city_name": "Manegaon"
                },
                {
                    "city_name": "Mangawan"
                },
                {
                    "city_name": "Manglaya Sadak"
                },
                {
                    "city_name": "Manpur"
                },
                {
                    "city_name": "Mau"
                },
                {
                    "city_name": "Mauganj"
                },
                {
                    "city_name": "Meghnagar"
                },
                {
                    "city_name": "Mehara Gaon"
                },
                {
                    "city_name": "Mehgaon"
                },
                {
                    "city_name": "Mhaugaon"
                },
                {
                    "city_name": "Mhow"
                },
                {
                    "city_name": "Mihona"
                },
                {
                    "city_name": "Mohgaon"
                },
                {
                    "city_name": "Morar"
                },
                {
                    "city_name": "Morena"
                },
                {
                    "city_name": "Morwa"
                },
                {
                    "city_name": "Multai"
                },
                {
                    "city_name": "Mundi"
                },
                {
                    "city_name": "Mungaoli"
                },
                {
                    "city_name": "Murwara"
                },
                {
                    "city_name": "Nagda"
                },
                {
                    "city_name": "Nagod"
                },
                {
                    "city_name": "Nagri"
                },
                {
                    "city_name": "Naigarhi"
                },
                {
                    "city_name": "Nainpur"
                },
                {
                    "city_name": "Nalkheda"
                },
                {
                    "city_name": "Namli"
                },
                {
                    "city_name": "Narayangarh"
                },
                {
                    "city_name": "Narsimhapur"
                },
                {
                    "city_name": "Narsingarh"
                },
                {
                    "city_name": "Narsinghpur"
                },
                {
                    "city_name": "Narwar"
                },
                {
                    "city_name": "Nasrullaganj"
                },
                {
                    "city_name": "Naudhia"
                },
                {
                    "city_name": "Naugaon"
                },
                {
                    "city_name": "Naurozabad"
                },
                {
                    "city_name": "Neemuch"
                },
                {
                    "city_name": "Nepa Nagar"
                },
                {
                    "city_name": "Neuton Chikhli Kalan"
                },
                {
                    "city_name": "Nimach"
                },
                {
                    "city_name": "Niwari"
                },
                {
                    "city_name": "Obedullaganj"
                },
                {
                    "city_name": "Omkareshwar"
                },
                {
                    "city_name": "Orachha"
                },
                {
                    "city_name": "Ordinance Factory Itarsi"
                },
                {
                    "city_name": "Pachmarhi"
                },
                {
                    "city_name": "Pachmarhi Cantonment"
                },
                {
                    "city_name": "Pachore"
                },
                {
                    "city_name": "Palchorai"
                },
                {
                    "city_name": "Palda"
                },
                {
                    "city_name": "Palera"
                },
                {
                    "city_name": "Pali"
                },
                {
                    "city_name": "Panagar"
                },
                {
                    "city_name": "Panara"
                },
                {
                    "city_name": "Pandaria"
                },
                {
                    "city_name": "Pandhana"
                },
                {
                    "city_name": "Pandhurna"
                },
                {
                    "city_name": "Panna"
                },
                {
                    "city_name": "Pansemal"
                },
                {
                    "city_name": "Parasia"
                },
                {
                    "city_name": "Pasan"
                },
                {
                    "city_name": "Patan"
                },
                {
                    "city_name": "Patharia"
                },
                {
                    "city_name": "Pawai"
                },
                {
                    "city_name": "Petlawad"
                },
                {
                    "city_name": "Phuph Kalan"
                },
                {
                    "city_name": "Pichhore"
                },
                {
                    "city_name": "Pipariya"
                },
                {
                    "city_name": "Pipliya Mandi"
                },
                {
                    "city_name": "Piploda"
                },
                {
                    "city_name": "Pithampur"
                },
                {
                    "city_name": "Polay Kalan"
                },
                {
                    "city_name": "Porsa"
                },
                {
                    "city_name": "Prithvipur"
                },
                {
                    "city_name": "Raghogarh"
                },
                {
                    "city_name": "Rahatgarh"
                },
                {
                    "city_name": "Raisen"
                },
                {
                    "city_name": "Rajakhedi"
                },
                {
                    "city_name": "Rajgarh"
                },
                {
                    "city_name": "Rajnagar"
                },
                {
                    "city_name": "Rajpur"
                },
                {
                    "city_name": "Rampur Baghelan"
                },
                {
                    "city_name": "Rampur Naikin"
                },
                {
                    "city_name": "Rampura"
                },
                {
                    "city_name": "Ranapur"
                },
                {
                    "city_name": "Ranipura"
                },
                {
                    "city_name": "Ratangarh"
                },
                {
                    "city_name": "Ratlam"
                },
                {
                    "city_name": "Ratlam Kasba"
                },
                {
                    "city_name": "Rau"
                },
                {
                    "city_name": "Rehli"
                },
                {
                    "city_name": "Rehti"
                },
                {
                    "city_name": "Rewa"
                },
                {
                    "city_name": "Sabalgarh"
                },
                {
                    "city_name": "Sagar"
                },
                {
                    "city_name": "Sagar Cantonment"
                },
                {
                    "city_name": "Sailana"
                },
                {
                    "city_name": "Sanawad"
                },
                {
                    "city_name": "Sanchi"
                },
                {
                    "city_name": "Sanwer"
                },
                {
                    "city_name": "Sarangpur"
                },
                {
                    "city_name": "Sardarpur"
                },
                {
                    "city_name": "Sarni"
                },
                {
                    "city_name": "Satai"
                },
                {
                    "city_name": "Satna"
                },
                {
                    "city_name": "Satwas"
                },
                {
                    "city_name": "Sausar"
                },
                {
                    "city_name": "Sehore"
                },
                {
                    "city_name": "Semaria"
                },
                {
                    "city_name": "Sendhwa"
                },
                {
                    "city_name": "Seondha"
                },
                {
                    "city_name": "Seoni"
                },
                {
                    "city_name": "Seoni Malwa"
                },
                {
                    "city_name": "Sethia"
                },
                {
                    "city_name": "Shahdol"
                },
                {
                    "city_name": "Shahgarh"
                },
                {
                    "city_name": "Shahpur"
                },
                {
                    "city_name": "Shahpura"
                },
                {
                    "city_name": "Shajapur"
                },
                {
                    "city_name": "Shamgarh"
                },
                {
                    "city_name": "Sheopur"
                },
                {
                    "city_name": "Shivpuri"
                },
                {
                    "city_name": "Shujalpur"
                },
                {
                    "city_name": "Sidhi"
                },
                {
                    "city_name": "Sihora"
                },
                {
                    "city_name": "Singolo"
                },
                {
                    "city_name": "Singrauli"
                },
                {
                    "city_name": "Sinhasa"
                },
                {
                    "city_name": "Sirgora"
                },
                {
                    "city_name": "Sirmaur"
                },
                {
                    "city_name": "Sironj"
                },
                {
                    "city_name": "Sitamau"
                },
                {
                    "city_name": "Sohagpur"
                },
                {
                    "city_name": "Sonkatch"
                },
                {
                    "city_name": "Soyatkalan"
                },
                {
                    "city_name": "Suhagi"
                },
                {
                    "city_name": "Sultanpur"
                },
                {
                    "city_name": "Susner"
                },
                {
                    "city_name": "Suthaliya"
                },
                {
                    "city_name": "Tal"
                },
                {
                    "city_name": "Talen"
                },
                {
                    "city_name": "Tarana"
                },
                {
                    "city_name": "Taricharkalan"
                },
                {
                    "city_name": "Tekanpur"
                },
                {
                    "city_name": "Tendukheda"
                },
                {
                    "city_name": "Teonthar"
                },
                {
                    "city_name": "Thandia"
                },
                {
                    "city_name": "Tikamgarh"
                },
                {
                    "city_name": "Timarni"
                },
                {
                    "city_name": "Tirodi"
                },
                {
                    "city_name": "Udaipura"
                },
                {
                    "city_name": "Ujjain"
                },
                {
                    "city_name": "Ukwa"
                },
                {
                    "city_name": "Umaria"
                },
                {
                    "city_name": "Unchahara"
                },
                {
                    "city_name": "Unhel"
                },
                {
                    "city_name": "Vehicle Factory Jabalpur"
                },
                {
                    "city_name": "Vidisha"
                },
                {
                    "city_name": "Vijayraghavgarh"
                },
                {
                    "city_name": "Waraseoni"
                }
            ]

            var manipur = [
                {
                    "city_name": "Andro"
                },
                {
                    "city_name": "Bijoy Govinda"
                },
                {
                    "city_name": "Bishnupur"
                },
                {
                    "city_name": "Churachandpur"
                },
                {
                    "city_name": "Heriok"
                },
                {
                    "city_name": "Imphal"
                },
                {
                    "city_name": "Jiribam"
                },
                {
                    "city_name": "Kakching"
                },
                {
                    "city_name": "Kakching Khunou"
                },
                {
                    "city_name": "Khongman"
                },
                {
                    "city_name": "Kumbi"
                },
                {
                    "city_name": "Kwakta"
                },
                {
                    "city_name": "Lamai"
                },
                {
                    "city_name": "Lamjaotongba"
                },
                {
                    "city_name": "Lamshang"
                },
                {
                    "city_name": "Lilong"
                },
                {
                    "city_name": "Mayang Imphal"
                },
                {
                    "city_name": "Moirang"
                },
                {
                    "city_name": "Moreh"
                },
                {
                    "city_name": "Nambol"
                },
                {
                    "city_name": "Naoriya Pakhanglakpa"
                },
                {
                    "city_name": "Ningthoukhong"
                },
                {
                    "city_name": "Oinam"
                },
                {
                    "city_name": "Porompat"
                },
                {
                    "city_name": "Samurou"
                },
                {
                    "city_name": "Sekmai Bazar"
                },
                {
                    "city_name": "Senapati"
                },
                {
                    "city_name": "Sikhong Sekmai"
                },
                {
                    "city_name": "Sugnu"
                },
                {
                    "city_name": "Thongkhong Laxmi Bazar"
                },
                {
                    "city_name": "Thoubal"
                },
                {
                    "city_name": "Torban"
                },
                {
                    "city_name": "Wangjing"
                },
                {
                    "city_name": "Wangoi"
                },
                {
                    "city_name": "Yairipok"
                }
            ]
             
            var meghalaya = [
                {
                    "city_name": "Baghmara"
                },
                {
                    "city_name": "Cherrapunji"
                },
                {
                    "city_name": "Jawai"
                },
                {
                    "city_name": "Madanrting"
                },
                {
                    "city_name": "Mairang"
                },
                {
                    "city_name": "Mawlai"
                },
                {
                    "city_name": "Nongmynsong"
                },
                {
                    "city_name": "Nongpoh"
                },
                {
                    "city_name": "Nongstoin"
                },
                {
                    "city_name": "Nongthymmai"
                },
                {
                    "city_name": "Pynthorumkhrah"
                },
                {
                    "city_name": "Resubelpara"
                },
                {
                    "city_name": "Shillong"
                },
                {
                    "city_name": "Shillong Cantonment"
                },
                {
                    "city_name": "Tura"
                },
                {
                    "city_name": "Williamnagar"
                }
            ]

            var mizo = [
                {
                    "city_name": "Aizawl"
                },
                {
                    "city_name": "Bairabi"
                },
                {
                    "city_name": "Biate"
                },
                {
                    "city_name": "Champhai"
                },
                {
                    "city_name": "Darlawn"
                },
                {
                    "city_name": "Hnahthial"
                },
                {
                    "city_name": "Kawnpui"
                },
                {
                    "city_name": "Khawhai"
                },
                {
                    "city_name": "Khawzawl"
                },
                {
                    "city_name": "Kolasib"
                },
                {
                    "city_name": "Lengpui"
                },
                {
                    "city_name": "Lunglei"
                },
                {
                    "city_name": "Mamit"
                },
                {
                    "city_name": "North Vanlaiphai"
                },
                {
                    "city_name": "Saiha"
                },
                {
                    "city_name": "Sairang"
                },
                {
                    "city_name": "Saitul"
                },
                {
                    "city_name": "Serchhip"
                },
                {
                    "city_name": "Thenzawl"
                },
                {
                    "city_name": "Tlabung"
                },
                {
                    "city_name": "Vairengte"
                },
                {
                    "city_name": "Zawlnuam"
                }
            ]

            var naga = [
                {
                    "city_name": "Chumukedima"
                },
                {
                    "city_name": "Dimapur"
                },
                {
                    "city_name": "Kohima"
                },
                {
                    "city_name": "Mokokchung"
                },
                {
                    "city_name": "Mon"
                },
                {
                    "city_name": "Phek"
                },
                {
                    "city_name": "Tuensang"
                },
                {
                    "city_name": "Wokha"
                },
                {
                    "city_name": "Zunheboto"
                }
            ]

            var odisha = [
                {
                    "city_name": "Anandapur"
                },
                {
                    "city_name": "Angul"
                },
                {
                    "city_name": "Aska"
                },
                {
                    "city_name": "Athgarh"
                },
                {
                    "city_name": "Athmallik"
                },
                {
                    "city_name": "Balagoda"
                },
                {
                    "city_name": "Balangir"
                },
                {
                    "city_name": "Balasore"
                },
                {
                    "city_name": "Baleshwar"
                },
                {
                    "city_name": "Balimeta"
                },
                {
                    "city_name": "Balugaon"
                },
                {
                    "city_name": "Banapur"
                },
                {
                    "city_name": "Bangura"
                },
                {
                    "city_name": "Banki"
                },
                {
                    "city_name": "Banposh"
                },
                {
                    "city_name": "Barbil"
                },
                {
                    "city_name": "Bargarh"
                },
                {
                    "city_name": "Baripada"
                },
                {
                    "city_name": "Barpali"
                },
                {
                    "city_name": "Basudebpur"
                },
                {
                    "city_name": "Baudh"
                },
                {
                    "city_name": "Belagachhia"
                },
                {
                    "city_name": "Belaguntha"
                },
                {
                    "city_name": "Belpahar"
                },
                {
                    "city_name": "Berhampur"
                },
                {
                    "city_name": "Bhadrak"
                },
                {
                    "city_name": "Bhanjanagar"
                },
                {
                    "city_name": "Bhawanipatna"
                },
                {
                    "city_name": "Bhuban"
                },
                {
                    "city_name": "Bhubaneswar"
                },
                {
                    "city_name": "Binika"
                },
                {
                    "city_name": "Birmitrapur"
                },
                {
                    "city_name": "Bishama Katek"
                },
                {
                    "city_name": "Bolangir"
                },
                {
                    "city_name": "Brahmapur"
                },
                {
                    "city_name": "Brajrajnagar"
                },
                {
                    "city_name": "Buguda"
                },
                {
                    "city_name": "Burla"
                },
                {
                    "city_name": "Byasanagar"
                },
                {
                    "city_name": "Champua"
                },
                {
                    "city_name": "Chandapur"
                },
                {
                    "city_name": "Chandbali"
                },
                {
                    "city_name": "Chandili"
                },
                {
                    "city_name": "Charibatia"
                },
                {
                    "city_name": "Chatrapur"
                },
                {
                    "city_name": "Chikitigarh"
                },
                {
                    "city_name": "Chitrakonda"
                },
                {
                    "city_name": "Choudwar"
                },
                {
                    "city_name": "Cuttack"
                },
                {
                    "city_name": "Dadhapatna"
                },
                {
                    "city_name": "Daitari"
                },
                {
                    "city_name": "Damanjodi"
                },
                {
                    "city_name": "Deogarh"
                },
                {
                    "city_name": "Deracolliery"
                },
                {
                    "city_name": "Dhamanagar"
                },
                {
                    "city_name": "Dhenkanal"
                },
                {
                    "city_name": "Digapahandi"
                },
                {
                    "city_name": "Dungamal"
                },
                {
                    "city_name": "Fertilizer Corporation of Indi"
                },
                {
                    "city_name": "Ganjam"
                },
                {
                    "city_name": "Ghantapada"
                },
                {
                    "city_name": "Gopalpur"
                },
                {
                    "city_name": "Gudari"
                },
                {
                    "city_name": "Gunupur"
                },
                {
                    "city_name": "Hatibandha"
                },
                {
                    "city_name": "Hinjilikatu"
                },
                {
                    "city_name": "Hirakud"
                },
                {
                    "city_name": "Jagatsinghapur"
                },
                {
                    "city_name": "Jajpur"
                },
                {
                    "city_name": "Jalda"
                },
                {
                    "city_name": "Jaleswar"
                },
                {
                    "city_name": "Jatni"
                },
                {
                    "city_name": "Jaypur"
                },
                {
                    "city_name": "Jeypore"
                },
                {
                    "city_name": "Jharsuguda"
                },
                {
                    "city_name": "Jhumpura"
                },
                {
                    "city_name": "Joda"
                },
                {
                    "city_name": "Junagarh"
                },
                {
                    "city_name": "Kamakhyanagar"
                },
                {
                    "city_name": "Kantabanji"
                },
                {
                    "city_name": "Kantilo"
                },
                {
                    "city_name": "Karanja"
                },
                {
                    "city_name": "Kashinagara"
                },
                {
                    "city_name": "Kataka"
                },
                {
                    "city_name": "Kavisuryanagar"
                },
                {
                    "city_name": "Kendrapara"
                },
                {
                    "city_name": "Kendujhar"
                },
                {
                    "city_name": "Keonjhar"
                },
                {
                    "city_name": "Kesinga"
                },
                {
                    "city_name": "Khaliapali"
                },
                {
                    "city_name": "Khalikote"
                },
                {
                    "city_name": "Khandaparha"
                },
                {
                    "city_name": "Kharhial"
                },
                {
                    "city_name": "Kharhial Road"
                },
                {
                    "city_name": "Khatiguda"
                },
                {
                    "city_name": "Khurda"
                },
                {
                    "city_name": "Kochinda"
                },
                {
                    "city_name": "Kodala"
                },
                {
                    "city_name": "Konark"
                },
                {
                    "city_name": "Koraput"
                },
                {
                    "city_name": "Kotaparh"
                },
                {
                    "city_name": "Lanjigarh"
                },
                {
                    "city_name": "Lattikata"
                },
                {
                    "city_name": "Makundapur"
                },
                {
                    "city_name": "Malkangiri"
                },
                {
                    "city_name": "Mukhiguda"
                },
                {
                    "city_name": "Nabarangpur"
                },
                {
                    "city_name": "Nalco"
                },
                {
                    "city_name": "Naurangapur"
                },
                {
                    "city_name": "Nayagarh"
                },
                {
                    "city_name": "Nilagiri"
                },
                {
                    "city_name": "Nimaparha"
                },
                {
                    "city_name": "Nuapada"
                },
                {
                    "city_name": "Nuapatna"
                },
                {
                    "city_name": "OCL Industrialship"
                },
                {
                    "city_name": "Padampur"
                },
                {
                    "city_name": "Paradip"
                },
                {
                    "city_name": "Paradwip"
                },
                {
                    "city_name": "Parlakimidi"
                },
                {
                    "city_name": "Patamundai"
                },
                {
                    "city_name": "Patnagarh"
                },
                {
                    "city_name": "Phulabani"
                },
                {
                    "city_name": "Pipili"
                },
                {
                    "city_name": "Polasara"
                },
                {
                    "city_name": "Pratapsasan"
                },
                {
                    "city_name": "Puri"
                },
                {
                    "city_name": "Purushottampur"
                },
                {
                    "city_name": "Rairangpur"
                },
                {
                    "city_name": "Raj Gangpur"
                },
                {
                    "city_name": "Rambha"
                },
                {
                    "city_name": "Raurkela"
                },
                {
                    "city_name": "Raurkela Civil Township"
                },
                {
                    "city_name": "Rayagada"
                },
                {
                    "city_name": "Redhakhol"
                },
                {
                    "city_name": "Remuna"
                },
                {
                    "city_name": "Rengali"
                },
                {
                    "city_name": "Rourkela"
                },
                {
                    "city_name": "Sambalpur"
                },
                {
                    "city_name": "Sinapali"
                },
                {
                    "city_name": "Sonepur"
                },
                {
                    "city_name": "Sorada"
                },
                {
                    "city_name": "Soro"
                },
                {
                    "city_name": "Sunabeda"
                },
                {
                    "city_name": "Sundargarh"
                },
                {
                    "city_name": "Talcher"
                },
                {
                    "city_name": "Talcher Thermal Power Station "
                },
                {
                    "city_name": "Tarabha"
                },
                {
                    "city_name": "Tensa"
                },
                {
                    "city_name": "Titlagarh"
                },
                {
                    "city_name": "Udala"
                },
                {
                    "city_name": "Udayagiri"
                },
                {
                    "city_name": "Umarkot"
                },
                {
                    "city_name": "Vikrampur"
                }
            ]

            var pudu = [
                {
                    "city_name": "Ariankuppam"
                },
                {
                    "city_name": "Karaikal"
                },
                {
                    "city_name": "Kurumbapet"
                },
                {
                    "city_name": "Mahe"
                },
                {
                    "city_name": "Ozhukarai"
                },
                {
                    "city_name": "Pondicherry"
                },
                {
                    "city_name": "Villianur"
                },
                {
                    "city_name": "Yanam"
                }
            ]

            var punjb = [
                {
                    "city_name": "'Abdul Hakim"
                },
                {
                    "city_name": "Abohar"
                },
                {
                    "city_name": "Abohar"
                },
                {
                    "city_name": "Adampur"
                },
                {
                    "city_name": "Adampur"
                },
                {
                    "city_name": "Ahmadpur East"
                },
                {
                    "city_name": "Ahmadpur Lumma"
                },
                {
                    "city_name": "Ahmadpur Sial"
                },
                {
                    "city_name": "Ahmedabad"
                },
                {
                    "city_name": "Ahmedgarh"
                },
                {
                    "city_name": "Ahmedgarh"
                },
                {
                    "city_name": "Ajnala"
                },
                {
                    "city_name": "Ajnala"
                },
                {
                    "city_name": "Akalgarh"
                },
                {
                    "city_name": "Akalgarh"
                },
                {
                    "city_name": "Alawalpur"
                },
                {
                    "city_name": "Alawalpur"
                },
                {
                    "city_name": "Alipur"
                },
                {
                    "city_name": "Alipur Chatha"
                },
                {
                    "city_name": "Amloh"
                },
                {
                    "city_name": "Amloh"
                },
                {
                    "city_name": "Amritsar"
                },
                {
                    "city_name": "Amritsar"
                },
                {
                    "city_name": "Amritsar Cantonment"
                },
                {
                    "city_name": "Amritsar Cantonment"
                },
                {
                    "city_name": "Anandpur Sahib"
                },
                {
                    "city_name": "Anandpur Sahib"
                },
                {
                    "city_name": "Arifwala"
                },
                {
                    "city_name": "Attock"
                },
                {
                    "city_name": "Baddomalhi"
                },
                {
                    "city_name": "Badhni Kalan"
                },
                {
                    "city_name": "Badhni Kalan"
                },
                {
                    "city_name": "Bagh"
                },
                {
                    "city_name": "Bagh Purana"
                },
                {
                    "city_name": "Bagh Purana"
                },
                {
                    "city_name": "Bahawalnagar"
                },
                {
                    "city_name": "Bahawalpur"
                },
                {
                    "city_name": "Bai Pheru"
                },
                {
                    "city_name": "Balachaur"
                },
                {
                    "city_name": "Balachaur"
                },
                {
                    "city_name": "Banaur"
                },
                {
                    "city_name": "Banaur"
                },
                {
                    "city_name": "Banga"
                },
                {
                    "city_name": "Banga"
                },
                {
                    "city_name": "Banur"
                },
                {
                    "city_name": "Banur"
                },
                {
                    "city_name": "Baretta"
                },
                {
                    "city_name": "Baretta"
                },
                {
                    "city_name": "Bariwala"
                },
                {
                    "city_name": "Bariwala"
                },
                {
                    "city_name": "Barnala"
                },
                {
                    "city_name": "Barnala"
                },
                {
                    "city_name": "Basirpur"
                },
                {
                    "city_name": "Bassi Pathana"
                },
                {
                    "city_name": "Bassi Pathana"
                },
                {
                    "city_name": "Batala"
                },
                {
                    "city_name": "Batala"
                },
                {
                    "city_name": "Bathinda"
                },
                {
                    "city_name": "Bathinda"
                },
                {
                    "city_name": "Begowal"
                },
                {
                    "city_name": "Begowal"
                },
                {
                    "city_name": "Begowala"
                },
                {
                    "city_name": "Behrampur"
                },
                {
                    "city_name": "Behrampur"
                },
                {
                    "city_name": "Bhabat"
                },
                {
                    "city_name": "Bhabat"
                },
                {
                    "city_name": "Bhadur"
                },
                {
                    "city_name": "Bhadur"
                },
                {
                    "city_name": "Bhakkar"
                },
                {
                    "city_name": "Bhalwal"
                },
                {
                    "city_name": "Bhankharpur"
                },
                {
                    "city_name": "Bhankharpur"
                },
                {
                    "city_name": "Bharoli Kalan"
                },
                {
                    "city_name": "Bharoli Kalan"
                },
                {
                    "city_name": "Bhawana"
                },
                {
                    "city_name": "Bhawanigarh"
                },
                {
                    "city_name": "Bhawanigarh"
                },
                {
                    "city_name": "Bhera"
                },
                {
                    "city_name": "Bhikhi"
                },
                {
                    "city_name": "Bhikhi"
                },
                {
                    "city_name": "Bhikhiwind"
                },
                {
                    "city_name": "Bhikhiwind"
                },
                {
                    "city_name": "Bhisiana"
                },
                {
                    "city_name": "Bhisiana"
                },
                {
                    "city_name": "Bhogpur"
                },
                {
                    "city_name": "Bhogpur"
                },
                {
                    "city_name": "Bhopalwala"
                },
                {
                    "city_name": "Bhuch"
                },
                {
                    "city_name": "Bhuch"
                },
                {
                    "city_name": "Bhulath"
                },
                {
                    "city_name": "Bhulath"
                },
                {
                    "city_name": "Budha Theh"
                },
                {
                    "city_name": "Budha Theh"
                },
                {
                    "city_name": "Budhlada"
                },
                {
                    "city_name": "Budhlada"
                },
                {
                    "city_name": "Burewala"
                },
                {
                    "city_name": "Chak Azam Sahu"
                },
                {
                    "city_name": "Chak Jhumra"
                },
                {
                    "city_name": "Chak Sarwar Shahid"
                },
                {
                    "city_name": "Chakwal"
                },
                {
                    "city_name": "Chawinda"
                },
                {
                    "city_name": "Chichawatni"
                },
                {
                    "city_name": "Chima"
                },
                {
                    "city_name": "Chima"
                },
                {
                    "city_name": "Chiniot"
                },
                {
                    "city_name": "Chishtian Mandi"
                },
                {
                    "city_name": "Choa Saidan Shah"
                },
                {
                    "city_name": "Chohal"
                },
                {
                    "city_name": "Chohal"
                },
                {
                    "city_name": "Chuhar Kana"
                },
                {
                    "city_name": "Chunian"
                },
                {
                    "city_name": "Dajal"
                },
                {
                    "city_name": "Darya Khan"
                },
                {
                    "city_name": "Daska"
                },
                {
                    "city_name": "Dasuya"
                },
                {
                    "city_name": "Dasuya"
                },
                {
                    "city_name": "Daud Khel"
                },
                {
                    "city_name": "Daulatpur"
                },
                {
                    "city_name": "Daulatpur"
                },
                {
                    "city_name": "Daultala"
                },
                {
                    "city_name": "Dera Baba Nanak"
                },
                {
                    "city_name": "Dera Baba Nanak"
                },
                {
                    "city_name": "Dera Bassi"
                },
                {
                    "city_name": "Dera Bassi"
                },
                {
                    "city_name": "Dera Din Panah"
                },
                {
                    "city_name": "Dera Ghazi Khan"
                },
                {
                    "city_name": "Dhanaula"
                },
                {
                    "city_name": "Dhanaula"
                },
                {
                    "city_name": "Dhanote"
                },
                {
                    "city_name": "Dharam Kot"
                },
                {
                    "city_name": "Dharam Kot"
                },
                {
                    "city_name": "Dhariwal"
                },
                {
                    "city_name": "Dhariwal"
                },
                {
                    "city_name": "Dhilwan"
                },
                {
                    "city_name": "Dhilwan"
                },
                {
                    "city_name": "Dhonkal"
                },
                {
                    "city_name": "Dhuri"
                },
                {
                    "city_name": "Dhuri"
                },
                {
                    "city_name": "Dijkot"
                },
                {
                    "city_name": "Dina"
                },
                {
                    "city_name": "Dinanagar"
                },
                {
                    "city_name": "Dinanagar"
                },
                {
                    "city_name": "Dinga"
                },
                {
                    "city_name": "Dipalpur"
                },
                {
                    "city_name": "Dirba"
                },
                {
                    "city_name": "Dirba"
                },
                {
                    "city_name": "Doraha"
                },
                {
                    "city_name": "Doraha"
                },
                {
                    "city_name": "Dullewala"
                },
                {
                    "city_name": "Dunga Bunga"
                },
                {
                    "city_name": "Dunyapur"
                },
                {
                    "city_name": "Eminabad"
                },
                {
                    "city_name": "Faisalabad"
                },
                {
                    "city_name": "Faqirwali"
                },
                {
                    "city_name": "Faridkot"
                },
                {
                    "city_name": "Faridkot"
                },
                {
                    "city_name": "Faruka"
                },
                {
                    "city_name": "Fateh Jang"
                },
                {
                    "city_name": "Fateh Nangal"
                },
                {
                    "city_name": "Fateh Nangal"
                },
                {
                    "city_name": "Fatehgarh Churian"
                },
                {
                    "city_name": "Fatehgarh Churian"
                },
                {
                    "city_name": "Fatehgarh Sahib"
                },
                {
                    "city_name": "Fatehgarh Sahib"
                },
                {
                    "city_name": "Fatehpur"
                },
                {
                    "city_name": "Fazalpur"
                },
                {
                    "city_name": "Fazilka"
                },
                {
                    "city_name": "Fazilka"
                },
                {
                    "city_name": "Ferozwala"
                },
                {
                    "city_name": "Firozpur"
                },
                {
                    "city_name": "Firozpur"
                },
                {
                    "city_name": "Firozpur Cantonment"
                },
                {
                    "city_name": "Firozpur Cantonment"
                },
                {
                    "city_name": "Fort Abbas"
                },
                {
                    "city_name": "Gardhiwala"
                },
                {
                    "city_name": "Gardhiwala"
                },
                {
                    "city_name": "Garh Maharaja"
                },
                {
                    "city_name": "Garhshankar"
                },
                {
                    "city_name": "Garhshankar"
                },
                {
                    "city_name": "Ghagga"
                },
                {
                    "city_name": "Ghagga"
                },
                {
                    "city_name": "Ghakar"
                },
                {
                    "city_name": "Ghanaur"
                },
                {
                    "city_name": "Ghanaur"
                },
                {
                    "city_name": "Ghurgushti"
                },
                {
                    "city_name": "Giddarbaha"
                },
                {
                    "city_name": "Giddarbaha"
                },
                {
                    "city_name": "Gobindgarh"
                },
                {
                    "city_name": "Gobindgarh"
                },
                {
                    "city_name": "Gojra"
                },
                {
                    "city_name": "Goniana"
                },
                {
                    "city_name": "Goniana"
                },
                {
                    "city_name": "Goraya"
                },
                {
                    "city_name": "Goraya"
                },
                {
                    "city_name": "Gujar Khan"
                },
                {
                    "city_name": "Gujranwala"
                },
                {
                    "city_name": "Gujrat"
                },
                {
                    "city_name": "Gurdaspur"
                },
                {
                    "city_name": "Gurdaspur"
                },
                {
                    "city_name": "Guru Har Sahai"
                },
                {
                    "city_name": "Guru Har Sahai"
                },
                {
                    "city_name": "Hadali"
                },
                {
                    "city_name": "Hafizabad"
                },
                {
                    "city_name": "Hajipur"
                },
                {
                    "city_name": "Hajipur"
                },
                {
                    "city_name": "Handiaya"
                },
                {
                    "city_name": "Handiaya"
                },
                {
                    "city_name": "Hariana"
                },
                {
                    "city_name": "Hariana"
                },
                {
                    "city_name": "Harnoli"
                },
                {
                    "city_name": "Harunabad"
                },
                {
                    "city_name": "Hasan Abdal"
                },
                {
                    "city_name": "Hasilpur"
                },
                {
                    "city_name": "Haveli"
                },
                {
                    "city_name": "Hazro"
                },
                {
                    "city_name": "Hoshiarpur"
                },
                {
                    "city_name": "Hoshiarpur"
                },
                {
                    "city_name": "Hujra Shah Muqim"
                },
                {
                    "city_name": "Hussainpur"
                },
                {
                    "city_name": "Hussainpur"
                },
                {
                    "city_name": "Isa Khel"
                },
                {
                    "city_name": "Jagraon"
                },
                {
                    "city_name": "Jagraon"
                },
                {
                    "city_name": "Jahanian"
                },
                {
                    "city_name": "Jaitu"
                },
                {
                    "city_name": "Jaitu"
                },
                {
                    "city_name": "Jalalabad"
                },
                {
                    "city_name": "Jalalabad"
                },
                {
                    "city_name": "Jalalpur Bhattian"
                },
                {
                    "city_name": "Jalalpur Jattan"
                },
                {
                    "city_name": "Jalalpur Pirwala"
                },
                {
                    "city_name": "Jalandhar"
                },
                {
                    "city_name": "Jalandhar"
                },
                {
                    "city_name": "Jalandhar Cantonment"
                },
                {
                    "city_name": "Jalandhar Cantonment"
                },
                {
                    "city_name": "Jalla Jeem"
                },
                {
                    "city_name": "Jamke Chima"
                },
                {
                    "city_name": "Jampur"
                },
                {
                    "city_name": "Jand"
                },
                {
                    "city_name": "Jandanwala"
                },
                {
                    "city_name": "Jandiala"
                },
                {
                    "city_name": "Jandiala"
                },
                {
                    "city_name": "Jandiala Sherkhan"
                },
                {
                    "city_name": "Jaranwala"
                },
                {
                    "city_name": "Jatoi"
                },
                {
                    "city_name": "Jauharabad"
                },
                {
                    "city_name": "Jhang"
                },
                {
                    "city_name": "Jhawarian"
                },
                {
                    "city_name": "Jhelum"
                },
                {
                    "city_name": "Jugial"
                },
                {
                    "city_name": "Jugial"
                },
                {
                    "city_name": "Kabirwala"
                },
                {
                    "city_name": "Kahna Nau"
                },
                {
                    "city_name": "Kahror Pakka"
                },
                {
                    "city_name": "Kahuta"
                },
                {
                    "city_name": "Kalabagh"
                },
                {
                    "city_name": "Kalanaur"
                },
                {
                    "city_name": "Kalanaur"
                },
                {
                    "city_name": "Kalaswala"
                },
                {
                    "city_name": "Kaleke"
                },
                {
                    "city_name": "Kalur Kot"
                },
                {
                    "city_name": "Kamalia"
                },
                {
                    "city_name": "Kamar Mashani"
                },
                {
                    "city_name": "Kamir"
                },
                {
                    "city_name": "Kamoke"
                },
                {
                    "city_name": "Kamra"
                },
                {
                    "city_name": "Kanganpur"
                },
                {
                    "city_name": "Kapurthala"
                },
                {
                    "city_name": "Kapurthala"
                },
                {
                    "city_name": "Karampur"
                },
                {
                    "city_name": "Karor Lal Esan"
                },
                {
                    "city_name": "Karoran"
                },
                {
                    "city_name": "Karoran"
                },
                {
                    "city_name": "Kartarpur"
                },
                {
                    "city_name": "Kartarpur"
                },
                {
                    "city_name": "Kasur"
                },
                {
                    "city_name": "Khairpur Tamewali"
                },
                {
                    "city_name": "Khamanon"
                },
                {
                    "city_name": "Khamanon"
                },
                {
                    "city_name": "Khanauri"
                },
                {
                    "city_name": "Khanauri"
                },
                {
                    "city_name": "Khanewal"
                },
                {
                    "city_name": "Khangah Dogran"
                },
                {
                    "city_name": "Khangarh"
                },
                {
                    "city_name": "Khanna"
                },
                {
                    "city_name": "Khanna"
                },
                {
                    "city_name": "Khanpur"
                },
                {
                    "city_name": "Kharar"
                },
                {
                    "city_name": "Kharar"
                },
                {
                    "city_name": "Kharian"
                },
                {
                    "city_name": "Khem Karan"
                },
                {
                    "city_name": "Khem Karan"
                },
                {
                    "city_name": "Khewra"
                },
                {
                    "city_name": "Khundian"
                },
                {
                    "city_name": "Khurianwala"
                },
                {
                    "city_name": "Khushab"
                },
                {
                    "city_name": "Kot Abdul Malik"
                },
                {
                    "city_name": "Kot Addu"
                },
                {
                    "city_name": "Kot Fatta"
                },
                {
                    "city_name": "Kot Fatta"
                },
                {
                    "city_name": "Kot Isa Khan"
                },
                {
                    "city_name": "Kot Isa Khan"
                },
                {
                    "city_name": "Kot Kapura"
                },
                {
                    "city_name": "Kot Kapura"
                },
                {
                    "city_name": "Kot Mithan"
                },
                {
                    "city_name": "Kot Moman"
                },
                {
                    "city_name": "Kot Radha Kishan"
                },
                {
                    "city_name": "Kot Samaba"
                },
                {
                    "city_name": "Kotkapura"
                },
                {
                    "city_name": "Kotkapura"
                },
                {
                    "city_name": "Kotli Loharan"
                },
                {
                    "city_name": "Kundian"
                },
                {
                    "city_name": "Kunjah"
                },
                {
                    "city_name": "Kurali"
                },
                {
                    "city_name": "Kurali"
                },
                {
                    "city_name": "Lahore"
                },
                {
                    "city_name": "Lalamusa"
                },
                {
                    "city_name": "Lalian"
                },
                {
                    "city_name": "Lalru"
                },
                {
                    "city_name": "Lalru"
                },
                {
                    "city_name": "Lehra Gaga"
                },
                {
                    "city_name": "Lehra Gaga"
                },
                {
                    "city_name": "Liaqatabad"
                },
                {
                    "city_name": "Liaqatpur"
                },
                {
                    "city_name": "Lieah"
                },
                {
                    "city_name": "Liliani"
                },
                {
                    "city_name": "Lodhian Khas"
                },
                {
                    "city_name": "Lodhian Khas"
                },
                {
                    "city_name": "Lodhran"
                },
                {
                    "city_name": "Longowal"
                },
                {
                    "city_name": "Longowal"
                },
                {
                    "city_name": "Ludhewala Waraich"
                },
                {
                    "city_name": "Ludhiana"
                },
                {
                    "city_name": "Ludhiana"
                },
                {
                    "city_name": "Machhiwara"
                },
                {
                    "city_name": "Machhiwara"
                },
                {
                    "city_name": "Mahilpur"
                },
                {
                    "city_name": "Mahilpur"
                },
                {
                    "city_name": "Mailsi"
                },
                {
                    "city_name": "Majitha"
                },
                {
                    "city_name": "Majitha"
                },
                {
                    "city_name": "Makhdumpur"
                },
                {
                    "city_name": "Makhdumpur Rashid"
                },
                {
                    "city_name": "Makhu"
                },
                {
                    "city_name": "Makhu"
                },
                {
                    "city_name": "Malakwal"
                },
                {
                    "city_name": "Malaut"
                },
                {
                    "city_name": "Malaut"
                },
                {
                    "city_name": "Malerkotla"
                },
                {
                    "city_name": "Malerkotla"
                },
                {
                    "city_name": "Maloud"
                },
                {
                    "city_name": "Maloud"
                },
                {
                    "city_name": "Mamu Kanjan"
                },
                {
                    "city_name": "Mananwala Jodh Singh"
                },
                {
                    "city_name": "Mandi Bahauddin"
                },
                {
                    "city_name": "Mandi Gobindgarh"
                },
                {
                    "city_name": "Mandi Gobindgarh"
                },
                {
                    "city_name": "Mandi Sadiq Ganj"
                },
                {
                    "city_name": "Mangat"
                },
                {
                    "city_name": "Mangla"
                },
                {
                    "city_name": "Mankera"
                },
                {
                    "city_name": "Mansa"
                },
                {
                    "city_name": "Mansa"
                },
                {
                    "city_name": "Maur"
                },
                {
                    "city_name": "Maur"
                },
                {
                    "city_name": "Mian Channun"
                },
                {
                    "city_name": "Miani"
                },
                {
                    "city_name": "Mianwali"
                },
                {
                    "city_name": "Minchinabad"
                },
                {
                    "city_name": "Mitha Tiwana"
                },
                {
                    "city_name": "Moga"
                },
                {
                    "city_name": "Moga"
                },
                {
                    "city_name": "Mohali"
                },
                {
                    "city_name": "Mohali"
                },
                {
                    "city_name": "Moonak"
                },
                {
                    "city_name": "Moonak"
                },
                {
                    "city_name": "Morinda"
                },
                {
                    "city_name": "Morinda"
                },
                {
                    "city_name": "Mukerian"
                },
                {
                    "city_name": "Mukerian"
                },
                {
                    "city_name": "Muktsar"
                },
                {
                    "city_name": "Muktsar"
                },
                {
                    "city_name": "Mullanpur Dakha"
                },
                {
                    "city_name": "Mullanpur Dakha"
                },
                {
                    "city_name": "Mullanpur Garibdas"
                },
                {
                    "city_name": "Mullanpur Garibdas"
                },
                {
                    "city_name": "Multan"
                },
                {
                    "city_name": "Munak"
                },
                {
                    "city_name": "Munak"
                },
                {
                    "city_name": "Muradpura"
                },
                {
                    "city_name": "Muradpura"
                },
                {
                    "city_name": "Muridke"
                },
                {
                    "city_name": "Murree"
                },
                {
                    "city_name": "Mustafabad"
                },
                {
                    "city_name": "Muzaffargarh"
                },
                {
                    "city_name": "Nabha"
                },
                {
                    "city_name": "Nabha"
                },
                {
                    "city_name": "Nakodar"
                },
                {
                    "city_name": "Nakodar"
                },
                {
                    "city_name": "Nangal"
                },
                {
                    "city_name": "Nangal"
                },
                {
                    "city_name": "Nankana Sahib"
                },
                {
                    "city_name": "Narang"
                },
                {
                    "city_name": "Narowal"
                },
                {
                    "city_name": "Nawashahr"
                },
                {
                    "city_name": "Nawashahr"
                },
                {
                    "city_name": "Naya Nangal"
                },
                {
                    "city_name": "Naya Nangal"
                },
                {
                    "city_name": "Nehon"
                },
                {
                    "city_name": "Nehon"
                },
                {
                    "city_name": "Noorpur Thal"
                },
                {
                    "city_name": "Nowshera"
                },
                {
                    "city_name": "Nowshera Virkan"
                },
                {
                    "city_name": "Nurmahal"
                },
                {
                    "city_name": "Nurmahal"
                },
                {
                    "city_name": "Okara"
                },
                {
                    "city_name": "Pakpattan"
                },
                {
                    "city_name": "Pasrur"
                },
                {
                    "city_name": "Pathankot"
                },
                {
                    "city_name": "Pathankot"
                },
                {
                    "city_name": "Patiala"
                },
                {
                    "city_name": "Patiala"
                },
                {
                    "city_name": "Patti"
                },
                {
                    "city_name": "Patti"
                },
                {
                    "city_name": "Pattoki"
                },
                {
                    "city_name": "Pattran"
                },
                {
                    "city_name": "Pattran"
                },
                {
                    "city_name": "Payal"
                },
                {
                    "city_name": "Payal"
                },
                {
                    "city_name": "Phagwara"
                },
                {
                    "city_name": "Phagwara"
                },
                {
                    "city_name": "Phalia"
                },
                {
                    "city_name": "Phillaur"
                },
                {
                    "city_name": "Phillaur"
                },
                {
                    "city_name": "Phularwan"
                },
                {
                    "city_name": "Pind Dadan Khan"
                },
                {
                    "city_name": "Pindi Bhattian"
                },
                {
                    "city_name": "Pindi Gheb"
                },
                {
                    "city_name": "Pirmahal"
                },
                {
                    "city_name": "Qadian"
                },
                {
                    "city_name": "Qadian"
                },
                {
                    "city_name": "Qadirabad"
                },
                {
                    "city_name": "Qadirpur Ran"
                },
                {
                    "city_name": "Qila Disar Singh"
                },
                {
                    "city_name": "Qila Sobha Singh"
                },
                {
                    "city_name": "Quaidabad"
                },
                {
                    "city_name": "Rabwah"
                },
                {
                    "city_name": "Rahim Yar Khan"
                },
                {
                    "city_name": "Rahon"
                },
                {
                    "city_name": "Rahon"
                },
                {
                    "city_name": "Raikot"
                },
                {
                    "city_name": "Raikot"
                },
                {
                    "city_name": "Raiwind"
                },
                {
                    "city_name": "Raja Jang"
                },
                {
                    "city_name": "Raja Sansi"
                },
                {
                    "city_name": "Raja Sansi"
                },
                {
                    "city_name": "Rajanpur"
                },
                {
                    "city_name": "Rajpura"
                },
                {
                    "city_name": "Rajpura"
                },
                {
                    "city_name": "Ram Das"
                },
                {
                    "city_name": "Ram Das"
                },
                {
                    "city_name": "Raman"
                },
                {
                    "city_name": "Raman"
                },
                {
                    "city_name": "Rampura"
                },
                {
                    "city_name": "Rampura"
                },
                {
                    "city_name": "Rasulnagar"
                },
                {
                    "city_name": "Rawalpindi"
                },
                {
                    "city_name": "Rayya"
                },
                {
                    "city_name": "Rayya"
                },
                {
                    "city_name": "Renala Khurd"
                },
                {
                    "city_name": "Rojhan"
                },
                {
                    "city_name": "Rupnagar"
                },
                {
                    "city_name": "Rupnagar"
                },
                {
                    "city_name": "Rurki Kasba"
                },
                {
                    "city_name": "Rurki Kasba"
                },
                {
                    "city_name": "Saddar Gogera"
                },
                {
                    "city_name": "Sadiqabad"
                },
                {
                    "city_name": "Safdarabad"
                },
                {
                    "city_name": "Sahiwal"
                },
                {
                    "city_name": "Sahnewal"
                },
                {
                    "city_name": "Sahnewal"
                },
                {
                    "city_name": "Samana"
                },
                {
                    "city_name": "Samana"
                },
                {
                    "city_name": "Samasatta"
                },
                {
                    "city_name": "Sambrial"
                },
                {
                    "city_name": "Sammundri"
                },
                {
                    "city_name": "Samrala"
                },
                {
                    "city_name": "Samrala"
                },
                {
                    "city_name": "Sanaur"
                },
                {
                    "city_name": "Sanaur"
                },
                {
                    "city_name": "Sangala Hill"
                },
                {
                    "city_name": "Sangat"
                },
                {
                    "city_name": "Sangat"
                },
                {
                    "city_name": "Sangrur"
                },
                {
                    "city_name": "Sangrur"
                },
                {
                    "city_name": "Sanjwal"
                },
                {
                    "city_name": "Sansarpur"
                },
                {
                    "city_name": "Sansarpur"
                },
                {
                    "city_name": "Sarai Alamgir"
                },
                {
                    "city_name": "Sarai Sidhu"
                },
                {
                    "city_name": "Sardulgarh"
                },
                {
                    "city_name": "Sardulgarh"
                },
                {
                    "city_name": "Sargodha"
                },
                {
                    "city_name": "Shadiwal"
                },
                {
                    "city_name": "Shahkot"
                },
                {
                    "city_name": "Shahkot"
                },
                {
                    "city_name": "Shahkot"
                },
                {
                    "city_name": "Shahpur City"
                },
                {
                    "city_name": "Shahpur Saddar"
                },
                {
                    "city_name": "Shakargarh"
                },
                {
                    "city_name": "Sham Churasi"
                },
                {
                    "city_name": "Sham Churasi"
                },
                {
                    "city_name": "Sharqpur"
                },
                {
                    "city_name": "Shehr Sultan"
                },
                {
                    "city_name": "Shekhpura"
                },
                {
                    "city_name": "Shekhpura"
                },
                {
                    "city_name": "Shekhupura"
                },
                {
                    "city_name": "Shujaabad"
                },
                {
                    "city_name": "Sialkot"
                },
                {
                    "city_name": "Sillanwali"
                },
                {
                    "city_name": "Sirhind"
                },
                {
                    "city_name": "Sirhind"
                },
                {
                    "city_name": "Sodhra"
                },
                {
                    "city_name": "Sohawa"
                },
                {
                    "city_name": "Sri Hargobindpur"
                },
                {
                    "city_name": "Sri Hargobindpur"
                },
                {
                    "city_name": "Sujanpur"
                },
                {
                    "city_name": "Sujanpur"
                },
                {
                    "city_name": "Sukheke"
                },
                {
                    "city_name": "Sultanpur Lodhi"
                },
                {
                    "city_name": "Sultanpur Lodhi"
                },
                {
                    "city_name": "Sunam"
                },
                {
                    "city_name": "Sunam"
                },
                {
                    "city_name": "Talagang"
                },
                {
                    "city_name": "Talwandi Bhai"
                },
                {
                    "city_name": "Talwandi Bhai"
                },
                {
                    "city_name": "Talwara"
                },
                {
                    "city_name": "Talwara"
                },
                {
                    "city_name": "Tandlianwala"
                },
                {
                    "city_name": "Tappa"
                },
                {
                    "city_name": "Tappa"
                },
                {
                    "city_name": "Tarn Taran"
                },
                {
                    "city_name": "Tarn Taran"
                },
                {
                    "city_name": "Taunsa"
                },
                {
                    "city_name": "Taxila"
                },
                {
                    "city_name": "Tibba Sultanpur"
                },
                {
                    "city_name": "Toba Tek Singh"
                },
                {
                    "city_name": "Tulamba"
                },
                {
                    "city_name": "Uch"
                },
                {
                    "city_name": "Urmar Tanda"
                },
                {
                    "city_name": "Urmar Tanda"
                },
                {
                    "city_name": "Vihari"
                },
                {
                    "city_name": "Wah"
                },
                {
                    "city_name": "Warburton"
                },
                {
                    "city_name": "Wazirabad"
                },
                {
                    "city_name": "Yazman"
                },
                {
                    "city_name": "Zafarwal"
                },
                {
                    "city_name": "Zahir Pir"
                },
                {
                    "city_name": "Zira"
                },
                {
                    "city_name": "Zira"
                },
                {
                    "city_name": "Zirakpur"
                },
                {
                    "city_name": "Zirakpur"
                }
            ]

            var rajasthan = [
                {
                    "city_name": "Abu Road"
                },
                {
                    "city_name": "Ajmer"
                },
                {
                    "city_name": "Aklera"
                },
                {
                    "city_name": "Alwar"
                },
                {
                    "city_name": "Amet"
                },
                {
                    "city_name": "Antah"
                },
                {
                    "city_name": "Anupgarh"
                },
                {
                    "city_name": "Asind"
                },
                {
                    "city_name": "Bagar"
                },
                {
                    "city_name": "Bagru"
                },
                {
                    "city_name": "Bahror"
                },
                {
                    "city_name": "Bakani"
                },
                {
                    "city_name": "Bali"
                },
                {
                    "city_name": "Balotra"
                },
                {
                    "city_name": "Bandikui"
                },
                {
                    "city_name": "Banswara"
                },
                {
                    "city_name": "Baran"
                },
                {
                    "city_name": "Bari"
                },
                {
                    "city_name": "Bari Sadri"
                },
                {
                    "city_name": "Barmer"
                },
                {
                    "city_name": "Basi"
                },
                {
                    "city_name": "Basni Belima"
                },
                {
                    "city_name": "Baswa"
                },
                {
                    "city_name": "Bayana"
                },
                {
                    "city_name": "Beawar"
                },
                {
                    "city_name": "Begun"
                },
                {
                    "city_name": "Bhadasar"
                },
                {
                    "city_name": "Bhadra"
                },
                {
                    "city_name": "Bhalariya"
                },
                {
                    "city_name": "Bharatpur"
                },
                {
                    "city_name": "Bhasawar"
                },
                {
                    "city_name": "Bhawani Mandi"
                },
                {
                    "city_name": "Bhawri"
                },
                {
                    "city_name": "Bhilwara"
                },
                {
                    "city_name": "Bhindar"
                },
                {
                    "city_name": "Bhinmal"
                },
                {
                    "city_name": "Bhiwadi"
                },
                {
                    "city_name": "Bijoliya Kalan"
                },
                {
                    "city_name": "Bikaner"
                },
                {
                    "city_name": "Bilara"
                },
                {
                    "city_name": "Bissau"
                },
                {
                    "city_name": "Borkhera"
                },
                {
                    "city_name": "Budhpura"
                },
                {
                    "city_name": "Bundi"
                },
                {
                    "city_name": "Chatsu"
                },
                {
                    "city_name": "Chechat"
                },
                {
                    "city_name": "Chhabra"
                },
                {
                    "city_name": "Chhapar"
                },
                {
                    "city_name": "Chhipa Barod"
                },
                {
                    "city_name": "Chhoti Sadri"
                },
                {
                    "city_name": "Chirawa"
                },
                {
                    "city_name": "Chittaurgarh"
                },
                {
                    "city_name": "Chittorgarh"
                },
                {
                    "city_name": "Chomun"
                },
                {
                    "city_name": "Churu"
                },
                {
                    "city_name": "Daosa"
                },
                {
                    "city_name": "Dariba"
                },
                {
                    "city_name": "Dausa"
                },
                {
                    "city_name": "Deoli"
                },
                {
                    "city_name": "Deshnok"
                },
                {
                    "city_name": "Devgarh"
                },
                {
                    "city_name": "Devli"
                },
                {
                    "city_name": "Dhariawad"
                },
                {
                    "city_name": "Dhaulpur"
                },
                {
                    "city_name": "Dholpur"
                },
                {
                    "city_name": "Didwana"
                },
                {
                    "city_name": "Dig"
                },
                {
                    "city_name": "Dungargarh"
                },
                {
                    "city_name": "Dungarpur"
                },
                {
                    "city_name": "Falna"
                },
                {
                    "city_name": "Fatehnagar"
                },
                {
                    "city_name": "Fatehpur"
                },
                {
                    "city_name": "Gajsinghpur"
                },
                {
                    "city_name": "Galiakot"
                },
                {
                    "city_name": "Ganganagar"
                },
                {
                    "city_name": "Gangapur"
                },
                {
                    "city_name": "Goredi Chancha"
                },
                {
                    "city_name": "Gothra"
                },
                {
                    "city_name": "Govindgarh"
                },
                {
                    "city_name": "Gulabpura"
                },
                {
                    "city_name": "Hanumangarh"
                },
                {
                    "city_name": "Hindaun"
                },
                {
                    "city_name": "Indragarh"
                },
                {
                    "city_name": "Jahazpur"
                },
                {
                    "city_name": "Jaipur"
                },
                {
                    "city_name": "Jaisalmer"
                },
                {
                    "city_name": "Jaiselmer"
                },
                {
                    "city_name": "Jaitaran"
                },
                {
                    "city_name": "Jalore"
                },
                {
                    "city_name": "Jhalawar"
                },
                {
                    "city_name": "Jhalrapatan"
                },
                {
                    "city_name": "Jhunjhunun"
                },
                {
                    "city_name": "Jobner"
                },
                {
                    "city_name": "Jodhpur"
                },
                {
                    "city_name": "Kaithun"
                },
                {
                    "city_name": "Kaman"
                },
                {
                    "city_name": "Kankroli"
                },
                {
                    "city_name": "Kanor"
                },
                {
                    "city_name": "Kapasan"
                },
                {
                    "city_name": "Kaprain"
                },
                {
                    "city_name": "Karanpura"
                },
                {
                    "city_name": "Karauli"
                },
                {
                    "city_name": "Kekri"
                },
                {
                    "city_name": "Keshorai Patan"
                },
                {
                    "city_name": "Kesrisinghpur"
                },
                {
                    "city_name": "Khairthal"
                },
                {
                    "city_name": "Khandela"
                },
                {
                    "city_name": "Khanpur"
                },
                {
                    "city_name": "Kherli"
                },
                {
                    "city_name": "Kherliganj"
                },
                {
                    "city_name": "Kherwara Chhaoni"
                },
                {
                    "city_name": "Khetri"
                },
                {
                    "city_name": "Kiranipura"
                },
                {
                    "city_name": "Kishangarh"
                },
                {
                    "city_name": "Kishangarh Ranwal"
                },
                {
                    "city_name": "Kolvi Rajendrapura"
                },
                {
                    "city_name": "Kot Putli"
                },
                {
                    "city_name": "Kota"
                },
                {
                    "city_name": "Kuchaman"
                },
                {
                    "city_name": "Kuchera"
                },
                {
                    "city_name": "Kumbhalgarh"
                },
                {
                    "city_name": "Kumbhkot"
                },
                {
                    "city_name": "Kumher"
                },
                {
                    "city_name": "Kushalgarh"
                },
                {
                    "city_name": "Lachhmangarh"
                },
                {
                    "city_name": "Ladnun"
                },
                {
                    "city_name": "Lakheri"
                },
                {
                    "city_name": "Lalsot"
                },
                {
                    "city_name": "Losal"
                },
                {
                    "city_name": "Madanganj"
                },
                {
                    "city_name": "Mahu Kalan"
                },
                {
                    "city_name": "Mahwa"
                },
                {
                    "city_name": "Makrana"
                },
                {
                    "city_name": "Malpura"
                },
                {
                    "city_name": "Mandal"
                },
                {
                    "city_name": "Mandalgarh"
                },
                {
                    "city_name": "Mandawar"
                },
                {
                    "city_name": "Mandwa"
                },
                {
                    "city_name": "Mangrol"
                },
                {
                    "city_name": "Manohar Thana"
                },
                {
                    "city_name": "Manoharpur"
                },
                {
                    "city_name": "Marwar"
                },
                {
                    "city_name": "Merta"
                },
                {
                    "city_name": "Modak"
                },
                {
                    "city_name": "Mount Abu"
                },
                {
                    "city_name": "Mukandgarh"
                },
                {
                    "city_name": "Mundwa"
                },
                {
                    "city_name": "Nadbai"
                },
                {
                    "city_name": "Naenwa"
                },
                {
                    "city_name": "Nagar"
                },
                {
                    "city_name": "Nagaur"
                },
                {
                    "city_name": "Napasar"
                },
                {
                    "city_name": "Naraina"
                },
                {
                    "city_name": "Nasirabad"
                },
                {
                    "city_name": "Nathdwara"
                },
                {
                    "city_name": "Nawa"
                },
                {
                    "city_name": "Nawalgarh"
                },
                {
                    "city_name": "Neem Ka Thana"
                },
                {
                    "city_name": "Neemrana"
                },
                {
                    "city_name": "Newa Talai"
                },
                {
                    "city_name": "Nimaj"
                },
                {
                    "city_name": "Nimbahera"
                },
                {
                    "city_name": "Niwai"
                },
                {
                    "city_name": "Nohar"
                },
                {
                    "city_name": "Nokha"
                },
                {
                    "city_name": "One SGM"
                },
                {
                    "city_name": "Padampur"
                },
                {
                    "city_name": "Pali"
                },
                {
                    "city_name": "Partapur"
                },
                {
                    "city_name": "Parvatsar"
                },
                {
                    "city_name": "Pasoond"
                },
                {
                    "city_name": "Phalna"
                },
                {
                    "city_name": "Phalodi"
                },
                {
                    "city_name": "Phulera"
                },
                {
                    "city_name": "Pilani"
                },
                {
                    "city_name": "Pilibanga"
                },
                {
                    "city_name": "Pindwara"
                },
                {
                    "city_name": "Pipalia Kalan"
                },
                {
                    "city_name": "Pipar"
                },
                {
                    "city_name": "Pirawa"
                },
                {
                    "city_name": "Pokaran"
                },
                {
                    "city_name": "Pratapgarh"
                },
                {
                    "city_name": "Pushkar"
                },
                {
                    "city_name": "Raipur"
                },
                {
                    "city_name": "Raisinghnagar"
                },
                {
                    "city_name": "Rajakhera"
                },
                {
                    "city_name": "Rajaldesar"
                },
                {
                    "city_name": "Rajgarh"
                },
                {
                    "city_name": "Rajsamand"
                },
                {
                    "city_name": "Ramganj Mandi"
                },
                {
                    "city_name": "Ramgarh"
                },
                {
                    "city_name": "Rani"
                },
                {
                    "city_name": "Raniwara"
                },
                {
                    "city_name": "Ratan Nagar"
                },
                {
                    "city_name": "Ratangarh"
                },
                {
                    "city_name": "Rawatbhata"
                },
                {
                    "city_name": "Rawatsar"
                },
                {
                    "city_name": "Rikhabdev"
                },
                {
                    "city_name": "Ringas"
                },
                {
                    "city_name": "Sadri"
                },
                {
                    "city_name": "Sadulshahar"
                },
                {
                    "city_name": "Sagwara"
                },
                {
                    "city_name": "Salumbar"
                },
                {
                    "city_name": "Sambhar"
                },
                {
                    "city_name": "Samdari"
                },
                {
                    "city_name": "Sanchor"
                },
                {
                    "city_name": "Sangariya"
                },
                {
                    "city_name": "Sangod"
                },
                {
                    "city_name": "Sardarshahr"
                },
                {
                    "city_name": "Sarwar"
                },
                {
                    "city_name": "Satal Kheri"
                },
                {
                    "city_name": "Sawai Madhopur"
                },
                {
                    "city_name": "Sewan Kalan"
                },
                {
                    "city_name": "Shahpura"
                },
                {
                    "city_name": "Sheoganj"
                },
                {
                    "city_name": "Sikar"
                },
                {
                    "city_name": "Sirohi"
                },
                {
                    "city_name": "Siwana"
                },
                {
                    "city_name": "Sogariya"
                },
                {
                    "city_name": "Sojat"
                },
                {
                    "city_name": "Sojat Road"
                },
                {
                    "city_name": "Sri Madhopur"
                },
                {
                    "city_name": "Sriganganagar"
                },
                {
                    "city_name": "Sujangarh"
                },
                {
                    "city_name": "Suket"
                },
                {
                    "city_name": "Sumerpur"
                },
                {
                    "city_name": "Sunel"
                },
                {
                    "city_name": "Surajgarh"
                },
                {
                    "city_name": "Suratgarh"
                },
                {
                    "city_name": "Swaroopganj"
                },
                {
                    "city_name": "Takhatgarh"
                },
                {
                    "city_name": "Taranagar"
                },
                {
                    "city_name": "Three STR"
                },
                {
                    "city_name": "Tijara"
                },
                {
                    "city_name": "Toda Bhim"
                },
                {
                    "city_name": "Toda Raisingh"
                },
                {
                    "city_name": "Todra"
                },
                {
                    "city_name": "Tonk"
                },
                {
                    "city_name": "Udaipur"
                },
                {
                    "city_name": "Udpura"
                },
                {
                    "city_name": "Uniara"
                },
                {
                    "city_name": "Vanasthali"
                },
                {
                    "city_name": "Vidyavihar"
                },
                {
                    "city_name": "Vijainagar"
                },
                {
                    "city_name": "Viratnagar"
                },
                {
                    "city_name": "Wer"
                }
            ]

            var sikkim = [
                {
                    "city_name": "Gangtok"
                },
                {
                    "city_name": "Gezing"
                },
                {
                    "city_name": "Jorethang"
                },
                {
                    "city_name": "Mangan"
                },
                {
                    "city_name": "Namchi"
                },
                {
                    "city_name": "Naya Bazar"
                },
                {
                    "city_name": "No City"
                },
                {
                    "city_name": "Rangpo"
                },
                {
                    "city_name": "Sikkim"
                },
                {
                    "city_name": "Singtam"
                },
                {
                    "city_name": "Upper Tadong"
                }
            ]

            var tamil = [
                {
                    "city_name": "Abiramam"
                },
                {
                    "city_name": "Achampudur"
                },
                {
                    "city_name": "Acharapakkam"
                },
                {
                    "city_name": "Acharipallam"
                },
                {
                    "city_name": "Achipatti"
                },
                {
                    "city_name": "Adikaratti"
                },
                {
                    "city_name": "Adiramapattinam"
                },
                {
                    "city_name": "Aduturai"
                },
                {
                    "city_name": "Adyar"
                },
                {
                    "city_name": "Agaram"
                },
                {
                    "city_name": "Agasthiswaram"
                },
                {
                    "city_name": "Akkaraipettai"
                },
                {
                    "city_name": "Alagappapuram"
                },
                {
                    "city_name": "Alagapuri"
                },
                {
                    "city_name": "Alampalayam"
                },
                {
                    "city_name": "Alandur"
                },
                {
                    "city_name": "Alanganallur"
                },
                {
                    "city_name": "Alangayam"
                },
                {
                    "city_name": "Alangudi"
                },
                {
                    "city_name": "Alangulam"
                },
                {
                    "city_name": "Alanthurai"
                },
                {
                    "city_name": "Alapakkam"
                },
                {
                    "city_name": "Allapuram"
                },
                {
                    "city_name": "Alur"
                },
                {
                    "city_name": "Alwar Tirunagari"
                },
                {
                    "city_name": "Alwarkurichi"
                },
                {
                    "city_name": "Ambasamudram"
                },
                {
                    "city_name": "Ambur"
                },
                {
                    "city_name": "Ammainaickanur"
                },
                {
                    "city_name": "Ammaparikuppam"
                },
                {
                    "city_name": "Ammapettai"
                },
                {
                    "city_name": "Ammavarikuppam"
                },
                {
                    "city_name": "Ammur"
                },
                {
                    "city_name": "Anaimalai"
                },
                {
                    "city_name": "Anaiyur"
                },
                {
                    "city_name": "Anakaputhur"
                },
                {
                    "city_name": "Ananthapuram"
                },
                {
                    "city_name": "Andanappettai"
                },
                {
                    "city_name": "Andipalayam"
                },
                {
                    "city_name": "Andippatti"
                },
                {
                    "city_name": "Anjugramam"
                },
                {
                    "city_name": "Annamalainagar"
                },
                {
                    "city_name": "Annavasal"
                },
                {
                    "city_name": "Annur"
                },
                {
                    "city_name": "Anthiyur"
                },
                {
                    "city_name": "Appakudal"
                },
                {
                    "city_name": "Arachalur"
                },
                {
                    "city_name": "Arakandanallur"
                },
                {
                    "city_name": "Arakonam"
                },
                {
                    "city_name": "Aralvaimozhi"
                },
                {
                    "city_name": "Arani"
                },
                {
                    "city_name": "Arani Road"
                },
                {
                    "city_name": "Arantangi"
                },
                {
                    "city_name": "Arasiramani"
                },
                {
                    "city_name": "Aravakurichi"
                },
                {
                    "city_name": "Aravankadu"
                },
                {
                    "city_name": "Arcot"
                },
                {
                    "city_name": "Arimalam"
                },
                {
                    "city_name": "Ariyalur"
                },
                {
                    "city_name": "Ariyappampalayam"
                },
                {
                    "city_name": "Ariyur"
                },
                {
                    "city_name": "Arni"
                },
                {
                    "city_name": "Arulmigu Thirumuruganpundi"
                },
                {
                    "city_name": "Arumanai"
                },
                {
                    "city_name": "Arumbavur"
                },
                {
                    "city_name": "Arumuganeri"
                },
                {
                    "city_name": "Aruppukkottai"
                },
                {
                    "city_name": "Ashokapuram"
                },
                {
                    "city_name": "Athani"
                },
                {
                    "city_name": "Athanur"
                },
                {
                    "city_name": "Athimarapatti"
                },
                {
                    "city_name": "Athipattu"
                },
                {
                    "city_name": "Athur"
                },
                {
                    "city_name": "Attayyampatti"
                },
                {
                    "city_name": "Attur"
                },
                {
                    "city_name": "Auroville"
                },
                {
                    "city_name": "Avadattur"
                },
                {
                    "city_name": "Avadi"
                },
                {
                    "city_name": "Avalpundurai"
                },
                {
                    "city_name": "Avaniapuram"
                },
                {
                    "city_name": "Avinashi"
                },
                {
                    "city_name": "Ayakudi"
                },
                {
                    "city_name": "Ayanadaippu"
                },
                {
                    "city_name": "Aygudi"
                },
                {
                    "city_name": "Ayothiapattinam"
                },
                {
                    "city_name": "Ayyalur"
                },
                {
                    "city_name": "Ayyampalayam"
                },
                {
                    "city_name": "Ayyampettai"
                },
                {
                    "city_name": "Azhagiapandiapuram"
                },
                {
                    "city_name": "Balakrishnampatti"
                },
                {
                    "city_name": "Balakrishnapuram"
                },
                {
                    "city_name": "Balapallam"
                },
                {
                    "city_name": "Balasamudram"
                },
                {
                    "city_name": "Bargur"
                },
                {
                    "city_name": "Belur"
                },
                {
                    "city_name": "Berhatty"
                },
                {
                    "city_name": "Bhavani"
                },
                {
                    "city_name": "Bhawanisagar"
                },
                {
                    "city_name": "Bhuvanagiri"
                },
                {
                    "city_name": "Bikketti"
                },
                {
                    "city_name": "Bodinayakkanur"
                },
                {
                    "city_name": "Brahmana Periya Agraharam"
                },
                {
                    "city_name": "Buthapandi"
                },
                {
                    "city_name": "Buthipuram"
                },
                {
                    "city_name": "Chatrapatti"
                },
                {
                    "city_name": "Chembarambakkam"
                },
                {
                    "city_name": "Chengalpattu"
                },
                {
                    "city_name": "Chengam"
                },
                {
                    "city_name": "Chennai"
                },
                {
                    "city_name": "Chennasamudram"
                },
                {
                    "city_name": "Chennimalai"
                },
                {
                    "city_name": "Cheranmadevi"
                },
                {
                    "city_name": "Cheruvanki"
                },
                {
                    "city_name": "Chetpet"
                },
                {
                    "city_name": "Chettiarpatti"
                },
                {
                    "city_name": "Chettipalaiyam"
                },
                {
                    "city_name": "Chettipalayam Cantonment"
                },
                {
                    "city_name": "Chettithangal"
                },
                {
                    "city_name": "Cheyur"
                },
                {
                    "city_name": "Cheyyar"
                },
                {
                    "city_name": "Chidambaram"
                },
                {
                    "city_name": "Chinalapatti"
                },
                {
                    "city_name": "Chinna Anuppanadi"
                },
                {
                    "city_name": "Chinna Salem"
                },
                {
                    "city_name": "Chinnakkampalayam"
                },
                {
                    "city_name": "Chinnammanur"
                },
                {
                    "city_name": "Chinnampalaiyam"
                },
                {
                    "city_name": "Chinnasekkadu"
                },
                {
                    "city_name": "Chinnavedampatti"
                },
                {
                    "city_name": "Chitlapakkam"
                },
                {
                    "city_name": "Chittodu"
                },
                {
                    "city_name": "Cholapuram"
                },
                {
                    "city_name": "Coimbatore"
                },
                {
                    "city_name": "Coonoor"
                },
                {
                    "city_name": "Courtalam"
                },
                {
                    "city_name": "Cuddalore"
                },
                {
                    "city_name": "Dalavaipatti"
                },
                {
                    "city_name": "Darasuram"
                },
                {
                    "city_name": "Denkanikottai"
                },
                {
                    "city_name": "Desur"
                },
                {
                    "city_name": "Devadanapatti"
                },
                {
                    "city_name": "Devakkottai"
                },
                {
                    "city_name": "Devakottai"
                },
                {
                    "city_name": "Devanangurichi"
                },
                {
                    "city_name": "Devarshola"
                },
                {
                    "city_name": "Devasthanam"
                },
                {
                    "city_name": "Dhalavoipuram"
                },
                {
                    "city_name": "Dhali"
                },
                {
                    "city_name": "Dhaliyur"
                },
                {
                    "city_name": "Dharapadavedu"
                },
                {
                    "city_name": "Dharapuram"
                },
                {
                    "city_name": "Dharmapuri"
                },
                {
                    "city_name": "Dindigul"
                },
                {
                    "city_name": "Dusi"
                },
                {
                    "city_name": "Edaganasalai"
                },
                {
                    "city_name": "Edaikodu"
                },
                {
                    "city_name": "Edakalinadu"
                },
                {
                    "city_name": "Elathur"
                },
                {
                    "city_name": "Elayirampannai"
                },
                {
                    "city_name": "Elumalai"
                },
                {
                    "city_name": "Eral"
                },
                {
                    "city_name": "Eraniel"
                },
                {
                    "city_name": "Eriodu"
                },
                {
                    "city_name": "Erode"
                },
                {
                    "city_name": "Erumaipatti"
                },
                {
                    "city_name": "Eruvadi"
                },
                {
                    "city_name": "Ethapur"
                },
                {
                    "city_name": "Ettaiyapuram"
                },
                {
                    "city_name": "Ettimadai"
                },
                {
                    "city_name": "Ezhudesam"
                },
                {
                    "city_name": "Ganapathipuram"
                },
                {
                    "city_name": "Gandhi Nagar"
                },
                {
                    "city_name": "Gangaikondan"
                },
                {
                    "city_name": "Gangavalli"
                },
                {
                    "city_name": "Ganguvarpatti"
                },
                {
                    "city_name": "Gingi"
                },
                {
                    "city_name": "Gopalasamudram"
                },
                {
                    "city_name": "Gopichettipalaiyam"
                },
                {
                    "city_name": "Gudalur"
                },
                {
                    "city_name": "Gudiyattam"
                },
                {
                    "city_name": "Guduvanchery"
                },
                {
                    "city_name": "Gummidipoondi"
                },
                {
                    "city_name": "Hanumanthampatti"
                },
                {
                    "city_name": "Harur"
                },
                {
                    "city_name": "Harveypatti"
                },
                {
                    "city_name": "Highways"
                },
                {
                    "city_name": "Hosur"
                },
                {
                    "city_name": "Hubbathala"
                },
                {
                    "city_name": "Huligal"
                },
                {
                    "city_name": "Idappadi"
                },
                {
                    "city_name": "Idikarai"
                },
                {
                    "city_name": "Ilampillai"
                },
                {
                    "city_name": "Ilanji"
                },
                {
                    "city_name": "Iluppaiyurani"
                },
                {
                    "city_name": "Iluppur"
                },
                {
                    "city_name": "Inam Karur"
                },
                {
                    "city_name": "Injambakkam"
                },
                {
                    "city_name": "Irugur"
                },
                {
                    "city_name": "Jaffrabad"
                },
                {
                    "city_name": "Jagathala"
                },
                {
                    "city_name": "Jalakandapuram"
                },
                {
                    "city_name": "Jalladiampet"
                },
                {
                    "city_name": "Jambai"
                },
                {
                    "city_name": "Jayankondam"
                },
                {
                    "city_name": "Jolarpet"
                },
                {
                    "city_name": "Kadambur"
                },
                {
                    "city_name": "Kadathur"
                },
                {
                    "city_name": "Kadayal"
                },
                {
                    "city_name": "Kadayampatti"
                },
                {
                    "city_name": "Kadayanallur"
                },
                {
                    "city_name": "Kadiapatti"
                },
                {
                    "city_name": "Kalakkad"
                },
                {
                    "city_name": "Kalambur"
                },
                {
                    "city_name": "Kalapatti"
                },
                {
                    "city_name": "Kalappanaickenpatti"
                },
                {
                    "city_name": "Kalavai"
                },
                {
                    "city_name": "Kalinjur"
                },
                {
                    "city_name": "Kaliyakkavilai"
                },
                {
                    "city_name": "Kallakkurichi"
                },
                {
                    "city_name": "Kallakudi"
                },
                {
                    "city_name": "Kallidaikurichchi"
                },
                {
                    "city_name": "Kallukuttam"
                },
                {
                    "city_name": "Kallupatti"
                },
                {
                    "city_name": "Kalpakkam"
                },
                {
                    "city_name": "Kalugumalai"
                },
                {
                    "city_name": "Kamayagoundanpatti"
                },
                {
                    "city_name": "Kambainallur"
                },
                {
                    "city_name": "Kambam"
                },
                {
                    "city_name": "Kamuthi"
                },
                {
                    "city_name": "Kanadukathan"
                },
                {
                    "city_name": "Kanakkampalayam"
                },
                {
                    "city_name": "Kanam"
                },
                {
                    "city_name": "Kanchipuram"
                },
                {
                    "city_name": "Kandanur"
                },
                {
                    "city_name": "Kangayam"
                },
                {
                    "city_name": "Kangayampalayam"
                },
                {
                    "city_name": "Kangeyanallur"
                },
                {
                    "city_name": "Kaniyur"
                },
                {
                    "city_name": "Kanjikoil"
                },
                {
                    "city_name": "Kannadendal"
                },
                {
                    "city_name": "Kannamangalam"
                },
                {
                    "city_name": "Kannampalayam"
                },
                {
                    "city_name": "Kannankurichi"
                },
                {
                    "city_name": "Kannapalaiyam"
                },
                {
                    "city_name": "Kannivadi"
                },
                {
                    "city_name": "Kanyakumari"
                },
                {
                    "city_name": "Kappiyarai"
                },
                {
                    "city_name": "Karaikkudi"
                },
                {
                    "city_name": "Karamadai"
                },
                {
                    "city_name": "Karambakkam"
                },
                {
                    "city_name": "Karambakkudi"
                },
                {
                    "city_name": "Kariamangalam"
                },
                {
                    "city_name": "Kariapatti"
                },
                {
                    "city_name": "Karugampattur"
                },
                {
                    "city_name": "Karumandi Chellipalayam"
                },
                {
                    "city_name": "Karumathampatti"
                },
                {
                    "city_name": "Karumbakkam"
                },
                {
                    "city_name": "Karungal"
                },
                {
                    "city_name": "Karunguzhi"
                },
                {
                    "city_name": "Karuppur"
                },
                {
                    "city_name": "Karur"
                },
                {
                    "city_name": "Kasipalaiyam"
                },
                {
                    "city_name": "Kasipalayam G"
                },
                {
                    "city_name": "Kathirvedu"
                },
                {
                    "city_name": "Kathujuganapalli"
                },
                {
                    "city_name": "Katpadi"
                },
                {
                    "city_name": "Kattivakkam"
                },
                {
                    "city_name": "Kattumannarkoil"
                },
                {
                    "city_name": "Kattupakkam"
                },
                {
                    "city_name": "Kattuputhur"
                },
                {
                    "city_name": "Kaveripakkam"
                },
                {
                    "city_name": "Kaveripattinam"
                },
                {
                    "city_name": "Kavundampalaiyam"
                },
                {
                    "city_name": "Kavundampalayam"
                },
                {
                    "city_name": "Kayalpattinam"
                },
                {
                    "city_name": "Kayattar"
                },
                {
                    "city_name": "Kelamangalam"
                },
                {
                    "city_name": "Kelambakkam"
                },
                {
                    "city_name": "Kembainaickenpalayam"
                },
                {
                    "city_name": "Kethi"
                },
                {
                    "city_name": "Kilakarai"
                },
                {
                    "city_name": "Kilampadi"
                },
                {
                    "city_name": "Kilkulam"
                },
                {
                    "city_name": "Kilkunda"
                },
                {
                    "city_name": "Killiyur"
                },
                {
                    "city_name": "Killlai"
                },
                {
                    "city_name": "Kilpennathur"
                },
                {
                    "city_name": "Kilvelur"
                },
                {
                    "city_name": "Kinathukadavu"
                },
                {
                    "city_name": "Kiramangalam"
                },
                {
                    "city_name": "Kiranur"
                },
                {
                    "city_name": "Kiripatti"
                },
                {
                    "city_name": "Kizhapavur"
                },
                {
                    "city_name": "Kmarasamipatti"
                },
                {
                    "city_name": "Kochadai"
                },
                {
                    "city_name": "Kodaikanal"
                },
                {
                    "city_name": "Kodambakkam"
                },
                {
                    "city_name": "Kodavasal"
                },
                {
                    "city_name": "Kodumudi"
                },
                {
                    "city_name": "Kolachal"
                },
                {
                    "city_name": "Kolappalur"
                },
                {
                    "city_name": "Kolathupalayam"
                },
                {
                    "city_name": "Kolathur"
                },
                {
                    "city_name": "Kollankodu"
                },
                {
                    "city_name": "Kollankoil"
                },
                {
                    "city_name": "Komaralingam"
                },
                {
                    "city_name": "Komarapalayam"
                },
                {
                    "city_name": "Kombai"
                },
                {
                    "city_name": "Konakkarai"
                },
                {
                    "city_name": "Konavattam"
                },
                {
                    "city_name": "Kondalampatti"
                },
                {
                    "city_name": "Konganapuram"
                },
                {
                    "city_name": "Koradacheri"
                },
                {
                    "city_name": "Korampallam"
                },
                {
                    "city_name": "Kotagiri"
                },
                {
                    "city_name": "Kothinallur"
                },
                {
                    "city_name": "Kottaiyur"
                },
                {
                    "city_name": "Kottakuppam"
                },
                {
                    "city_name": "Kottaram"
                },
                {
                    "city_name": "Kottivakkam"
                },
                {
                    "city_name": "Kottur"
                },
                {
                    "city_name": "Kovilpatti"
                },
                {
                    "city_name": "Koyampattur"
                },
                {
                    "city_name": "Krishnagiri"
                },
                {
                    "city_name": "Krishnarayapuram"
                },
                {
                    "city_name": "Krishnasamudram"
                },
                {
                    "city_name": "Kuchanur"
                },
                {
                    "city_name": "Kuhalur"
                },
                {
                    "city_name": "Kulasekarappattinam"
                },
                {
                    "city_name": "Kulasekarapuram"
                },
                {
                    "city_name": "Kulithalai"
                },
                {
                    "city_name": "Kumarapalaiyam"
                },
                {
                    "city_name": "Kumarapalayam"
                },
                {
                    "city_name": "Kumarapuram"
                },
                {
                    "city_name": "Kumbakonam"
                },
                {
                    "city_name": "Kundrathur"
                },
                {
                    "city_name": "Kuniyamuthur"
                },
                {
                    "city_name": "Kunnathur"
                },
                {
                    "city_name": "Kunur"
                },
                {
                    "city_name": "Kuraikundu"
                },
                {
                    "city_name": "Kurichi"
                },
                {
                    "city_name": "Kurinjippadi"
                },
                {
                    "city_name": "Kurudampalaiyam"
                },
                {
                    "city_name": "Kurumbalur"
                },
                {
                    "city_name": "Kuthalam"
                },
                {
                    "city_name": "Kuthappar"
                },
                {
                    "city_name": "Kuttalam"
                },
                {
                    "city_name": "Kuttanallur"
                },
                {
                    "city_name": "Kuzhithurai"
                },
                {
                    "city_name": "Labbaikudikadu"
                },
                {
                    "city_name": "Lakkampatti"
                },
                {
                    "city_name": "Lalgudi"
                },
                {
                    "city_name": "Lalpet"
                },
                {
                    "city_name": "Llayangudi"
                },
                {
                    "city_name": "Madambakkam"
                },
                {
                    "city_name": "Madanur"
                },
                {
                    "city_name": "Madathukulam"
                },
                {
                    "city_name": "Madhavaram"
                },
                {
                    "city_name": "Madippakkam"
                },
                {
                    "city_name": "Madukkarai"
                },
                {
                    "city_name": "Madukkur"
                },
                {
                    "city_name": "Madurai"
                },
                {
                    "city_name": "Maduranthakam"
                },
                {
                    "city_name": "Maduravoyal"
                },
                {
                    "city_name": "Mahabalipuram"
                },
                {
                    "city_name": "Makkinanpatti"
                },
                {
                    "city_name": "Mallamuppampatti"
                },
                {
                    "city_name": "Mallankinaru"
                },
                {
                    "city_name": "Mallapuram"
                },
                {
                    "city_name": "Mallasamudram"
                },
                {
                    "city_name": "Mallur"
                },
                {
                    "city_name": "Mamallapuram"
                },
                {
                    "city_name": "Mamsapuram"
                },
                {
                    "city_name": "Manachanallur"
                },
                {
                    "city_name": "Manali"
                },
                {
                    "city_name": "Manalmedu"
                },
                {
                    "city_name": "Manalurpet"
                },
                {
                    "city_name": "Manamadurai"
                },
                {
                    "city_name": "Manapakkam"
                },
                {
                    "city_name": "Manapparai"
                },
                {
                    "city_name": "Manavalakurichi"
                },
                {
                    "city_name": "Mandaikadu"
                },
                {
                    "city_name": "Mandapam"
                },
                {
                    "city_name": "Mangadu"
                },
                {
                    "city_name": "Mangalam"
                },
                {
                    "city_name": "Mangalampet"
                },
                {
                    "city_name": "Manimutharu"
                },
                {
                    "city_name": "Mannargudi"
                },
                {
                    "city_name": "Mappilaiurani"
                },
                {
                    "city_name": "Maraimalai Nagar"
                },
                {
                    "city_name": "Marakkanam"
                },
                {
                    "city_name": "Maramangalathupatti"
                },
                {
                    "city_name": "Marandahalli"
                },
                {
                    "city_name": "Markayankottai"
                },
                {
                    "city_name": "Marudur"
                },
                {
                    "city_name": "Marungur"
                },
                {
                    "city_name": "Masinigudi"
                },
                {
                    "city_name": "Mathigiri"
                },
                {
                    "city_name": "Mattur"
                },
                {
                    "city_name": "Mayiladuthurai"
                },
                {
                    "city_name": "Mecheri"
                },
                {
                    "city_name": "Melacheval"
                },
                {
                    "city_name": "Melachokkanathapuram"
                },
                {
                    "city_name": "Melagaram"
                },
                {
                    "city_name": "Melamadai"
                },
                {
                    "city_name": "Melamaiyur"
                },
                {
                    "city_name": "Melanattam"
                },
                {
                    "city_name": "Melathiruppanthuruthi"
                },
                {
                    "city_name": "Melattur"
                },
                {
                    "city_name": "Melmananbedu"
                },
                {
                    "city_name": "Melpattampakkam"
                },
                {
                    "city_name": "Melur"
                },
                {
                    "city_name": "Melvisharam"
                },
                {
                    "city_name": "Mettupalayam"
                },
                {
                    "city_name": "Mettur"
                },
                {
                    "city_name": "Meyyanur"
                },
                {
                    "city_name": "Milavittan"
                },
                {
                    "city_name": "Minakshipuram"
                },
                {
                    "city_name": "Minambakkam"
                },
                {
                    "city_name": "Minjur"
                },
                {
                    "city_name": "Modakurichi"
                },
                {
                    "city_name": "Mohanur"
                },
                {
                    "city_name": "Mopperipalayam"
                },
                {
                    "city_name": "Mudalur"
                },
                {
                    "city_name": "Mudichur"
                },
                {
                    "city_name": "Mudukulathur"
                },
                {
                    "city_name": "Mukasipidariyur"
                },
                {
                    "city_name": "Mukkudal"
                },
                {
                    "city_name": "Mulagumudu"
                },
                {
                    "city_name": "Mulakaraipatti"
                },
                {
                    "city_name": "Mulanur"
                },
                {
                    "city_name": "Mullakkadu"
                },
                {
                    "city_name": "Muruganpalayam"
                },
                {
                    "city_name": "Musiri"
                },
                {
                    "city_name": "Muthupet"
                },
                {
                    "city_name": "Muthur"
                },
                {
                    "city_name": "Muttayyapuram"
                },
                {
                    "city_name": "Muttupet"
                },
                {
                    "city_name": "Muvarasampettai"
                },
                {
                    "city_name": "Myladi"
                },
                {
                    "city_name": "Mylapore"
                },
                {
                    "city_name": "Nadukkuthagai"
                },
                {
                    "city_name": "Naduvattam"
                },
                {
                    "city_name": "Nagapattinam"
                },
                {
                    "city_name": "Nagavakulam"
                },
                {
                    "city_name": "Nagercoil"
                },
                {
                    "city_name": "Nagojanahalli"
                },
                {
                    "city_name": "Nallampatti"
                },
                {
                    "city_name": "Nallur"
                },
                {
                    "city_name": "Namagiripettai"
                },
                {
                    "city_name": "Namakkal"
                },
                {
                    "city_name": "Nambiyur"
                },
                {
                    "city_name": "Nambutalai"
                },
                {
                    "city_name": "Nandambakkam"
                },
                {
                    "city_name": "Nandivaram"
                },
                {
                    "city_name": "Nangavalli"
                },
                {
                    "city_name": "Nangavaram"
                },
                {
                    "city_name": "Nanguneri"
                },
                {
                    "city_name": "Nanjikottai"
                },
                {
                    "city_name": "Nannilam"
                },
                {
                    "city_name": "Naranammalpuram"
                },
                {
                    "city_name": "Naranapuram"
                },
                {
                    "city_name": "Narasimhanaickenpalayam"
                },
                {
                    "city_name": "Narasingapuram"
                },
                {
                    "city_name": "Narasojipatti"
                },
                {
                    "city_name": "Naravarikuppam"
                },
                {
                    "city_name": "Nasiyanur"
                },
                {
                    "city_name": "Natham"
                },
                {
                    "city_name": "Nathampannai"
                },
                {
                    "city_name": "Natrampalli"
                },
                {
                    "city_name": "Nattam"
                },
                {
                    "city_name": "Nattapettai"
                },
                {
                    "city_name": "Nattarasankottai"
                },
                {
                    "city_name": "Navalpattu"
                },
                {
                    "city_name": "Nazarethpettai"
                },
                {
                    "city_name": "Nazerath"
                },
                {
                    "city_name": "Neikkarapatti"
                },
                {
                    "city_name": "Neiyyur"
                },
                {
                    "city_name": "Nellikkuppam"
                },
                {
                    "city_name": "Nelliyalam"
                },
                {
                    "city_name": "Nemili"
                },
                {
                    "city_name": "Nemilicheri"
                },
                {
                    "city_name": "Neripperichal"
                },
                {
                    "city_name": "Nerkunram"
                },
                {
                    "city_name": "Nerkuppai"
                },
                {
                    "city_name": "Nerunjipettai"
                },
                {
                    "city_name": "Neykkarappatti"
                },
                {
                    "city_name": "Neyveli"
                },
                {
                    "city_name": "Nidamangalam"
                },
                {
                    "city_name": "Nilagiri"
                },
                {
                    "city_name": "Nilakkottai"
                },
                {
                    "city_name": "Nilankarai"
                },
                {
                    "city_name": "Odaipatti"
                },
                {
                    "city_name": "Odaiyakulam"
                },
                {
                    "city_name": "Oddanchatram"
                },
                {
                    "city_name": "Odugathur"
                },
                {
                    "city_name": "Oggiyamduraipakkam"
                },
                {
                    "city_name": "Olagadam"
                },
                {
                    "city_name": "Omalur"
                },
                {
                    "city_name": "Ooty"
                },
                {
                    "city_name": "Orathanadu"
                },
                {
                    "city_name": "Othakadai"
                },
                {
                    "city_name": "Othakalmandapam"
                },
                {
                    "city_name": "Ottapparai"
                },
                {
                    "city_name": "Pacode"
                },
                {
                    "city_name": "Padaividu"
                },
                {
                    "city_name": "Padianallur"
                },
                {
                    "city_name": "Padirikuppam"
                },
                {
                    "city_name": "Padmanabhapuram"
                },
                {
                    "city_name": "Padririvedu"
                },
                {
                    "city_name": "Palaganangudy"
                },
                {
                    "city_name": "Palaimpatti"
                },
                {
                    "city_name": "Palakkodu"
                },
                {
                    "city_name": "Palamedu"
                },
                {
                    "city_name": "Palani"
                },
                {
                    "city_name": "Palani Chettipatti"
                },
                {
                    "city_name": "Palavakkam"
                },
                {
                    "city_name": "Palavansathu"
                },
                {
                    "city_name": "Palayakayal"
                },
                {
                    "city_name": "Palayam"
                },
                {
                    "city_name": "Palayamkottai"
                },
                {
                    "city_name": "Palladam"
                },
                {
                    "city_name": "Pallapalayam"
                },
                {
                    "city_name": "Pallapatti"
                },
                {
                    "city_name": "Pallattur"
                },
                {
                    "city_name": "Pallavaram"
                },
                {
                    "city_name": "Pallikaranai"
                },
                {
                    "city_name": "Pallikonda"
                },
                {
                    "city_name": "Pallipalaiyam"
                },
                {
                    "city_name": "Pallipalaiyam Agraharam"
                },
                {
                    "city_name": "Pallipattu"
                },
                {
                    "city_name": "Pammal"
                },
                {
                    "city_name": "Panagudi"
                },
                {
                    "city_name": "Panaimarathupatti"
                },
                {
                    "city_name": "Panapakkam"
                },
                {
                    "city_name": "Panboli"
                },
                {
                    "city_name": "Pandamangalam"
                },
                {
                    "city_name": "Pannaikadu"
                },
                {
                    "city_name": "Pannaipuram"
                },
                {
                    "city_name": "Pannuratti"
                },
                {
                    "city_name": "Panruti"
                },
                {
                    "city_name": "Papanasam"
                },
                {
                    "city_name": "Pappankurichi"
                },
                {
                    "city_name": "Papparapatti"
                },
                {
                    "city_name": "Pappireddipatti"
                },
                {
                    "city_name": "Paramakkudi"
                },
                {
                    "city_name": "Paramankurichi"
                },
                {
                    "city_name": "Paramathi"
                },
                {
                    "city_name": "Parangippettai"
                },
                {
                    "city_name": "Paravai"
                },
                {
                    "city_name": "Pasur"
                },
                {
                    "city_name": "Pathamadai"
                },
                {
                    "city_name": "Pattinam"
                },
                {
                    "city_name": "Pattiviranpatti"
                },
                {
                    "city_name": "Pattukkottai"
                },
                {
                    "city_name": "Pazhugal"
                },
                {
                    "city_name": "Pennadam"
                },
                {
                    "city_name": "Pennagaram"
                },
                {
                    "city_name": "Pennathur"
                },
                {
                    "city_name": "Peraiyur"
                },
                {
                    "city_name": "Peralam"
                },
                {
                    "city_name": "Perambalur"
                },
                {
                    "city_name": "Peranamallur"
                },
                {
                    "city_name": "Peravurani"
                },
                {
                    "city_name": "Periyakodiveri"
                },
                {
                    "city_name": "Periyakulam"
                },
                {
                    "city_name": "Periyanayakkanpalaiyam"
                },
                {
                    "city_name": "Periyanegamam"
                },
                {
                    "city_name": "Periyapatti"
                },
                {
                    "city_name": "Periyasemur"
                },
                {
                    "city_name": "Pernambut"
                },
                {
                    "city_name": "Perumagalur"
                },
                {
                    "city_name": "Perumandi"
                },
                {
                    "city_name": "Perumuchi"
                },
                {
                    "city_name": "Perundurai"
                },
                {
                    "city_name": "Perungalathur"
                },
                {
                    "city_name": "Perungudi"
                },
                {
                    "city_name": "Perungulam"
                },
                {
                    "city_name": "Perur"
                },
                {
                    "city_name": "Perur Chettipalaiyam"
                },
                {
                    "city_name": "Pethampalayam"
                },
                {
                    "city_name": "Pethanaickenpalayam"
                },
                {
                    "city_name": "Pillanallur"
                },
                {
                    "city_name": "Pirkankaranai"
                },
                {
                    "city_name": "Polichalur"
                },
                {
                    "city_name": "Pollachi"
                },
                {
                    "city_name": "Polur"
                },
                {
                    "city_name": "Ponmani"
                },
                {
                    "city_name": "Ponnamaravathi"
                },
                {
                    "city_name": "Ponnampatti"
                },
                {
                    "city_name": "Ponneri"
                },
                {
                    "city_name": "Porur"
                },
                {
                    "city_name": "Pothanur"
                },
                {
                    "city_name": "Pothatturpettai"
                },
                {
                    "city_name": "Pudukadai"
                },
                {
                    "city_name": "Pudukkottai Cantonment"
                },
                {
                    "city_name": "Pudukottai"
                },
                {
                    "city_name": "Pudupalaiyam Aghraharam"
                },
                {
                    "city_name": "Pudupalayam"
                },
                {
                    "city_name": "Pudupatti"
                },
                {
                    "city_name": "Pudupattinam"
                },
                {
                    "city_name": "Pudur"
                },
                {
                    "city_name": "Puduvayal"
                },
                {
                    "city_name": "Pulambadi"
                },
                {
                    "city_name": "Pulampatti"
                },
                {
                    "city_name": "Puliyampatti"
                },
                {
                    "city_name": "Puliyankudi"
                },
                {
                    "city_name": "Puliyur"
                },
                {
                    "city_name": "Pullampadi"
                },
                {
                    "city_name": "Puluvapatti"
                },
                {
                    "city_name": "Punamalli"
                },
                {
                    "city_name": "Punjai Puliyampatti"
                },
                {
                    "city_name": "Punjai Thottakurichi"
                },
                {
                    "city_name": "Punjaipugalur"
                },
                {
                    "city_name": "Puthalam"
                },
                {
                    "city_name": "Putteri"
                },
                {
                    "city_name": "Puvalur"
                },
                {
                    "city_name": "Puzhal"
                },
                {
                    "city_name": "Puzhithivakkam"
                },
                {
                    "city_name": "Rajapalayam"
                },
                {
                    "city_name": "Ramanathapuram"
                },
                {
                    "city_name": "Ramapuram"
                },
                {
                    "city_name": "Rameswaram"
                },
                {
                    "city_name": "Ranipet"
                },
                {
                    "city_name": "Rasipuram"
                },
                {
                    "city_name": "Rayagiri"
                },
                {
                    "city_name": "Rithapuram"
                },
                {
                    "city_name": "Rosalpatti"
                },
                {
                    "city_name": "Rudravathi"
                },
                {
                    "city_name": "Sadayankuppam"
                },
                {
                    "city_name": "Saint Thomas Mount"
                },
                {
                    "city_name": "Salangapalayam"
                },
                {
                    "city_name": "Salem"
                },
                {
                    "city_name": "Samalapuram"
                },
                {
                    "city_name": "Samathur"
                },
                {
                    "city_name": "Sambavar Vadagarai"
                },
                {
                    "city_name": "Sankaramanallur"
                },
                {
                    "city_name": "Sankarankoil"
                },
                {
                    "city_name": "Sankarapuram"
                },
                {
                    "city_name": "Sankari"
                },
                {
                    "city_name": "Sankarnagar"
                },
                {
                    "city_name": "Saravanampatti"
                },
                {
                    "city_name": "Sarcarsamakulam"
                },
                {
                    "city_name": "Sathiyavijayanagaram"
                },
                {
                    "city_name": "Sathuvachari"
                },
                {
                    "city_name": "Sathyamangalam"
                },
                {
                    "city_name": "Sattankulam"
                },
                {
                    "city_name": "Sattur"
                },
                {
                    "city_name": "Sayalgudi"
                },
                {
                    "city_name": "Sayapuram"
                },
                {
                    "city_name": "Seithur"
                },
                {
                    "city_name": "Sembakkam"
                },
                {
                    "city_name": "Semmipalayam"
                },
                {
                    "city_name": "Sennirkuppam"
                },
                {
                    "city_name": "Senthamangalam"
                },
                {
                    "city_name": "Sentharapatti"
                },
                {
                    "city_name": "Senur"
                },
                {
                    "city_name": "Sethiathoppu"
                },
                {
                    "city_name": "Sevilimedu"
                },
                {
                    "city_name": "Sevugampatti"
                },
                {
                    "city_name": "Shenbakkam"
                },
                {
                    "city_name": "Shencottai"
                },
                {
                    "city_name": "Shenkottai"
                },
                {
                    "city_name": "Sholavandan"
                },
                {
                    "city_name": "Sholinganallur"
                },
                {
                    "city_name": "Sholingur"
                },
                {
                    "city_name": "Sholur"
                },
                {
                    "city_name": "Sikkarayapuram"
                },
                {
                    "city_name": "Singampuneri"
                },
                {
                    "city_name": "Singanallur"
                },
                {
                    "city_name": "Singaperumalkoil"
                },
                {
                    "city_name": "Sirapalli"
                },
                {
                    "city_name": "Sirkali"
                },
                {
                    "city_name": "Sirugamani"
                },
                {
                    "city_name": "Sirumugai"
                },
                {
                    "city_name": "Sithayankottai"
                },
                {
                    "city_name": "Sithurajapuram"
                },
                {
                    "city_name": "Sivaganga"
                },
                {
                    "city_name": "Sivagiri"
                },
                {
                    "city_name": "Sivakasi"
                },
                {
                    "city_name": "Sivanthipuram"
                },
                {
                    "city_name": "Sivur"
                },
                {
                    "city_name": "Soranjeri"
                },
                {
                    "city_name": "South Kannanur"
                },
                {
                    "city_name": "South Kodikulam"
                },
                {
                    "city_name": "Srimushnam"
                },
                {
                    "city_name": "Sriperumpudur"
                },
                {
                    "city_name": "Sriramapuram"
                },
                {
                    "city_name": "Srirangam"
                },
                {
                    "city_name": "Srivaikuntam"
                },
                {
                    "city_name": "Srivilliputtur"
                },
                {
                    "city_name": "Suchindram"
                },
                {
                    "city_name": "Suliswaranpatti"
                },
                {
                    "city_name": "Sulur"
                },
                {
                    "city_name": "Sundarapandiam"
                },
                {
                    "city_name": "Sundarapandiapuram"
                },
                {
                    "city_name": "Surampatti"
                },
                {
                    "city_name": "Surandai"
                },
                {
                    "city_name": "Suriyampalayam"
                },
                {
                    "city_name": "Swamimalai"
                },
                {
                    "city_name": "Tambaram"
                },
                {
                    "city_name": "Taramangalam"
                },
                {
                    "city_name": "Tattayyangarpettai"
                },
                {
                    "city_name": "Tayilupatti"
                },
                {
                    "city_name": "Tenkasi"
                },
                {
                    "city_name": "Thadikombu"
                },
                {
                    "city_name": "Thakkolam"
                },
                {
                    "city_name": "Thalainayar"
                },
                {
                    "city_name": "Thalakudi"
                },
                {
                    "city_name": "Thamaraikulam"
                },
                {
                    "city_name": "Thammampatti"
                },
                {
                    "city_name": "Thanjavur"
                },
                {
                    "city_name": "Thanthoni"
                },
                {
                    "city_name": "Tharangambadi"
                },
                {
                    "city_name": "Thedavur"
                },
                {
                    "city_name": "Thenambakkam"
                },
                {
                    "city_name": "Thengampudur"
                },
                {
                    "city_name": "Theni"
                },
                {
                    "city_name": "Theni Allinagaram"
                },
                {
                    "city_name": "Thenkarai"
                },
                {
                    "city_name": "Thenthamaraikulam"
                },
                {
                    "city_name": "Thenthiruperai"
                },
                {
                    "city_name": "Thesur"
                },
                {
                    "city_name": "Thevaram"
                },
                {
                    "city_name": "Thevur"
                },
                {
                    "city_name": "Thiagadurgam"
                },
                {
                    "city_name": "Thiagarajar Colony"
                },
                {
                    "city_name": "Thingalnagar"
                },
                {
                    "city_name": "Thiruchirapalli"
                },
                {
                    "city_name": "Thirukarungudi"
                },
                {
                    "city_name": "Thirukazhukundram"
                },
                {
                    "city_name": "Thirumalayampalayam"
                },
                {
                    "city_name": "Thirumazhisai"
                },
                {
                    "city_name": "Thirunagar"
                },
                {
                    "city_name": "Thirunageswaram"
                },
                {
                    "city_name": "Thirunindravur"
                },
                {
                    "city_name": "Thirunirmalai"
                },
                {
                    "city_name": "Thiruparankundram"
                },
                {
                    "city_name": "Thiruparappu"
                },
                {
                    "city_name": "Thiruporur"
                },
                {
                    "city_name": "Thiruppanandal"
                },
                {
                    "city_name": "Thirupuvanam"
                },
                {
                    "city_name": "Thiruthangal"
                },
                {
                    "city_name": "Thiruthuraipundi"
                },
                {
                    "city_name": "Thiruvaivaru"
                },
                {
                    "city_name": "Thiruvalam"
                },
                {
                    "city_name": "Thiruvarur"
                },
                {
                    "city_name": "Thiruvattaru"
                },
                {
                    "city_name": "Thiruvenkatam"
                },
                {
                    "city_name": "Thiruvennainallur"
                },
                {
                    "city_name": "Thiruvithankodu"
                },
                {
                    "city_name": "Thisayanvilai"
                },
                {
                    "city_name": "Thittacheri"
                },
                {
                    "city_name": "Thondamuthur"
                },
                {
                    "city_name": "Thorapadi"
                },
                {
                    "city_name": "Thottipalayam"
                },
                {
                    "city_name": "Thottiyam"
                },
                {
                    "city_name": "Thudiyalur"
                },
                {
                    "city_name": "Thuthipattu"
                },
                {
                    "city_name": "Thuvakudi"
                },
                {
                    "city_name": "Timiri"
                },
                {
                    "city_name": "Tindivanam"
                },
                {
                    "city_name": "Tinnanur"
                },
                {
                    "city_name": "Tiruchchendur"
                },
                {
                    "city_name": "Tiruchengode"
                },
                {
                    "city_name": "Tirukkalukkundram"
                },
                {
                    "city_name": "Tirukkattuppalli"
                },
                {
                    "city_name": "Tirukkoyilur"
                },
                {
                    "city_name": "Tirumangalam"
                },
                {
                    "city_name": "Tirumullaivasal"
                },
                {
                    "city_name": "Tirumuruganpundi"
                },
                {
                    "city_name": "Tirunageswaram"
                },
                {
                    "city_name": "Tirunelveli"
                },
                {
                    "city_name": "Tirupathur"
                },
                {
                    "city_name": "Tirupattur"
                },
                {
                    "city_name": "Tiruppuvanam"
                },
                {
                    "city_name": "Tirupur"
                },
                {
                    "city_name": "Tirusulam"
                },
                {
                    "city_name": "Tiruttani"
                },
                {
                    "city_name": "Tiruvallur"
                },
                {
                    "city_name": "Tiruvannamalai"
                },
                {
                    "city_name": "Tiruverambur"
                },
                {
                    "city_name": "Tiruverkadu"
                },
                {
                    "city_name": "Tiruvethipuram"
                },
                {
                    "city_name": "Tiruvidaimarudur"
                },
                {
                    "city_name": "Tiruvottiyur"
                },
                {
                    "city_name": "Tittakudi"
                },
                {
                    "city_name": "TNPL Pugalur"
                },
                {
                    "city_name": "Tondi"
                },
                {
                    "city_name": "Turaiyur"
                },
                {
                    "city_name": "Tuticorin"
                },
                {
                    "city_name": "Udagamandalam"
                },
                {
                    "city_name": "Udagamandalam Valley"
                },
                {
                    "city_name": "Udankudi"
                },
                {
                    "city_name": "Udayarpalayam"
                },
                {
                    "city_name": "Udumalaipettai"
                },
                {
                    "city_name": "Udumalpet"
                },
                {
                    "city_name": "Ullur"
                },
                {
                    "city_name": "Ulundurpettai"
                },
                {
                    "city_name": "Unjalaur"
                },
                {
                    "city_name": "Unnamalaikadai"
                },
                {
                    "city_name": "Uppidamangalam"
                },
                {
                    "city_name": "Uppiliapuram"
                },
                {
                    "city_name": "Urachikkottai"
                },
                {
                    "city_name": "Urapakkam"
                },
                {
                    "city_name": "Usilampatti"
                },
                {
                    "city_name": "Uthangarai"
                },
                {
                    "city_name": "Uthayendram"
                },
                {
                    "city_name": "Uthiramerur"
                },
                {
                    "city_name": "Uthukkottai"
                },
                {
                    "city_name": "Uttamapalaiyam"
                },
                {
                    "city_name": "Uttukkuli"
                },
                {
                    "city_name": "Vadakarai Kizhpadugai"
                },
                {
                    "city_name": "Vadakkanandal"
                },
                {
                    "city_name": "Vadakku Valliyur"
                },
                {
                    "city_name": "Vadalur"
                },
                {
                    "city_name": "Vadamadurai"
                },
                {
                    "city_name": "Vadavalli"
                },
                {
                    "city_name": "Vadipatti"
                },
                {
                    "city_name": "Vadugapatti"
                },
                {
                    "city_name": "Vaithiswarankoil"
                },
                {
                    "city_name": "Valangaiman"
                },
                {
                    "city_name": "Valasaravakkam"
                },
                {
                    "city_name": "Valavanur"
                },
                {
                    "city_name": "Vallam"
                },
                {
                    "city_name": "Valparai"
                },
                {
                    "city_name": "Valvaithankoshtam"
                },
                {
                    "city_name": "Vanavasi"
                },
                {
                    "city_name": "Vandalur"
                },
                {
                    "city_name": "Vandavasi"
                },
                {
                    "city_name": "Vandiyur"
                },
                {
                    "city_name": "Vaniputhur"
                },
                {
                    "city_name": "Vaniyambadi"
                },
                {
                    "city_name": "Varadarajanpettai"
                },
                {
                    "city_name": "Varadharajapuram"
                },
                {
                    "city_name": "Vasudevanallur"
                },
                {
                    "city_name": "Vathirairuppu"
                },
                {
                    "city_name": "Vattalkundu"
                },
                {
                    "city_name": "Vazhapadi"
                },
                {
                    "city_name": "Vedapatti"
                },
                {
                    "city_name": "Vedaranniyam"
                },
                {
                    "city_name": "Vedasandur"
                },
                {
                    "city_name": "Velampalaiyam"
                },
                {
                    "city_name": "Velankanni"
                },
                {
                    "city_name": "Vellakinar"
                },
                {
                    "city_name": "Vellakoil"
                },
                {
                    "city_name": "Vellalapatti"
                },
                {
                    "city_name": "Vellalur"
                },
                {
                    "city_name": "Vellanur"
                },
                {
                    "city_name": "Vellimalai"
                },
                {
                    "city_name": "Vellore"
                },
                {
                    "city_name": "Vellottamparappu"
                },
                {
                    "city_name": "Velluru"
                },
                {
                    "city_name": "Vengampudur"
                },
                {
                    "city_name": "Vengathur"
                },
                {
                    "city_name": "Vengavasal"
                },
                {
                    "city_name": "Venghatur"
                },
                {
                    "city_name": "Venkarai"
                },
                {
                    "city_name": "Vennanthur"
                },
                {
                    "city_name": "Veppathur"
                },
                {
                    "city_name": "Verkilambi"
                },
                {
                    "city_name": "Vettaikaranpudur"
                },
                {
                    "city_name": "Vettavalam"
                },
                {
                    "city_name": "Vijayapuri"
                },
                {
                    "city_name": "Vikramasingapuram"
                },
                {
                    "city_name": "Vikravandi"
                },
                {
                    "city_name": "Vilangudi"
                },
                {
                    "city_name": "Vilankurichi"
                },
                {
                    "city_name": "Vilapakkam"
                },
                {
                    "city_name": "Vilathikulam"
                },
                {
                    "city_name": "Vilavur"
                },
                {
                    "city_name": "Villukuri"
                },
                {
                    "city_name": "Villupuram"
                },
                {
                    "city_name": "Viraganur"
                },
                {
                    "city_name": "Virakeralam"
                },
                {
                    "city_name": "Virakkalpudur"
                },
                {
                    "city_name": "Virapandi"
                },
                {
                    "city_name": "Virapandi Cantonment"
                },
                {
                    "city_name": "Virappanchatram"
                },
                {
                    "city_name": "Viravanallur"
                },
                {
                    "city_name": "Virudambattu"
                },
                {
                    "city_name": "Virudhachalam"
                },
                {
                    "city_name": "Virudhunagar"
                },
                {
                    "city_name": "Virupakshipuram"
                },
                {
                    "city_name": "Viswanatham"
                },
                {
                    "city_name": "Vriddhachalam"
                },
                {
                    "city_name": "Walajabad"
                },
                {
                    "city_name": "Walajapet"
                },
                {
                    "city_name": "Wellington"
                },
                {
                    "city_name": "Yercaud"
                },
                {
                    "city_name": "Zamin Uthukuli"
                }
            ]

            var telangana = [
                {
                    "city_name": "Achampet"
                },
                {
                    "city_name": "Adilabad"
                },
                {
                    "city_name": "Armoor"
                },
                {
                    "city_name": "Asifabad"
                },
                {
                    "city_name": "Badepally"
                },
                {
                    "city_name": "Banswada"
                },
                {
                    "city_name": "Bellampalli"
                },
                {
                    "city_name": "Bhadrachalam"
                },
                {
                    "city_name": "Bhainsa"
                },
                {
                    "city_name": "Bhongir"
                },
                {
                    "city_name": "Bhupalpally"
                },
                {
                    "city_name": "Bodhan"
                },
                {
                    "city_name": "Bollaram"
                },
                {
                    "city_name": "Devarkonda"
                },
                {
                    "city_name": "Farooqnagar"
                },
                {
                    "city_name": "Gadwal"
                },
                {
                    "city_name": "Gajwel"
                },
                {
                    "city_name": "Ghatkesar"
                },
                {
                    "city_name": "Hyderabad"
                },
                {
                    "city_name": "Jagtial"
                },
                {
                    "city_name": "Jangaon"
                },
                {
                    "city_name": "Kagaznagar"
                },
                {
                    "city_name": "Kalwakurthy"
                },
                {
                    "city_name": "Kamareddy"
                },
                {
                    "city_name": "Karimnagar"
                },
                {
                    "city_name": "Khammam"
                },
                {
                    "city_name": "Kodada"
                },
                {
                    "city_name": "Koratla"
                },
                {
                    "city_name": "Kottagudem"
                },
                {
                    "city_name": "Kyathampalle"
                },
                {
                    "city_name": "Madhira"
                },
                {
                    "city_name": "Mahabubabad"
                },
                {
                    "city_name": "Mahbubnagar"
                },
                {
                    "city_name": "Mancherial"
                },
                {
                    "city_name": "Mandamarri"
                },
                {
                    "city_name": "Manuguru"
                },
                {
                    "city_name": "Medak"
                },
                {
                    "city_name": "Medchal"
                },
                {
                    "city_name": "Miryalaguda"
                },
                {
                    "city_name": "Nagar Karnul"
                },
                {
                    "city_name": "Nakrekal"
                },
                {
                    "city_name": "Nalgonda"
                },
                {
                    "city_name": "Narayanpet"
                },
                {
                    "city_name": "Narsampet"
                },
                {
                    "city_name": "Nirmal"
                },
                {
                    "city_name": "Nizamabad"
                },
                {
                    "city_name": "Palwancha"
                },
                {
                    "city_name": "Peddapalli"
                },
                {
                    "city_name": "Ramagundam"
                },
                {
                    "city_name": "Ranga Reddy district"
                },
                {
                    "city_name": "Sadasivpet"
                },
                {
                    "city_name": "Sangareddy"
                },
                {
                    "city_name": "Sarapaka"
                },
                {
                    "city_name": "Sathupalle"
                },
                {
                    "city_name": "Secunderabad"
                },
                {
                    "city_name": "Siddipet"
                },
                {
                    "city_name": "Singapur"
                },
                {
                    "city_name": "Sircilla"
                },
                {
                    "city_name": "Suryapet"
                },
                {
                    "city_name": "Tandur"
                },
                {
                    "city_name": "Vemulawada"
                },
                {
                    "city_name": "Vikarabad"
                },
                {
                    "city_name": "Wanaparthy"
                },
                {
                    "city_name": "Warangal"
                },
                {
                    "city_name": "Yellandu"
                },
                {
                    "city_name": "Zahirabad"
                }
            ]

            var tripura = [
                {
                    "city_name": "Agartala"
                },
                {
                    "city_name": "Amarpur"
                },
                {
                    "city_name": "Ambassa"
                },
                {
                    "city_name": "Badharghat"
                },
                {
                    "city_name": "Belonia"
                },
                {
                    "city_name": "Dharmanagar"
                },
                {
                    "city_name": "Gakulnagar"
                },
                {
                    "city_name": "Gandhigram"
                },
                {
                    "city_name": "Indranagar"
                },
                {
                    "city_name": "Jogendranagar"
                },
                {
                    "city_name": "Kailasahar"
                },
                {
                    "city_name": "Kamalpur"
                },
                {
                    "city_name": "Kanchanpur"
                },
                {
                    "city_name": "Khowai"
                },
                {
                    "city_name": "Kumarghat"
                },
                {
                    "city_name": "Kunjaban"
                },
                {
                    "city_name": "Narsingarh"
                },
                {
                    "city_name": "Pratapgarh"
                },
                {
                    "city_name": "Ranir Bazar"
                },
                {
                    "city_name": "Sabrum"
                },
                {
                    "city_name": "Sonamura"
                },
                {
                    "city_name": "Teliamura"
                },
                {
                    "city_name": "Udaipur"
                }
            ]

            var uttar = [
                {
                    "city_name": "Achhalda"
                },
                {
                    "city_name": "Achhnera"
                },
                {
                    "city_name": "Adari"
                },
                {
                    "city_name": "Afzalgarh"
                },
                {
                    "city_name": "Agarwal Mandi"
                },
                {
                    "city_name": "Agra"
                },
                {
                    "city_name": "Agra Cantonment"
                },
                {
                    "city_name": "Ahraura"
                },
                {
                    "city_name": "Ailum"
                },
                {
                    "city_name": "Air Force Area"
                },
                {
                    "city_name": "Ajhuwa"
                },
                {
                    "city_name": "Akbarpur"
                },
                {
                    "city_name": "Alapur"
                },
                {
                    "city_name": "Aliganj"
                },
                {
                    "city_name": "Aligarh"
                },
                {
                    "city_name": "Allahabad"
                },
                {
                    "city_name": "Allahabad Cantonment"
                },
                {
                    "city_name": "Allahganj"
                },
                {
                    "city_name": "Amanpur"
                },
                {
                    "city_name": "Ambahta"
                },
                {
                    "city_name": "Amethi"
                },
                {
                    "city_name": "Amila"
                },
                {
                    "city_name": "Amilo"
                },
                {
                    "city_name": "Aminagar Sarai"
                },
                {
                    "city_name": "Aminagar Urf Bhurbaral"
                },
                {
                    "city_name": "Amraudha"
                },
                {
                    "city_name": "Amroha"
                },
                {
                    "city_name": "Anandnagar"
                },
                {
                    "city_name": "Anpara"
                },
                {
                    "city_name": "Antu"
                },
                {
                    "city_name": "Anupshahr"
                },
                {
                    "city_name": "Aonla"
                },
                {
                    "city_name": "Armapur Estate"
                },
                {
                    "city_name": "Ashokpuram"
                },
                {
                    "city_name": "Ashrafpur Kichhauchha"
                },
                {
                    "city_name": "Atarra"
                },
                {
                    "city_name": "Atasu"
                },
                {
                    "city_name": "Atrauli"
                },
                {
                    "city_name": "Atraulia"
                },
                {
                    "city_name": "Auraiya"
                },
                {
                    "city_name": "Aurangabad"
                },
                {
                    "city_name": "Aurangabad Bangar"
                },
                {
                    "city_name": "Auras"
                },
                {
                    "city_name": "Awagarh"
                },
                {
                    "city_name": "Ayodhya"
                },
                {
                    "city_name": "Azamgarh"
                },
                {
                    "city_name": "Azizpur"
                },
                {
                    "city_name": "Azmatgarh"
                },
                {
                    "city_name": "Babarpur Ajitmal"
                },
                {
                    "city_name": "Baberu"
                },
                {
                    "city_name": "Babina"
                },
                {
                    "city_name": "Babrala"
                },
                {
                    "city_name": "Babugarh"
                },
                {
                    "city_name": "Bachhiowan"
                },
                {
                    "city_name": "Bachhraon"
                },
                {
                    "city_name": "Bad"
                },
                {
                    "city_name": "Badaun"
                },
                {
                    "city_name": "Baghpat"
                },
                {
                    "city_name": "Bah"
                },
                {
                    "city_name": "Bahadurganj"
                },
                {
                    "city_name": "Baheri"
                },
                {
                    "city_name": "Bahjoi"
                },
                {
                    "city_name": "Bahraich"
                },
                {
                    "city_name": "Bahsuma"
                },
                {
                    "city_name": "Bahua"
                },
                {
                    "city_name": "Bajna"
                },
                {
                    "city_name": "Bakewar"
                },
                {
                    "city_name": "Bakiabad"
                },
                {
                    "city_name": "Baldeo"
                },
                {
                    "city_name": "Ballia"
                },
                {
                    "city_name": "Balrampur"
                },
                {
                    "city_name": "Banat"
                },
                {
                    "city_name": "Banda"
                },
                {
                    "city_name": "Bangarmau"
                },
                {
                    "city_name": "Banki"
                },
                {
                    "city_name": "Bansdih"
                },
                {
                    "city_name": "Bansgaon"
                },
                {
                    "city_name": "Bansi"
                },
                {
                    "city_name": "Barabanki"
                },
                {
                    "city_name": "Baragaon"
                },
                {
                    "city_name": "Baraut"
                },
                {
                    "city_name": "Bareilly"
                },
                {
                    "city_name": "Bareilly Cantonment"
                },
                {
                    "city_name": "Barhalganj"
                },
                {
                    "city_name": "Barhani"
                },
                {
                    "city_name": "Barhapur"
                },
                {
                    "city_name": "Barkhera"
                },
                {
                    "city_name": "Barsana"
                },
                {
                    "city_name": "Barva Sagar"
                },
                {
                    "city_name": "Barwar"
                },
                {
                    "city_name": "Basti"
                },
                {
                    "city_name": "Begumabad Budhana"
                },
                {
                    "city_name": "Behat"
                },
                {
                    "city_name": "Behta Hajipur"
                },
                {
                    "city_name": "Bela"
                },
                {
                    "city_name": "Belthara"
                },
                {
                    "city_name": "Beniganj"
                },
                {
                    "city_name": "Beswan"
                },
                {
                    "city_name": "Bewar"
                },
                {
                    "city_name": "Bhadarsa"
                },
                {
                    "city_name": "Bhadohi"
                },
                {
                    "city_name": "Bhagwantnagar"
                },
                {
                    "city_name": "Bharatganj"
                },
                {
                    "city_name": "Bhargain"
                },
                {
                    "city_name": "Bharthana"
                },
                {
                    "city_name": "Bharuhana"
                },
                {
                    "city_name": "Bharwari"
                },
                {
                    "city_name": "Bhatni Bazar"
                },
                {
                    "city_name": "Bhatpar Rani"
                },
                {
                    "city_name": "Bhawan Bahadurnagar"
                },
                {
                    "city_name": "Bhinga"
                },
                {
                    "city_name": "Bhojpur Dharampur"
                },
                {
                    "city_name": "Bhokarhedi"
                },
                {
                    "city_name": "Bhongaon"
                },
                {
                    "city_name": "Bhulepur"
                },
                {
                    "city_name": "Bidhuna"
                },
                {
                    "city_name": "Bighapur"
                },
                {
                    "city_name": "Bijnor"
                },
                {
                    "city_name": "Bijpur"
                },
                {
                    "city_name": "Bikapur"
                },
                {
                    "city_name": "Bilari"
                },
                {
                    "city_name": "Bilaspur"
                },
                {
                    "city_name": "Bilgram"
                },
                {
                    "city_name": "Bilhaur"
                },
                {
                    "city_name": "Bilram"
                },
                {
                    "city_name": "Bilrayaganj"
                },
                {
                    "city_name": "Bilsanda"
                },
                {
                    "city_name": "Bilsi"
                },
                {
                    "city_name": "Bindki"
                },
                {
                    "city_name": "Bisalpur"
                },
                {
                    "city_name": "Bisanda Buzurg"
                },
                {
                    "city_name": "Bisauli"
                },
                {
                    "city_name": "Bisharatganj"
                },
                {
                    "city_name": "Bisokhar"
                },
                {
                    "city_name": "Biswan"
                },
                {
                    "city_name": "Bithur"
                },
                {
                    "city_name": "Budaun"
                },
                {
                    "city_name": "Bugrasi"
                },
                {
                    "city_name": "Bulandshahar"
                },
                {
                    "city_name": "Burhana"
                },
                {
                    "city_name": "Chail"
                },
                {
                    "city_name": "Chak Imam Ali"
                },
                {
                    "city_name": "Chakeri"
                },
                {
                    "city_name": "Chakia"
                },
                {
                    "city_name": "Chandauli"
                },
                {
                    "city_name": "Chandausi"
                },
                {
                    "city_name": "Chandpur"
                },
                {
                    "city_name": "Charkhari"
                },
                {
                    "city_name": "Charthawal"
                },
                {
                    "city_name": "Chaumuhan"
                },
                {
                    "city_name": "Chhaprauli"
                },
                {
                    "city_name": "Chhara Rafatpur"
                },
                {
                    "city_name": "Chharprauli"
                },
                {
                    "city_name": "Chhata"
                },
                {
                    "city_name": "Chhatari"
                },
                {
                    "city_name": "Chhibramau"
                },
                {
                    "city_name": "Chhutmalpur"
                },
                {
                    "city_name": "Chilkana Sultanpur"
                },
                {
                    "city_name": "Chirgaon"
                },
                {
                    "city_name": "Chit Baragaon"
                },
                {
                    "city_name": "Chitrakut Dham"
                },
                {
                    "city_name": "Chopan"
                },
                {
                    "city_name": "Choubepur Kalan"
                },
                {
                    "city_name": "Chunar"
                },
                {
                    "city_name": "Churk Ghurma"
                },
                {
                    "city_name": "Colonelganj"
                },
                {
                    "city_name": "Dadri"
                },
                {
                    "city_name": "Dalmau"
                },
                {
                    "city_name": "Dankaur"
                },
                {
                    "city_name": "Dariyabad"
                },
                {
                    "city_name": "Dasna"
                },
                {
                    "city_name": "Dataganj"
                },
                {
                    "city_name": "Daurala"
                },
                {
                    "city_name": "Dayal Bagh"
                },
                {
                    "city_name": "Deoband"
                },
                {
                    "city_name": "Deoranian"
                },
                {
                    "city_name": "Deoria"
                },
                {
                    "city_name": "Dewa"
                },
                {
                    "city_name": "Dhampur"
                },
                {
                    "city_name": "Dhanauha"
                },
                {
                    "city_name": "Dhanauli"
                },
                {
                    "city_name": "Dhanaura"
                },
                {
                    "city_name": "Dharoti Khurd"
                },
                {
                    "city_name": "Dhauratanda"
                },
                {
                    "city_name": "Dhaurhra"
                },
                {
                    "city_name": "Dibai"
                },
                {
                    "city_name": "Dibiyapur"
                },
                {
                    "city_name": "Dildarnagar Fatehpur"
                },
                {
                    "city_name": "Do Ghat"
                },
                {
                    "city_name": "Dohrighat"
                },
                {
                    "city_name": "Dostpur"
                },
                {
                    "city_name": "Dudhinagar"
                },
                {
                    "city_name": "Dulhipur"
                },
                {
                    "city_name": "Dundwaraganj"
                },
                {
                    "city_name": "Ekdil"
                },
                {
                    "city_name": "Erich"
                },
                {
                    "city_name": "Etah"
                },
                {
                    "city_name": "Etawah"
                },
                {
                    "city_name": "Faizabad"
                },
                {
                    "city_name": "Faizabad Cantonment"
                },
                {
                    "city_name": "Faizganj"
                },
                {
                    "city_name": "Farah"
                },
                {
                    "city_name": "Faridnagar"
                },
                {
                    "city_name": "Faridpur"
                },
                {
                    "city_name": "Faridpur Cantonment"
                },
                {
                    "city_name": "Fariha"
                },
                {
                    "city_name": "Farrukhabad"
                },
                {
                    "city_name": "Fatehabad"
                },
                {
                    "city_name": "Fatehganj Pashchimi"
                },
                {
                    "city_name": "Fatehganj Purvi"
                },
                {
                    "city_name": "Fatehgarh"
                },
                {
                    "city_name": "Fatehpur"
                },
                {
                    "city_name": "Fatehpur Chaurasi"
                },
                {
                    "city_name": "Fatehpur Sikri"
                },
                {
                    "city_name": "Firozabad"
                },
                {
                    "city_name": "Gajraula"
                },
                {
                    "city_name": "Ganga Ghat"
                },
                {
                    "city_name": "Gangapur"
                },
                {
                    "city_name": "Gangoh"
                },
                {
                    "city_name": "Ganj Muradabad"
                },
                {
                    "city_name": "Garautha"
                },
                {
                    "city_name": "Garhi Pukhta"
                },
                {
                    "city_name": "Garhmukteshwar"
                },
                {
                    "city_name": "Gaura Barahaj"
                },
                {
                    "city_name": "Gauri Bazar"
                },
                {
                    "city_name": "Gausganj"
                },
                {
                    "city_name": "Gawan"
                },
                {
                    "city_name": "Ghatampur"
                },
                {
                    "city_name": "Ghaziabad"
                },
                {
                    "city_name": "Ghazipur"
                },
                {
                    "city_name": "Ghiror"
                },
                {
                    "city_name": "Ghorawal"
                },
                {
                    "city_name": "Ghosi"
                },
                {
                    "city_name": "Ghosia Bazar"
                },
                {
                    "city_name": "Ghughuli"
                },
                {
                    "city_name": "Gohand"
                },
                {
                    "city_name": "Gokul"
                },
                {
                    "city_name": "Gola Bazar"
                },
                {
                    "city_name": "Gola Gokarannath"
                },
                {
                    "city_name": "Gonda"
                },
                {
                    "city_name": "Gopamau"
                },
                {
                    "city_name": "Gopiganj"
                },
                {
                    "city_name": "Gorakhpur"
                },
                {
                    "city_name": "Gosainganj"
                },
                {
                    "city_name": "Govardhan"
                },
                {
                    "city_name": "Greater Noida"
                },
                {
                    "city_name": "Gulaothi"
                },
                {
                    "city_name": "Gulariya"
                },
                {
                    "city_name": "Gulariya Bhindara"
                },
                {
                    "city_name": "Gunnaur"
                },
                {
                    "city_name": "Gursahaiganj"
                },
                {
                    "city_name": "Gursarai"
                },
                {
                    "city_name": "Gyanpur"
                },
                {
                    "city_name": "Hafizpur"
                },
                {
                    "city_name": "Haidergarh"
                },
                {
                    "city_name": "Haldaur"
                },
                {
                    "city_name": "Hamirpur"
                },
                {
                    "city_name": "Handia"
                },
                {
                    "city_name": "Hapur"
                },
                {
                    "city_name": "Hardoi"
                },
                {
                    "city_name": "Harduaganj"
                },
                {
                    "city_name": "Hargaon"
                },
                {
                    "city_name": "Hariharpur"
                },
                {
                    "city_name": "Harraiya"
                },
                {
                    "city_name": "Hasanpur"
                },
                {
                    "city_name": "Hasayan"
                },
                {
                    "city_name": "Hastinapur"
                },
                {
                    "city_name": "Hata"
                },
                {
                    "city_name": "Hathras"
                },
                {
                    "city_name": "Hyderabad"
                },
                {
                    "city_name": "Ibrahimpur"
                },
                {
                    "city_name": "Iglas"
                },
                {
                    "city_name": "Ikauna"
                },
                {
                    "city_name": "Iltifatganj Bazar"
                },
                {
                    "city_name": "Indian Telephone Industry Mank"
                },
                {
                    "city_name": "Islamnagar"
                },
                {
                    "city_name": "Itaunja"
                },
                {
                    "city_name": "Itimadpur"
                },
                {
                    "city_name": "Jagner"
                },
                {
                    "city_name": "Jahanabad"
                },
                {
                    "city_name": "Jahangirabad"
                },
                {
                    "city_name": "Jahangirpur"
                },
                {
                    "city_name": "Jais"
                },
                {
                    "city_name": "Jaithara"
                },
                {
                    "city_name": "Jalalabad"
                },
                {
                    "city_name": "Jalali"
                },
                {
                    "city_name": "Jalalpur"
                },
                {
                    "city_name": "Jalaun"
                },
                {
                    "city_name": "Jalesar"
                },
                {
                    "city_name": "Jamshila"
                },
                {
                    "city_name": "Jangipur"
                },
                {
                    "city_name": "Jansath"
                },
                {
                    "city_name": "Jarwal"
                },
                {
                    "city_name": "Jasrana"
                },
                {
                    "city_name": "Jaswantnagar"
                },
                {
                    "city_name": "Jatari"
                },
                {
                    "city_name": "Jaunpur"
                },
                {
                    "city_name": "Jewar"
                },
                {
                    "city_name": "Jhalu"
                },
                {
                    "city_name": "Jhansi"
                },
                {
                    "city_name": "Jhansi Cantonment"
                },
                {
                    "city_name": "Jhansi Railway Settlement"
                },
                {
                    "city_name": "Jhinjhak"
                },
                {
                    "city_name": "Jhinjhana"
                },
                {
                    "city_name": "Jhusi"
                },
                {
                    "city_name": "Jhusi Kohna"
                },
                {
                    "city_name": "Jiyanpur"
                },
                {
                    "city_name": "Joya"
                },
                {
                    "city_name": "Jyoti Khuria"
                },
                {
                    "city_name": "Jyotiba Phule Nagar"
                },
                {
                    "city_name": "Kabrai"
                },
                {
                    "city_name": "Kachhauna Patseni"
                },
                {
                    "city_name": "Kachhla"
                },
                {
                    "city_name": "Kachhwa"
                },
                {
                    "city_name": "Kadaura"
                },
                {
                    "city_name": "Kadipur"
                },
                {
                    "city_name": "Kailashpur"
                },
                {
                    "city_name": "Kaimganj"
                },
                {
                    "city_name": "Kairana"
                },
                {
                    "city_name": "Kakgaina"
                },
                {
                    "city_name": "Kakod"
                },
                {
                    "city_name": "Kakori"
                },
                {
                    "city_name": "Kakrala"
                },
                {
                    "city_name": "Kalinagar"
                },
                {
                    "city_name": "Kalpi"
                },
                {
                    "city_name": "Kamalganj"
                },
                {
                    "city_name": "Kampil"
                },
                {
                    "city_name": "Kandhla"
                },
                {
                    "city_name": "Kandwa"
                },
                {
                    "city_name": "Kannauj"
                },
                {
                    "city_name": "Kanpur"
                },
                {
                    "city_name": "Kant"
                },
                {
                    "city_name": "Kanth"
                },
                {
                    "city_name": "Kaptanganj"
                },
                {
                    "city_name": "Karaon"
                },
                {
                    "city_name": "Karari"
                },
                {
                    "city_name": "Karhal"
                },
                {
                    "city_name": "Karnawal"
                },
                {
                    "city_name": "Kasganj"
                },
                {
                    "city_name": "Katariya"
                },
                {
                    "city_name": "Katghar Lalganj"
                },
                {
                    "city_name": "Kathera"
                },
                {
                    "city_name": "Katra"
                },
                {
                    "city_name": "Katra Medniganj"
                },
                {
                    "city_name": "Kauriaganj"
                },
                {
                    "city_name": "Kemri"
                },
                {
                    "city_name": "Kerakat"
                },
                {
                    "city_name": "Khadda"
                },
                {
                    "city_name": "Khaga"
                },
                {
                    "city_name": "Khailar"
                },
                {
                    "city_name": "Khair"
                },
                {
                    "city_name": "Khairabad"
                },
                {
                    "city_name": "Khairagarh"
                },
                {
                    "city_name": "Khalilabad"
                },
                {
                    "city_name": "Khamaria"
                },
                {
                    "city_name": "Khanpur"
                },
                {
                    "city_name": "Kharela"
                },
                {
                    "city_name": "Khargupur"
                },
                {
                    "city_name": "Khariya"
                },
                {
                    "city_name": "Kharkhoda"
                },
                {
                    "city_name": "Khatauli"
                },
                {
                    "city_name": "Khatauli Rural"
                },
                {
                    "city_name": "Khekra"
                },
                {
                    "city_name": "Kheri"
                },
                {
                    "city_name": "Kheta Sarai"
                },
                {
                    "city_name": "Khudaganj"
                },
                {
                    "city_name": "Khurja"
                },
                {
                    "city_name": "Khutar"
                },
                {
                    "city_name": "Kiraoli"
                },
                {
                    "city_name": "Kiratpur"
                },
                {
                    "city_name": "Kishanpur"
                },
                {
                    "city_name": "Kishni"
                },
                {
                    "city_name": "Kithaur"
                },
                {
                    "city_name": "Koiripur"
                },
                {
                    "city_name": "Konch"
                },
                {
                    "city_name": "Kopaganj"
                },
                {
                    "city_name": "Kora Jahanabad"
                },
                {
                    "city_name": "Korwa"
                },
                {
                    "city_name": "Kosi Kalan"
                },
                {
                    "city_name": "Kota"
                },
                {
                    "city_name": "Kotra"
                },
                {
                    "city_name": "Kotwa"
                },
                {
                    "city_name": "Kulpahar"
                },
                {
                    "city_name": "Kunda"
                },
                {
                    "city_name": "Kundarki"
                },
                {
                    "city_name": "Kunwargaon"
                },
                {
                    "city_name": "Kurara"
                },
                {
                    "city_name": "Kurawali"
                },
                {
                    "city_name": "Kursath"
                },
                {
                    "city_name": "Kurthi Jafarpur"
                },
                {
                    "city_name": "Kushinagar"
                },
                {
                    "city_name": "Kusmara"
                },
                {
                    "city_name": "Laharpur"
                },
                {
                    "city_name": "Lakhimpur"
                },
                {
                    "city_name": "Lakhna"
                },
                {
                    "city_name": "Lalganj"
                },
                {
                    "city_name": "Lalitpur"
                },
                {
                    "city_name": "Lar"
                },
                {
                    "city_name": "Lawar"
                },
                {
                    "city_name": "Ledwa Mahuwa"
                },
                {
                    "city_name": "Lohta"
                },
                {
                    "city_name": "Loni"
                },
                {
                    "city_name": "Lucknow"
                },
                {
                    "city_name": "Machhlishahr"
                },
                {
                    "city_name": "Madhoganj"
                },
                {
                    "city_name": "Madhogarh"
                },
                {
                    "city_name": "Maghar"
                },
                {
                    "city_name": "Mahaban"
                },
                {
                    "city_name": "Maharajganj"
                },
                {
                    "city_name": "Mahmudabad"
                },
                {
                    "city_name": "Mahoba"
                },
                {
                    "city_name": "Maholi"
                },
                {
                    "city_name": "Mahona"
                },
                {
                    "city_name": "Mahroni"
                },
                {
                    "city_name": "Mailani"
                },
                {
                    "city_name": "Mainpuri"
                },
                {
                    "city_name": "Majhara Pipar Ehatmali"
                },
                {
                    "city_name": "Majhauli Raj"
                },
                {
                    "city_name": "Malihabad"
                },
                {
                    "city_name": "Mallanwam"
                },
                {
                    "city_name": "Mandawar"
                },
                {
                    "city_name": "Manikpur"
                },
                {
                    "city_name": "Maniyar"
                },
                {
                    "city_name": "Manjhanpur"
                },
                {
                    "city_name": "Mankapur"
                },
                {
                    "city_name": "Marehra"
                },
                {
                    "city_name": "Mariahu"
                },
                {
                    "city_name": "Maruadih"
                },
                {
                    "city_name": "Maswasi"
                },
                {
                    "city_name": "Mataundh"
                },
                {
                    "city_name": "Mathu"
                },
                {
                    "city_name": "Mathura"
                },
                {
                    "city_name": "Mathura Cantonment"
                },
                {
                    "city_name": "Mau"
                },
                {
                    "city_name": "Mau Aima"
                },
                {
                    "city_name": "Maudaha"
                },
                {
                    "city_name": "Mauranipur"
                },
                {
                    "city_name": "Maurawan"
                },
                {
                    "city_name": "Mawana"
                },
                {
                    "city_name": "Meerut"
                },
                {
                    "city_name": "Mehnagar"
                },
                {
                    "city_name": "Mehndawal"
                },
                {
                    "city_name": "Mendu"
                },
                {
                    "city_name": "Milak"
                },
                {
                    "city_name": "Miranpur"
                },
                {
                    "city_name": "Mirat"
                },
                {
                    "city_name": "Mirat Cantonment"
                },
                {
                    "city_name": "Mirganj"
                },
                {
                    "city_name": "Mirzapur"
                },
                {
                    "city_name": "Misrikh"
                },
                {
                    "city_name": "Modinagar"
                },
                {
                    "city_name": "Mogra Badshahpur"
                },
                {
                    "city_name": "Mohan"
                },
                {
                    "city_name": "Mohanpur"
                },
                {
                    "city_name": "Mohiuddinpur"
                },
                {
                    "city_name": "Moradabad"
                },
                {
                    "city_name": "Moth"
                },
                {
                    "city_name": "Mubarakpur"
                },
                {
                    "city_name": "Mughal Sarai"
                },
                {
                    "city_name": "Mughal Sarai Railway Settlemen"
                },
                {
                    "city_name": "Muhammadabad"
                },
                {
                    "city_name": "Muhammadi"
                },
                {
                    "city_name": "Mukrampur Khema"
                },
                {
                    "city_name": "Mundia"
                },
                {
                    "city_name": "Mundora"
                },
                {
                    "city_name": "Muradnagar"
                },
                {
                    "city_name": "Mursan"
                },
                {
                    "city_name": "Musafirkhana"
                },
                {
                    "city_name": "Muzaffarnagar"
                },
                {
                    "city_name": "Nadigaon"
                },
                {
                    "city_name": "Nagina"
                },
                {
                    "city_name": "Nagram"
                },
                {
                    "city_name": "Nai Bazar"
                },
                {
                    "city_name": "Nainana Jat"
                },
                {
                    "city_name": "Najibabad"
                },
                {
                    "city_name": "Nakur"
                },
                {
                    "city_name": "Nanaunta"
                },
                {
                    "city_name": "Nandgaon"
                },
                {
                    "city_name": "Nanpara"
                },
                {
                    "city_name": "Naraini"
                },
                {
                    "city_name": "Narauli"
                },
                {
                    "city_name": "Naraura"
                },
                {
                    "city_name": "Naugawan Sadat"
                },
                {
                    "city_name": "Nautanwa"
                },
                {
                    "city_name": "Nawabganj"
                },
                {
                    "city_name": "Nichlaul"
                },
                {
                    "city_name": "Nidhauli Kalan"
                },
                {
                    "city_name": "Nihtaur"
                },
                {
                    "city_name": "Nindaura"
                },
                {
                    "city_name": "Niwari"
                },
                {
                    "city_name": "Nizamabad"
                },
                {
                    "city_name": "Noida"
                },
                {
                    "city_name": "Northern Railway Colony"
                },
                {
                    "city_name": "Nurpur"
                },
                {
                    "city_name": "Nyoria Husenpur"
                },
                {
                    "city_name": "Nyotini"
                },
                {
                    "city_name": "Obra"
                },
                {
                    "city_name": "Oel Dhakwa"
                },
                {
                    "city_name": "Orai"
                },
                {
                    "city_name": "Oran"
                },
                {
                    "city_name": "Ordinance Factory Muradnagar"
                },
                {
                    "city_name": "Pachperwa"
                },
                {
                    "city_name": "Padrauna"
                },
                {
                    "city_name": "Pahasu"
                },
                {
                    "city_name": "Paintepur"
                },
                {
                    "city_name": "Pali"
                },
                {
                    "city_name": "Palia Kalan"
                },
                {
                    "city_name": "Parasi"
                },
                {
                    "city_name": "Parichha"
                },
                {
                    "city_name": "Parichhatgarh"
                },
                {
                    "city_name": "Parsadepur"
                },
                {
                    "city_name": "Patala"
                },
                {
                    "city_name": "Patiyali"
                },
                {
                    "city_name": "Patti"
                },
                {
                    "city_name": "Pawayan"
                },
                {
                    "city_name": "Phalauda"
                },
                {
                    "city_name": "Phaphund"
                },
                {
                    "city_name": "Phulpur"
                },
                {
                    "city_name": "Phulwaria"
                },
                {
                    "city_name": "Pihani"
                },
                {
                    "city_name": "Pilibhit"
                },
                {
                    "city_name": "Pilkana"
                },
                {
                    "city_name": "Pilkhuwa"
                },
                {
                    "city_name": "Pinahat"
                },
                {
                    "city_name": "Pipalsana Chaudhari"
                },
                {
                    "city_name": "Pipiganj"
                },
                {
                    "city_name": "Pipraich"
                },
                {
                    "city_name": "Pipri"
                },
                {
                    "city_name": "Pratapgarh"
                },
                {
                    "city_name": "Pukhrayan"
                },
                {
                    "city_name": "Puranpur"
                },
                {
                    "city_name": "Purdil Nagar"
                },
                {
                    "city_name": "Purqazi"
                },
                {
                    "city_name": "Purwa"
                },
                {
                    "city_name": "Qasimpur"
                },
                {
                    "city_name": "Rabupura"
                },
                {
                    "city_name": "Radha Kund"
                },
                {
                    "city_name": "Rae Bareilly"
                },
                {
                    "city_name": "Raja Ka Rampur"
                },
                {
                    "city_name": "Rajapur"
                },
                {
                    "city_name": "Ramkola"
                },
                {
                    "city_name": "Ramnagar"
                },
                {
                    "city_name": "Rampur"
                },
                {
                    "city_name": "Rampur Bhawanipur"
                },
                {
                    "city_name": "Rampur Karkhana"
                },
                {
                    "city_name": "Rampur Maniharan"
                },
                {
                    "city_name": "Rampura"
                },
                {
                    "city_name": "Ranipur"
                },
                {
                    "city_name": "Rashidpur Garhi"
                },
                {
                    "city_name": "Rasra"
                },
                {
                    "city_name": "Rasulabad"
                },
                {
                    "city_name": "Rath"
                },
                {
                    "city_name": "Raya"
                },
                {
                    "city_name": "Renukut"
                },
                {
                    "city_name": "Reoti"
                },
                {
                    "city_name": "Richha"
                },
                {
                    "city_name": "Risia Bazar"
                },
                {
                    "city_name": "Rithora"
                },
                {
                    "city_name": "Robertsganj"
                },
                {
                    "city_name": "Roza"
                },
                {
                    "city_name": "Rudarpur"
                },
                {
                    "city_name": "Rudauli"
                },
                {
                    "city_name": "Rudayan"
                },
                {
                    "city_name": "Rura"
                },
                {
                    "city_name": "Rustamnagar Sahaspur"
                },
                {
                    "city_name": "Sabatwar"
                },
                {
                    "city_name": "Sadabad"
                },
                {
                    "city_name": "Sadat"
                },
                {
                    "city_name": "Safipur"
                },
                {
                    "city_name": "Sahanpur"
                },
                {
                    "city_name": "Saharanpur"
                },
                {
                    "city_name": "Sahaspur"
                },
                {
                    "city_name": "Sahaswan"
                },
                {
                    "city_name": "Sahawar"
                },
                {
                    "city_name": "Sahibabad"
                },
                {
                    "city_name": "Sahjanwa"
                },
                {
                    "city_name": "Sahpau"
                },
                {
                    "city_name": "Saidpur"
                },
                {
                    "city_name": "Sainthal"
                },
                {
                    "city_name": "Saiyadraja"
                },
                {
                    "city_name": "Sakhanu"
                },
                {
                    "city_name": "Sakit"
                },
                {
                    "city_name": "Salarpur Khadar"
                },
                {
                    "city_name": "Salimpur"
                },
                {
                    "city_name": "Salon"
                },
                {
                    "city_name": "Sambhal"
                },
                {
                    "city_name": "Sambhawali"
                },
                {
                    "city_name": "Samdhan"
                },
                {
                    "city_name": "Samthar"
                },
                {
                    "city_name": "Sandi"
                },
                {
                    "city_name": "Sandila"
                },
                {
                    "city_name": "Sarai akil"
                },
                {
                    "city_name": "Sarai Mir"
                },
                {
                    "city_name": "Sarauli"
                },
                {
                    "city_name": "Sardhana"
                },
                {
                    "city_name": "Sarila"
                },
                {
                    "city_name": "Sarsawan"
                },
                {
                    "city_name": "Sasni"
                },
                {
                    "city_name": "Satrikh"
                },
                {
                    "city_name": "Saunkh"
                },
                {
                    "city_name": "Saurikh"
                },
                {
                    "city_name": "Seohara"
                },
                {
                    "city_name": "Sewal Khas"
                },
                {
                    "city_name": "Sewarhi"
                },
                {
                    "city_name": "Shahabad"
                },
                {
                    "city_name": "Shahganj"
                },
                {
                    "city_name": "Shahi"
                },
                {
                    "city_name": "Shahjahanpur"
                },
                {
                    "city_name": "Shahjahanpur Cantonment"
                },
                {
                    "city_name": "Shahpur"
                },
                {
                    "city_name": "Shamli"
                },
                {
                    "city_name": "Shamsabad"
                },
                {
                    "city_name": "Shankargarh"
                },
                {
                    "city_name": "Shergarh"
                },
                {
                    "city_name": "Sherkot"
                },
                {
                    "city_name": "Shikarpur"
                },
                {
                    "city_name": "Shikohabad"
                },
                {
                    "city_name": "Shisgarh"
                },
                {
                    "city_name": "Shivdaspur"
                },
                {
                    "city_name": "Shivli"
                },
                {
                    "city_name": "Shivrajpur"
                },
                {
                    "city_name": "Shohratgarh"
                },
                {
                    "city_name": "Siddhanur"
                },
                {
                    "city_name": "Siddharthnagar"
                },
                {
                    "city_name": "Sidhauli"
                },
                {
                    "city_name": "Sidhpura"
                },
                {
                    "city_name": "Sikandarabad"
                },
                {
                    "city_name": "Sikandarpur"
                },
                {
                    "city_name": "Sikandra"
                },
                {
                    "city_name": "Sikandra Rao"
                },
                {
                    "city_name": "Singahi Bhiraura"
                },
                {
                    "city_name": "Sirathu"
                },
                {
                    "city_name": "Sirsa"
                },
                {
                    "city_name": "Sirsaganj"
                },
                {
                    "city_name": "Sirsi"
                },
                {
                    "city_name": "Sisauli"
                },
                {
                    "city_name": "Siswa Bazar"
                },
                {
                    "city_name": "Sitapur"
                },
                {
                    "city_name": "Siyana"
                },
                {
                    "city_name": "Som"
                },
                {
                    "city_name": "Sonbhadra"
                },
                {
                    "city_name": "Soron"
                },
                {
                    "city_name": "Suar"
                },
                {
                    "city_name": "Sukhmalpur Nizamabad"
                },
                {
                    "city_name": "Sultanpur"
                },
                {
                    "city_name": "Sumerpur"
                },
                {
                    "city_name": "Suriyawan"
                },
                {
                    "city_name": "Swamibagh"
                },
                {
                    "city_name": "Tajpur"
                },
                {
                    "city_name": "Talbahat"
                },
                {
                    "city_name": "Talgram"
                },
                {
                    "city_name": "Tambaur"
                },
                {
                    "city_name": "Tanda"
                },
                {
                    "city_name": "Tatarpur Lallu"
                },
                {
                    "city_name": "Tetribazar"
                },
                {
                    "city_name": "Thakurdwara"
                },
                {
                    "city_name": "Thana Bhawan"
                },
                {
                    "city_name": "Thiriya Nizamat Khan"
                },
                {
                    "city_name": "Tikaitnagar"
                },
                {
                    "city_name": "Tikri"
                },
                {
                    "city_name": "Tilhar"
                },
                {
                    "city_name": "Tindwari"
                },
                {
                    "city_name": "Tirwaganj"
                },
                {
                    "city_name": "Titron"
                },
                {
                    "city_name": "Tori Fatehpur"
                },
                {
                    "city_name": "Tulsipur"
                },
                {
                    "city_name": "Tundla"
                },
                {
                    "city_name": "Tundla Kham"
                },
                {
                    "city_name": "Tundla Railway Colony"
                },
                {
                    "city_name": "Ugu"
                },
                {
                    "city_name": "Ujhani"
                },
                {
                    "city_name": "Ujhari"
                },
                {
                    "city_name": "Umri"
                },
                {
                    "city_name": "Umri Kalan"
                },
                {
                    "city_name": "Un"
                },
                {
                    "city_name": "Unchahar"
                },
                {
                    "city_name": "Unnao"
                },
                {
                    "city_name": "Usaihat"
                },
                {
                    "city_name": "Usawan"
                },
                {
                    "city_name": "Utraula"
                },
                {
                    "city_name": "Varanasi"
                },
                {
                    "city_name": "Varanasi Cantonment"
                },
                {
                    "city_name": "Vijaigarh"
                },
                {
                    "city_name": "Vrindavan"
                },
                {
                    "city_name": "Wazirganj"
                },
                {
                    "city_name": "Zafarabad"
                },
                {
                    "city_name": "Zaidpur"
                },
                {
                    "city_name": "Zamania"
                }
            ]

            var uttarakhand = [
                {
                    "city_name": "Almora"
                },
                {
                    "city_name": "Almora Cantonment"
                },
                {
                    "city_name": "Badrinathpuri"
                },
                {
                    "city_name": "Bageshwar"
                },
                {
                    "city_name": "Bah Bazar"
                },
                {
                    "city_name": "Banbasa"
                },
                {
                    "city_name": "Bandia"
                },
                {
                    "city_name": "Barkot"
                },
                {
                    "city_name": "Bazpur"
                },
                {
                    "city_name": "Bhim Tal"
                },
                {
                    "city_name": "Bhowali"
                },
                {
                    "city_name": "Chakrata"
                },
                {
                    "city_name": "Chamba"
                },
                {
                    "city_name": "Chamoli and Gopeshwar"
                },
                {
                    "city_name": "Champawat"
                },
                {
                    "city_name": "Clement Town"
                },
                {
                    "city_name": "Dehra Dun Cantonment"
                },
                {
                    "city_name": "Dehradun"
                },
                {
                    "city_name": "Dehrakhas"
                },
                {
                    "city_name": "Devaprayag"
                },
                {
                    "city_name": "Dhaluwala"
                },
                {
                    "city_name": "Dhandera"
                },
                {
                    "city_name": "Dharchula"
                },
                {
                    "city_name": "Dharchula Dehat"
                },
                {
                    "city_name": "Didihat"
                },
                {
                    "city_name": "Dineshpur"
                },
                {
                    "city_name": "Doiwala"
                },
                {
                    "city_name": "Dugadda"
                },
                {
                    "city_name": "Dwarahat"
                },
                {
                    "city_name": "Gadarpur"
                },
                {
                    "city_name": "Gangotri"
                },
                {
                    "city_name": "Gauchar"
                },
                {
                    "city_name": "Haldwani"
                },
                {
                    "city_name": "Haridwar"
                },
                {
                    "city_name": "Herbertpur"
                },
                {
                    "city_name": "Jaspur"
                },
                {
                    "city_name": "Jhabrera"
                },
                {
                    "city_name": "Joshimath"
                },
                {
                    "city_name": "Kachnal Gosain"
                },
                {
                    "city_name": "Kaladungi"
                },
                {
                    "city_name": "Kalagarh"
                },
                {
                    "city_name": "Karnaprayang"
                },
                {
                    "city_name": "Kashipur"
                },
                {
                    "city_name": "Kashirampur"
                },
                {
                    "city_name": "Kausani"
                },
                {
                    "city_name": "Kedarnath"
                },
                {
                    "city_name": "Kelakhera"
                },
                {
                    "city_name": "Khatima"
                },
                {
                    "city_name": "Kichha"
                },
                {
                    "city_name": "Kirtinagar"
                },
                {
                    "city_name": "Kotdwara"
                },
                {
                    "city_name": "Laksar"
                },
                {
                    "city_name": "Lalkuan"
                },
                {
                    "city_name": "Landaura"
                },
                {
                    "city_name": "Landhaura Cantonment"
                },
                {
                    "city_name": "Lensdaun"
                },
                {
                    "city_name": "Logahat"
                },
                {
                    "city_name": "Mahua Dabra Haripura"
                },
                {
                    "city_name": "Mahua Kheraganj"
                },
                {
                    "city_name": "Manglaur"
                },
                {
                    "city_name": "Masuri"
                },
                {
                    "city_name": "Mohanpur Mohammadpur"
                },
                {
                    "city_name": "Muni Ki Reti"
                },
                {
                    "city_name": "Nagla"
                },
                {
                    "city_name": "Nainital"
                },
                {
                    "city_name": "Nainital Cantonment"
                },
                {
                    "city_name": "Nandaprayang"
                },
                {
                    "city_name": "Narendranagar"
                },
                {
                    "city_name": "Pauri"
                },
                {
                    "city_name": "Pithoragarh"
                },
                {
                    "city_name": "Pratitnagar"
                },
                {
                    "city_name": "Raipur"
                },
                {
                    "city_name": "Raiwala"
                },
                {
                    "city_name": "Ramnagar"
                },
                {
                    "city_name": "Ranikhet"
                },
                {
                    "city_name": "Ranipur"
                },
                {
                    "city_name": "Rishikesh"
                },
                {
                    "city_name": "Rishikesh Cantonment"
                },
                {
                    "city_name": "Roorkee"
                },
                {
                    "city_name": "Rudraprayag"
                },
                {
                    "city_name": "Rudrapur"
                },
                {
                    "city_name": "Rurki"
                },
                {
                    "city_name": "Rurki Cantonment"
                },
                {
                    "city_name": "Shaktigarh"
                },
                {
                    "city_name": "Sitarganj"
                },
                {
                    "city_name": "Srinagar"
                },
                {
                    "city_name": "Sultanpur"
                },
                {
                    "city_name": "Tanakpur"
                },
                {
                    "city_name": "Tehri"
                },
                {
                    "city_name": "Udham Singh Nagar"
                },
                {
                    "city_name": "Uttarkashi"
                },
                {
                    "city_name": "Vikasnagar"
                },
                {
                    "city_name": "Virbhadra"
                }
            ]

            var bengal = [
                {
                    "city_name": "24 Parganas (n)"
                },
                {
                    "city_name": "24 Parganas (s)"
                },
                {
                    "city_name": "Adra"
                },
                {
                    "city_name": "Ahmadpur"
                },
                {
                    "city_name": "Aiho"
                },
                {
                    "city_name": "Aistala"
                },
                {
                    "city_name": "Alipur Duar"
                },
                {
                    "city_name": "Alipur Duar Railway Junction"
                },
                {
                    "city_name": "Alpur"
                },
                {
                    "city_name": "Amalhara"
                },
                {
                    "city_name": "Amkula"
                },
                {
                    "city_name": "Amlagora"
                },
                {
                    "city_name": "Amodghata"
                },
                {
                    "city_name": "Amtala"
                },
                {
                    "city_name": "Andul"
                },
                {
                    "city_name": "Anksa"
                },
                {
                    "city_name": "Ankurhati"
                },
                {
                    "city_name": "Anup Nagar"
                },
                {
                    "city_name": "Arambagh"
                },
                {
                    "city_name": "Argari"
                },
                {
                    "city_name": "Arsha"
                },
                {
                    "city_name": "Asansol"
                },
                {
                    "city_name": "Ashoknagar Kalyangarh"
                },
                {
                    "city_name": "Aurangabad"
                },
                {
                    "city_name": "Bablari Dewanganj"
                },
                {
                    "city_name": "Badhagachhi"
                },
                {
                    "city_name": "Baduria"
                },
                {
                    "city_name": "Baghdogra"
                },
                {
                    "city_name": "Bagnan"
                },
                {
                    "city_name": "Bagra"
                },
                {
                    "city_name": "Bagula"
                },
                {
                    "city_name": "Baharampur"
                },
                {
                    "city_name": "Bahirgram"
                },
                {
                    "city_name": "Bahula"
                },
                {
                    "city_name": "Baidyabati"
                },
                {
                    "city_name": "Bairatisal"
                },
                {
                    "city_name": "Baj Baj"
                },
                {
                    "city_name": "Bakreswar"
                },
                {
                    "city_name": "Balaram Pota"
                },
                {
                    "city_name": "Balarampur"
                },
                {
                    "city_name": "Bali Chak"
                },
                {
                    "city_name": "Ballavpur"
                },
                {
                    "city_name": "Bally"
                },
                {
                    "city_name": "Balurghat"
                },
                {
                    "city_name": "Bamunari"
                },
                {
                    "city_name": "Banarhat Tea Garden"
                },
                {
                    "city_name": "Bandel"
                },
                {
                    "city_name": "Bangaon"
                },
                {
                    "city_name": "Bankra"
                },
                {
                    "city_name": "Bankura"
                },
                {
                    "city_name": "Bansbaria"
                },
                {
                    "city_name": "Banshra"
                },
                {
                    "city_name": "Banupur"
                },
                {
                    "city_name": "Bara Bamonia"
                },
                {
                    "city_name": "Barakpur"
                },
                {
                    "city_name": "Barakpur Cantonment"
                },
                {
                    "city_name": "Baranagar"
                },
                {
                    "city_name": "Barasat"
                },
                {
                    "city_name": "Barddhaman"
                },
                {
                    "city_name": "Barijhati"
                },
                {
                    "city_name": "Barjora"
                },
                {
                    "city_name": "Barrackpore"
                },
                {
                    "city_name": "Baruihuda"
                },
                {
                    "city_name": "Baruipur"
                },
                {
                    "city_name": "Barunda"
                },
                {
                    "city_name": "Basirhat"
                },
                {
                    "city_name": "Baska"
                },
                {
                    "city_name": "Begampur"
                },
                {
                    "city_name": "Beldanga"
                },
                {
                    "city_name": "Beldubi"
                },
                {
                    "city_name": "Belebathan"
                },
                {
                    "city_name": "Beliator"
                },
                {
                    "city_name": "Bhadreswar"
                },
                {
                    "city_name": "Bhandardaha"
                },
                {
                    "city_name": "Bhangar Raghunathpur"
                },
                {
                    "city_name": "Bhangri Pratham Khanda"
                },
                {
                    "city_name": "Bhanowara"
                },
                {
                    "city_name": "Bhatpara"
                },
                {
                    "city_name": "Bholar Dabri"
                },
                {
                    "city_name": "Bidhannagar"
                },
                {
                    "city_name": "Bidyadharpur"
                },
                {
                    "city_name": "Biki Hakola"
                },
                {
                    "city_name": "Bilandapur"
                },
                {
                    "city_name": "Bilpahari"
                },
                {
                    "city_name": "Bipra Noapara"
                },
                {
                    "city_name": "Birlapur"
                },
                {
                    "city_name": "Birnagar"
                },
                {
                    "city_name": "Bisarpara"
                },
                {
                    "city_name": "Bishnupur"
                },
                {
                    "city_name": "Bolpur"
                },
                {
                    "city_name": "Bongaon"
                },
                {
                    "city_name": "Bowali"
                },
                {
                    "city_name": "Burdwan"
                },
                {
                    "city_name": "Canning"
                },
                {
                    "city_name": "Cart Road"
                },
                {
                    "city_name": "Chachanda"
                },
                {
                    "city_name": "Chak Bankola"
                },
                {
                    "city_name": "Chak Enayetnagar"
                },
                {
                    "city_name": "Chak Kashipur"
                },
                {
                    "city_name": "Chakalampur"
                },
                {
                    "city_name": "Chakbansberia"
                },
                {
                    "city_name": "Chakdaha"
                },
                {
                    "city_name": "Chakpara"
                },
                {
                    "city_name": "Champahati"
                },
                {
                    "city_name": "Champdani"
                },
                {
                    "city_name": "Chamrail"
                },
                {
                    "city_name": "Chandannagar"
                },
                {
                    "city_name": "Chandpur"
                },
                {
                    "city_name": "Chandrakona"
                },
                {
                    "city_name": "Chapari"
                },
                {
                    "city_name": "Chapui"
                },
                {
                    "city_name": "Char Brahmanagar"
                },
                {
                    "city_name": "Char Maijdia"
                },
                {
                    "city_name": "Charka"
                },
                {
                    "city_name": "Chata Kalikapur"
                },
                {
                    "city_name": "Chauhati"
                },
                {
                    "city_name": "Checha Khata"
                },
                {
                    "city_name": "Chelad"
                },
                {
                    "city_name": "Chhora"
                },
                {
                    "city_name": "Chikrand"
                },
                {
                    "city_name": "Chittaranjan"
                },
                {
                    "city_name": "Contai"
                },
                {
                    "city_name": "Cooch Behar"
                },
                {
                    "city_name": "Dainhat"
                },
                {
                    "city_name": "Dakshin Baguan"
                },
                {
                    "city_name": "Dakshin Jhapardaha"
                },
                {
                    "city_name": "Dakshin Rajyadharpur"
                },
                {
                    "city_name": "Dakshin Raypur"
                },
                {
                    "city_name": "Dalkola"
                },
                {
                    "city_name": "Dalurband"
                },
                {
                    "city_name": "Darap Pur"
                },
                {
                    "city_name": "Darjiling"
                },
                {
                    "city_name": "Daulatpur"
                },
                {
                    "city_name": "Debipur"
                },
                {
                    "city_name": "Defahat"
                },
                {
                    "city_name": "Deora"
                },
                {
                    "city_name": "Deulia"
                },
                {
                    "city_name": "Dhakuria"
                },
                {
                    "city_name": "Dhandadihi"
                },
                {
                    "city_name": "Dhanyakuria"
                },
                {
                    "city_name": "Dharmapur"
                },
                {
                    "city_name": "Dhatri Gram"
                },
                {
                    "city_name": "Dhuilya"
                },
                {
                    "city_name": "Dhulagari"
                },
                {
                    "city_name": "Dhulian"
                },
                {
                    "city_name": "Dhupgari"
                },
                {
                    "city_name": "Dhusaripara"
                },
                {
                    "city_name": "Diamond Harbour"
                },
                {
                    "city_name": "Digha"
                },
                {
                    "city_name": "Dignala"
                },
                {
                    "city_name": "Dinhata"
                },
                {
                    "city_name": "Dubrajpur"
                },
                {
                    "city_name": "Dumjor"
                },
                {
                    "city_name": "Durgapur"
                },
                {
                    "city_name": "Durllabhganj"
                },
                {
                    "city_name": "Egra"
                },
                {
                    "city_name": "Eksara"
                },
                {
                    "city_name": "Falakata"
                },
                {
                    "city_name": "Farakka"
                },
                {
                    "city_name": "Fatellapur"
                },
                {
                    "city_name": "Fort Gloster"
                },
                {
                    "city_name": "Gabberia"
                },
                {
                    "city_name": "Gadigachha"
                },
                {
                    "city_name": "Gairkata"
                },
                {
                    "city_name": "Gangarampur"
                },
                {
                    "city_name": "Garalgachha"
                },
                {
                    "city_name": "Garbeta Amlagora"
                },
                {
                    "city_name": "Garhbeta"
                },
                {
                    "city_name": "Garshyamnagar"
                },
                {
                    "city_name": "Garui"
                },
                {
                    "city_name": "Garulia"
                },
                {
                    "city_name": "Gayespur"
                },
                {
                    "city_name": "Ghatal"
                },
                {
                    "city_name": "Ghorsala"
                },
                {
                    "city_name": "Goaljan"
                },
                {
                    "city_name": "Goasafat"
                },
                {
                    "city_name": "Gobardanga"
                },
                {
                    "city_name": "Gobindapur"
                },
                {
                    "city_name": "Gopalpur"
                },
                {
                    "city_name": "Gopinathpur"
                },
                {
                    "city_name": "Gora Bazar"
                },
                {
                    "city_name": "Guma"
                },
                {
                    "city_name": "Gurdaha"
                },
                {
                    "city_name": "Guriahati"
                },
                {
                    "city_name": "Guskhara"
                },
                {
                    "city_name": "Habra"
                },
                {
                    "city_name": "Haldia"
                },
                {
                    "city_name": "Haldibari"
                },
                {
                    "city_name": "Halisahar"
                },
                {
                    "city_name": "Haora"
                },
                {
                    "city_name": "Harharia Chak"
                },
                {
                    "city_name": "Harindanga"
                },
                {
                    "city_name": "Haringhata"
                },
                {
                    "city_name": "Haripur"
                },
                {
                    "city_name": "Harishpur"
                },
                {
                    "city_name": "Hatgachha"
                },
                {
                    "city_name": "Hatsimla"
                },
                {
                    "city_name": "Hijuli"
                },
                {
                    "city_name": "Hindustan Cables Town"
                },
                {
                    "city_name": "Hooghly"
                },
                {
                    "city_name": "Howrah"
                },
                {
                    "city_name": "Hugli-Chunchura"
                },
                {
                    "city_name": "Humaipur"
                },
                {
                    "city_name": "Ichha Pur Defence Estate"
                },
                {
                    "city_name": "Ingraj Bazar"
                },
                {
                    "city_name": "Islampur"
                },
                {
                    "city_name": "Jafarpur"
                },
                {
                    "city_name": "Jagadanandapur"
                },
                {
                    "city_name": "Jagdishpur"
                },
                {
                    "city_name": "Jagtaj"
                },
                {
                    "city_name": "Jala Kendua"
                },
                {
                    "city_name": "Jaldhaka"
                },
                {
                    "city_name": "Jalkhura"
                },
                {
                    "city_name": "Jalpaiguri"
                },
                {
                    "city_name": "Jamuria"
                },
                {
                    "city_name": "Jangipur"
                },
                {
                    "city_name": "Jaygaon"
                },
                {
                    "city_name": "Jaynagar-Majilpur"
                },
                {
                    "city_name": "Jemari"
                },
                {
                    "city_name": "Jemari Township"
                },
                {
                    "city_name": "Jetia"
                },
                {
                    "city_name": "Jhalida"
                },
                {
                    "city_name": "Jhargram"
                },
                {
                    "city_name": "Jhorhat"
                },
                {
                    "city_name": "Jiaganj-Azimganj"
                },
                {
                    "city_name": "Joka"
                },
                {
                    "city_name": "Jot Kamal"
                },
                {
                    "city_name": "Kachu Pukur"
                },
                {
                    "city_name": "Kajora"
                },
                {
                    "city_name": "Kakdihi"
                },
                {
                    "city_name": "Kakdwip"
                },
                {
                    "city_name": "Kalaikunda"
                },
                {
                    "city_name": "Kalara"
                },
                {
                    "city_name": "Kalimpong"
                },
                {
                    "city_name": "Kaliyaganj"
                },
                {
                    "city_name": "Kalna"
                },
                {
                    "city_name": "Kalyani"
                },
                {
                    "city_name": "Kamarhati"
                },
                {
                    "city_name": "Kanaipur"
                },
                {
                    "city_name": "Kanchrapara"
                },
                {
                    "city_name": "Kandi"
                },
                {
                    "city_name": "Kanki"
                },
                {
                    "city_name": "Kankuria"
                },
                {
                    "city_name": "Kantlia"
                },
                {
                    "city_name": "Kanyanagar"
                },
                {
                    "city_name": "Karimpur"
                },
                {
                    "city_name": "Karsiyang"
                },
                {
                    "city_name": "Kasba"
                },
                {
                    "city_name": "Kasimbazar"
                },
                {
                    "city_name": "Katwa"
                },
                {
                    "city_name": "Kaugachhi"
                },
                {
                    "city_name": "Kenda"
                },
                {
                    "city_name": "Kendra Khottamdi"
                },
                {
                    "city_name": "Kendua"
                },
                {
                    "city_name": "Kesabpur"
                },
                {
                    "city_name": "Khagrabari"
                },
                {
                    "city_name": "Khalia"
                },
                {
                    "city_name": "Khalor"
                },
                {
                    "city_name": "Khandra"
                },
                {
                    "city_name": "Khantora"
                },
                {
                    "city_name": "Kharagpur"
                },
                {
                    "city_name": "Kharagpur Railway Settlement"
                },
                {
                    "city_name": "Kharar"
                },
                {
                    "city_name": "Khardaha"
                },
                {
                    "city_name": "Khari Mala Khagrabari"
                },
                {
                    "city_name": "Kharsarai"
                },
                {
                    "city_name": "Khatra"
                },
                {
                    "city_name": "Khodarampur"
                },
                {
                    "city_name": "Kodalia"
                },
                {
                    "city_name": "Kolaghat"
                },
                {
                    "city_name": "Kolaghat Thermal Power Project"
                },
                {
                    "city_name": "Kolkata"
                },
                {
                    "city_name": "Konardihi"
                },
                {
                    "city_name": "Konnogar"
                },
                {
                    "city_name": "Krishnanagar"
                },
                {
                    "city_name": "Krishnapur"
                },
                {
                    "city_name": "Kshidirpur"
                },
                {
                    "city_name": "Kshirpai"
                },
                {
                    "city_name": "Kulihanda"
                },
                {
                    "city_name": "Kulti"
                },
                {
                    "city_name": "Kunustara"
                },
                {
                    "city_name": "Kuperskem"
                },
                {
                    "city_name": "Madanpur"
                },
                {
                    "city_name": "Madhusudanpur"
                },
                {
                    "city_name": "Madhyamgram"
                },
                {
                    "city_name": "Maheshtala"
                },
                {
                    "city_name": "Mahiari"
                },
                {
                    "city_name": "Mahikpur"
                },
                {
                    "city_name": "Mahira"
                },
                {
                    "city_name": "Mahishadal"
                },
                {
                    "city_name": "Mainaguri"
                },
                {
                    "city_name": "Makardaha"
                },
                {
                    "city_name": "Mal"
                },
                {
                    "city_name": "Malda"
                },
                {
                    "city_name": "Mandarbani"
                },
                {
                    "city_name": "Mansinhapur"
                },
                {
                    "city_name": "Masila"
                },
                {
                    "city_name": "Maslandapur"
                },
                {
                    "city_name": "Mathabhanga"
                },
                {
                    "city_name": "Mekliganj"
                },
                {
                    "city_name": "Memari"
                },
                {
                    "city_name": "Midnapur"
                },
                {
                    "city_name": "Mirik"
                },
                {
                    "city_name": "Monoharpur"
                },
                {
                    "city_name": "Mrigala"
                },
                {
                    "city_name": "Muragachha"
                },
                {
                    "city_name": "Murgathaul"
                },
                {
                    "city_name": "Murshidabad"
                },
                {
                    "city_name": "Nabadhai Dutta Pukur"
                },
                {
                    "city_name": "Nabagram"
                },
                {
                    "city_name": "Nabgram"
                },
                {
                    "city_name": "Nachhratpur Katabari"
                },
                {
                    "city_name": "Nadia"
                },
                {
                    "city_name": "Naihati"
                },
                {
                    "city_name": "Nalhati"
                },
                {
                    "city_name": "Nasra"
                },
                {
                    "city_name": "Natibpur"
                },
                {
                    "city_name": "Naupala"
                },
                {
                    "city_name": "Navadwip"
                },
                {
                    "city_name": "Nebadhai Duttapukur"
                },
                {
                    "city_name": "New Barrackpore"
                },
                {
                    "city_name": "Ni Barakpur"
                },
                {
                    "city_name": "Nibra"
                },
                {
                    "city_name": "Noapara"
                },
                {
                    "city_name": "Nokpul"
                },
                {
                    "city_name": "North Barakpur"
                },
                {
                    "city_name": "Odlabari"
                },
                {
                    "city_name": "Old Maldah"
                },
                {
                    "city_name": "Ondal"
                },
                {
                    "city_name": "Pairagachha"
                },
                {
                    "city_name": "Palashban"
                },
                {
                    "city_name": "Panchla"
                },
                {
                    "city_name": "Panchpara"
                },
                {
                    "city_name": "Pandua"
                },
                {
                    "city_name": "Pangachhiya"
                },
                {
                    "city_name": "Paniara"
                },
                {
                    "city_name": "Panihati"
                },
                {
                    "city_name": "Panuhat"
                },
                {
                    "city_name": "Par Beliya"
                },
                {
                    "city_name": "Parashkol"
                },
                {
                    "city_name": "Parasia"
                },
                {
                    "city_name": "Parbbatipur"
                },
                {
                    "city_name": "Parui"
                },
                {
                    "city_name": "Paschim Jitpur"
                },
                {
                    "city_name": "Paschim Punro Para"
                },
                {
                    "city_name": "Patrasaer"
                },
                {
                    "city_name": "Pattabong Tea Garden"
                },
                {
                    "city_name": "Patuli"
                },
                {
                    "city_name": "Patulia"
                },
                {
                    "city_name": "Phulia"
                },
                {
                    "city_name": "Podara"
                },
                {
                    "city_name": "Port Blair"
                },
                {
                    "city_name": "Prayagpur"
                },
                {
                    "city_name": "Pujali"
                },
                {
                    "city_name": "Purba Medinipur"
                },
                {
                    "city_name": "Purba Tajpur"
                },
                {
                    "city_name": "Purulia"
                },
                {
                    "city_name": "Raghudebbati"
                },
                {
                    "city_name": "Raghudebpur"
                },
                {
                    "city_name": "Raghunathchak"
                },
                {
                    "city_name": "Raghunathpur"
                },
                {
                    "city_name": "Raghunathpur-Dankuni"
                },
                {
                    "city_name": "Raghunathpur-Magra"
                },
                {
                    "city_name": "Raigachhi"
                },
                {
                    "city_name": "Raiganj"
                },
                {
                    "city_name": "Raipur"
                },
                {
                    "city_name": "Rajarhat Gopalpur"
                },
                {
                    "city_name": "Rajpur"
                },
                {
                    "city_name": "Ramchandrapur"
                },
                {
                    "city_name": "Ramjibanpur"
                },
                {
                    "city_name": "Ramnagar"
                },
                {
                    "city_name": "Rampur Hat"
                },
                {
                    "city_name": "Ranaghat"
                },
                {
                    "city_name": "Raniganj"
                },
                {
                    "city_name": "Ratibati"
                },
                {
                    "city_name": "Raypur"
                },
                {
                    "city_name": "Rishra"
                },
                {
                    "city_name": "Rishra Cantonment"
                },
                {
                    "city_name": "Ruiya"
                },
                {
                    "city_name": "Sahajadpur"
                },
                {
                    "city_name": "Sahapur"
                },
                {
                    "city_name": "Sainthia"
                },
                {
                    "city_name": "Salap"
                },
                {
                    "city_name": "Sankarpur"
                },
                {
                    "city_name": "Sankrail"
                },
                {
                    "city_name": "Santoshpur"
                },
                {
                    "city_name": "Saontaidih"
                },
                {
                    "city_name": "Sarenga"
                },
                {
                    "city_name": "Sarpi"
                },
                {
                    "city_name": "Satigachha"
                },
                {
                    "city_name": "Serpur"
                },
                {
                    "city_name": "Shankhanagar"
                },
                {
                    "city_name": "Shantipur"
                },
                {
                    "city_name": "Shrirampur"
                },
                {
                    "city_name": "Siduli"
                },
                {
                    "city_name": "Siliguri"
                },
                {
                    "city_name": "Simla"
                },
                {
                    "city_name": "Singur"
                },
                {
                    "city_name": "Sirsha"
                },
                {
                    "city_name": "Siuri"
                },
                {
                    "city_name": "Sobhaganj"
                },
                {
                    "city_name": "Sodpur"
                },
                {
                    "city_name": "Sonamukhi"
                },
                {
                    "city_name": "Sonatikiri"
                },
                {
                    "city_name": "Srikantabati"
                },
                {
                    "city_name": "Srirampur"
                },
                {
                    "city_name": "Sukdal"
                },
                {
                    "city_name": "Taherpur"
                },
                {
                    "city_name": "Taki"
                },
                {
                    "city_name": "Talbandha"
                },
                {
                    "city_name": "Tamluk"
                },
                {
                    "city_name": "Tarakeswar"
                },
                {
                    "city_name": "Tentulberia"
                },
                {
                    "city_name": "Tentulkuli"
                },
                {
                    "city_name": "Thermal Power Project"
                },
                {
                    "city_name": "Tinsukia"
                },
                {
                    "city_name": "Titagarh"
                },
                {
                    "city_name": "Tufanganj"
                },
                {
                    "city_name": "Ukhra"
                },
                {
                    "city_name": "Ula"
                },
                {
                    "city_name": "Ulubaria"
                },
                {
                    "city_name": "Uttar Durgapur"
                },
                {
                    "city_name": "Uttar Goara"
                },
                {
                    "city_name": "Uttar Kalas"
                },
                {
                    "city_name": "Uttar Kamakhyaguri"
                },
                {
                    "city_name": "Uttar Latabari"
                },
                {
                    "city_name": "Uttar Mahammadpur"
                },
                {
                    "city_name": "Uttar Pirpur"
                },
                {
                    "city_name": "Uttar Raypur"
                },
                {
                    "city_name": "Uttarpara-Kotrung"
                }
            ]

            if(req.body.state == 'Andaman and Nicobar Islands'){
                res.status(200).json({success : true,message: andaman})
            }
            else if(req.body.state == 'Maharashtra'){
                res.status(200).json({success : true,message: Maharashtra})
            }
            else if(req.body.state == 'Andhra Pradesh'){
                res.status(200).json({success : true,message: andhra})
            }
            else if(req.body.state == 'Arunachal Pradesh'){
                res.status(200).json({success : true,message: arunchal})
            }
            else if(req.body.state == 'Assam'){
                res.status(200).json({success : true,message: assam})
            }
            else if(req.body.state == 'Bihar'){
                res.status(200).json({success : true,message: bihar})
            }
            else if(req.body.state == 'Chandigarh'){
                res.status(200).json({success : true,message: 'Chandigarh'})
            }
            else if(req.body.state == 'Chhattisgarh'){
                res.status(200).json({success : true,message: chattisgarh})
            }
            else if(req.body.state == 'Dadra and Nagar Haveli'){
                res.status(200).json({success : true,message: dadarNagar})
            }
            else if(req.body.state == 'Daman and Diu'){
                res.status(200).json({success : true,message: daman})
            }
            else if(req.body.state == 'Delhi'){
                res.status(200).json({success : true,message: delhi})
            }
            else if(req.body.state == 'Goa'){
                res.status(200).json({success : true,message: goa})
            }
            else if(req.body.state == 'Gujarat'){
                res.status(200).json({success : true,message: gujrat})
            }
            else if(req.body.state == 'Haryana'){
                res.status(200).json({success : true,message: haryana})
            }
            else if(req.body.state == 'Himachal Pradesh'){
                res.status(200).json({success : true,message: himachal})
            }
            else if(req.body.state == 'Jammu and Kashmir'){
                res.status(200).json({success : true,message: jammu})
            }
            else if(req.body.state == 'Jharkhand'){
                res.status(200).json({success : true,message: jharkhand})
            }
            else if(req.body.state == 'Karnataka'){
                res.status(200).json({success : true,message: karnataka})
            }
            else if(req.body.state == 'Kerala'){
                res.status(200).json({success : true,message: kerala})
            }
            else if(req.body.state == 'Ladakh'){
                res.status(200).json({success : true,message: ladakh})
            }
            else if(req.body.state == 'Lakshadweep'){
                res.status(200).json({success : true,message: lakshadweep})
            }
            else if(req.body.state == 'Madhya Pradesh'){
                res.status(200).json({success : true,message: mp})
            }
            else if(req.body.state == 'Manipur'){
                res.status(200).json({success : true,message: manipur})
            }
            else if(req.body.state == 'Meghalaya'){
                res.status(200).json({success : true,message: meghalaya})
            }
            else if(req.body.state == 'Mizoram'){
                res.status(200).json({success : true,message: mizo})
            }
            else if(req.body.state == 'Nagaland'){
                res.status(200).json({success : true,message: naga})
            }
            else if(req.body.state == 'Odisha'){
                res.status(200).json({success : true,message: odisha})
            }
            else if(req.body.state == 'Pondicherry'){
                res.status(200).json({success : true,message: pudu})
            }
            else if(req.body.state == 'Punjab'){
                res.status(200).json({success : true,message: punjb})
            }
            else if(req.body.state == 'Rajasthan'){
                res.status(200).json({success : true,message: rajasthan})
            }
            else if(req.body.state == 'Sikkim'){
                res.status(200).json({success : true,message: sikkim})
            }
            else if(req.body.state == 'Tamil Nadu'){
                res.status(200).json({success : true,message: tamil})
            }
            else if(req.body.state == 'Telangana'){
                res.status(200).json({success : true,message: telangana})
            }
            else if(req.body.state == 'Tripura'){
                res.status(200).json({success : true,message: tripura})
            }
            else if(req.body.state == 'Uttar Pradesh'){
                res.status(200).json({success : true,message: uttar})
            }
            else if(req.body.state == 'Uttarakhand'){
                res.status(200).json({success : true,message: uttarakhand})
            }
            else if(req.body.state == 'West Bengal'){
                res.status(200).json({success : true,message: bengal})
            }
        }
        catch (error) {
            res.status(400).json({success : false,message: error.message})
        }
    },
}