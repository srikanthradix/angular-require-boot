(function () {
    'use strict';

    define(['angular',
        'js/bootstrap/bootstrap'
    ], function (angular) {
        angular.module('myApp', ['ui.router', 'myApp.bootstrap'])

        .config(['$urlRouterProvider', function ($urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
        }])
    })
})();