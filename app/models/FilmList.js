var mongoose = require('mongoose');

var FilmsListsSchema = new mongoose.Schema({
	id_freebase: String,
	id_list: String
});


module.exports = mongoose.model('FilmsLists', FilmsListsSchema);
