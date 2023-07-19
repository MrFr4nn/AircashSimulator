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
        function confirmCashierTransaction(couponCode, phoneNumber) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AbonOnlinePartner/ConfirmCashierTransaction",
                data: {
                    CouponCode: couponCode,
                    PhoneNumber: phoneNumber,
                    Environment: $rootScope.environment
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
        function generateCashierAbon() {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AbonSalePartner/CashierCreateCouponOnlinePartner",
                params: {
                    Environment: $rootScope.environment
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
    }
]);

cashierAbonModule.controller("cashierAbonCtrl",
    ['$scope', '$state', 'cashierAbonService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, cashierAbonService, $filter, $http, JwtParser, $uibModal, $rootScope) {

            $scope.confirmTransactionModel = {
                couponCode: "",
                phoneNumber: ""
            }

            $scope.confirmBusy = false;
            $scope.confirmCashierTransaction = function () {
                $scope.confirmBusy = true;
                cashierAbonService.confirmCashierTransaction($scope.confirmTransactionModel.couponCode.replaceAll('-', ''), $scope.confirmTransactionModel.phoneNumber)
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
                            $scope.confirmTransactionModel.couponCode = response.serviceResponse.couponCode.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1-$2-$3-$4");
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

            $scope.addHyphen = function (event) {
                if ('0123456789'.indexOf(event.key) < 0) {
                    $scope.confirmTransactionModel.couponCode = $scope.confirmTransactionModel.couponCode.replaceAll(/[^0-9-]/g, '');;
                }
                if ($scope.confirmTransactionModel.couponCode.replaceAll('-', '').length < 16) {
                    if ($scope.confirmTransactionModel.couponCode.replaceAll('-', '').length > 12) {
                        $scope.confirmTransactionModel.couponCode = $scope.confirmTransactionModel.couponCode.replaceAll('-', '').replace(/(\d{4})(\d{4})(\d{4})(\d)/, "$1-$2-$3-$4");
                    }
                    else if ($scope.confirmTransactionModel.couponCode.replaceAll('-', '').length > 8) {
                        $scope.confirmTransactionModel.couponCode = $scope.confirmTransactionModel.couponCode.replaceAll('-', '').replace(/(\d{4})(\d{4})(\d)/, "$1-$2-$3");
                    }
                    else if ($scope.confirmTransactionModel.couponCode.replaceAll('-', '').length > 4) {
                        $scope.confirmTransactionModel.couponCode = $scope.confirmTransactionModel.couponCode.replaceAll('-', '').replace(/(\d{4})(\d)/, "$1-$2");
                    }
                } else {
                    if ($scope.confirmTransactionModel.couponCode.replaceAll('-', '').length > 16) {
                        $scope.confirmTransactionModel.couponCode = $scope.confirmTransactionModel.couponCode.replaceAll('-', '').substring(0, 16);
                        $scope.confirmTransactionModel.couponCode = $scope.confirmTransactionModel.couponCode.replaceAll('-', '').replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1-$2-$3-$4");
                    }
                }
            };
        }
    ]);