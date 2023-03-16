var cashierAcC2DPayoutModule = angular.module('cashier_acC2DPayout', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier.cashier_acC2DPayout', {
            data: {
                pageTitle: 'Aircash C2D Payout'
            },
            url: "/PayoutC2D",
            controller: 'cashier_acC2DPayoutCtrl',
            templateUrl: 'app/cashier_ac_C2D_payout/cashier_ac_C2D_payout.html'
        });
});

cashierAcC2DPayoutModule.service("cashier_acC2DPayoutService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            createPayout: createPayout,
            checkCode: checkCode,
            confirmTransaction: confirmTransaction
        });
        function createPayout(createPayoutRequest) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashC2DPayout/CashierCreatePayout",
                data: createPayoutRequest
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
        function checkCode(barCode) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashC2DPayout/CheckCode",
                data: {
                    barcode: barCode
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
        function confirmTransaction(barCode) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashC2DPayout/CashierConfirmTransaction",
                data: {
                    barcode: barCode
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
    }
]);

cashierAcC2DPayoutModule.controller("cashier_acC2DPayoutCtrl",
    ['$scope', '$state', 'cashier_acC2DPayoutService', '$filter', '$http', 'JwtParser', '$uibModal', 'config', '$rootScope',
        function ($scope, $state, cashier_acC2DPayoutService, $filter, $http, JwtParser, $uibModal, config, $rootScope) {

            $scope.createPayoutModel = {
                amount: 100,
                phoneNumber: "",
                firstName: "",
                lastName: "",
                birthDate: "",
                email: ""
            };
            $scope.confirmModel = {
                amount: 0,
                firstName: "",
                lastName: "",
                dateOfBirth: ""
            }

            $scope.createPayoutServiceBusy = false;
            $scope.createPayoutServiceResponse = false;


            $scope.createPayout = function () {
                $scope.createPayoutRequest = {
                    phoneNumber: $scope.createPayoutModel.phoneNumber,
                    amount: $scope.createPayoutModel.amount,
                    parameters: [{ key: "email", value: $scope.createPayoutModel.email }, { key: "PayerFirstName", value: $scope.createPayoutModel.firstName }, { key: "PayerLastName", value: $scope.createPayoutModel.lastName }, { key: "PayerBirthDate", value: $scope.createPayoutModel.birthDate.toLocaleDateString('en-CA') }]
                }
                $scope.createPayoutServiceBusy = true;
                cashier_acC2DPayoutService.createPayout($scope.createPayoutRequest)
                    .then(function (response) {
                        if (response) {
                            $scope.createPayoutRequestDateTimeUTC = response.requestDateTimeUTC;
                            $scope.createPayoutResponseDateTimeUTC = response.responseDateTimeUTC;
                            $scope.createPayoutSequence = response.sequence;
                            response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                            $scope.createPayoutResponseObject = response.serviceResponse;
                            $scope.createPayoutRequestObject = response.serviceRequest
                            $scope.createPayoutResponse = JSON.stringify(response.serviceResponse, null, 4);
                            $scope.createPayoutRequest = JSON.stringify(response.serviceRequest, null, 4);
                            console.log($scope.createPayoutModel.birthDate);
                            if ($scope.createPayoutResponseObject.aircashTransactionID) {
                                $rootScope.showGritter("Success");
                            } else {
                                $rootScope.showGritter("Error", "Check the entered data");
                            } 
                        }
                        $scope.createPayoutServiceBusy = false;
                        $scope.createPayoutServiceResponse = true;
                    }, () => {
                        console.log("error");
                    });
            }

            $scope.checkCodeResponded = false;
            $scope.checkCodeServiceBusy = false;

            $scope.checkCode = function () {
                $scope.checkCodeServiceBusy = true;
                cashier_acC2DPayoutService.checkCode($scope.barcode)
                    .then(function (response) {
                        if (response) {
                            $scope.createPayoutRequestDateTimeUTC = response.requestDateTimeUTC;
                            $scope.createPayoutResponseDateTimeUTC = response.responseDateTimeUTC;
                            $scope.createPayoutSequence = response.sequence;
                            response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                            $scope.createPayoutResponseObject = response.serviceResponse;
                            $scope.createPayoutRequestObject = response.serviceRequest
                            $scope.createPayoutResponse = JSON.stringify(response.serviceResponse, null, 4);
                            $scope.createPayoutRequest = JSON.stringify(response.serviceRequest, null, 4);
                            
                            if ($scope.createPayoutResponseObject.barCode) {
                                $scope.confirmModel.amount = $scope.createPayoutResponseObject.amount;
                                $scope.confirmModel.firstName = $scope.createPayoutResponseObject.firstName;
                                $scope.confirmModel.lastName = $scope.createPayoutResponseObject.lastName;
                                $scope.confirmModel.dateOfBirth = $scope.createPayoutResponseObject.dateOfBirth;
                                $scope.barcodeConfirm = $scope.createPayoutResponseObject.barCode;
                                $scope.checkCodeResponded = true;

                                if ($scope.confirmModel.amount < 0) {
                                    $scope.confirmModel.amount = Math.abs($scope.confirmModel.amount);
                                    $scope.transactionType = "Deposit";
                                } else {
                                    $scope.transactionType = "Withdrawal";
                                }
                            } else {
                                $rootScope.showGritter("Invalid Barcode", "");
                                $scope.checkCodeResponded = false;
                            }
                        }
                        $scope.checkCodeServiceBusy = false;
                    }, () => {
                        console.log("error");
                    });
            }

            $scope.confirmTransactionResponded = false;
            $scope.confirmTransactionServiceBusy = false;

            $scope.confirmTransaction = function () {
                $scope.confirmTransactionServiceBusy = true;
                cashier_acC2DPayoutService.confirmTransaction($scope.barcodeConfirm)
                    .then(function (response) {

                        if (response) {
                            $scope.confirmTransactionRequestDateTimeUTC = response.requestDateTimeUTC;
                            $scope.confirmTransactionResponseDateTimeUTC = response.responseDateTimeUTC;
                            $scope.confirmTransactionSequence = response.sequence;
                            response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                            $scope.confirmTransactionServiceResponseObject = response.serviceResponse;
                            $scope.confirmTransactionServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                            $scope.confirmTransactionServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                            if ($scope.confirmTransactionServiceResponseObject.errorCode) {
                                $rootScope.showGritter("Error", $scope.confirmTransactionServiceResponseObject.errorMessage);
                            } else {
                                $rootScope.showGritter("Success");
                                $scope.checkCodeResponded = false;
                            }
                        }
                        $scope.confirmTransactionServiceBusy = false;
                        $scope.confirmTransactionResponded = true;
                    }, () => {
                        console.log("error");
                    });
            }

            $scope.setBirthDatePayout = function (date) {
                $scope.createPayoutModel.birthDate = date;
            }

        }]);