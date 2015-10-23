define([
    'angular'
], function(angular) {
	angular.module('myApp.view7.story', ['ui.router'])
	
//	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
//		$stateProvider
//    	.state('view7', {
//    		url: '/view7',
//    		templateUrl:  'promises/story.html',
//	        controller: 'storyController'
//        })
//	}])
	
	//all of them should return to display
	.service('storyService', ['$q', '$http', '$timeout', 'http_defaults', function($q, $http, $timeout, http_defaults) {
		var self = this;
		var promises = [ ];
		
		self.getText = function(urls) {
			angular.forEach(urls, function(url) {
				var promise = 
						$http({
							url   : 'static/story/' + url + '.json',
				            method: 'GET',
				            timeout: 5000
						}, http_defaults);
				promises.push(promise);
			})
			return $q.all(promises);
		}
	}])
	
	//some of them which returned first are displayed
	.service('storyServiceUsingMap', ['$q', '$http', '$timeout', 'http_defaults', function($q, $http, $timeout, http_defaults) {
		var self = this;
		self.getText = function(urls) {
	        var promises = urls.map(function(chapter) {
	            return $http({ 
	            	url: 'static/story/' + chapter + '.json', 
	            	method: 'GET',
	            	timeout: 5000
        		}, http_defaults);
	        });
	        return $q.all(promises);
	    }
	}])
	
	.controller('storyController', ['storyService', 'storyServiceUsingMap', '$scope', function(storyService, storyServiceUsingMap, $scope) {
		  var firstChapters = ['chapter-1', 'chapter-2'];
		  storyService.getText(firstChapters)
		  	.then(function(responses) {
		  		$scope.chapter1 = responses[0].data;
  		        $scope.chapter2 = responses[1].data;
			  })
			  
		  var lastChapters = ['chapter-3', 'chapter-4'];
		  storyServiceUsingMap.getText(lastChapters)
		  	.then(function(responses) {
		  		$scope.chapter3 = responses[0].data;
  		        $scope.chapter4 = responses[1].data;
			  })			  
	}])
	
	
	
	.value('http_defaults', {
	    timeout: 2000
	  })
	
})