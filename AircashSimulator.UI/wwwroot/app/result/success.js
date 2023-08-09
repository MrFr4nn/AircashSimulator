var successModule = angular.module('success', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('success', {
            data: {
                pageTitle: 'Success'
            },
            url: "/success",
            controller: 'SuccessCtrl',
            templateUrl: 'app/result/success.html?v=' + Global.appVersion
        });
});

successModule.service("successService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

successModule.controller("SuccessCtrl",
    ['$scope', '$state', 'successService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, successService, $filter, $http, JwtParser, $uibModal, $rootScope) {
        }
    ]);