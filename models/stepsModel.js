import { Schema, model } from 'mongoose';

const stepSchema = new Schema({
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

export default model('steps',stepSchema)
