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
        var app = angular.module('myApp.view2b.searchEmplForm', ['ui.router', 'ngResource', 'angularUtils.directives.dirPagination'])

        var REACT_EVENTS = {
            "REACT_BROADCAST_MSG": "reactBroadcast:msg"
        };

        var MY_EVENTS = app.constant("MY_EVENTS", REACT_EVENTS);

        //function $broadcast(event: string, ...args: any[]) {
        //    angular.element('body').injector().invoke([
        //        '$rootScope',
        //        '$timeout',
        //        ($rootScope: ng.IRootScopeService, $timeout: ng.ITimeoutService) =>
        //    {
        //        args.unshift(event);
        //        $timeout(() => {
        //            $rootScope.$broadcast.apply($rootScope, args);
        //    });
        //}
        //]);
    //}

        var myEmpReactClass = React.createClass({
            displayName : 'MyEmployeesList',
            //propTypes: {
            //    // A custom object
            //    employees: React.PropTypes.arrayOf({
            //        id: React.PropTypes.string,
            //        name: React.PropTypes.string,
            //        salary: React.PropTypes.number,
            //        deptName: React.PropTypes.string
            //    })
            //},
            getDefaultProps: function() {
                return {
                    styles: {
                        table: {
                            border: "1px solid #dfd7ca",
                            color: '#3e3f3a',
                            background: '#b3d4fc',
                            'borderBottomWidth': '2px',
                            'borderCollapse': 'collapse',
                            'width': '90%'
                        },
                        td: {
                            border: '1px solid #999',
                            padding: '8px',
                            'width': '18%'
                        }
                    }
                }
            },
            render: function () {
                var employees = this.props.employees;
                var scope = this.props.scope;
                var styles = this.props.styles;

                var rows = employees.map(function (emp, idx) {

                    var clickHandler = function (ev) {
                        console.log(ev.currentTarget);
                        scope.$broadcast(REACT_EVENTS.REACT_BROADCAST_MSG, {
                            msg: ev.currentTarget
                        });
                    };

                    return (
                        React.DOM.tr({key: idx, onClick: clickHandler},
                            React.DOM.td({style: styles.td}, emp.id),
                            React.DOM.td({style: styles.td}, emp.name),
                            React.DOM.td({style: styles.td}, emp.salary),
                            React.DOM.td({style: styles.td}, emp.department.name)
                        )
                    );
                });

                return (
                    React.DOM.table({style: styles.table},
                        React.DOM.tbody(null,rows))
                );
            }
        });



            //angular.module('myApp')
            //    .getControllerProvider()
            //    .register
        app.controller('searchEmplCtrl', ['$state', 'srchFormService', 'MY_EVENTS',
                function ($state, srchFormService, MY_EVENTS) {
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
                    self.removeEmployee = function (emp) {
                        self.emps = srchFormService.removeEmployee(emp);
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
        app.directive('displayWithReact', ['$rootScope', 'MY_EVENTS', function ($rootScope, MY_EVENTS) {
                var self = this || {};

                self.link = function (scope, elem, attrs, reactCtrl) {
                    scope.$watchCollection(angular.bind(reactCtrl, function () {
                        return reactCtrl.employees;
                    }), function (newVal, oldVal) {
                        if (newVal === oldVal) {
                            return;
                        } // AKA first run
                        var element = React.createElement(myEmpReactClass, {employees: newVal, scope: scope});
                        React.render(element, elem[0]);
                    })

                    scope.$on(MY_EVENTS.REACT_BROADCAST_MSG, function (event, reactEvent) {
                        console.log('in Angular');
                        console.log(reactEvent.msg);
                    });
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
        app.directive('editableField', function () {
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
        app.service('srchFormService', ['$q', 'deptService', function ($q, deptService) {
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
                    console.log('index:' + index);
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