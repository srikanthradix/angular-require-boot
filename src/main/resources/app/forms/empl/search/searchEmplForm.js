/**
 * Created by Srikanth on 8/27/2015.
 */
(function () {
    'use strict';

    define([
        'angular', 'angularResource', 'angularUtils'//, 'ngReactGrid'
    ], function (angular) {
        angular.module('myApp.view2b.searchEmplForm', ['ui.router', 'ngResource', 'angularUtils.directives.dirPagination'])

            //angular.module('myApp')
            //    .getControllerProvider()
            //    .register
            .controller('searchEmplCtrl', ['srchFormService', '$state', function (srchFormService, $state) {
                var self = this;
                self.itemsPerPage = srchFormService.getItemsPerPage();
                self.predicate = srchFormService.getPredicate();
                self.reverse = srchFormService.getReverse();

                self.search = function (dept) {
                    self.emps = srchFormService.search(dept);
                }
                self.navigate = function (route) {
                    $state.go(route);
                }
                self.removeEmployee = function (emp) {
                    self.emps = srchFormService.removeEmployee(emp);
                }
                self.updateEmployee = function(emp) {
                    self.emps = srchFormService.updateEmployee(emp);
                }
                self.order = function (predicate) {
                    srchFormService.order(predicate);
                    self.predicate = srchFormService.getPredicate();
                    self.reverse = srchFormService.getReverse();
                }
                self.setItemsPerPage = function (itemsPerPage) {
                    srchFormService.setItemsPerPage(itemsPerPage);
                    self.itemsPerPage = itemsPerPage;
                }
                self.selectAll = srchFormService.selectAll;
                self.download = srchFormService.download;
                self.reset = srchFormService.reset;

                self.reset();

            }])

            //angular.module('myApp')
            //    .getProvider()
            .service('empReactRenderer', ['React', function (React) {
                var self = this;
                self.render = function () {
                    var employees = this.props.employees;

                    var rows = employees.map(function (datum) {
                        var clickHandler = function (ev) {
                            console.log('in ReactJS');
                            console.log(ev);
                        };

                        return (
                            React.DOM.tr({onClick: clickHandler},
                                React.DOM.td(null, datum[0]),
                                React.DOM.td(null, datum[1]),
                                React.DOM.td(null, datum[2]),
                                React.DOM.td(null, datum[3])
                            )
                        );
                    });

                    return (
                        React.DOM.table(null, rows)
                    );
                };

                self.create = function () {
                    return React.createClass({
                        displayName: 'MyEmployeeReactList',
                        render: self.render
                    });
                }
            }])

            //angular.module('myApp')
            //    .getCompileProvider()
            .directive('displayWithReact', ['React', 'empReactRenderer', function (React, empReactRenderer) {
                var self = this || {};

                self.link = function (scope, elem, attrs, reactCtrl) {
                    scope.$watch(angular.bind(this, function () {
                        //this is the "this" parent directive, not a child
                        var employees = reactCtrl.employees;
                    }), function (newVal, oldVal) {
                        var myEmpReactRenderer = empReactRenderer.create();
                        React.renderComponent(myEmpReactRenderer({employees: newVal}), elem[0]);
                    })
                }

                return {
                    restrict: 'E',

                    scope: {},
                    controllerAs: 'reactCtrl',
                    controller: function () {

                    },
                    bindToController: {
                        employees: '='
                    },

                    link: self.link
                }
            }])

            // Inline edit directive
            .directive('editableField', ['$timeout', function ($timeout) {
                var self = this || {};
                self.link = function (scope, elm, attr, editCtrl) {
                    var previousValue;

                    editCtrl.edit = function () {
                        editCtrl.editMode = true;
                        previousValue = editCtrl.model;

                        $timeout(function () {
                            elm.find('input')[0].focus();
                        }, 0, false);
                    };
                    editCtrl.save = function () {
                        editCtrl.editMode = false;
                        editCtrl.someCtrlFn({value: editCtrl.model});
                    };
                    editCtrl.cancel = function () {
                        editCtrl.editMode = false;
                        editCtrl.model = previousValue;
                    };
                }
                return {
                    scope: {},
                    controllerAs: 'editCtrl',
                    controller: function () {
                    },
                    bindToController: {
                        model: '=editableField',
                        someCtrlFn: '&onSave'
                    },
                    transclude: true,
                    link: self.link,
                    templateUrl: '../../../templates/inline-edit.html'
                };
            }])

            //angular.module('myApp')
            //    .getProvider()
            .service('deptService', ['$resource', function ($resource) {
                return $resource('/dept/:dept', {dept: '@_dept'});
            }])

            //angular.module('myApp')
            //    .getProvider()
            .service('srchFormService', ['deptService', function (deptService) {
                var self = this;
                self.master = {};
                self.itemsPerPage = 5;
                self.predicate = 'salary';
                self.reverse = true;
                self.emps = []

                self.setItemsPerPage = function (itemsPerPage) {
                    self.itemsPerPage = itemsPerPage;
                }

                self.getItemsPerPage = function () {
                    return self.itemsPerPage;
                }

                self.getPredicate = function () {
                    return self.predicate;
                }

                self.getReverse = function () {
                    return self.reverse;
                }

                self.search = function (dept) {
                    self.emps = []
                    if (dept) {
                        deptService.query({dept: dept})
                            .$promise.then(function (employees) {
                                if (employees) {
                                    angular.forEach(employees, function (employee) {
                                        self.emps.push(employee);
                                    });
                                }
                            })
                    }
                    return self.emps;
                }

                self.updateEmployee = function (emp) {
                    var index = self.emps.indexOf(emp);
                    console.log('index:'+index);
                    if (~index) {
                        self.emps[index] = emp;
                    }
                    return self.emps;
                }

                self.removeEmployee = function (emp) {
                    var index = self.emps.indexOf(emp);
                    self.emps.splice(index, 1);
                    return self.emps;
                }

                self.order = function (predicate) {
                    self.reverse = (self.predicate === predicate) ? !self.reverse : false;
                    self.predicate = predicate;
                }

                self.selectAll = function () {
                    self.emps = self.emps || {};

                    if (self.selectedAll) {
                        self.selectedAll = true;
                    } else {
                        self.selectedAll = false;
                    }

                    angular.forEach(self.emps, function (emp) {
                        emp.selected = self.selectedAll;
                    });
                }

                self.download = function () {
                    var data = [];
                    angular.forEach(self.emps, function (emp) {
                        var row = emp.id + ",";
                        row = row + emp.name + ",";
                        row = row + emp.salary + ",";
                        row = row + emp.department.name + ",";
                        data.push(row);
                    });
                    var anchor = angular.element('<a/>');
                    anchor.attr({
                        href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
                        target: '_blank',
                        download: 'filename.csv'
                    })[0].click();
                };

                self.reset = function () {
                    self.emp = angular.copy(self.master);
                };

            }]);
    })
})();