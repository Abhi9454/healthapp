const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
	userId : {
		required: true,
		type: String
	},
	steps : {
		required: false,
		type: String,
		default:''
	},
	createdAt:{
		type: "String",
		default: Date.now()
	},
},{collection : 'steps'},)

module.exports = mongoose.model('steps',stepSchema)
