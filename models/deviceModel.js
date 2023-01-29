import { Schema, model } from 'mongoose';

const deviceSchema = new Schema({
	name : {
		required: true,
		type: String
	},
	modelName : {
		required: false,
		type: String,
		default:''
	},
    modelId : {
		required: false,
		type: String,
		default:''
	},
    partnerId :{
		required : false,
		type: String,
		default: ''
	},
	createdAt:{
		type: Date,
		default: Date.now()
	},
},{collection : 'device'},)

export default model('device',deviceSchema)
