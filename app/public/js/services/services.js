
// request FreeBase
app.service('freebaseService',function($http){
	//Your API Key from Google goes here
	var apiKey = 'AIzaSyBaohCgE0hyEWqp96c1OdMZpcsqJnSLYQo';
	var serviceUrl = 'https://www.googleapis.com/freebase/v1/mqlread';
	apiKey = ((apiKey) ? 'key=' + encodeURIComponent(apiKey) + '&' : '');
	this.lookup = function(query){
		return $http.jsonp(serviceUrl + '?' + apiKey + 'callback=JSON_CALLBACK&query=' + JSON.stringify(query))
			.success(function(data, status, headers, config){
				console.log("Data received from Freebase");          
			})
			.error(function(data, status, headers, config){
				console.error('Error getting data from Freebase' + data);
			});
	}
});


// manage all films linked to one user
app.service('FilmUserService',function($http){

	this.addFilm = function(idFilm){

		return $http.post('/films', {"idFilm":idFilm})
			.success(function(data, status, headers, config){
				if( data == "OK" ) 
					console.log("postFilm");
			})  
			.error(function(data, status, headers, config) { 
				console.log("Error on adding a film"); 
			}); 
        };

	this.removeFilm = function(idFilm){

		return "OK";
		/*return $http.post('/films', {"idFilm":idFilm})*/
		/*.success(function(data, status, headers, config){*/
		/*if( data == "OK" ) */
		/*console.log("postFilm");*/
		/*})  */
		/*.error(function(data, status, headers, config) { */
		/*console.log("Error on adding a film"); */
		/*}); */
        };

        this.getFilms = function(){
		
		return $http.get('/films')
			.success(function(data, status, headers, config){
				console.log("getFilms");
			})
			.error(function(data, status, headers, config) { 
				console.log("Error on getting films");
			});
	};
});

// manage users 
app.service('UserService',function($http){

	//if no parameters, get me
	this.getUser = function(){

		return $http.get('/users')
			.success(function(response){
				console.log("getUser");
			})
			.error(function(data, status, headers, config) {
				console.log("Error on getting users info");
			});
	}
});
