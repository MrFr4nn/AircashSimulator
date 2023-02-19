var logoModule = angular.module('logo', []);


app.config(function ($stateProvider) {
    $stateProvider
        .state('app.logo', {
            data: {
                pageTitle: 'Logo'
            },
            url: "/logo",
            controller: 'LogoCtrl',
            templateUrl: 'app/logo/logo.html'
        });
});

logoModule.service("logoService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

logoModule.controller("LogoCtrl",
    ['$scope', '$state', 'logoService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, dashboardService, $filter, $http, JwtParser, $uibModal, $rootScope) {
        }
    ]);