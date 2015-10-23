/**
 * Created by Srikanth on 9/1/2015.
 */
define([
    'angular',
    'd3'
], function(angular) {
	angular.module('myApp.view4.d3js', ['ui.router'])
	
//	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
//		$stateProvider
//    	.state('view4', {
//    		url: '/view4',
//    		 templateUrl:  'd3js/d3js.html',
//	        controller: 'd3Controller'
//        })
//	}])
	
//    .config(['$routeProvider', function($routeProvider) {
//        $routeProvider.when('/view4', {
//            templateUrl: 'd3js/d3js.html',
//            controller: 'd3Controller'
//        });
//    }])

    .controller('d3Controller', ['$scope', 'mapFactory', 'scales', 'tracker', function($scope, mapFactory, scaleService, tracker) {

        $scope.chartData = [10,20,30,40,50];
        $scope.matrixData = [
            [11975,  5871, 8916, 2868],
            [ 1951, 10048, 2060, 6171],
            [ 8010, 16145, 8090, 8045],
            [ 1013,   990,  940, 6907]
        ];
        $scope.percent = tracker.getPercent();
        
        //circleService.circle();
        //lineService.line();
        //treeService.tree();
        //mapFactory.showUSAMap();
        scaleService.showRect();

        //This is to keep track of changes in the percent.
        $scope.$watch(
            function(){ return tracker.getPercent() },
            function(newVal) {
              $scope.percent = newVal;
            }
        );

        tracker.progress();
        
    }])

    .service('tracker', ['d3Service', '$timeout', function(d3Service, $timeout) {

        this.percent = '40%';
        var self = this;
        return {
            getPercent: function() {
                return self.percent;
            },

            progress: function() {
                $timeout(function () {
                    //$timeout(callback) will wait until the current digest cycle (if any) is done, then execute the callback, then run at the end a full $apply.
                    self.percent = '100%';
                }, 2000);
                return self.percent;
            }
        }
    }])

    .service('scales', ['d3Service', function(d3Service) {
        var d3 = d3Service.d3();
        var data = [20, 40, 50];

        return {
            showRect: function() {

                var width = 600;
                var height = 500;

                var widthScale = d3.scale.linear()
                    .domain([0,50])
                    .range([0,500])

                var axis = d3.svg.axis()
                    .scale(widthScale);

                var colorScale = d3.scale.linear()
                    .domain([0,50])
                    .range(["blue", "red"])

                var canvas = d3.select('#scales')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .attr('transform', 'translate(5, 20)')

                var bars = canvas.selectAll('rect')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr('fill', function(d){ return colorScale(d); })
                    .attr('width', function(d){ return widthScale(d); })
                    .attr('height', 20)
                    .attr('y', function(d, i){ return 30 * i; })

                canvas.selectAll('text')
                    .data(data)
                    .enter()
                    .append('text')
                    .attr('y', function(d, i) { return (30 * i); })//or 30 * i + 12.5
                    .attr('fill', 'white')
                    .text(function(d) { return d; })
                    .attr('transform', 'translate(0, 12.5)')

                canvas.append('g')
                    .attr('transform', 'translate(0,150)')
                    .call(axis)

            }
        }
    }])

    .factory('d3Service', ['$q', '$window', '$rootScope', '$document', function($q, $window, $rootScope, $document) {

        //var d = $q.defer();
        //
        //function onScriptLoad() {
        //    $rootScope.$apply(function() {
        //        d.resolve($window.d3)
        //    });
        //}
        //
        //var scriptTag = $document.getElementsByTagName("script");
        //scriptTag.onload = onScriptLoad;
        //
        //return {
        //    d3: function() {
        //        return d.promise();
        //    }
        //}

        return {
            d3: function() {
                return $window.d3;
            }
        }

    }])

    .service("mercatorService", ['d3Service', function(d3Service) {
        var self = this;
        return {
            showMap : function(data) {
                var d3 = d3Service.d3();

                var canvas = d3.select('body')
                    .append('svg')
                    .attr('width', 750)
                    .attr('height', 750)

                var group = canvas.selectAll('g')
                    //.data(features)
                    .data(data.features)
                    .enter()
                    .append('g');

                var projection = d3.geo.mercator()
                var path = d3.geo.path().projection(projection);

                var areas = group.append('path')
                    .attr('d', path)
                    //.attr('class', 'area')
                    .attr('fill', 'steelblue')

                group.append('text')
                    .attr('x', function(d) { return path.centroid(d)[0]; } )
                    .attr('y', function(d) { return path.centroid(d)[1]; } )
                    .attr('text-anchor', 'middle')
                    .text(function(d){ return d.properties.name; })
            }
        };
    }])

    .factory("mapFactory", ['mapDataService', 'mercatorService', function(mapDataService, mercatorService) {
        var self = this;
        return {
            showUSAMap : function() {
                mapDataService.getDataForUSAMap()
                    .then(function(data) {
                        mercatorService.showMap(data);
                    }, function(error) {
                        console.log('Error retrieving map data for USA, '+error)
                    })
                    .finally(function() {
                        console.log('Finished at :'+new Date());
                    })

                //var canvas = d3.select('body')
                //    .append('svg')
                //    .attr('width', 500)
                //    .attr('height', 500)
                //
                //d3.json('static/USA.geo.json', function(data) {
                //
                //    var group = canvas.selectAll('g')
                //            //.data(features)
                //            .data(data.features)
                //            .enter()
                //            .append('g');
                //
                //    var projection = d3.geo.mercator();
                //    var path = d3.geo.path().projection(projection);
                //
                //    var areas = group.append('path')
                //        .attr('d', path)
                //        //.attr('class', 'area')
                //        .attr('fill', 'steelblue')
                //
                //});
            }
        };
    }])

    .directive('barChart', ['d3Service', function(d3Service) {

        var myDirective = {

            scope: {
                chartData: '=',
                matrixData: '='
            },

            restrict: 'EA',

            replace: false,

            link: function (scope, elem, attrs) {
                var data = attrs.chartData.split(',');
                var d3 = d3Service.d3();
                var chart = d3.select(elem[0]);

                chart
                	.append("div")
                    .attr("class", "chart")

                    //returns an array of all <div>...</div> elements in div
                    .selectAll("div")
                        .data(scope.chartData)
                    .enter()
                        .append("div")
                        .transition().ease("elastic")
                        .style("width", function (d) {
                            return d + "%"
                        })
                        .text(function (d) {
                            return d + "%"
                        });
            }
        }
        return myDirective;
    }])

    .directive('matrix', ['d3Service', function(d3Service) {

        var myDirective = {

            scope: {
                matrixData: '=matrixData'
            },

            restrict: 'EA',

            replace: false,

            link: function (scope, elem, attrs) {
                var d3 = d3Service.d3();
                var matrix = d3.select(elem[0]);

                var tr = matrix
                    .append("table")
                    .selectAll("tr")
                    .data(scope.matrixData)
                    .enter()
                    .append("tr");

                var td = tr.selectAll("td")
                    .data(function(d) {
                        return d;
                    })
                    .enter()
                    .append("td")
                    .data(function(d) {
                        return d;
                    });
            }
        }
        return myDirective;
    }])

    .factory('circleService', ['d3Service', function(d3Service) {

        var data = [10, 20, 30]

        return {
                circle : function () {
                    var d3 = d3Service.d3();
                    //d3.select("body").append("p").html("First paragraph");
                    //d3.select("body").append("p").html("Second paragraph").attr("class", "p2");
                    //d3.select("body").append("p").html("Third paragraph").attr("id", "p3");

                    //d3.select(".p2").html("I'm classy");
                    //d3.select("#p3").html("I've got ideas");

                    //d3.selectAll("p").style("font-weight", "bold");

                    //d3.select("p").append("span")
                    //    .html("I'm a rebel child")
                    //    .style("background-color", "firebrick");

                    //d3.selectAll("p")
                    //    .style("background-color", "aliceblue");
                    //
                    //d3.selectAll("*")
                    //    .style("background-color", "whitesmoke");
                    //
                    //d3.selectAll("p, span")
                    //    .style("background-color", "lawngreen");
                    //
                    //d3.selectAll("*")
                    //    .style("background-color", "whitesmoke");

                    //d3.select("body")
                    //    .append("span")
                    //    .html("select me if you can");

                    //d3.selectAll("span")
                    //    .style("font-weight", "bold");
                    //
                    //d3.selectAll("p")
                    //    .append("span")
                    //    .style("font-weight", null);

                    //d3.selectAll("p:not(body)")
                    //    .style("font-weight", "bold");

                    //d3.selectAll("p")
                    //    //.data(["10", "20", "30"])
                    //    .style("font-size", function(d, i) {
                    //        return 10*(i+1)+"px";
                    //    })

                    var canvas = d3.select("body")
                        .append("svg")
                        .attr("width", "500")
                        .attr("height", "500");

                    canvas.append("circle")
                        .attr("cx", "10")
                        .attr("cy", "10")
                        .attr("r", "5");

                    canvas.append("circle")
                        .attr("cx", "25")
                        .attr("cy", "10")
                        .attr("r", "5");

                    canvas.selectAll("circle")
                        .data(data)
                            .attr("fill", "red")//update.
                        .enter()//create.
                            .append("circle")
                            .attr("cx", function(d, i){return (10*(i+1))+15})
                            .attr("cy", function(d, i){return 10})
                            .attr("r", function(d){return 5;})
                            .attr("fill", "green")

                    canvas.selectAll("circle")
                        .data(data)
                        .exit()//exit selection represents the circles that are unmatched by using the data.
                            .attr("fill", "blue")


            }
        }
    }])

    .factory('lineService', ['d3Service', function(d3Service) {
        var data = [
            {x: 50, y: 100},
            {x: 100, y: 150},
            {x: 150, y: 200}
        ]

        return {
            line: function () {
                var d3 = d3Service.d3();

                var canvas = d3.select("body")
                    .append("svg")
                    .attr("width", "500")
                    .attr("height", "500")

                var group = canvas.select("g")
                    .attr("transform", "translate(100, 100)")

                var line = d3.svg.line()
                    .x(function(d) { return d.x; })
                    .y(function(d) { return d.y; })

                group.selectAll("path")
                        .data([data])
                     .enter()
                        .append("path")
                        .attr("d", line)
                        .attr("fill", "none")
                        .attr("stroke", "black")
                        .attr("stroke-width", 10);
            }
        }
    }])

    .factory('treeService', ['d3Service', 'familyService', function(d3Service, familyService) {

        return {
            tree : function() {
                var family = familyService.getFamily()
                                .then(function(data) {
                                    return data;
                                });

                var d3 = d3Service.d3();

                var canvas = d3.select("body")
                    .append("svg")
                    .attr("width", "500")
                    .attr("height", "500");

                d3.json("static/family.json", function(data) {

                    var treemap = d3.layout.treemap()
                        .size([500, 500])
                        .nodes(data)

                    console.log(treemap)

                    var cells = canvas.selectAll(".class")
                        .data(family)
                        .enter()
                        .append("g")
                        .attr("class", "cell")

                    cells.append("rect")
                        .attr("x", function(d) { return d.x; })
                        .attr("y",function(d) { return d.y; })
                        .attr("width",function(d) { return d.dx; })
                        .attr("height",function(d) { return d.dy; })
                });
            }
        }
    }])
})
;


