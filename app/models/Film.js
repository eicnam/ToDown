var mongoose = require('mongoose');

var FilmsUsersSchema = new mongoose.Schema({
	id_freebase: String,
    	id_user: String
});


module.exports = mongoose.model('FilmsUsers', FilmsUsersSchema);

