const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

let itemSchema = new Schema ({
	name : {
		type: String,
	},
	url : {
		type : String,
		required:true
	}
})

module.exports = mongoose.model('links',itemSchema);