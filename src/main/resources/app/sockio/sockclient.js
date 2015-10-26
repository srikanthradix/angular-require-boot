(function () {
    'use strict';
    define([
        'angular',
        'sockjs',
        'stomp'
    ], function (angular) {

        angular.module('myApp')
            .getControllerProvider()
            .register('sockIOCtrl', ['$scope', 'sockjsService', function ($scope, sockjs) {
                var self = this;

                self.setConnected = function (connected) {
                    document.getElementById('connect').disabled = connected;
                    document.getElementById('disconnect').disabled = !connected;
                    document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
                    document.getElementById('response').innerHTML = '';
                };

                var connectListener = $scope.$on('sockio:connected', function (event, connection) {
                    self.setConnected(connection.isOpen);
                });

                $scope.$on('sockio:msg', function (event, connection) {
                    var greeting = connection.greeting;
//	    	$scope.response = JSON.parse(greeting.body).content;
//	    	console.log('msg received:'+$scope.response);
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
            }])

        angular.module('myApp')
            .getProvider()
            .service('sockjsService', ['$rootScope', function ($rootScope) {

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
                        $rootScope.$broadcast('sockio:connected', {
                            isOpen: true
                        })
                        console.log('Connected: ' + frame);
                        stompClient.subscribe('/topic/greetings', function (greeting) {

                            $rootScope.$broadcast('sockio:msg', {
                                greeting: greeting
                            })
                        });
                    });
                },

                self.disconnect = function () {
                    if (stompClient != null) {
                        stompClient.disconnect();
                    }
                    $rootScope.$broadcast('sockio:connected', {
                        isOpen: false
                    })
                    console.log("Disconnected");
                },

                self.sendName = function () {
                    var name = document.getElementById('name').value;
                    stompClient.send("/app/hello", {}, JSON.stringify({'name': name}));
                }

            }])
    })
})();