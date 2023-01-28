const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
	userId : {
		required: true,
		type: String
	},
	weight : {
		required: false,
		type: String,
		default:''
	},
	createdAt:{
		type: Date,
		default: Date.now()
	},
},{collection : 'weight'},)

module.exports = mongoose.model('weight',stepSchema)
