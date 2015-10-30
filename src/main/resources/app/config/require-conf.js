(function () {
    'use strict';

    require.config({
        baseUrl: '../',
        paths: {
            angular: 'vendor/angular/angular.min',
            angularResource: 'vendor/angular-resource/angular-resource.min',
            angularAnimate: 'vendor/angular-animate/angular-animate.min',
            angularUIBootstrap: 'vendor/angular-bootstrap/ui-bootstrap-tpls.min',
            angularUIRouter: 'vendor/angular-ui-router/release/angular-ui-router.min',
            angularUtils: 'vendor/angularUtils-pagination/dirPagination',
            d3: 'vendor/d3/d3.min',
            sockjs: 'vendor/sockjs/sockjs.min',
            stomp: 'vendor/stomp-websocket/lib/stomp.min',
            react: 'vendor/react/react-with-addons.min',
            //reactDom: 'vendor/react-dom/react-dom',

            //app scripts
            d3Ctrl: 'js/d3js/d3js',
            sockIOCtrl: 'js/sockio/sockclient',
            carouselCtrl: 'js/carousel/carousel',
            filterCtrl: 'js/filters/filters',
            storyCtrl: 'js/promises/story',
            scopeCtrl: 'js/scope/scope'
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