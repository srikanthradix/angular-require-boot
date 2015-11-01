/**
 * Created by Srikanth on 8/27/2015.
 */
(function () {
    'use strict';

    define(['angular',
        'js/functions/constants',
        'js/functions/utils',
        'js/components/version/version',
        'js/events/directivesAndTemplates',
        'js/forms/empl/new/newEmplForm',
        'js/forms/empl/search/searchEmplForm'
    ], function (angular) {
        var app = angular.module('myApp.bootstrap', ['ui.router',
            'myApp.constants',
            'myApp.functions',
            'myApp.version',
            'myApp.directivesAndTemplates',
            'myApp.newEmplForm',
            'myApp.searchEmplForm'
        ])

            .config(["NAV", '$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
                function (NAV, $stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {

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
                    };
                    $stateProvider
                        .state(NAV.HOME, {
                            url: '/',
                            views: {
                                '': {
                                    templateUrl: 'html/home/home.html'
                                },
                                'nav-menu@home': {
                                    templateUrl: 'html/nav/menu.html',
                                    controllerAs: 'tabC',
                                    controller: 'TabController'
                                },
                                'body@home': {
                                    templateUrl: 'html/events/directivesAndTemplates.html',
                                    controllerAs: 'datC',
                                    controller: 'DirAndTemplatesCtrl'
                                }
                            }
                        })
                        .state(NAV.NEW_EMP.PAGE, {
                            url: '/new-employee',
                            views: {
                                'body@home': {
                                    templateUrl: 'html/forms/empl/new/newEmplForm.html',
                                    controllerAs: 'nefC',
                                    controller: 'NewEmplCtrl'
                                }
                            }
                        })
                        .state(NAV.LIST_EMP.PAGE, {
                            url: '/list-employees',
                            views: {
                                'body@home': {
                                    templateUrl: 'html/forms/empl/search/searchAndUpdateEmplForm.html',
                                    controllerAs: 'srchC',
                                    controller: 'searchEmplCtrl'
                                }
                            }
                        })
                        .state(NAV.D3, {
                            url: '/d3',
                            views: {
                                'body@home': {
                                    templateUrl: 'html/d3js/d3js.html',
                                    controllerAs: 'd3C',
                                    controller: 'd3Ctrl',
                                    resolve: {
                                        load: lazyLoad('d3Ctrl')
                                    }
                                }
                            }
                        })
                        .state(NAV.CAROUSEL, {
                            url: '/carousel',
                            views: {
                                'body@home': {
                                    templateUrl: 'html/carousel/carousel.html',
                                    controllerAs: 'crslCtrl',
                                    controller: 'carouselCtrl',
                                    resolve: {
                                        load: lazyLoad('carouselCtrl')
                                    }
                                }
                            }
                        })
                        .state(NAV.SOCK_IO, {
                            url: '/sock-io',
                            views: {
                                'body@home': {
                                    templateUrl: 'html/sockio/sockclient.html',
                                    controllerAs: 'sockCtrl',
                                    controller: 'sockIOCtrl',
                                    resolve: {
                                        load: lazyLoad('sockIOCtrl')
                                    }
                                }
                            }
                        })
                        .state(NAV.SCOPE, {
                            url: '/scopes',
                            views: {
                                'body@home': {
                                    templateUrl: 'html/scope/scope.html',
                                    controller: 'scopeCtrl',
                                    resolve: {
                                        load: lazyLoad('scopeCtrl')
                                    }
                                }
                            }
                        })
                        .state(NAV.PROMISES, {
                            url: '/promises',
                            views: {
                                'body@home': {
                                    templateUrl: 'html/promises/story.html',
                                    controllerAs: 'storyC',
                                    controller: 'storyCtrl',
                                    resolve: {
                                        load: lazyLoad('storyCtrl')
                                    }
                                }
                            }
                        })
                        .state(NAV.FILTERS, {
                            url: '/filters',
                            views: {
                                'body@home': {
                                    templateUrl: 'html/filters/filters.html',
                                    controllerAs: 'filterC',
                                    controller: 'filterCtrl',
                                    resolve: {
                                        load: lazyLoad('filterCtrl')
                                    }
                                }
                            }
                        })

                    $urlRouterProvider.otherwise("/");
                }])

            .controller('TabController', ['NAV', '$scope', '$state', function (NAV, $scope, $state) {
                var self = this;
                self.tabs = [
                    {route: NAV.HOME, title: "Directives and Templates"},
                    {
                        route: '', title: "Forms",
                        dropdown: [
                            {route: NAV.NEW_EMP.ID, title: "NewForm"},
                            {route: NAV.LIST_EMP.SEARCH.PAGE, title: "SearchForm"},
                        ]
                    },
                    {route: NAV.CAROUSEL, title: "Carousel"},
                    {route: NAV.D3, title: "D3"},
                    {route: NAV.SOCK_IO, title: "SockIO"},
                    {route: NAV.SCOPE, title: "Scope"},
                    {route: NAV.PROMISES, title: "Promises"},
                    {route: NAV.FILTERS, title: "Filters"},
                ];

                self.go = function (route) {
                    if (route) {
                        $state.go(route);
                    }
                };

                self.active = function (route) {
                    return $state.is(route);
                };
            }]);

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

    })
})();