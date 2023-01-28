const mongoose = require('mongoose');

const temperatureSchema = new mongoose.Schema({
	userId : {
		required: true,
		type: String
	},
	temperature : {
		required: false,
		type: String,
		default:''
	},
	createdAt:{
		type: Date,
		default: Date.now()
	},
},{collection : 'temperature'},)

module.exports = mongoose.model('temperature',temperatureSchema)
