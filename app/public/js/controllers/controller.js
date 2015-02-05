'use strict';

app.controller('ToDownCtrl', function($rootScope, $scope, $http, $timeout, $mdSidenav, $mdToast, $log, $location, freebaseFactory, $mdDialog, ListsService, ListsUsersService) {

	$rootScope.isAuthenticated = false;

	$scope.toggleLeft = function() {
		$mdSidenav('left').toggle();
	};

	$scope.closeLeft = function() {
		$mdSidenav('left').close();
	};

	$scope.redirect = function(){
		var urlTwitter = "/auth/twitter?returnto="+$location.url(); 
		window.location.assign(urlTwitter);
	};

	$scope.research = function(keyEvent) {
		if (keyEvent.which === 13){
			freebaseFactory.getFilmInfoByName($scope.searchWord)
				.then(function(objectTreatedByTheFactory){
					console.log(objectTreatedByTheFactory);
					$scope.films = objectTreatedByTheFactory;
					$location.path('search'); 
				})
				.catch(function(fallback){
					console.log("error");
				});
		}
	};

	$scope.createList = function() {
		/*console.log("createlist");*/
		$mdDialog.show({
			controller: DialogController,
			templateUrl: '../../views/partials/createListForm.tpl.html'
		})
		.then(function(answer) {
			/*console.log("apres cereatiuon de liste");*/
			/*console.log($scope);*/
			$scope.getAllListsOfTheUser();
		}, function() {
			console.log('error when creating a list');
		});
	};

	
	$scope.getAllListsOfTheUser = function() {
		console.log("getting all the lists of the user connected");
		ListsUsersService.getlistuser()
			.then(function(objectReturnediByThePromise){
				/*console.log(objectReturnediByThePromise);*/

				$scope.lists = new Array();
				angular.forEach(objectReturnediByThePromise.data, function(listuser) {
					console.log("getting the name of a list");
					ListsService.getlists(listuser.id_list)
						.then(function(listsReturned){
							/*console.log("un autre retour");*/
							$scope.lists.push(listsReturned.data);
							/*console.log(listsReturned);*/
						})
						.catch(function(fallback){
							console.log("Error on getting lists");
						});
				});
			})
			.catch(function(fallback){
				console.log("Error on adding a list");
			});
	}
	$scope.getAllListsOfTheUser();

});


