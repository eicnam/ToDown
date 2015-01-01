var mongoose = require('mongoose');

var UsersSchema = new mongoose.Schema({
	id_user: String,
	username: String,
    	url:String
});

mongoose.model('Users', UsersSchema);

