const mongoose = require('mongoose');

const healthActivitySchema = new mongoose.Schema({
	name : {
		required: true,
		type: String
	},
	value : {
		required: true,
		type: String,
		unique: true
	},
	createdAt:{
		type: Date,
		default: Date.now()
	},
})

module.exports = mongoose.model('healthActivity',healthActivitySchema)
