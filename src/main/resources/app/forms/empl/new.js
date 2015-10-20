/**
 * Created by Srikanth on 8/27/2015.
 */
'use strict';

define([
    'angular',
//    'angularRoute',
    'angularAnimate'
], function(angular) {
	angular.module('myApp.view2a.new', ['ngAnimate', 'ui.router'])

    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    	$stateProvider
    	.state('view2a', {
    		url: '/view2a',
            templateUrl: 'forms/empl/new.html',
            controller: 'NewEmplController'
        })
    	.state('view2a.id', {
    		url: '/view2a/id',
            templateUrl: 'forms/empl/id.html',
        })
        .state('view2a.profile', {
    		url: '/view2a/profile',
            templateUrl: 'forms/empl/profile.html',
        });
    	
    	$urlRouterProvider.otherwise('/view2a');
    }])

    .controller('NewEmplController', ['$scope', '$state', 'empService', function($scope, $state, empService) {
    	$scope.master = $scope.master || {};
    	$scope.view2a = $scope.view2a || {};
    	
    	$scope.next = function(emp) {
            angular.extend($scope.master, emp);
        };
        
        $scope.save = function(emp) {
        	angular.extend(emp, $scope.master);
        	empService.save(emp).$promise
        	.then(function(data) {
        		$scope.view2a.message = 'Employee signed up: '+data.id 
        	}, function(error) {
        		console.log(error);
        		$scope.view2a.message = 'There is an error signing up employee. Please contact customer support.'; 
        	})
        	.finally(function() {
        		$scope.reset();
        		$state.go('view2a');
        	});
        };
        
        $scope.search = function(id) {
        	$scope.emps = []
        	empService.get({id:id})
        	.$promise.then(function(data) {
        		$scope.emps.push(data);
        	})
        }

        $scope.reset = function() {
            $scope.emp = $scope.master = {};
        };
    }])
    
    .service('empService', ['$resource', function($resource) {
		  return $resource('/emp/:id', {id: '@_id'}, {
			  	update: {
			  		method: 'PUT' // this method issues a PUT request
			  	}
		  });
    }])
	
    .directive('empAvail', ['empService', function(empService) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$asyncValidators.empAvail = function(modelValue, viewValue) {
                    if(ctrl.$isEmpty(modelValue)) {
                        return true;
                    } else {
                    	//GET http://localhost:8080/emp?id=v
//                		return $http.get('/emp', {params: {id: viewValue}})
                    	return empService.get({id: viewValue})
	            			.$promise.then(
	                            function(data) {
	                                if (data.id === viewValue) {
	                                	ctrl.$setValidity('id', false);
	                                } else {
	                                	ctrl.$setValidity('id', true);
	                                }
	                            }
	                		);
                    }
                };
            }
        };
    }])

    //custom validator for email
//    .directive('emailValidator', function() {
//        var REGEX_EMAIL = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
//        return {
//            require: 'ngModel',
//            link: function(scope, elm, attrs, ctrl) {
//                if(ctrl && ctrl.$validators.email) {
//                    ctrl.$validators.email = function(modelValue) {
//                        return ctrl.$isEmpty(modelValue) || REGEX_EMAIL.test(ctrl.modelValue);
//                    };
//                }
//            }
//        };
//    })
})