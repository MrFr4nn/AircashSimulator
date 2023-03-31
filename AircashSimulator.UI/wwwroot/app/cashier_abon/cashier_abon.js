var cashierAbonModule = angular.module('cashier_abon', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier.cashier_abon', {
            data: {
                pageTitle: 'A bon'
            },
            url: "/abon",
            controller: 'cashierAbonCtrl',
            templateUrl: 'app/cashier_abon/cashier_abon.html'
        });
});

cashierAbonModule.service("cashierAbonService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            generateCashierAbon: generateCashierAbon,
            confirmCashierTransaction: confirmCashierTransaction
        });
        function confirmCashierTransaction(couponCode) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AbonOnlinePartner/ConfirmCashierTransaction",
                data: {
                    CouponCode: couponCode
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
        function generateCashierAbon() {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AbonSalePartner/CashierCreateCouponOnlinePartner",
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
    }
]);

cashierAbonModule.controller("cashierAbonCtrl",
    ['$scope', '$state', 'cashierAbonService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, cashierAbonService, $filter, $http, JwtParser, $uibModal, $rootScope) {

            $scope.confirmTransactionModel = {
                couponCode: ""
            }

            $scope.confirmBusy = false;
            $scope.confirmCashierTransaction = function () {
                $scope.confirmBusy = true;
                cashierAbonService.confirmCashierTransaction($scope.confirmTransactionModel.couponCode)
                    .then(function (response) {
                        if (response.serviceResponse.code) {
                            $rootScope.showGritter("Error", response.serviceResponse.message);
                        }
                        else {
                            $rootScope.showGritter("Success");
                        }
                        $scope.confirmBusy = false;
                    }, () => {
                        $rootScope.showGritter("Error");
                        $scope.confirmBusy = false;
                    });
            }


            $scope.confirmBusy = false;
            $scope.generateCashierAbon = function () {
                $scope.confirmBusy = true;
                cashierAbonService.generateCashierAbon()
                    .then(function (response) {
                        if (response.serviceResponse.couponCode) {
                            $scope.confirmTransactionModel.couponCode = response.serviceResponse.couponCode;
                        }
                        else {
                            $rootScope.showGritter("Error", response.serviceResponse.message);
                        }
                        $scope.confirmBusy = false;
                    }, () => {
                        $rootScope.showGritter("Error");
                        $scope.confirmBusy = false;
                    });
            }
        }
    ]);