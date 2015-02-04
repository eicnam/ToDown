
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
				console.error('Error getting data from Freebase' + JSON.stringify(query));
			});
	}
});



// FILMUSER : OLD SERVICE
// manage all films linked to one user
app.service('FilmUserService',function($http){

	this.addFilm = function(idFilm, releaseDate){

		return $http.post('/films', {"idFilm":idFilm, "release_date": releaseDate})
			.success(function(data, status, headers, config){
				if( data == "OK" ) 
					console.log("postFilm");
			})  
			.error(function(data, status, headers, config) { 
				console.log("Error on adding a film"); 
			}); 
        };

	this.removeFilm = function(idFilm){
		console.log(idFilm);
		return $http.put('/films', {"idFilm":idFilm})
			.success(function(data, status, headers, config){
				if( data == "OK" ) {
					console.log("deleteFilm");
					//TODO supprimer du scope
				}
			})  
			.error(function(data, status, headers, config) { 
				console.log("Error on deleting a film"); 
			}); 
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



// listsusers
// manage all lists linked to one user
app.service('ListsUsersService',function($http){

	this.addlistuser = function(id_list){

		return $http.post('/lists_users', {"id_list":id_list})
			.success(function(data, status, headers, config){
				if( data == "ok" ) 
					console.log("post listuser");
			})  
			.error(function(data, status, headers, config) { 
				console.log("error on adding a listuser"); 
			}); 
        };

	this.sharelistuser = function(id_list, id_user){

		return $http.post('/lists_users', {"id_list":id_list, "id_user":id_user})
			.success(function(data, status, headers, config){
				if( data == "ok" ) 
					console.log("post listuser");
			})  
			.error(function(data, status, headers, config) { 
				console.log("error on adding a listuser"); 
			}); 
        };

	this.removelistuser = function(idfilm){
		console.log(idfilm);
		return $http.put('/lists_user', {"idListUser":idListUser})
			.success(function(data, status, headers, config){
				if( data == "ok" ) {
					console.log("delete listuser");
					//todo supprimer du scope
				}
			})  
			.error(function(data, status, headers, config) { 
				console.log("error on deleting a listuser"); 
			}); 
        };

        this.getlistuser = function(){
		
		return $http.get('/lists_users')
			.success(function(data, status, headers, config){
				console.log("getlistuser");
			})
			.error(function(data, status, headers, config) { 
				console.log("error on getting listuser");
			});
	};
});





// List 
// manage all lists
app.service('ListsService',function($http){

	this.addlist = function(name, collaborative, listIdUserSharedWith){

		return $http.post('/lists', {'name':name, 'collaborative':collaborative, 'listIdUserSharedWith':listIdUserSharedWith})
			.success(function(data, status, headers, config){
				if( data ) 
					console.log("post list");
			})  
			.error(function(data, status, headers, config) { 
				console.log("error on adding a list"); 
			}); 
        };

	this.removelists = function(idLists){
		console.log(idLists);
		return $http.put('/lists', {"idLists":idLists})
			.success(function(data, status, headers, config){
				if( data == "ok" ) {
					console.log("delete lists");
				}
			})  
			.error(function(data, status, headers, config) { 
				console.log("error on deleting a lists"); 
			}); 
        };

        this.getlists= function(id_list){
		console.log("id_list fetched : "+id_list);
		if (id_list != undefined && id_list != "") 
			return $http.get('/lists',  {params:{"id_list":id_list}})
			.success(function(data, status, headers, config){
				console.log("getSpecificLists");
			})
			.error(function(data, status, headers, config) { 
				console.log("error on getting lists");
			});
		else return $http.get('/lists')
			.success(function(data, status, headers, config){
				console.log("getAllLists");
			})
			.error(function(data, status, headers, config) { 
				console.log("error on getting lists");
			});
	};
});



//FILMSLISTS
// manage all films linked to one lists 
app.service('FilmsListsService',function($http){

	this.addFilmList = function(idFilm, idList, release_date){

		console.log("service : postFilmList");
		return $http.post('/films_lists', {"idFilm":idFilm, "idList": idList, "release_date":release_date})
			.success(function(data, status, headers, config){
				if( data == "OK" ) 
					console.log("post FilmList");
			})  
			.error(function(data, status, headers, config) { 
				console.log("Error on adding a film list"); 
			}); 
        };

	this.removeFilmList= function(idFilm, idList){
		console.log("service : putFilmList");
		console.log(idFilm);
		console.log(idList);
		return $http.put('/films_lists', {"idFilm":idFilm, "idList":idList})
			.success(function(data, status, headers, config){
				if( data == "OK" ) {
					console.log("deleteFilmList");
				}
			})  
			.error(function(data, status, headers, config) { 
				console.log("Error on deleting a filmlist"); 
			}); 
        };

        this.getFilmList = function(idList){
		console.log("service : getFilmList");
		console.log(idList);
		return $http.get('/films_lists', {params:{"id_list":idList}})
			.success(function(data, status, headers, config){
				console.log("getFilmList");
			})
			.error(function(data, status, headers, config) { 
				console.log("Error on getting filmslists");
			});
	};
});


// manage users 
app.service('UserService',function($http){

	//if no parameters, get the current user
	this.getUser = function(all){
		if (all == true) {
			return $http.get('/users', {params: {all:true}})
				.success(function(response){
					console.log("getAllUser");
				})
				.error(function(data, status, headers, config) {
					console.log("Error on getting all the users info");
				});
		}else{
			return $http.get('/users')
				.success(function(response){
					console.log("getUser");
				})
				.error(function(data, status, headers, config) {
					console.log("Error on getting users info");
				});
		}
	}

	//if no parameters, get the current user
	this.putUser = function(newEmail){

		return $http.put('/users',{"email":newEmail})
			.success(function(response){
				console.log("putUser");
			})
			.error(function(data, status, headers, config) {
				console.log("Error on getting users info");
			});
	}
});

