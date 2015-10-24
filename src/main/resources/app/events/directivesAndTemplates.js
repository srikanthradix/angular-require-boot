(function() {
'use strict';
	define([
    'angular',
    'components/version/version'
], function(angular) {
	angular.module('myApp.view1.directivesAndTemplates', ['ui.router', 'myApp.version'])
	
//	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
//		$stateProvider
//    	.state('view1', {
//    		url: '/view1',
//    		 templateUrl: 'events/mouse.html',
//	        controller: 'View1Ctrl'
//        })
//	}])
	
//    .config(['$routeProvider', function($routeProvider) {
//      $routeProvider.when('/view1', {
//        templateUrl: 'events/mouse.html',
//        controller: 'View1Ctrl'
//      });
//    }])
	
    .directive('mouseEventsDirective', function() {
        return {
            link: function($scope, $elm, $attrs) {
                $elm.bind('mouseenter', function() {
                    $elm.css('background-color', 'yellow');
                    $elm.text('Entered');
                });
                $elm.bind('mouseleave', function(){
                    $elm.css('background-color', 'white');
                    $elm.text('Exited');
                });
            }
        };
    })

    .controller('DirAndTemplatesCtrl', [function() {
    	
    	var self = this;
    	self.expand_collapse = function(data) {
            data.show = !data.show;
        }
    	self.deleteNode = function(data) {
            data.nodes = []
        }
    	self.addNode = function(data) {
            var noOfNodes = data.nodes.length + 1;
            var newName = data.name + '-' + noOfNodes
            data.nodes.push(
                {   name: newName,
                    nodes: [],
                    currencies: [
                        {name: 'USD'},
                        {name: 'EUR'},
                        {name: 'GBP'}
                    ],
                    show: true
                }
            );
        }
    	self.tree = [
            {   name: 'Node',
                nodes: [],
                currencies: [
                    {name: 'USD'},
                    {name: 'EUR'},
                    {name: 'GBP'}
                ],
                show: true
            }
        ];
        
    	self.loginData = false;
    	self.login = function() {
    		self.loginData = true;
        };
        self.logout = function() {
        	self.loginData = false;
        }

    }])

    .directive( 'editInPlace', function() {
        return {
            restrict: 'E',
            scope: { value: '=' },
            transclude: true,

            template: '<span ng-click="edit()" ng-bind="value.name"></span>' +
                        '<input ng-model="value.name"></input>',

            link: function ( $scope, element, attrs ) {
                // Let's get a reference to the input element, as we'll want to reference it.
                var inputElement = angular.element( element.children()[1] );

                // This directive should have a set class so we can style it.
                element.addClass( 'edit-in-place' );

                // Initially, we're not editing.
                $scope.editing = false;

                // ng-click handler to activate edit-in-place
                $scope.edit = function () {
                    $scope.editing = true;

                    // We control display through a class on the directive itself. See the CSS.
                    element.addClass( 'active' );

                    // And we must focus the element.
                    // `angular.element()` provides a chainable array, like jQuery so to access a native DOM function,
                    // we have to reference the first element in the array.
                    inputElement[0].focus();
                };

                // When we leave the input, we're done editing.
                inputElement.prop( 'onblur', function() {
                    $scope.editing = false;
                    element.removeClass( 'active' );
                });
            }
        };
    })

})
})();

