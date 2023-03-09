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
        return ({
            generateTransaction: generateTransaction
        });
        function generateTransaction(amount) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashPay/GenerateTransaction",
                data: {
                    Amount: amount
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
    }
]);

inAppPayModule.controller("inAppPayCtrl",
    ['$scope', '$state', 'inAppPayService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, dashboardService, $filter, $http, JwtParser, $uibModal, $rootScope) {
            $scope.generateTransactionModel = {
                amount: 100
            };
            $scope.generateTransaction = function () {
                inAppPayService.generateTransaction()
                    .then(function (response) {
                        console.log(response);
                    });
            }
        }
    ]);

