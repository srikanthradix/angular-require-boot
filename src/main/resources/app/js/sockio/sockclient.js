(function () {
    'use strict';
    define([
        'angular',
        'sockjs',
        'stomp'
    ], function (angular) {

        angular.module('myApp.bootstrap')
            .getProvider()
            .constant("MY_EVENTS", {
                "SOCK_IO_MSG": "sockio:msg",
                "SOCK_IO_CONNECTED": "sockio:connected"
            });

        angular.module('myApp.bootstrap')
            .getControllerProvider()
            .register('sockIOCtrl', ['$scope', 'sockjsService', 'MY_EVENTS', function ($scope, sockjs, MY_EVENTS) {
                var self = this;

                self.setConnected = function (connected) {
                    document.getElementById('connect').disabled = connected;
                    document.getElementById('disconnect').disabled = !connected;
                    document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
                    document.getElementById('response').innerHTML = '';
                };

                var connectListener = $scope.$on(MY_EVENTS.SOCK_IO_CONNECTED, function (event, connection) {
                    self.setConnected(connection.isOpen);
                });

                $scope.$on(MY_EVENTS.SOCK_IO_MSG, function (event, connection) {
                    var greeting = connection.greeting;
                    document.getElementById('response').innerHTML = JSON.parse(greeting.body).content;
                });

                self.connect = sockjs.connect;
                self.disconnect = sockjs.disconnect;
                self.sendName = sockjs.sendName;
                self.showGreeting = sockjs.showGreeting;

                $scope.$on('$viewContentLoaded', function () {
                    self.disconnect();
                });

                //    When using $rootScope.$on, we need to unbind those listeners each time the $scope is destroyed. $scope.$on listeners are automatically unbound,
                //    but we'll need to call the above closure manually on the $destroy event:
                //    $scope.$on('destroy', connectListener);

                // unsubscribes...
                // this would probably sit in a callback or something
                //    connectListener();
            }]);

        angular.module('myApp.bootstrap')
            .getProvider()
            .service('sockjsService', ['$rootScope', 'MY_EVENTS', function ($rootScope, MY_EVENTS) {

                var self = this;
                var stompClient = null;
                self.connect = function () {
                    var socket = new SockJS('/hello');
                    stompClient = Stomp.over(socket);
                    var headers = {
                        login: 'mylogin',
                        passcode: 'mypasscode'
                    };
                    stompClient.connect(headers, function (frame) {
                        $rootScope.$broadcast(MY_EVENTS.SOCK_IO_CONNECTED, {
                            isOpen: true
                        });
                        console.log('Connected: ' + frame);
                        stompClient.subscribe('/topic/greetings', function (greeting) {

                            $rootScope.$broadcast(MY_EVENTS.SOCK_IO_MSG, {
                                greeting: greeting
                            });
                        });
                    });
                },

                self.disconnect = function () {
                    if (stompClient !== null) {
                        stompClient.disconnect();
                    }
                    $rootScope.$broadcast(MY_EVENTS.SOCK_IO_CONNECTED, {
                        isOpen: false
                    });
                    console.log("Disconnected");
                },

                self.sendName = function () {
                    var name = document.getElementById('name').value;
                    return stompClient.send("/app/hello", {}, JSON.stringify({'name': name}));
                }

            }]);
    });
})();