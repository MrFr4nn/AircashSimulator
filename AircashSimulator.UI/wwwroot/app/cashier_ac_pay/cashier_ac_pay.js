var cashierAcPayModule = angular.module('cashier_acPay', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier.cashier_acPay', {
            data: {
                pageTitle: 'Aircash Pay'
            },
            url: "/aircashPay",
            controller: 'cashierAcPayCtrl',
            templateUrl: 'app/cashier_ac_pay/cashier_ac_pay.html'
        });
});

cashierAcPayModule.service("cashierAcPayService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

cashierAcPayModule.controller("cashierAcPayCtrl",
    ['$scope', '$state', 'cashierAcPayService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, cashierAcPayService, $filter, $http, JwtParser, $uibModal, $rootScope) {
            console.log("ctrl works");
        }
    ]);