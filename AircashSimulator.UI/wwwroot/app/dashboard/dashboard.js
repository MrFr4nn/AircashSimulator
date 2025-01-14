﻿var dashboardModule = angular.module('dashboard', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.dashboard', {
            data: {
                pageTitle: 'Dashboard'
            },
            url: "/dashboard",
            controller: 'DashboardCtrl',
            templateUrl: 'app/dashboard/dashboard.html?v=' + Global.appVersion
        });
});

dashboardModule.service("dashboardService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

dashboardModule.controller("DashboardCtrl",
    ['$scope', '$state', 'dashboardService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, dashboardService, $filter, $http, JwtParser, $uibModal, $rootScope)
        {
    }
]);