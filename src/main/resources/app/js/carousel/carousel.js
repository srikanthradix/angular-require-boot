(function() {
'use strict';
define([
    'angular',
    'angularAnimate',
    'angularUIBootstrap'
], function(angular) {
	angular.module('myApp.carousel', ['ui.router', 'ui.bootstrap', 'ngAnimate'])

    angular.module('myApp.bootstrap')
        .getControllerProvider()
        .register('carouselCtrl', [function() {
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

        for(var i=0; i<3; i++) {
            self.addSlide();
        }
    }])

    angular.module('myApp.bootstrap')
        .getCompileProvider()
        .directive('myCarousel', ['$compile',function($compile){
        function link(scope, element, attrs, crslC) {
            scope.$watch(angular.bind(crslC, function () {
                return crslC.slides;
            }), function (newVal, oldVal) {
                if (newVal === oldVal) {
                    return;
                }
            }, true);
        }
        return {
            link: link,
            restrict: 'E',
            scope: {},
            controller: function () {},
            controllerAs: 'crslC',
            bindToController: {
                slides : '=',
                myInterval : '=',
                noWrapSlides : '='
            },
            templateUrl : '../../html/templates/carousel-tpl.html'
        };
    }]);

    angular.module('myApp.bootstrap')
        .getControllerProvider()
        .register('DateCtrl', [function() {
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