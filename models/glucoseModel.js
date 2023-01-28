const mongoose = require('mongoose');

const glucoseSchema = new mongoose.Schema({
	userId : {
		required: true,
		type: String
	},
	glucose : {
		required: false,
		type: String,
		default:''
	},
	createdAt:{
		type: Date,
		default: Date.now()
	},
},{collection : 'glucose'},)

module.exports = mongoose.model('glucose',glucoseSchema)
