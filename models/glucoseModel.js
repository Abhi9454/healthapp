import pkg from 'mongoose';
const { Schema, model } = pkg;

const glucoseSchema = new Schema({
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
		type: "String",
		default: Date.now()
	},
},{collection : 'glucose'},)

export default model('glucose',glucoseSchema)
