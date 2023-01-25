const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	firstName : {
		required: false,
		type: String
	},
	lastName : {
		required: false,
		type: String
	},
	organizationName : { // only for partner
		required: false,
		type: String
	},
	gender : {
		required: false,
		type: String,
	},
	phone : {
		required: true,
		type: String,
		unique: true
	},
	email : {
		required: true,
		type: String,
		unique: true
	},
	dob : {        // only for patient
		required: false,
		type: String,
		default:''
	},
	userType : {
		required: false,
		type: Number, //patient = 0,partner = 1,admin = 2
		default: '0'
	},
	healthActivity : {    // only for patient
		required: false,
		type: Array,
		default:''
	},
	profileImageUrl : {
		required: false,
		type: String,
		default: '1662632016476.webp'
	},
	description : {
		required: false,
		type: String,
		default:''
	},
	coverImageUrl : {
		required: false,
		type: String,
		default:'1662565875921.webp'
	},
	category : {
		required: false,
		type: String,
		default:''
	},
	password :{
		required: true,
		type: String,
	},
	address : {
		required: false,
		type: String,
		default:''
	},
	city : {
		required: false,
		type: String,
		default:''
	},
	state : {
		required: false,
		type: String,
		default:''
	},
	country : {
		required: false,
		type: String,
		default:''
	},
	active :{
		required : false,
		type: Number,
		default:1
	},
	pincode : {
		required: false,
		type: String,
		default:''
	},
	partnerId :{
		required : false,
		type: String,
		default: ''
	},
    deviceId :{ 
		required : false,
		type: String,
		default: ''
	},
	createdAt:{
		type: Date,
		default: Date.now()
	},
},{collection : 'user'},)

module.exports = mongoose.model('user',userSchema)
