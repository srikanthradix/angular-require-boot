(function () {
    'use strict';
    define([
        'angular'
    ], function (angular) {
        angular.module('myApp.directivesAndTemplates', [])

            .directive('mouseEventsDirective', function () {
                return {
                    link: function ($scope, $elm, $attrs) {
                        $elm.bind('mouseenter', function () {
                            $elm.css('background-color', 'yellow');
                            $elm.text('Entered');
                        });
                        $elm.bind('mouseleave', function () {
                            $elm.css('background-color', 'white');
                            $elm.text('Exited');
                        });
                    }
                };
            })

            .controller('DirAndTemplatesCtrl', ['nodeService', function (nodeService) {

                var self = this;
                self.expandCollapse = function (data) {
                    nodeService.expandCollapse(data);
                }
                self.deleteNode = function (data) {
                    nodeService.deleteNode(data);
                }
                self.addNode = function (data) {
                    nodeService.addNode(data);
                }
                self.tree = nodeService.getTree();

                self.loginData = false;
                self.login = function () {
                    self.loginData = true;
                };
                self.logout = function () {
                    self.loginData = false;
                }

            }])

            .service('nodeService', function () {
                var self = this;
                self.loginData = false;
                self.tree = [
                    {
                        name: 'Node',
                        nodes: [],
                        currencies: [
                            {name: 'USD'},
                            {name: 'EUR'},
                            {name: 'GBP'}
                        ],
                        show: true
                    }
                ];

                self.getTree = function () {
                    return self.tree;
                }

                self.expandCollapse = function (data) {
                    data.show = !data.show;
                }
                self.deleteNode = function (data) {
                    data.nodes = []
                }
                self.addNode = function (data) {
                    var noOfNodes = data.nodes.length + 1;
                    var newName = data.name + '-' + noOfNodes
                    data.nodes.push(
                        {
                            name: newName,
                            nodes: [],
                            currencies: [
                                {name: 'USD'},
                                {name: 'EUR'},
                                {name: 'GBP'}
                            ],
                            show: true
                        }
                    );
                }

                self.login = function () {
                    self.loginData = true;
                    return self.loginData;
                };
                self.logout = function () {
                    self.loginData = false;
                    return self.loginData;
                }
            })

            .directive('editInPlaceDir', function () {
                return {
                    restrict: 'E',

                    scope: {},
                    controllerAs: 'editCtrl',
                    controller: function () {
                    },
                    bindToController: {value: '='},

                    transclude: true,

                    template: '<span ng-click="editCtrl.edit()" ng-bind="editCtrl.value.name"></span>' +
                    '<input ng-model="editCtrl.value.name"></input>',

                    link: function ($scope, element, attrs, editCtrl) {
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
                };
            })

    })
})();

