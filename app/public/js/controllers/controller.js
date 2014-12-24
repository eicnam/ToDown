'use strict';

var togglePlayControllers = angular.module('togglePlayControllers', ['ngMaterial']);
togglePlayControllers.controller('togglePlayCtrl', ['$scope','$http',
		function ($scope,$http) {
			/*console.log($scope);*/
			$scope.appname="salut";
			console.log(location);
			$scope.hash = encodeURIComponent("/"+window.location.hash);

			$scope.insertInDatabase = function(){
				/*$http({method: 'GET', url: '/api/application'}).*/
				/*success(function(data, status, headers, config) {*/
				/*$scope.appname = data; */
				console.log($scope.hash);
				console.log("la");
				/*}).*/
				/*error(function(data, status, headers, config) {*/
				/*console.log('Error: ' + data);*/
				/*});	*/
			}
		}
		]);

/*angular.module('sidenavDemo1', ['ngMaterial'])*/
togglePlayControllers.controller('AppCtrl', function($scope, $timeout, $mdSidenav, $log) {
	$scope.toggleLeft = function() {
		$mdSidenav('left').toggle()
	.then(function(){
		$log.debug("toggle left is done");
	});
	};
});
togglePlayControllers.controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
	$scope.close = function() {
		$mdSidenav('left').close()
	.then(function(){
		$log.debug("close LEFT is done");
	});
	};
});
