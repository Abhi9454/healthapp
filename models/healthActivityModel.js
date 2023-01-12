const mongoose = require('mongoose');

const healthActivitySchema = new mongoose.Schema({
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
})
healthActivitySchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id  }
  });
module.exports = mongoose.model('healthActivity',healthActivitySchema)
