var dashboardModule = angular.module('dashboard', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.dashboard', {
            data: {
                pageTitle: 'Dashboard'
            },
            url: "/dashboard",
            controller: 'DashboardCtrl',
            templateUrl: 'app/dashboard/dashboard.html'
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