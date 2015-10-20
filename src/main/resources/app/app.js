'use strict';

define([
        'angular',
        'tabs/tabs',
        'events/mouse',
        'forms/empl/new',
        'forms/empl/search',
        'forms/filter/filter',
        'd3js/d3js',
        'carousel/carousel',
        'sockio/sockserver',
        'scope/scope'
], function(
		angular
	) {
	return angular.module('myApp', [
       'ui.router',
       'myApp.tabs',
       'myApp.view1.mouse',
       'myApp.view2a.new',
       'myApp.view2b.search',
       'myApp.view2c.filter',
       'myApp.view3.carousel',
       'myApp.view4.d3js',
       'myApp.view5.sockio',
       'myApp.view6.scope'
   ])
   
   .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    	$urlRouterProvider.otherwise('/view1');
    }])   
           
//    .config(['$routeProvider', function($routeProvider) {
//    	$routeProvider.otherwise({redirectTo: '/view1'});
//    }])

//    .run(['$rootScope', '$location', '$routeParams', function($rootScope, $location, $routeParams) {
//        $rootScope.$on('$routeChangeSuccess', function(scope, current, pre) {
//            console.log('Current route name: ' + $location.path());
//            console.log($routeParams);
//        })
//    }])
})

;


