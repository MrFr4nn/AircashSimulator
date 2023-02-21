var cashierAcPaymentModule = angular.module('cashier_acPayment', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier.cashier_acPayment', {
            data: {
                pageTitle: 'Aircash Payment'
            },
            url: "/aircashPayment",
            controller: 'cashierAcPaymentCtrl',
            templateUrl: 'app/cashier_ac_payment/cashier_ac_payment.html'
        });
});

cashierAcPaymentModule.service("cashierAcPaymentService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

cashierAcPaymentModule.controller("cashierAcPaymentCtrl",
    ['$scope', '$state', 'cashierAcPaymentService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, cashierAcPaymentService, $filter, $http, JwtParser, $uibModal, $rootScope) {
            console.log("ctrl works");
        }
    ]);