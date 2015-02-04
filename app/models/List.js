var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var ListsSchema = new mongoose.Schema({
	_id: ObjectId,
    	name: String
});


module.exports = mongoose.model('Lists', ListsSchema);
