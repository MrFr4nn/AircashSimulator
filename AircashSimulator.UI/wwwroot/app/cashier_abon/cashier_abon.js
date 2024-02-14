var cashierAbonModule = angular.module('cashier_abon', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('cashier.cashier_abon', {
            data: {
                pageTitle: 'A bon'
            },
            url: "/abon",
            controller: 'cashierAbonCtrl',
            templateUrl: 'app/cashier_abon/cashier_abon.html?v=' + Global.appVersion
        });
});

cashierAbonModule.service("cashierAbonService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            generateCashierAbon: generateCashierAbon,
            confirmCashierTransaction: confirmCashierTransaction,
            confirmCashierTransactionV2: confirmCashierTransactionV2
        });
        function confirmCashierTransaction(couponCode, phoneNumber, parameters) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AbonOnlinePartner/ConfirmCashierTransaction",
                data: {
                    CouponCode: couponCode,
                    PhoneNumber: phoneNumber,
                    Parameters: parameters,
                    Environment: $rootScope.environment
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
        function confirmCashierTransactionV2(couponCode, phoneNumber, parameters) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AbonOnlinePartner/AutorizationTransactionRequest",
                data: {
                    CouponCode: couponCode,
                    PhoneNumber: phoneNumber,
                    Parameters: parameters,
                    Environment: $rootScope.environment,
     
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
            $scope.matchParameters = [];
            $scope.confirmCashierTransaction = function () {
                $scope.confirmBusy = true;
                if ($scope.useAuthorizationCheckBox) {
                    $scope.matchParameters = [
                        {
                            key: "PayerFirstName",
                            value: $scope.confirmTransactionModel.firstName
                        },
                        {
                            key: "PayerLastName",
                            value: $scope.confirmTransactionModel.lastName
                        },
                        {
                            key: "PayerBirthDate",
                            value: $scope.confirmTransactionModel.birthDate.toLocaleDateString('en-CA')
                        }
                    ];
                } else {
                    $scope.matchParameters = [];
                    $scope.confirmTransactionModel.firstName = "";
                    $scope.confirmTransactionModel.lastName = "";
                    $scope.confirmTransactionModel.birthDate = "";
                    $scope.confirmTransactionModel.phoneNumber = "";
                }
                cashierAbonService.confirmCashierTransaction($scope.confirmTransactionModel.couponCode.replaceAll('-', ''), $scope.confirmTransactionModel.phoneNumber, $scope.matchParameters)
                    .then(function (response) {
                        if (response.ServiceResponse.Code) {
                            $rootScope.showGritter("Error", response.ServiceResponse.Message);
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

            $scope.confirmCashierTransactionV2 = function () {
                $scope.confirmBusy = true;
                if ($scope.useAuthorizationCheckBox) {
                    $scope.matchParameters = [
                        {
                            key: "PayerFirstName",
                            value: $scope.confirmTransactionModel.firstName
                        },
                        {
                            key: "PayerLastName",
                            value: $scope.confirmTransactionModel.lastName
                        },
                        {
                            key: "PayerBirthDate",
                            value: $scope.confirmTransactionModel.birthDate.toLocaleDateString('en-CA')
                        }
                    ];
                } else {
                    $scope.matchParameters = [];
                    $scope.confirmTransactionModel.firstName = "";
                    $scope.confirmTransactionModel.lastName = "";
                    $scope.confirmTransactionModel.birthDate = "";
                    $scope.confirmTransactionModel.phoneNumber = "";
                }
                cashierAbonService.confirmCashierTransactionV2($scope.confirmTransactionModel.couponCode.replaceAll('-', ''), $scope.confirmTransactionModel.phoneNumber, $scope.matchParameters)
                    .then(function (response) {
                        if (response.ServiceResponse && response.ServiceResponse.Code) {
                            $rootScope.showGritter("Error", response.ServiceResponse.Message);
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
                        if (response.ServiceResponse.CouponCode) {
                            $scope.confirmTransactionModel.couponCode = response.ServiceResponse.CouponCode.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1-$2-$3-$4");
                        }
                        else {
                            $rootScope.showGritter("Error", response.ServiceResponse.Message);
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
            $scope.setDate = function (date) {
                $scope.confirmTransactionModel.birthDate = date;
            }
        }
    ]);