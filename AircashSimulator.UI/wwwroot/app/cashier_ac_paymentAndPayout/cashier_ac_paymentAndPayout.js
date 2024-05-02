var cashierAcPaymentAndPayoutModule = angular.module('cashier_acPaymentAndPayout', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('cashier.cashier_acPaymentAndPayout', {
            data: {
                pageTitle: 'Aircash Sales Partner'
            },
            url: "/SalesPartner",
            controller: 'cashieracPaymentAndPayoutCtrl',
            templateUrl: 'app/cashier_ac_paymentAndPayout/cashier_ac_paymentAndPayout.html?v=' + Global.appVersion
        });
});

cashierAcPaymentAndPayoutModule.service("cashieracPaymentAndPayoutService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            checkCode: checkCode,
            confirmTransaction: confirmTransaction
        });
        function checkCode(barCode, locationID) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashPaymentAndPayout/CashierCheckCode",
                data: {
                    BarCode: barCode,
                    LocationID: locationID,
                    Environment: $rootScope.environment
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
        function confirmTransaction(barCode, locationID) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashPaymentAndPayout/CashierConfirmTransaction",
                data: {
                    BarCode: barCode,
                    LocationID: locationID,
                    Environment: $rootScope.environment
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
    }
]);

cashierAcPaymentAndPayoutModule.controller("cashieracPaymentAndPayoutCtrl",
    ['$scope', '$state', 'cashieracPaymentAndPayoutService', '$filter', '$http', 'JwtParser', '$uibModal', 'config', '$rootScope',
        function ($scope, $state, cashieracPaymentAndPayoutService, $filter, $http, JwtParser, $uibModal, config, $rootScope) {

            $scope.codeModel = {
                barCode: null,
                locationID: '123'
            };

            $scope.codeValid = false;
            $scope.checkCodeServiceBusy = false;
            $scope.confirmTransactionServiceBusy = false;
            $scope.checkCodeServiceResponded = false;

            $scope.checkCode = function () {
                $scope.checkCodeServiceBusy = true;
                cashieracPaymentAndPayoutService.checkCode($scope.codeModel.barCode, $scope.codeModel.locationID)
                    .then(function (response) {

                        if (response) {
                            $scope.checkCodeRequestDateTimeUTC = response.RequestDateTimeUTC;
                            $scope.checkCodeResponseDateTimeUTC = response.ResponseDateTimeUTC;
                            $scope.checkCodeSequence = response.Sequence;
                            response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                            $scope.checkCodeServiceResponseObject = response.ServiceResponse;
                            $scope.checkCodeServiceRequestObject = response.ServiceRequest;
                            $scope.checkCodeServiceResponse = JSON.stringify(response.ServiceResponse, null, 4);
                            $scope.checkCodeServiceRequest = JSON.stringify(response.ServiceRequest, null, 4);
                            if (typeof $scope.checkCodeServiceResponseObject.ErrorCode != "undefined") {
                                $rootScope.showGritter("Error ", $scope.checkCodeServiceResponseObject.ErrorMessage);
                                $scope.codeValid = false;
                            } else {
                                $rootScope.showGritter("Success");
                                $scope.codeValid = true;
                                if ($scope.checkCodeServiceResponseObject.Amount > 0) {
                                    $scope.transactionType = "Deposit";
                                } else {
                                    $scope.transactionType = "Withdrawal";
                                    $scope.checkCodeServiceResponseObject.Amount = Math.abs($scope.checkCodeServiceResponseObject.Amount);
                                }
                                console.log($scope.checkCodeServiceResponseObject);
                            }
                        }
                        $scope.checkCodeServiceBusy = false;
                        $scope.checkCodeServiceResponded = true;
                        
                    }, () => {
                        console.log("error");
                    });
            }

            $scope.confirmTransaction = function () {
                $scope.confirmTransactionServiceBusy = true;
                cashieracPaymentAndPayoutService.confirmTransaction($scope.codeModel.barCode, $scope.codeModel.locationID)
                    .then(function (response) {

                        if (response) {
                            $scope.confirmTransactionRequestDateTimeUTC = response.RequestDateTimeUTC;
                            $scope.confirmTransactionResponseDateTimeUTC = response.ResponseDateTimeUTC;
                            $scope.confirmTransactionSequence = response.Sequence;
                            response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                            $scope.confirmTransactionServiceResponse = response.ServiceResponse;
                            $scope.confirmTransactionServiceResponse = JSON.stringify(response.ServiceResponse, null, 4);
                            $scope.confirmTransactionServiceRequest = JSON.stringify(response.ServiceRequest, null, 4);
                            if (typeof $scope.checkCodeServiceResponseObject.ErrorCode != "undefined") {
                                $rootScope.showGritter("Error ", $scope.checkCodeServiceResponseObject.ErrorMessage);
                            } else {
                                $rootScope.showGritter("Success");
                                $scope.codeValid = false;
                            }
                        }
                        $scope.confirmTransactionServiceBusy = false;
                        $scope.confirmTransactionServiceResponded = true;
                    }, () => {
                        console.log("error");
                    });
            }


        }]);