/**
 * Created by Srikanth on 8/27/2015.
 */
(function () {
    'use strict';

    define([
        'angular', 'angularUtils', 'react'
    ], function (angular) {
        angular.module('myApp.view2b.searchEmplForm', ['ui.router', 'angularUtils.directives.dirPagination', /*'React'*/])

            .controller('SearchEmplController', ['srchFormService', '$state', function (srchFormService, $state) {
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
                self.removeEmployee = function (index) {
                    self.emps = srchFormService.removeEmployee(index);
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

            .service('empReactRenderer', ['React', function() {
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

            .directive('displayWithReact', ['React', 'empReactRenderer', function (React, empReactRenderer) {
                var self = this || {};

                self.link = function (scope, elem, attrs, reactCtrl) {
                    scope.$watch(angular.bind(this, function() {
                        //this is the "this" parent directive, not a child
                        var employees = reactCtrl.employees;
                    }), function(newVal, oldVal) {
                        var myEmpReactRenderer = empReactRenderer.create();
                        React.renderComponent(myEmpReactRenderer({employees:newVal}), elem[0]);
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

            .directive('editInPlace', function () {
                var self = this || {};

                self.template = function () {
                    return '<span ng-click="editCtrl.edit()" ng-bind="editCtrl.value"></span>' +
                        '<input ng-model="editCtrl.value">';
                }

                self.link = function (scope, element, attrs, editCtrl) {
                    // Let's get a reference to the input element, as we'll want to reference it.
                    var inputElement = angular.element(element.children()[1]);

                    // This directive should have a set class so we can style it.
                    element.addClass('edit-in-place');

                    // Initially, we're not editing.
                    editCtrl.editing = false;

                    // ng-click handler to activate edit-in-place
                    editCtrl.edit = function () {
                        editCtrl.editing = true;

                        // We control display through a class on the directive itself. See the CSS.
                        element.addClass('active');

                        // And we must focus the element.
                        // `angular.element()` provides a chainable array, like jQuery so to access a native DOM function,
                        // we have to reference the first element in the array.
                        inputElement[0].focus();
                    };

                    // When we leave the input, we're done editing.
                    inputElement.prop('onblur', function () {
                        editCtrl.editing = false;
                        element.removeClass('active');
                    });
                }

                return {
                    restrict: 'E',

                    scope: {},
                    controllerAs: 'editCtrl',
                    controller: function () {
                    },
                    bindToController: {
                        value: '='
                    },

                    transclude: true,

                    template: self.template,

                    link: self.link
                };
            })

            .service('deptService', ['$resource', function ($resource) {
                return $resource('/dept/:dept', {dept: '@_dept'});
            }])

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

                self.removeEmployee = function (index) {
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