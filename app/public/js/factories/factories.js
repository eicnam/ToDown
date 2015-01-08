app.factory('freebaseFactory', function(freebaseService){
	var factory = {
		
		/*"optional": "forbidden",*/
		query : [{
			"id": null,
			"/common/topic/image": [{
				"id": null,
				"optional": "optional"
			}],
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
					return dataReturnByThePromise.data.result;
				});
		}
	};
	return factory;
})
