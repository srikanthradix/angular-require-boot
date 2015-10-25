(function () {
    'use strict';
    define([
        'angular'
    ], function (angular) {
        angular.module('myApp.view8.filters', [ ])

        angular.module('myApp')
            .getControllerProvider()
            .register('filterCtrl', ['friendsFactory', 'weatherService', function (friendsFactory, weatherService) {
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