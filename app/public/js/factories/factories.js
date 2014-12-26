app.factory('lookupFactory', function(freebaseService){
	var factory = {
		
		query : [{
			"name~=": "", 
			"name": null,
			"/film/film/release_date_s": [{
				"release_date": null,
				"film_release_region": "France",
				"film_release_distribution_medium": null
				}],
			"type": "/film/film"
		}],

		getFilmInfo : function(searchedWord){

			factory.query[0]['name~='] = searchedWord+"*";

			return freebaseService.lookup(factory.query)
				.then(function(dataReturnByThePromise) {
					/*console.log(dataReturnByThePromise.data.result);*/
					return dataReturnByThePromise.data.result;
				});
		}
	};
	return factory;
})
