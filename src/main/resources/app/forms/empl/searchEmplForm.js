/**
 * Created by Srikanth on 8/27/2015.
 */
(function() {
'use strict';

define([
    'angular', 'angularUtils'
], function(angular) {
	angular.module('myApp.view2b.searchEmplForm', ['ui.router', 'angularUtils.directives.dirPagination'])

	
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

    .controller('SearchEmplController', ['deptService', function(deptService) {
    	var self = this;
    	self.master = {};
    	
        self.search = function(dept) {
        	self.emps = []
        	if(dept) {
        		deptService.query({dept:dept})
	        		.$promise.then(function(employees) {
		        		if(employees) {
		        			angular.forEach(employees, function(employee) {
		        				self.emps.push(employee);
	        				});
		        		}
	        	})
        	}
        }
        
        self.download = function() {
        	var data = [];
        	angular.forEach(self.emps, function(emp) {
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
        
        self.selectAll = function() {
        	self.emps = self.emps || {};
        	
        	if(self.selectedAll) {
        		self.selectedAll = true;
        	} else {
        		self.selectedAll = false;
        	}
        	
        	angular.forEach(self.emps, function(emp) {
    			emp.selected = self.selectedAll;
        	});       	
        }
        
        self.itemsPerPage = 5;
        self.predicate = 'salary';
        self.reverse = true;
        self.order = function(predicate) {
    		self.reverse = (self.predicate === predicate) ? !self.reverse : false;
	        self.predicate = predicate;
        }

        self.reset = function() {
            self.emp = angular.copy(self.master);
        };
        self.reset();
    }])
	
	.service('deptService', ['$resource', function($resource) {
		  return $resource('/dept/:dept', {dept: '@_dept' });
	}])

})
})();