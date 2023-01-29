import pkg from 'mongoose';
const { Schema, model } = pkg;

const heartRateSchema = new Schema({
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
		type: "String",
		default: Date.now()
	},
},{collection : 'heartRate'}
)

export default model('heartRate',heartRateSchema)
