'use strict';

define([
    'angular',
    'angularResource',
    'functions/utils'
], function(angular) {
	angular.module('myApp.view2c.filter', ['ui.router', 'ngResource', 'myApp.functions'])
	
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider
    	.state('view2c', {
    		url: '/view2c',
    		 templateUrl: 'forms/filter/filter.html',
	        controller: 'FriendsController'
        })
	}])	
	
//	.config(['$routeProvider', function($routeProvider) {
//		  $routeProvider.when('/view2c', {
//			templateUrl: 'forms/filter/filter.html',
//			controller: 'FriendsController'
//		  });
//	}])
	
	.controller('FriendsController', ['$scope', 'friendsFactory', function($scope, friendsFactory) {
	//$scope.greeting = 'Hola!';
	
		friendsFactory.getFriends()
		    .then(function(data) {
		        $scope.friends = data;
		        return data;
		    }, function(error) {
		        $scope.friends = 'Unable to retrieve friends\' data';
		    })
		    .finally(function() {
		        console.log('Finished at:', new Date());
	        });
	}])
		
	.controller('WeatherController', ['$scope', 'weatherService', function($scope, weatherService) {
		var weatherReport =  function() {
		    weatherService.getWeather()
		        .then(function(data) {
		            $scope.weather = data;
		        }, function(error) {
		            $scope.weather = 'Unable to get weather report';
	            });
	    }();
	}])
	
})