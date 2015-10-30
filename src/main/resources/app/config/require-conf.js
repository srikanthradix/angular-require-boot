(function () {
    'use strict';

    require.config({
        baseUrl: '../',
        paths: {
            angular: 'vendor/angular/angular',
            angularResource: 'vendor/angular-resource/angular-resource',
            angularAnimate: 'vendor/angular-animate/angular-animate',
            angularUIRouter: 'vendor/angular-ui-router/release/angular-ui-router',
            angularUtils: 'vendor/angularUtils-pagination/dirPagination',
            d3: 'vendor/d3/d3',
            sockjs: 'vendor/sockjs/sockjs',
            stomp: 'vendor/stomp-websocket/lib/stomp',
            react: 'vendor/react/react-with-addons',
            //reactDom: 'vendor/react-dom/react-dom',

            //app scripts
            d3Ctrl: 'js/d3js/d3js',
            sockIOCtrl: 'js/sockio/sockclient',
            carouselCtrl: 'js/carousel/carousel',
            filterCtrl: 'js/filters/filters',
            storyCtrl: 'js/promises/story',
            scopeCtrl: 'js/scope/scope',

        },
        shim: {
            'angular': {'exports': 'angular'},
            'angularResource': {
                deps: ['angular']
            },
            'angularAnimate': {
                deps: ['angular']
            },
            'angularUIRouter': {
                deps: ['angular']
            },
            'angularUtils': {
                deps: ['angular']
            },
            'reactDom': {
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