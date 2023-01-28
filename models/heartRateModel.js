const mongoose = require('mongoose');

const heartRateSchema = new mongoose.Schema({
	userId : {
		required: true,
		type: String
	},
	heartRate : {
		required: false,
		type: String,
		default:''
	},
    createdAt:{
		type: String,
		default: Date.now()
	},
},{collection : 'heartRate'}
)

module.exports = mongoose.model('heartRate',heartRateSchema)
