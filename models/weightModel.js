import pkg from 'mongoose';
const { Schema, model } = pkg;

const stepSchema = new Schema({
	userId : {
		required: true,
		type: String
	},
	weight : {
		required: false,
		type: String,
		default:''
	},
	createdAt:{
		type: "String",
		default: Date.now()
	},
},{collection : 'weight'},)

export default model('weight',stepSchema)
