var mongoose = require('mongoose');

var UsersSchema = new mongoose.Schema({
	id_user: String,
	username: String,
    	url:String,
    	email:String,
    	photo:String
});

mongoose.model('Users', UsersSchema);

