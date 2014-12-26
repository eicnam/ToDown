'use strict';

app.controller('ToDownCtrl', function($scope, $http, $timeout, $mdSidenav, $log, $location, lookupFactory) {
	
	$scope.toggleLeft = function() {
		$mdSidenav('left').toggle()
		.then(function(){
			$log.debug("toggle left is done");
		});
	};

	/*console.log($scope);*/
	/*$scope.appname="salut";*/
	$scope.hash = encodeURIComponent("/"+window.location.hash);

	$scope.insertInDatabase = function(){
		/*$http({method: 'GET', url: '/api/application'}).*/
		/*success(function(data, status, headers, config) {*/
		/*$scope.appname = data; */
		console.log($scope.hash);
		/*}).*/
		/*error(function(data, status, headers, config) {*/
		/*console.log('Error: ' + data);*/
		/*});	*/
	}

	$scope.research = function(keyEvent) {
		if (keyEvent.which === 13){
			
			lookupFactory.getFilmInfo($scope.searchWord)
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

