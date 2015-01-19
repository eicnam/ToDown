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
			"directed_by": [],
			"/film/film/release_date_s": [{
				"release_date": null,
				"film_release_region": [], 
				"film_release_distribution_medium": [],
				"sort": "release_date"
				}],
			"type": "/film/film"
		}],

		getFilmInfoByName : function(searchedWord){

			factory.query[0]['name~='] = searchedWord+"*";
			factory.query[0]['id'] = null;

			return freebaseService.lookup(factory.query)
				.then(function(dataReturnByThePromise) {
					return dataReturnByThePromise.data.result;
				});
		},

		getFilmInfoById : function(id_freebase){

			factory.query[0]['id'] = id_freebase;
			factory.query[0]['name~='] = "*";

			/*console.log(factory.query);*/
			return freebaseService.lookup(factory.query)
				.then(function(dataReturnByThePromise) {
					return dataReturnByThePromise.data.result;
				});
		}
	};
	return factory;
})

