var mongoose = require('mongoose');

var ListsUsersSchema = new mongoose.Schema({
	id_list: String,
	id_user: String
});


module.exports = mongoose.model('ListsUsers', ListsUsersSchema);
