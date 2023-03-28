var cashierAcPaymentAndPayoutModule = angular.module('cashier_acPaymentAndPayout', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier.cashier_acPaymentAndPayout', {
            data: {
                pageTitle: 'Aircash Sales Partner'
            },
            url: "/SalesPartner",
            controller: 'cashieracPaymentAndPayoutCtrl',
            templateUrl: 'app/cashier_ac_paymentAndPayout/cashier_ac_paymentAndPayout.html'
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
                    LocationID: locationID
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
                    LocationID: locationID
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
                            $scope.checkCodeRequestDateTimeUTC = response.requestDateTimeUTC;
                            $scope.checkCodeResponseDateTimeUTC = response.responseDateTimeUTC;
                            $scope.checkCodeSequence = response.sequence;
                            response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                            $scope.checkCodeServiceResponseObject = response.serviceResponse;
                            $scope.checkCodeServiceRequestObject = response.serviceRequest;
                            $scope.checkCodeServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                            $scope.checkCodeServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                            if ($scope.checkCodeServiceResponseObject.errorCode) {
                                $rootScope.showGritter("Error ", $scope.checkCodeServiceResponseObject.errorMessage);
                                $scope.codeValid = false;
                            } else {
                                $rootScope.showGritter("Success");
                                $scope.codeValid = true;
                                if ($scope.checkCodeServiceResponseObject.amount > 0) {
                                    $scope.transactionType = "Deposit";
                                } else {
                                    $scope.transactionType = "Withdrawal";
                                    $scope.checkCodeServiceResponseObject.amount = Math.abs($scope.checkCodeServiceResponseObject.amount);
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
                            $scope.confirmTransactionRequestDateTimeUTC = response.requestDateTimeUTC;
                            $scope.confirmTransactionResponseDateTimeUTC = response.responseDateTimeUTC;
                            $scope.confirmTransactionSequence = response.sequence;
                            response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                            $scope.confirmTransactionServiceResponse = response.serviceResponse;
                            $scope.confirmTransactionServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                            $scope.confirmTransactionServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                            if ($scope.confirmTransactionServiceResponse.errorCode) {
                                $rootScope.showGritter("Error ", $scope.checkCodeServiceResponseObject.errorMessage);
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