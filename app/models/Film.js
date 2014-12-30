var mongoose = require('mongoose');

var FilmSchema = new mongoose.Schema({
	id_freebase: String
});


mongoose.model('Film', FilmSchema);

