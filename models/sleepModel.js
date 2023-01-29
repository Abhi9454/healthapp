import pkg from 'mongoose';
const { Schema, model } = pkg;

const stepSchema = new Schema({
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

export default model('sleep',stepSchema)
