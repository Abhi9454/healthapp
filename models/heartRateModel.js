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
},{collection : 'heartRate'},
{timestamps: true}
)

module.exports = mongoose.model('heartRate',heartRateSchema)
