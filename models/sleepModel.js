const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
	userId : {
		required: true,
		type: String
	},
	sleep : {
		required: false,
		type: String,
		default:''
	},
	createdAt:{
		type: "String",
		default: Date.now()
	},
},{collection : 'sleep'},)

module.exports = mongoose.model('sleep',stepSchema)
