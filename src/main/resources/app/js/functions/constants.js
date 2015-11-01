/**
 * Created by Srikanth on 11/1/2015.
 */
(function () {
    'use strict';
    define([
        'angular',
        'angularResource'
    ], function (angular) {
        angular.module('myApp.constants', [])

            .constant("NAV", {
                "HOME": "home",
                "D3": "home.d3",
                "CAROUSEL": "home.carousel",
                "SCOPE": "home.scope",
                "SOCK_IO": "home.sock_io",
                "FILTERS": "home.filters",
                "NEW_EMP": {
                    "PAGE": "home.new_emp",
                    "ID": "home.new_emp.id",
                    "PROFILE": "home.new_emp.profile"
                },
                "LIST_EMP": {
                    PAGE: "home.list_emp",
                    SEARCH: {
                        PAGE: "home.list_emp.search",
                        CRITERIA: "criteria@home.list_emp.search",
                        RESULTS: "results@home.list_emp.search",
                        FOOTER: "footer@home.list_emp.search"
                    },
                    RSEARCH: {
                        PAGE: "home.list_emp.rsearch",
                        CRITERIA: "criteria@home.list_emp.rsearch",
                        RESULTS: "results@home.list_emp.rsearch",
                        FOOTER: "footer@home.list_emp.rsearch"
                    },
                    UPDATE: "home.list_emp.update"
                },
                "PROMISES": "home.promises"
            })
    })
})();
