var cashierAcPayoutModule = angular.module('cashier_acPayout', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier.cashier_acPayout', {
            data: {
                pageTitle: 'Aircash Payout'
            },
            url: "/aircashPayout",
            controller: 'cashierAcPayoutCtrl',
            templateUrl: 'app/cashier_ac_payout/cashier_ac_payout.html'
        });
});

cashierAcPayoutModule.service("cashierAcPayoutService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

cashierAcPayoutModule.controller("cashierAcPayoutCtrl",
    ['$scope', '$state', 'cashierAcPayoutService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, cashierAcPayoutService, $filter, $http, JwtParser, $uibModal, $rootScope) {
            console.log("ctrl works");
        }
    ]);