const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
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
})
healthActivitySchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id  }
  });
module.exports = mongoose.model('deviceModel',deviceSchema)
