var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	username: String,
    	url:String,
	salt:String,
	hash:String
});

mongoose.model('User', UserSchema);

