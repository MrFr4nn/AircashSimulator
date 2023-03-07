var inAppPayModule = angular.module('inAppPay', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('inAppPay', {
            data: {
                pageTitle: 'inAppPay'
            },
            url: "/inAppPay",
            controller: 'inAppPayCtrl',
            templateUrl: 'app/inAppPay/inAppPay.html'
        });
});

inAppPayModule.service("inAppPayService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

inAppPayModule.controller("inAppPayCtrl",
    ['$scope', '$state', 'inAppPayService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, dashboardService, $filter, $http, JwtParser, $uibModal, $rootScope) {
        }
    ]);