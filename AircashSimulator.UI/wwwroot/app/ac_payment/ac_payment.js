var acPaymentModule = angular.module('acPayment', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.acPayment', {
            data: {
                pageTitle: 'Aircash Payment'
            },
            url: "/aircashPayment",
            controller: 'acPaymentCtrl',
            templateUrl: 'app/ac_payment/ac_payment.html'
        });
});

acPaymentModule.service("acPaymentService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

acPaymentModule.controller("acPaymentCtrl",
    ['$scope', '$state', 'acPaymentService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, acPaymentService, $filter, $http, JwtParser, $uibModal, $rootScope) {
        }
    ]);