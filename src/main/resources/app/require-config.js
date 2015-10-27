(function () {
    'use strict';

    require.config({
        paths: {
            angular: 'bower_components/angular/angular',
            //angularMocks: 'bower_components/angular-mocks/angular-mocks',
            angularResource: 'bower_components/angular-resource/angular-resource',
            angularAnimate: 'bower_components/angular-animate/angular-animate',
            angularUIRouter: 'bower_components/angular-ui-router/release/angular-ui-router',
            angularUtils: 'bower_components/angularUtils-pagination/dirPagination',
            d3: 'bower_components/d3/d3',
            sockjs: 'bower_components/sockjs/sockjs',
            stomp: 'bower_components/stomp-websocket/lib/stomp',
            react: 'bower_components/react/react',
            'react-dom': 'bower_components/react-dom/react-dom',

            //app scripts
            d3Ctrl: 'd3js/d3js',
            sockIOCtrl: 'sockio/sockclient',
            carouselCtrl: 'carousel/carousel',
            filterCtrl: 'filters/filters',
            storyCtrl: 'promises/story',
            scopeCtrl: 'scope/scope'
            //searchEmplCtrl: 'forms/empl/searchEmplForm'
        },
        shim: {
            'angular': {'exports': 'angular'},
            'angularResource': {
                deps: ['angular']
            },
            //'angularMocks': {
            //    deps: ['angular'],
            //    'exports': 'angular.mock'
            //},
            'angularAnimate': {
                deps: ['angular']
            },
            'angularUIRouter': {
                deps: ['angular']
            },
            'angularUtils': {
                deps: ['angular']
            },
            'react-dom': {
                deps: ['react'],
                'exports': 'ReactDOM'
            }
        },
        priority: ["angular"]

    });

    require([
            'angular',
            'angularUIRouter',
            'angularResource',
            'app',
        ], function (angular, app) {
            var $html = angular.element(document.getElementsByTagName('html')[0]);
            angular.element().ready(function () {
                //bootstrap the app manually
                angular.bootstrap($html, ['myApp']);
            });
        }
    );
})();