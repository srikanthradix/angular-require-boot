(function() {
'use strict';
define([
    'angular',
    'angularAnimate',
    'angularUIBootstrap'
], function(angular) {
	angular.module('myApp.view3.carousel', ['ui.router', 'ngAnimate', 'ui.bootstrap'])
	
//	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
//		$stateProvider
//    	.state('view3', {
//    		url: '/view3',
//    		 templateUrl:  'carousel/carousel.html',
//	        controller: 'CarouselDemoCtrl'
//        })
//	}])

//    .config(['$routeProvider', function($routeProvider) {
//        $routeProvider.when('/view3', {
//            templateUrl: 'carousel/carousel.html',
//            controller: 'CarouselDemoCtrl'
//        });
//    }])

    .controller('CarouselDemoCtrl', [function() {
    	var self = this;
        self.myInterval = 6000;
        self.noWrapSlides = false;

        var slides = self.slides = [];

        self.addSlide = function() {
            var self = this;
            var width = 600 + self.slides.length + 1;
            self.slides.push({
                image: '//placekitten.com/' + width + '/300'
                //text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
                //['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
            });
        };

        for(var i=0; i<4; i++) {
            self.addSlide();
        }
    }])

    .controller('DateDemoCtrl', [function() {
    	var self = this;
        self.status = {
            opened : false
        }

        self.open = function($event) {
            self.status.opened = true;
        }

        self.disabled = function(date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        }
    }])
})
})();