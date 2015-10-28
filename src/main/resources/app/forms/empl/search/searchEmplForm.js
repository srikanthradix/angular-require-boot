/**
 * Created by Srikanth on 8/27/2015.
 */
(function () {
    'use strict';

    define([
        'angular', 'angularResource', 'angularUtils', 'react'//, 'reactDom'
    ], function (angular) {

        var React = require('react');

        //var ReactDOM = require('reactDom');
        angular.module('myApp.view2b.searchEmplForm', ['ui.router', 'ngResource', 'angularUtils.directives.dirPagination'])

            .factory('reactEmpTableRendererFactory', function () {
                var self = {};
                self.create = function () {
                    return React.createClass({
                        displayName: 'MyEmployeesList',
                        //propTypes: {
                        //    // A custom object
                        //    employees: React.PropTypes.arrayOf({
                        //        id: React.PropTypes.string,
                        //        name: React.PropTypes.string,
                        //        salary: React.PropTypes.number,
                        //        deptName: React.PropTypes.string
                        //    })
                        //},
                        getDefaultProps: function () {
                            var table = {
                                border: "1px solid #dfd7ca",
                                color: '#3e3f3a',
                                background: '#b3d4fc',
                                'borderBottomWidth': '2px',
                                'borderCollapse': 'collapse',
                                'width': '90%'
                            };
                            var td = {
                                border: '1px solid #999',
                                padding: '8px',
                                width: '18%',
                                textAlign: 'center',
                                verticalAlign: 'middle'
                            };
                            var cols = ['Id', 'Name', 'Salary', 'Department'];
                            return {
                                styles: {
                                    table: table,
                                    td: td
                                },
                                table: {
                                    cols: cols
                                }
                            }
                        },
                        render: function () {
                            var self = this;
                            var employees = self.props.employees;
                            var scope = self.props.scope;
                            var styles = self.props.styles;
                            var cols = self.props.table.cols;

                            var rows = employees.map(function (emp, idx) {

                                var clickHandler = function (selected, self) {
                                    emp.selected = selected;
                                    this.setState({});
                                    scope.clickHandler.call(scope, emp)
                                }

                                return (
                                    React.DOM.tr({key: idx},
                                        React.DOM.td({style: styles.td}, React.DOM.input({
                                            type: 'checkbox',
                                            checked: emp.selected,
                                            onChange: clickHandler.bind(self, !emp.selected)
                                        })),
                                        React.DOM.td({style: styles.td}, emp.id),
                                        React.DOM.td({style: styles.td}, emp.name),
                                        React.DOM.td({style: styles.td}, emp.salary),
                                        React.DOM.td({style: styles.td}, emp.department.name)
                                    )
                                );
                            });

                            //var thead = React.DOM.thead({},
                            //    React.DOM.tr({},
                            //        cols.map(function (col, idx) {
                            //            return React.DOM.th({key: idx}, col);
                            //        })));

                            var tbody = React.DOM.tbody({}, rows);

                            return (
                                React.DOM.table(
                                    {style: styles.table}, tbody
                                    //[thead, tbody]
                                )
                            );
                        }
                    });
                }
                return self;
            })

            //angular.module('myApp')
            //    .getControllerProvider()
            //    .register
            .controller('searchEmplCtrl', ['$state', 'srchFormService',
                function ($state, srchFormService) {
                    var self = this;
                    self.emps = [];
                    self.itemsPerPage = srchFormService.getItemsPerPage();
                    self.predicate = srchFormService.getPredicate();
                    self.reverse = srchFormService.getReverse();

                    self.search = function (dept) {
                        self.emps = srchFormService.search(dept);
                    }

                    self.navigate = function (route) {
                        $state.go(route);
                    }
                    self.removeEmployee = function () {
                        self.emps = srchFormService.removeEmployee();
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
            //    .getCompileProvider()
            .directive('displayWithReact', ['reactEmpTableRendererFactory', 'srchFormService',
                function (reactEmpTableRendererFactory, srchFormService) {
                    var self = {};

                    self.link = function (scope, elem, attrs, reactCtrl) {
                        scope.$watchCollection(angular.bind(reactCtrl, function () {
                            return reactCtrl.employees;
                        }), function (newVal, oldVal) {
                            if (newVal === oldVal) {
                                return;
                            } // AKA first run
                            var element = React.createElement(
                                reactEmpTableRendererFactory.create(),
                                {employees: newVal, scope: scope}
                            );
                            React.render(element, elem[0]);
                        })

                        scope.clickHandler = function (emp) {
                            //console.log('in angular');
                            //console.log(emp);
                        }
                    }

                    return {
                        restrict: 'E',
                        scope: {},
                        controller: function () {
                        },
                        controllerAs: 'reactCtrl',
                        bindToController: {
                            employees: '='
                        },
                        link: self.link
                    }
                }])

            // Inline edit directive
            .directive('editableField', function () {
                var self = this || {};
                self.link = function (scope, elm, attr, editCtrl) {
                    var previousValue;

                    editCtrl.edit = function () {
                        editCtrl.editMode = true;
                        previousValue = editCtrl.model;

                        elm.find('input')[0].focus();
                    };
                    editCtrl.save = function () {
                        editCtrl.editMode = false;
                        scope.$watch(angular.bind(editCtrl, function () {
                            return editCtrl.model;
                        }), function (newVal, oldVal) {
                            if (newVal === oldVal) {
                                console.log('model first time' + newVal);
                                return;
                            }
                            console.log('model updated');
                        });
                        //editCtrl.someCtrlFn({value: editCtrl.model});
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
                        model: '=editableField'
                        //someCtrlFn: '&onSave'
                    },
                    transclude: true,
                    link: self.link,
                    templateUrl: '../../../templates/inline-edit.html'
                };
            })

            //angular.module('myApp')
            //    .getProvider()
            .service('deptService', ['$resource', function ($resource) {
                return $resource('/dept/:dept', {dept: '@_dept'});
            }])

            //angular.module('myApp')
            //    .getProvider()
            .service('srchFormService', ['$q', 'deptService', function ($q, deptService) {
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
                                        employee.selected = false;
                                        self.emps.push(employee);
                                    });
                                }
                            })
                    }
                    return self.emps;
                }

                self.updateEmployee = function (emp) {
                    var index = self.emps.indexOf(emp);
                    console.log('index:' + index);
                    if (~index) {
                        self.emps[index] = emp;
                    }
                    return self.emps;
                }

                self.removeEmployee = function () {
                    var activeEmps = [];
                    angular.forEach(self.emps, function(emp) {
                        if(emp.selected === false) {
                            activeEmps.push(emp);
                        }
                    })
                    self.emps = activeEmps;
                    return self.emps;
                }

                self.order = function (predicate) {
                    self.reverse = (self.predicate === predicate) ? !self.reverse : false;
                    self.predicate = predicate;
                }

                self.selectAll = function () {
                    angular.forEach(self.emps, function (emp) {
                        emp.selected = true;
                    });
                }

                self.download = function () {
                    var data = ["EMP_ID, EMP_NAME, EMP_SALARY, EMP_DEPT" + '\r\n'];
                    angular.forEach(self.emps, function (emp) {
                        var row = emp.id + ",";
                        row = row + emp.name + ",";
                        row = row + emp.salary + ",";
                        row = row + emp.department.name + '\r\n';
                        data.push(row);
                    });
                    var anchor = angular.element('<a/>');
                    anchor.attr({
                        href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
                        target: '_blank',
                        download: 'employees.csv'
                    })[0].click();
                };

                self.reset = function () {
                    self.emp = angular.copy(self.master);
                };

            }]);
    })
})();