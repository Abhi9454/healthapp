import pkg from 'mongoose';
const { Schema, model } = pkg;

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
