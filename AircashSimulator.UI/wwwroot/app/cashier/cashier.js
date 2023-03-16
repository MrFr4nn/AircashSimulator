var cashierModule = angular.module('cashier', [
    'primaryMenu',
    'cashier_abon',
    'cashier_acPay',    
    'cashier_acFrameMenu',
    'cashier_acPayment',
    'cashier_acPayout',
    'cashier_acRedeemTicket',
    'cashier_acC2DPayout',
    'cashier_c2d'
]);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier', {
            data: {
                pageTitle: 'Cashier'
            },
            url: "/cashier",
            controller: 'CashierCtrl',
            templateUrl: 'app/cashier/cashier.html'
        });
});

cashierModule.service("cashierService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);


cashierModule.controller("CashierCtrl", ['$scope', '$rootScope', '$location',
    function ($scope, $rootScope,$location) {
        $location.path('/cashier/menu');
        }

]);