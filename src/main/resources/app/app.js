(function () {
    'use strict';

    define(['angular',
        'events/directivesAndTemplates',
        'forms/empl/newEmplForm',
        'forms/empl/searchEmplForm',
        'd3js/d3js',
        'carousel/carousel',
        'sockio/sockclient',
        'scope/scope',
        'promises/story',
        'filters/filters'
    ], function (angular) {
        angular.module('myApp', ['ui.router', 'ui.bootstrap',
            'myApp.view1.directivesAndTemplates',
            'myApp.view2a.newEmplForm',
            'myApp.view2b.searchEmplForm',
            'myApp.view3.carousel',
            'myApp.view4.d3js',
            'myApp.view5.sockio',
            'myApp.view6.scope',
            'myApp.view7.story',
            'myApp.view8.filters'
        ])
            .controller('TabController', ['$scope', '$state', function ($scope, $state) {
                var self = this;
                self.tabs = [
                    {route: 'main.view1', title: "Directives and Templates", active: false},
                    {
                        route: '', title: "Forms", active: false,
                        dropdown: [
                            {route: 'main.view2a', title: "NewForm", active: false},
                            {route: 'main.view2b', title: "SearchForm", active: false},
                        ]
                    },
                    {route: 'main.view3', title: "Carousel", active: false},
                    {route: 'main.view4', title: "D3", active: false},
                    {route: 'main.view5', title: "SockIO", active: false},
                    {route: 'main.view6', title: "Scope", active: false},
                    {route: 'main.view7', title: "Promises", active: false},
                    {route: 'main.view8', title: "Filters", active: false},
                ];

                self.go = function (route) {
                    if (route) {
                        $state.go(route);
                    }
                };

                self.active = function (route) {
                    return $state.is(route);
                };

                $scope.$on("$stateChangeSuccess", function () {
                    self.tabs.forEach(function (tab) {
                        tab.active = self.active(tab.route);
                    });
                });

            }])

            .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
                $stateProvider
                    .state('main', {
                        abstract: true,
                        url: '/main',
                        templateUrl: 'tabs/tabs.html',
                        controllerAs: 'tabC',
                        controller: 'TabController'
                    })
                    .state('main.view1', {
                        url: '/view1',
                        templateUrl: 'events/directivesAndTemplates.html',
                        controllerAs: 'datC',
                        controller: 'DirAndTemplatesCtrl'
                    })
                    .state('main.view2a', {
                        url: '/view2a',
                        templateUrl: 'forms/empl/newEmplForm.html',
                        controllerAs: 'nefC',
                        controller: 'NewEmplController'
                    })
                    .state('main.view2b', {
                        url: '/view2b',
                        templateUrl: 'forms/empl/searchEmplForm.html',
                        controllerAs: 'srchC',
                        controller: 'SearchEmplController'
                    })
                    .state('main.view3', {
                        url: '/view3',
                        templateUrl: 'carousel/carousel.html',
                        controllerAs: 'carouselCtrl',
                        controller: 'CarouselDemoCtrl'
                    })
                    .state('main.view4', {
                        url: '/view4',
                        templateUrl: 'd3js/d3js.html',
                        controllerAs: 'd3C',
                        controller: 'd3Ctrl'
                    })
                    .state('main.view5', {
                        url: '/view5',
                        templateUrl: 'sockio/sockclient.html',
                        controllerAs: 'sockCtrl',
                        controller: 'sockIOController'
                    })
                    .state('main.view6', {
                        url: '/view6',
                        templateUrl: 'scope/scope.html',
                        controller: 'scopeController'
                    })
                    .state('main.view7', {
                        url: '/view7',
                        templateUrl: 'promises/story.html',
                        controllerAs: 'storyCtrl',
                        controller: 'storyController'
                    })
                    .state('main.view8', {
                        url: '/view8',
                        templateUrl: 'filters/filters.html',
                        controllerAs: 'friendsC',
                        controller: 'FriendsController'
                    })
                $urlRouterProvider.otherwise('/main/view7');
            }])
    })
})();