var cashierAbonModule = angular.module('cashier_abon', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier.cashier_abon', {
            data: {
                pageTitle: 'A bon'
            },
            url: "/abon",
            controller: 'cashierAbonCtrl',
            templateUrl: 'app/cashier_abon/cashier_abon.html'
        });
});

cashierAbonModule.service("cashierAbonService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

cashierAbonModule.controller("cashierAbonCtrl",
    ['$scope', '$state', 'cashierAbonService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, cashierAbonService, $filter, $http, JwtParser, $uibModal, $rootScope) {
        }
    ]);