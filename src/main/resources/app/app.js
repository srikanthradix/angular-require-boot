(function () {
    'use strict';

    define(['angular',
        'functions/utils',
        'components/version/version',
        'events/directivesAndTemplates',
        'forms/empl/new/newEmplForm',
        'forms/empl/search/searchEmplForm'
    ], function (angular) {
        var app = angular.module('myApp', ['ui.router',
            'myApp.functions',
            'myApp.version',
            'myApp.view1.directivesAndTemplates',
            'myApp.view2a.newEmplForm',
            'myApp.view2b.searchEmplForm'
        ])

        app.controller('TabController', ['$scope', '$state', function ($scope, $state) {
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

        var cacheProviders = {};

        app.getProvider = function () {
            return cacheProviders.$provide;
        }

        app.getCompileProvider = function () {
            return cacheProviders.$compileProvider;
        }

        app.getControllerProvider = function () {
            return cacheProviders.$controllerProvider;
        }

        app.getFilterProvider = function () {
            return cacheProviders.$filterProvider;
        }

        app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
            function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {

                (function () {
                    cacheProviders.$controllerProvider = $controllerProvider;
                    cacheProviders.$compileProvider = $compileProvider;
                    cacheProviders.$filterProvider = $filterProvider;
                    cacheProviders.$provide = $provide;
                })();

                var lazyLoad = function (controllerName) {
                    return ["$q", function ($q) {
                        var deferred = $q.defer();
                        require([controllerName], function () {
                            deferred.resolve();
                        });
                        return deferred.promise;
                    }];
                }

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
                        templateUrl: 'forms/empl/new/newEmplForm.html',
                        controllerAs: 'nefC',
                        controller: 'NewEmplCtrl'
                        //resolve: {
                        //    load: lazyLoad('newEmplCtrl')
                        //}
                    })
                    .state('main.view2b', {
                        url: '/view2b/search',
                        templateUrl: 'forms/empl/search/searchAndUpdateEmplForm.html',
                        controllerAs: 'srchC',
                        controller: 'searchEmplCtrl'
                        //resolve: {
                        //    load: lazyLoad('searchEmplCtrl')
                        //}
                    })
                    .state('main.view3', {
                        url: '/view3',
                        templateUrl: 'carousel/carousel.html',
                        controllerAs: 'crslCtrl',
                        controller: 'carouselCtrl',
                        resolve: {
                            load: lazyLoad('carouselCtrl')
                        }
                    })
                    .state('main.view4', {
                        url: '/view4',
                        templateUrl: 'd3js/d3js.html',
                        controllerAs: 'd3C',
                        controller: 'd3Ctrl',
                        resolve: {
                            load: lazyLoad('d3Ctrl')
                        }
                    })
                    .state('main.view5', {
                        url: '/view5',
                        templateUrl: 'sockio/sockclient.html',
                        controllerAs: 'sockCtrl',
                        controller: 'sockIOCtrl',
                        resolve: {
                            load: lazyLoad('sockIOCtrl')
                        }
                    })
                    .state('main.view6', {
                        url: '/view6',
                        templateUrl: 'scope/scope.html',
                        controller: 'scopeCtrl',
                        resolve: {
                            load: lazyLoad('scopeCtrl')
                        }
                    })
                    .state('main.view7', {
                        url: '/view7',
                        templateUrl: 'promises/story.html',
                        controllerAs: 'storyC',
                        controller: 'storyCtrl',
                        resolve: {
                            load: lazyLoad('storyCtrl')
                        }
                    })
                    .state('main.view8', {
                        url: '/view8',
                        templateUrl: 'filters/filters.html',
                        controllerAs: 'filterC',
                        controller: 'filterCtrl',
                        resolve: {
                            load: lazyLoad('filterCtrl')
                        }
                    })
                $urlRouterProvider.otherwise('/main/view1');
            }])
    })
})();