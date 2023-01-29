import { Schema, model } from 'mongoose';

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
