'use strict';

var togglePlayApp = angular.module('togglePlayApp', [
  'ngRoute',
  'togglePlayControllers'
]);
togglePlayApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/la', {
        templateUrl: 'views/partials/content.html',
        controller: 'togglePlayCtrl'
      }).
      otherwise({
        redirectTo: '/la'
      });
  }]);
