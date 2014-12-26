'use strict';

var app = angular.module('toDownApp', [
  'ngRoute',
  'ngMaterial'
]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/partials/content.html'
      /*controller: 'ToDownCtrl'*/
      })
      .when('/search', {
        templateUrl: 'views/partials/gridFilms.html'
	/*controller: 'FilmCtrl'*/
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
