var cashierAcFrameModule = angular.module('cashier_acFrameMenu', [
    'cashier_acFrameAcPay',
    'cashier_acFrameAbon',
    'cashier_acFrameWithdrawal'
]);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier.cashier_acFrameMenu', {
            data: {
                pageTitle: 'Aircash Frame Menu'
            },
            url: "/aircashFrameMenu",
            controller: 'cashierAcFrameMenuCtrl',
            templateUrl: 'app/cashier_ac_frame_menu/cashier_ac_frame_menu.html'
        });
});

cashierAcFrameModule.service("cashierAcFrameMenuService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

cashierAcFrameModule.controller("cashierAcFrameMenuCtrl",
    ['$scope', '$state', 'cashierAcFrameMenuService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, cashierAcFrameMenuService, $filter, $http, JwtParser, $uibModal, $rootScope) {            
        }
    ]);