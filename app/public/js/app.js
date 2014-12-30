'use strict';

var app = angular.module('toDownApp', [
  'ngRoute',
  'ngMaterial',
  'ngResource'
]);

app.config(function($routeProvider, $locationProvider, $httpProvider) {
	
	//help found here https://vickev.com/#!/article/authentication-in-single-page-applications-node-js-passportjs-angularjs
	var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
	      // Initialize a new promise
	      var deferred = $q.defer();

	      // Make an AJAX call to check if the user is logged in
	      $http.get('/loggedin').success(function(user){
		
		// Authenticated
		if (user !== '0'){
		  $timeout(deferred.resolve, 0);
		}
		// Not Authenticated
		else {
		  $rootScope.message = 'You need to log in.';
		  $timeout(function(){deferred.reject();}, 0);
		  $location.url('/');
		}
	      });

	      return deferred.promise;
	};

	//the interceptor
	$httpProvider.interceptors.push(function($q, $location, $rootScope) {
		return {
			'responseError': function (rejection) {
				// Error: check the error status to get only the 401
				console.log('Failed with', rejection.status, 'status');
				if (rejection.status == 401) {
					//user is not loggedin
					$location.url('/');
				}
				if (rejection.status == 404) {
					$rootScope.message = 'Page not found';
					//page not found 
					$location.url('/');
				}
				return $q.reject(rejection);
			}
		};
	});

	$routeProvider
	.when('/', {
		templateUrl: 'views/partials/content.html',
		controller: 'HomeCtrl'
	})
	.when('/search', {
		templateUrl: 'views/partials/gridFilms.html',
		controller: 'SearchCtrl'
	})
	.when('/profile', {
		templateUrl: 'views/partials/profile.html',
		controller: 'ProfileCtrl',
		//this is a secure root
		resolve: {
			loggedin: checkLoggedin
		}
	})
	.when('/films', {
		templateUrl: 'views/partials/gridFilms.html',
		controller: 'FilmsUserCtrl'
	})
	.otherwise({
		redirectTo: '/'
	});
});


