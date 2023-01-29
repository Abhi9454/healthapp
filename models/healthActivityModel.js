import pkg from 'mongoose';
const { Schema, model } = pkg;

const healthActivitySchema = new Schema({
	name : {
		required: true,
		type: String
	},
	value : {
		required: true,
		type: String,
		unique: true
	},
	createdAt:{
		type: Date,
		default: Date.now()
	},
},{collection : 'healthActivity'},)


export default model('healthActivity',healthActivitySchema)
