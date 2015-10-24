(function () {
    'use strict';
    define([
        'angular',
        'functions/utils',
        'components/version/version'
    ], function (angular) {
        angular.module('myApp.view8.filters', ['myApp.functions', 'myApp.version'])

            .controller('FriendsController', ['friendsFactory', function (friendsFactory) {
                var self = this;
                self.greeting = 'Hola!';

                friendsFactory.getFriends()
                    .then(function (data) {
                        self.friends = data;
                    }, function (error) {
                        self.friends = 'Unable to retrieve friends\' data';
                    })
                    .finally(function () {
                        console.log('Finished at:', new Date());
                    });
            }])

            .controller('WeatherController', ['weatherService', function (weatherService) {
                var self = this;
                self.weatherReport = function () {
                    weatherService.getWeather()
                        .then(function (data) {
                            self.weather = data;
                        }, function (error) {
                            self.weather = 'Unable to get weather report';
                        });
                }();
            }])
    })
})();