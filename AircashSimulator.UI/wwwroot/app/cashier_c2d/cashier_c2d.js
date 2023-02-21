var cashierC2dModule = angular.module('cashier_c2d', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier.cashier_c2d', {
            data: {
                pageTitle: 'Aircash c2d'
            },
            url: "/cashToDigital",
            controller: 'cashierC2dCtrl',
            templateUrl: 'app/cashier_c2d/cashier_c2d.html'
        });
});

cashierC2dModule.service("cashierC2dService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

cashierC2dModule.controller("cashierC2dCtrl",
    ['$scope', '$state', 'cashierC2dService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, cashierC2dService, $filter, $http, JwtParser, $uibModal, $rootScope) {
            console.log("ctrl works");
        }
    ]);