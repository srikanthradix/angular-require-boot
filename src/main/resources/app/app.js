'use strict';

define(['angular', 
        'events/mouse',
        'forms/empl/new',
        'forms/empl/search',
        'forms/filter/filter',
        'd3js/d3js',
        'carousel/carousel',
        'sockio/sockserver',
        'scope/scope',
        'promises/story'
], function(angular) {
	angular.module('myApp', ['ui.router', 'ui.bootstrap', 
	                         'myApp.view1.mouse',
	                         'myApp.view2a.new',
	                         'myApp.view2b.search',
	                         'myApp.view2c.filter',
	                         'myApp.view3.carousel',
	                         'myApp.view4.d3js',
	                         'myApp.view5.sockio',
	                         'myApp.view6.scope',
	                         'myApp.view7.story'
	                         ])
    .controller('TabController', ['$scope', '$state', function($scope, $state) {
        $scope.tabs = [
            {route: 'main.view1', title : "MouseEvents", active : false},
            {route: '', title : "Forms", active : false,
                dropdown: [
                  	{route: 'main.view2a', title : "NewForm", active : false},
                    {route: 'main.view2b', title : "SearchForm", active : false},
                  	{route: 'main.view2c', title : "FormFilters", active : false},
                ]
            },
            {route: 'main.view3', title : "Carousel", active : false},
            {route: 'main.view4', title : "D3", active : false},
            {route: 'main.view5', title : "SockIO", active : false},
            {route: 'main.view6', title : "Scope", active : false},
            {route: 'main.view7', title : "Promises", active : false},
        ];
        
        $scope.go = function(route){
        	if(route) {
        		$state.go(route);
        	}
        };
     
        $scope.active = function(route){
            return $state.is(route);
        };
     
        $scope.$on("$stateChangeSuccess", function() {
            $scope.tabs.forEach(function(tab) {
                tab.active = $scope.active(tab.route);
            });
        });
        
    }])

	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider
    	.state('main', {
    		abstract: true,
    		url: '/main',
    		templateUrl:  'tabs/tabs.html',
	        controller: 'TabController'
        })
        .state('main.view1', {
    		url: '/view1',
    		templateUrl: 'events/mouse.html',
	        controller: 'View1Ctrl'
        })
        .state('main.view2a', {
    		url: '/view2a',
            templateUrl: 'forms/empl/new.html',
            controller: 'NewEmplController'
        })
        .state('main.view2b', {
    		url: '/view2b',
    		templateUrl: 'forms/empl/search.html',
	        controller: 'SearchEmplController'
        })
        .state('main.view2c', {
    		url: '/view2c',
    		 templateUrl: 'forms/filter/filter.html',
	        controller: 'FriendsController'
        })
        .state('main.view3', {
    		url: '/view3',
    		templateUrl:  'carousel/carousel.html',
	        controller: 'CarouselDemoCtrl'
        })
        .state('main.view4', {
    		url: '/view4',
    		templateUrl:  'd3js/d3js.html',
	        controller: 'd3Controller'
        })
        .state('main.view5', {
    		url: '/view5',
    		templateUrl: 'sockio/sockclient.html',
	        controller: 'sockIOController'
        })
        .state('main.view6', {
    		url: '/view6',
    		templateUrl: 'scope/scope.html',
	        controller: 'scopeController'
        })
        .state('main.view7', {
    		url: '/view7',
    		templateUrl:  'promises/story.html',
	        controller: 'storyController'
        })
        $urlRouterProvider.otherwise('/main/view7');
	}])
})