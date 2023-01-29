import { Schema, model } from 'mongoose';

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
