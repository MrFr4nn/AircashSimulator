﻿var acPayModule = angular.module('acCashless', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.acCashless', {
            data: {
                pageTitle: 'Aircash Cashless'
            },
            url: "/aircashCashless",
            controller: 'acacCashlessCtrl',
            templateUrl: 'app/ac_cashless/ac_cashless.html?v=' + Global.appVersion
        });
});

acPayModule.service("acPayService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        generatePartnerCode: generatePartnerCode,
        cancelTransaction: cancelTransaction,
        refundTransaction: refundTransaction,
        getTransactions: getTransactions
    });
    function generatePartnerCode(amount, description, locationID) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPay/GeneratePartnerCode",
            data: {
                Amount: amount,
                Description: description,
                LocationID: locationID
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function cancelTransaction(partnerTransactionID) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPay/CancelTransaction",
            data: {
                partnerTransactionID: partnerTransactionID
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function getTransactions(pageSize, pageNumber) {
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "Transaction/GetAircashPayPreparedTransactions",
            params: {
                PageSize: pageSize,
                PageNumber: pageNumber
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

}
]);

acPayModule.controller("acPayCtrl", ['$scope', '$state', '$filter', 'acPayService', '$http', 'JwtParser', '$uibModal', '$rootScope', function ($scope, $state, $filter, acPayService, $http, JwtParser, $uibModal, $rootScope) {
    $scope.generatePartnerCodeModel = {
        amount: null,
        description: null,
        locationID: null
    };

    $scope.cancelTransactionModel = {
        partnerTransactionID: ""
    };
    $scope.refundTransactionModel = {
        amount: null
    };
    $scope.setDefaults = function () {
        $scope.transactions = [];
        $scope.pageSize = 5;
        $scope.pageNumber = 1;
        $scope.totalLoaded = 0;
        $scope.busy = false;
    };

    $scope.showQRCode = function () {
        $("#QRModal").modal("show");
    }

    $scope.generateResponded = false;
    $scope.generateBusy = false;
    $scope.generatePartnerCode = function () {
        $scope.generateBusy = true;
        acPayService.generatePartnerCode($scope.generatePartnerCodeModel.amount, $scope.generatePartnerCodeModel.description, $scope.generatePartnerCodeModel.locationID)
            .then(function (response) {
                if (response) {
                    $scope.GenerateRequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.GenerateResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.sequenceGenerate = response.Sequence;
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.GenerateServiceRequest = JSON.stringify(response.ServiceRequest, null, 4);
                    $scope.GenerateServiceResponse = JSON.stringify(response.ServiceResponse, null, 4);
                    $scope.codeLink = response.ServiceResponse.CodeLink;
                    new QRCode(document.getElementById("qrcode"), $scope.codeLink);
                    $scope.getTransactions(true);
                }
                $scope.generateBusy = false;
                $scope.generateResponded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.cancelResponded = false;
    $scope.cancelBusy = false;
    $scope.cancelTransaction = function (transactionId) {
        $scope.cancelBusy = true;
        acPayService.cancelTransaction(transactionId)
            .then(function (response) {
                if (response) {
                    $scope.CancelRequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.CancelResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.sequenceCancel = response.Sequence;

                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.CancelServiceRequest = JSON.stringify(response.ServiceRequest, null, 4);
                    $scope.CancelServiceResponse = JSON.stringify(response.ServiceResponse, null, 4);
                }
                $scope.cancelBusy = false;
                $scope.cancelResponded = true;
            }, () => {
                console.log("error");
            });
    }
    $scope.getTransactions = function (reset) {
        if (reset) $scope.setDefaults();
        acPayService.getTransactions($scope.pageSize, $scope.pageNumber)
            .then(function (response) {
                $scope.pageNumber += 1;
                if (response) {
                    $scope.totalLoaded = response.length;
                    $scope.transactions = $scope.transactions.concat(response);
                }
            }, () => {
                console.log("error");
            });
    }

    $scope.loadMore = function (pageSize) {
        $scope.pageSize = pageSize;
        $scope.getTransactions();
    };

    $scope.setDefaults();

    $scope.getTransactions();

    $scope.cashless = {
        TopUp
    };

    $scope.cashless = {
        TopUp: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionID: "9059ca5c-675a-48b5-b41a-e04ab5b981ae",
                amount: 123.45,
                currencyIsoCode: "EUR",
                token: "65116",
                signature: "12345....abc"
            },
            responseExample: {
                aircashTransactionId: "kf62c8d0-713f-4cvr-8dfe-sd934vcfd1da",
                balance: 253.04,
                balanceCurrencyISOCode: "EUR",
            },
            errorResponseExample: {
                code: 1,
                message: "Unknown Token, the user has not linked the bracelet to the Aircash wallet and is unable to make a transaction until he does so.",
                additionalData: null,
            }
        },
        CancelTopUp: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionID: "9059ca5c-675a-48b5-b41a-e04ab5b981ae",
                signature: "12345....abc"
            },
            responseExample: {
                aircashTransactionId: "kf62c8d0-713f-4cvr-8dfe-sd934vcfd1da", 
            },
            errorResponseExample: {
                code: 1,
                message: "The transaction does not exist in the Aircash system, thecashier can return the funds to the user",
                additionalData: null,
            }
        },
        Purchase: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionID: "9059ca5c-675a-48b5-b41a-e04ab5b981ae",
                amount: 123.45,
                currencyIsoCode: "EUR",
                cashRegisterId: "651169059",
                signature: "12345....abc"
            },
            responseExample: {
                aircashTransactionId: "kf62c8d0-713f-4cvr-8dfe-sd934vcfd1da",
                balance: 253.04,
                balanceCurrencyISOCode: "EUR",
            },
            errorResponseExample: {
                code: 1,
                message: "Unknown Token, the user has not linked the bracelet to the Aircash wallet and is unable to make a transaction until he does so.",
                additionalData: null,
            }
        },
        CancelPurchase: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionID: "9059ca5c-675a-48b5-b41a-e04ab5b981ae",
                signature: "12345....abc"
            },
            responseExample: {
                aircashTransactionId: "kf62c8d0-713f-4cvr-8dfe-sd934vcfd1da",  
            },
            errorResponseExample: {
                code: 3,
                message: "The transaction does not exist in the Aircash system, the cashier can return the funds to the user.",
                additionalData: null,
            }
        }
    }

}]);