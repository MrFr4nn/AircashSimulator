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

acPayModule.controller("acPayCtrl", ['$scope', '$state', '$filter', 'acPayService', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', '$location', function ($scope, $state, $filter, acPayService, $http, JwtParser, $uibModal, $rootScope, $localStorage, $location) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
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
        acPayService.generatePartnerCode($scope.generatePartnerCodeModel.amount, $scope.generatePartnerCodeModel.description, $scope.generatePartnerCodeModel.locationID)
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
        acPayService.cancelTransaction(transactionId)
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

    $scope.refundTransaction = function (transactionId) {
        alert("Not implemented.");
        return;
        $scope.refundBusy = true;
        acPayService.refundTransaction(transactionId)
            .then(function (response) {
                if (response) {
                    $scope.refundRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.refundResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.refundSequence = response.sequence;

                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.refundServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.refundServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                }
                $scope.refundBusy = false;
                $scope.refundResponded = true;
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
}]);