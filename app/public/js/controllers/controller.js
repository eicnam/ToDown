'use strict';

app.controller('ToDownCtrl', function($rootScope, $scope, $http, $timeout, $mdSidenav, $mdToast, $log, $location, freebaseFactory) {
	
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
			freebaseFactory.getFilmInfo($scope.searchWord)
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

});

app.controller('SearchCtrl', function($rootScope, $scope, $http, FilmUserService) {

	$scope.location = "search";

	$scope.addFilm = function(idFilm){
		FilmUserService.addFilm(idFilm)
			.then(function(objectReturnediByThePromise){
				if (objectReturnediByThePromise.data == "OK" ) 
					console.log("Film added");
			})
			.catch(function(fallback){
				console.log("Error on adding a film");
			});
	}

});


app.controller('HomeCtrl', function($rootScope, $scope, $http, $mdToast) {
	
	$scope.location = "home";

	$scope.showSimpleToast = function(content) {
		$mdToast.show(
			$mdToast.simple()
			.content(content)
			.position("bottom right")
		     );
	};

	if ($rootScope.message != undefined && $rootScope.message != "" )
		$scope.showSimpleToast($rootScope.message);
});


app.controller('ProfileCtrl', function($rootScope, $scope, $http, UserService) {

	$scope.location = "profile";

	UserService.getUser().then(function(result){
		$scope.userInfo = result.data;	
	},
	function(rejection){
		console.log("Error on getting user");
	});

});


app.controller('LoggedInCtrl', function($rootScope, $scope, $http, $location, UserService) {

	$scope.location = "loggedin";

	// Make an AJAX call to check if the user is logged in
	$http.get('/loggedin').success(function(data, status, headers, config){
		console.log(data);
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


app.controller('FilmsUserCtrl', function($rootScope, $scope, $http, FilmUserService) {
	
	$scope.location = "filmUser";

	FilmUserService.getFilms().then(function(result){
		$scope.films = result.data;
	},
	function(rejection){
		console.log("Error on getting films");
	});

	$scope.removeFilm = function(idFilm){
		FilmUserService.removeFilm(idFilm)
			.then(function(objectReturnediByThePromise){
				if (objectReturnediByThePromise.data == "OK" ) 
					console.log("Film removed from my list");
			})
			.catch(function(fallback){
				console.log("Error on removing a film");
			});
	}
});
