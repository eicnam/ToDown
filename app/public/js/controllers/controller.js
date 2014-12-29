'use strict';

app.controller('ToDownCtrl', function($scope, $http, $timeout, $mdSidenav, $log, $location, lookupFactory) {
	
	$scope.toggleLeft = function() {
		$mdSidenav('left').toggle()
		.then(function(){
			$log.debug("toggle left is done");
		});
	};

	$scope.redirect = function(){
		var urlTwitter = "/auth/twitter?returnto="+$location.url(); 
		window.location.assign(urlTwitter);
	};

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

app.controller('ProfileCtrl', function($rootScope, $scope, $http) {
	
	$scope.username = "salut";
	console.log($rootScope);
	

});
