(function () {
    'use strict';

    define([
        'angular',
        'angularResource'
    ], function (angular) {
        angular.module('myApp.view2a.newEmplForm', ['ngResource', 'ui.router'])

            .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
                $stateProvider
                    .state('main.view2a.id', {
                        url: '/idForm',
                        templateUrl: 'forms/empl/new/idForm.html'
                    })
                    .state('main.view2a.profile', {
                        url: '/profileForm',
                        templateUrl: 'forms/empl/new/profileForm.html'
                    });

                $urlRouterProvider.otherwise('/main/view2a/idForm');
            }])

            .controller('NewEmplCtrl', ['$state', 'empService', function ($state, empService) {
                var self = this;
                self.master = self.master || {};
                self.view2a = self.view2a || {};

                self.next = function (emp) {
                    angular.extend(self.master, emp);
                };

                self.save = function (emp) {
                    angular.extend(emp, self.master);
                    empService.save(emp).$promise
                        .then(function (data) {
                            self.view2a.message = 'Employee signed up: ' + data.id
                        }, function (error) {
                            console.log(error);
                            self.view2a.message = 'There is an error signing up employee. Please contact customer support.';
                        })
                        .finally(function () {
                            self.reset();
                            $state.go('main.view2a');
                        });
                };

                self.search = function (id) {
                    self.emps = []
                    empService.get({id: id})
                        .$promise.then(function (data) {
                            self.emps.push(data);
                        })
                }

                self.reset = function () {
                    self.emp = self.master = {};
                };
            }])

            .service('empService', ['$resource', function ($resource) {
                return $resource('/emp/:id', {id: '@_id'}, {
                    update: {
                        method: 'PUT' // this method issues a PUT request
                    }
                });
            }])

            .directive('empAvail', ['empService', function (empService) {
                return {
                    require: 'ngModel',
                    link: function (scope, elm, attrs, ctrl) {
                        ctrl.$asyncValidators.empAvail = function (modelValue, viewValue) {
                            if (ctrl.$isEmpty(viewValue)) {
                                return true;
                            } else {
                                //GET http://localhost:8080/emp?id=v
//                		return $http.get('/emp', {params: {id: viewValue}})
                                return empService.get({id: viewValue})
                                    .$promise.then(
                                    function (data) {
                                        if (data.id === viewValue) {
                                            ctrl.$setValidity('id', false);
                                        } else {
                                            ctrl.$setValidity('id', true);
                                        }
                                    }
                                );
                            }
                        };
                    }
                };
            }])
    })
})();