var cashierAcRedeemTicketModule = angular.module('cashier_acRedeemTicket', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier.cashier_acRedeemTicket', {
            data: {
                pageTitle: 'Aircash RedeemTicket'
            },
            url: "/aircashRedeemTicket",
            controller: 'cashierAcRedeemTicketCtrl',
            templateUrl: 'app/cashier_ac_redeemTicket/cashier_ac_redeemTicket.html'
        });
});

cashierAcRedeemTicketModule.service("cashierAcRedeemTicketService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

cashierAcRedeemTicketModule.controller("cashierAcRedeemTicketCtrl",
    ['$scope', '$state', 'cashierAcRedeemTicketService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, cashierAcRedeemTicketService, $filter, $http, JwtParser, $uibModal, $rootScope) {
            console.log("ctrl works");
        }
    ]);