define([
    'angular',
    'sockjs',
    'stomp'
], function(angular) {
	angular.module('myApp.view5.sockio', ['ui.router'])
	
	
//	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
//		$stateProvider
//    	.state('view5', {
//    		url: '/view5',
//    		 templateUrl: 'sockio/sockclient.html',
//	        controller: 'sockIOController'
//        })
//	}])	
	
//	.config(['$routeProvider', function($routeProvider) {
//	   $routeProvider.when('/view5', {
//	    templateUrl: 'sockio/sockclient.html',
//	    controller: 'sockIOController'       
//	   }) 
//	}])

	.controller('sockIOController', ['$scope', 'sockjs', function($scope, sockjs){
		$scope.setConnected = function(connected){
	        document.getElementById('connect').disabled = connected;
	        document.getElementById('disconnect').disabled = !connected;
	        document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
	        document.getElementById('response').innerHTML = '';
	    };
	    
	    var connectListener = $scope.$on('sockio:connected', function(event, connection) {
	    	$scope.setConnected(connection.isOpen);
	    });
	    
	    $scope.$on('sockio:msg', function(event, connection) {
	    	var greeting = connection.greeting;
//	    	$scope.response = JSON.parse(greeting.body).content;
//	    	console.log('msg received:'+$scope.response);
	    	document.getElementById('response').innerHTML = JSON.parse(greeting.body).content;
	    });
	    
	    $scope.connect = sockjs.connect;
	    $scope.disconnect = sockjs.disconnect;
	    $scope.sendName = sockjs.sendName;
	    $scope.showGreeting = sockjs.showGreeting;
	    
	    $scope.$on('$viewContentLoaded', function() {
	        $scope.disconnect();
	    });
	    
	//    When using $rootScope.$on, we need to unbind those listeners each time the $scope is destroyed. $scope.$on listeners are automatically unbound, 
	//    but we'll need to call the above closure manually on the $destroy event:
	//    $scope.$on('destroy', connectListener);
	    
	 // unsubscribes...
	    // this would probably sit in a callback or something
	//    connectListener();
	}])
	
	.service('sockjs', ['$rootScope', function($rootScope){
	    
	    var stompClient = null;
	    
	    return {
	        connect: function(){
	            var socket = new SockJS('/hello');
	            stompClient = Stomp.over(socket);            
	            stompClient.connect({}, function(frame) {
	            	$rootScope.$broadcast('sockio:connected', {
	            		isOpen: true
	                })
	                console.log('Connected: ' + frame);
	                stompClient.subscribe('/topic/greetings', function(greeting){
	                	
	                	$rootScope.$broadcast('sockio:msg', {
	                		greeting: greeting
	    	            })
	                });
	            }); 
	        },
	
	        disconnect: function(){
	            if (stompClient != null) {
	                stompClient.disconnect();
	            }
	            $rootScope.$broadcast('sockio:connected', {
	            	isOpen: false
	            })
	            console.log("Disconnected");
	        },
	    
	        sendName: function(){
	            var name = document.getElementById('name').value;
	            stompClient.send("/app/hello", {}, JSON.stringify({ 'name': name }));
	        }
	    }
	}])
})