﻿var acPayModule = angular.module('acPay', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.acPay', {
            data: {
                pageTitle: 'Aircash Pay'
            },
            url: "/aircashPay",
            controller: 'acPayCtrl',
            templateUrl: 'app/ac_pay/ac_pay.html'
        });
});

acPayModule.service("acPayService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        generatePartnerCode: generatePartnerCode,
        cancelTransaction: cancelTransaction,
        getTransactions: getTransactions
    });
    function generatePartnerCode(amount, description, locationID, partnerId) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPay/GeneratePartnerCode",
            data: {
                PartnerId: partnerId,
                Amount: amount,
                Description: description,
                LocationID: locationID
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function cancelTransaction(partnerTransactionID, partnerId) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPay/CancelTransaction",
            data: {
                PartnerId: partnerId,
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

acPayModule.controller("acPayCtrl", ['$scope', '$state', '$filter', 'acPayService', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', '$location', function ($scope, $state, $filter, acPayService, $http, JwtParser, $uibModal, $rootScope, $localStorage, $location) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    $scope.partnerIds = JSON.parse($scope.decodedToken.partnerIdsDTO);
    if ($scope.partnerRoles.indexOf("AircashPay") == -1) {
        $location.path('/forbidden');
    }

    $scope.generatePartnerCodeModel = {
        amount: null,
        description: null,
        locationID: null
    };

    $scope.cancelTransactionModel = {
        partnerTransactionID: ""
    };
    $scope.refundTransactionModel = {
        partnerTransactionID: "",
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
        $("#qrcode").empty();
        $scope.generateBusy = true;
        $scope.generateResponded = false;
        acPayService.generatePartnerCode($scope.generatePartnerCodeModel.amount, $scope.generatePartnerCodeModel.description, $scope.generatePartnerCodeModel.locationID, $scope.partnerIds.AcPayPartnerId)
            .then(function (response) {
                if (response) {
                    $scope.GenerateRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.GenerateResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.sequenceGenerate = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.GenerateServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.GenerateServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.codeLink = response.serviceResponse.codeLink;
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
        $scope.cancelResponded = false;
        acPayService.cancelTransaction(transactionId, $scope.partnerIds.AcPayPartnerId)
            .then(function (response) {
                if (response) {
                    $scope.CancelRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.CancelResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.sequenceCancel = response.sequence;

                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.CancelServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.CancelServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
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

    $scope.showVideoAcPay = function () {
        $("#videoModalAcPay").modal("show");
    }

    $scope.aircashPay = {
        generatePartnerCode: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                amount: 100,
                currencyID: 978,
                partnerTransactionID: "ef52ca13-33b4-4564-8bca-0cbfc7c5a37d",
                description: "test",
                locationID: "test",
                signature: "WUY3NyUagi..."
            },
            responseExample: {
                codeLink: "https://aircashtest.page.link/?link=https%3a%2f%2faircash.eu%2facpay%3ftype%3d3%26code%3da14cfc86-fb75-4e07-a02f-630db813e91e&apn=com.aircash.aircash.test&ibi=com.aircash.aircash.test&afl=https://aircash.eu/acpay&ifl=https://aircash.eu/acpay&efr=1"
            }
        },
        confirmTransaction: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionID: "ef52ca13-33b4-4564-8bca-0cbfc7c5a37d",
                amount: 100,
                currencyID: 978,
                aircashTransactionID: "122e5e33-b5fb-4398-b138-c60582b9fa2b",
                signature: "Ff3oSWm20n...",
            }
        }
    };

}]);