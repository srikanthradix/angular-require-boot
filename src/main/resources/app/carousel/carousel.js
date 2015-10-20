define([
    'angular',
    'angularAnimate',
    'angularUIBootstrap'
], function(angular) {
	angular.module('myApp.view3.carousel', ['ui.router', 'ngAnimate', 'ui.bootstrap'])
	
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$stateProvider
    	.state('view3', {
    		url: '/view3',
    		 templateUrl:  'carousel/carousel.html',
	        controller: 'CarouselDemoCtrl'
        })
	}])

//    .config(['$routeProvider', function($routeProvider) {
//        $routeProvider.when('/view3', {
//            templateUrl: 'carousel/carousel.html',
//            controller: 'CarouselDemoCtrl'
//        });
//    }])

    .controller('CarouselDemoCtrl', ['$scope', function($scope) {
        $scope.myInterval = 6000;
        $scope.noWrapSlides = false;

        var slides = $scope.slides = [];

        $scope.addSlide = function() {
            var self = this;
            var width = 600 + self.slides.length + 1;
            self.slides.push({
                image: '//placekitten.com/' + width + '/300'
                //text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
                //['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
            });
        };

        for(var i=0; i<4; i++) {
            $scope.addSlide();
        }
    }])

    .controller('DateDemoCtrl', ['$scope', function($scope) {
        $scope.status = {
            opened : false
        }

        $scope.open = function($event) {
            $scope.status.opened = true;
        }

        $scope.disabled = function(date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        }
    }])
})
;