function DialogController($scope, $mdDialog, ListsService, ListsUsersService, FilmsListsService, UserService) {
	$scope.hide = function() {
		$mdDialog.hide();
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	
	$scope.list = {collaborative : false};
	$scope.answer = function(answer) {
		/*console.log($scope.list.listIdUserSharedWith);*/
		$mdDialog.hide(answer);
		if (answer == true) {
			/*console.log($scope.list.listIdUserSharedWith);*/
			/*$scope.list.listIdUserSharedWith = $scope.listIdUserSharedWith.id_user;*/
			/*console.log($scope.list);*/
			ListsService.addlist($scope.list.name, $scope.list.collaborative, $scope.list.listIdUserSharedWith.id_user)
				.then(function(objectReturnediByThePromise){
					console.log("list created");
					/*console.log(objectReturnediByThePromise);*/
					ListsUsersService.addlistuser(objectReturnediByThePromise.data._id)
						.then(function(objectReturnediByThePromise){
							console.log("list added to the user connected");
							console.log(objectReturnediByThePromise);
						})
						.catch(function(fallback){
							console.log("Error on adding a list");
						});

					//todo listIdUserSharedWith should be an array
					//for now we will only share to one user
						/*angular.forEach($scope.list.listIdUserSharedWith, function(user) {*/
						ListsUsersService.sharelistuser(objectReturnediByThePromise.data._id, $scope.list.listIdUserSharedWith.id_user)
							.then(function(objectReturnediByThePromise){
								console.log("list added to the other user we share with");
								console.log(objectReturnediByThePromise);
							})
							.catch(function(fallback){
								console.log("Error on adding a list");
							});
							/*});*/
				})
				.catch(function(fallback){
					console.log("Error on adding a list");
				});
		}
	};

	$scope.addToList = function(answer) {
		/*console.log($scope.listToAddIn);*/
		if ($scope.listToAddIn != undefined)
			$mdDialog.hide($scope.listToAddIn._id);
		else
			$mdDialog.hide();
			
			/*FilmUserService.addFilm(idFilm,release_date)*/
			/*.then(function(objectReturnediByThePromise){*/
			/*if (objectReturnediByThePromise.data == "OK" ) */
			/*console.log("Film added");*/
			/*})*/
			/*.catch(function(fallback){*/
			/*console.log("Error on adding a film");*/
			/*});*/
	};

	//fill combobox of users 
	console.log("getting all the users");
	UserService.getUser(true).then(function(result){
		/*console.log(result.data);*/
		$scope.users= result.data;	
	},
	function(rejection){
		console.log("Error on getting all user");
	});

	//fill combobox of lists
	console.log("getting all the lists of the user");
	ListsUsersService.getlistuser()
		.then(function(objectReturnediByThePromise){
			/*console.log(objectReturnediByThePromise);*/

			$scope.lists = new Array();
			angular.forEach(objectReturnediByThePromise.data, function(listuser) {
				console.log("getting the name of a list");
				ListsService.getlists(listuser.id_list)
					.then(function(listsReturned){
						$scope.lists.push(listsReturned.data);
						/*console.log(listsReturned);*/
						/*$scope.lists = ['Alabama', 'Alaska', 'Arizona'];*/
					})
					.catch(function(fallback){
						console.log("Error on getting a list");
					});
			});
		})
		.catch(function(fallback){
			console.log("Error on adding a list");
		});
}



app.controller('SearchCtrl', function($rootScope, $scope, $http, FilmUserService, FilmsListsService, $mdDialog, ListsUsersService, ListsService) {

	$scope.location = "search";
	$rootScope.location = "Recherche";

	$scope.addFilm = function(idFilm, release_date){

		console.log("addToList");
		$mdDialog.show({
			controller: DialogController,
			templateUrl: '../../views/partials/addFilmToList.tpl.html'
		})
		.then(function(idList) {
			FilmsListsService.addFilmList(idFilm, idList, release_date)
				.then(function(objectReturnediByThePromise){
					if (objectReturnediByThePromise.data == "OK" ) 
						console.log("Film added");
				})
				.catch(function(fallback){
					console.log("Error on adding a film");
				});
		}, function() {
			console.log('error');
		});
	}
});


app.controller('HomeCtrl', function($rootScope, $scope, $http, $mdToast, freebaseFactory, FilmUserService) {
	
	$scope.location = "home";
	$rootScope.location = "Accueil";

	$scope.showSimpleToast = function(content) {
		$mdToast.show(
			$mdToast.simple()
			.content(content)
			.position("bottom right")
		     );
	};

	if ($rootScope.message != undefined && $rootScope.message != "" )
		$scope.showSimpleToast($rootScope.message);

	$scope.addFilm = function(idFilm, release_date){
		FilmUserService.addFilm(idFilm,release_date)
			.then(function(objectReturnediByThePromise){
				if (objectReturnediByThePromise.data == "OK" ) 
					console.log("Film added");
			})
			.catch(function(fallback){
				console.log("Error on adding a film");
			});
	}

	freebaseFactory.getFilmInfoByTimeStamp()
		.then(function(objectTreatedByTheFactory){
			console.log(objectTreatedByTheFactory);
			$scope.films = objectTreatedByTheFactory;
		})
		.catch(function(fallback){
			console.log("error");
		});
});


app.controller('ProfileCtrl', function($rootScope, $scope, $http, UserService) {

	$scope.location = "profile";
	$rootScope.location = "Profile";

	UserService.getUser().then(function(result){
		console.log("UserInfo");
		/*console.log(result.data);*/
		$scope.userInfo = result.data;	
	},
	function(rejection){
		console.log("Error on getting user");
	});

	$scope.editProfile = function() {
		console.log($scope.newEmail);	
		UserService.putUser($scope.newEmail).then(function(result){
			console.log("UserInfo edited");
			/*console.log(result.data);*/
			$scope.userInfo.email = $scope.newEmail;	
		},
		function(rejection){
			console.log("Error on getting user");
		});
	};
});


app.controller('LoggedInCtrl', function($rootScope, $scope, $http, $location, UserService) {

	$scope.location = "loggedin";

	// Make an AJAX call to check if the user is logged in
	$http.get('/loggedin').success(function(data, status, headers, config){
		/*console.log(data);*/
		// Authenticated
		if (data.user!== '0'){
			$rootScope.isAuthenticated = true;
			if (data.returnto == '/')
				$location.url("/profile");
			else
				$location.url(data.returnto);

		}
		// Not Authenticated
		else {
			$rootScope.isAuthenticated = false;
			/*if (data.returnto == '/profile')*/
			/*$location.url("/");*/
			/*else*/
			$location.url(data.returnto);
		}

	});

});


// OLD 
// this will be removed 
app.controller('FilmsUserCtrl', function($rootScope, $scope, $http, FilmUserService, freebaseFactory) {
	
	$scope.location = "filmUser";
	$rootScope.location = "Mes films";

	FilmUserService.getFilms().then(function(result){
		console.log("mes films");
		console.log(result.data);

		$scope.films =  [];
		var filmsOnDatabase = result.data;

		angular.forEach(filmsOnDatabase, function(film) {
			freebaseFactory.getFilmInfoById(film.id_freebase)
				.then(function(objectTreatedByTheFactory){
					/*console.log(objectTreatedByTheFactory);*/
					$scope.films.push(objectTreatedByTheFactory[0]);

					console.log("films apres fabrique");
					console.log($scope.films);
				})
				.catch(function(fallback){
					console.log("error");
				});
		});
		

	},
	function(rejection){
		console.log("Error on getting films");
	});

	$scope.removeFilm = function(idFilm){
		FilmUserService.removeFilm(idFilm)
			.then(function(objectReturnediByThePromise){
				if (objectReturnediByThePromise.data == "OK" ) {
					console.log("Film removed from my list");
					angular.forEach($scope.films, function(film, key) {
						if(film.id==idFilm){
							$scope.films.splice(key,1); 
						}
					});
				}
			})
			.catch(function(fallback){
				console.log("Error on removing a film");
			});
	}
});


app.controller('FilmsListsCtrl', function($rootScope, $routeParams, $scope, $http, FilmsListsService, freebaseFactory) {
	
	$scope.location = "filmList";
	$rootScope.location = $routeParams.idList;

	console.log("getting all the films in a list...");
	FilmsListsService.getFilmList($routeParams.idList).then(function(result){
		/*console.log($routeParams);*/
		console.log(result.data);

		$scope.films =  [];
		var filmsOnDatabase = result.data;

		angular.forEach(filmsOnDatabase, function(film) {
			freebaseFactory.getFilmInfoById(film.id_freebase)
				.then(function(objectTreatedByTheFactory){
					/*console.log(objectTreatedByTheFactory);*/
					$scope.films.push(objectTreatedByTheFactory[0]);

					console.log("film after rebuilding with the factory");
					console.log($scope.films);
				})
				.catch(function(fallback){
					console.log("error on reconstructing the film with the factory");
				});
		});
	},
	function(rejection){
		console.log("Error on getting films");
	});

	$scope.removeFilm = function(idFilm){
		FilmsListsService.removeFilmList(idFilm, $routeParams.idList)
			.then(function(objectReturnediByThePromise){
				if (objectReturnediByThePromise.data == "OK" ) {
					console.log("Film removed from my list");
					angular.forEach($scope.films, function(film, key) {
						if(film.id==idFilm){
							$scope.films.splice(key,1); 
						}
					});
				}
			})
			.catch(function(fallback){
				console.log("Error on removing a film");
			});
	}
});
