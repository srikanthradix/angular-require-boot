'use strict';

define([
    'angular',
//    'components/version/version-directive',
//    'components/version/interpolate-filter'
], function(angular) {//}, versionDirective, interpolateFilter) {
		
	angular.module('myApp.version', [
//	  'myApp.version.interpolate-filter',
//	  'myApp.version.version-directive'
	])
	
	.directive('appVer', ['version', function(version){
	   return function(scope, elm, attrs) {
	      elm.text(version);
	   } ;
	}])
	
	.filter('interpolated', ['version', function(version) {
	    return function(text) {
	        return String(text).replace(/\%VERSION\%/mg, version);
	    };
	}])
	
	.filter('capitalize', [function() {
	    return function(text) {
	        if(!text) {
	            return ' ';
	        }
	        return String(text).toUpperCase();
	    }
	}])
	
	
	    //.directive('appVer', ['version', function(version) {
	    //    return function(scope, elm, attrs) {
	    //        elm.text(version);
	    //    };
	    //}]);
	
	.value('version', '0.3');
})
