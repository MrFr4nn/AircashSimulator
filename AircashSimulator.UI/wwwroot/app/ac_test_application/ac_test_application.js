var ac_test_applicationModule = angular.module('ac_test_application', []);


app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.ac_test_application', {
            data: {
                pageTitle: 'Aircash test application'
            },
            url: "/ac_test_application",
            controller: 'ac_test_applicationCtrl',
            templateUrl: 'app/ac_test_application/ac_test_application.html?v=' + Global.appVersion
        });
});

ac_test_applicationModule.service("ac_test_applicationService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

ac_test_applicationModule.controller("ac_test_applicationCtrl",
    ['$scope', '$state', 'ac_test_applicationService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, dashboardService, $filter, $http, JwtParser, $uibModal, $rootScope) {
        }
    ]);