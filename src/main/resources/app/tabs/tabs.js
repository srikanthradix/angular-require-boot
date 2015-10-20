'use strict';

define(['angular'
], function(angular) {
	angular.module('myApp.tabs', [])
    .controller('TabController', ['$scope', function($scope) {
        $scope.tabs = [
            {link: '.view1', label : "MouseEvents", ngview : true},
            {link: '#', label : "Forms", ngview : false,
                subtabs: [
                  	{link: '.view2a', label : "NewForm", ngview : true},
                    {link: '.view2b', label : "SearchForm", ngview : false},
                  	{link: '.view2c', label : "FormFilters", ngview : false}
                ]
            },
            {link: '.view3', label : "Carousel", ngview : false},
            {link: '.view4', label : "D3", ngview : false},
            {link: '.view5', label : "SockIO", ngview : false},
            {link: '.view6', label : "Scope", ngview : false},
        ];

    }]);
})