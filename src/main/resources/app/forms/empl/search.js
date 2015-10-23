/**
 * Created by Srikanth on 8/27/2015.
 */
'use strict';

define([
    'angular', 'angularUtils'
], function(angular) {
	angular.module('myApp.view2b.search', ['ui.router', 'angularUtils.directives.dirPagination'])

	
//	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
//		$stateProvider
//    	.state('view2b', {
//    		url: '/view2b',
//    		 templateUrl: 'forms/empl/search.html',
//	        controller: 'SearchEmplController'
//        })
//	}])
	
//    .config(['$routeProvider', function($routeProvider) {
//        $routeProvider.when('/view2b', {
//            templateUrl: 'forms/empl/search.html',
//            controller: 'SearchEmplController'
//        });
//    }])

    .controller('SearchEmplController', ['$scope', 'deptService', function($scope, deptService) {
    	$scope.master = {};
    	
        $scope.search = function(dept) {
        	$scope.emps = []
        	if(dept) {
        		deptService.query({dept:dept})
	        		.$promise.then(function(employees) {
		        		if(employees) {
		        			angular.forEach(employees, function(employee) {
		        				$scope.emps.push(employee);
	        				});
		        		}
	        	})
        	}
        }
        
        $scope.download = function() {
        	var data = [];
        	angular.forEach($scope.emps, function(emp) {
        		var row = emp.id + ",";
        		row = row + emp.name + ",";
        		row = row + emp.salary  + ",";
        		row = row + emp.department.name  + ",";
        		data.push(row);
        	});
        	var anchor = angular.element('<a/>');
            anchor.attr({
                href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
                target: '_blank',
                download: 'filename.csv'
            })[0].click();
        }
        
        $scope.selectAll = function() {
        	$scope.emps = $scope.emps || {};
        	
        	if($scope.selectedAll) {
        		$scope.selectedAll = true;
        	} else {
        		$scope.selectedAll = false;
        	}
        	
        	angular.forEach($scope.emps, function(emp) {
    			emp.selected = $scope.selectedAll;
        	});       	
        }
        
        $scope.itemsPerPage = 5;
        $scope.predicate = 'salary';
        $scope.reverse = true;
        $scope.order = function(predicate) {
    		$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
	        $scope.predicate = predicate;
        }

        $scope.reset = function() {
            $scope.emp = angular.copy($scope.master);
        };
        $scope.reset();
    }])
	
	.service('deptService', ['$resource', function($resource) {
		  return $resource('/dept/:dept', {dept: '@_dept' });
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