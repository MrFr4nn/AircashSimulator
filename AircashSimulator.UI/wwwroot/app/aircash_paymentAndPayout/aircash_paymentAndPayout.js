var aircashPaymentAndPayoutModule = angular.module('aircashPaymentAndPayout', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.aircashPaymentAndPayout', {
            data: {
                pageTitle: 'Aircash payment And payout'
            },
            url: "/aircashPaymentAndPayout",
            controller: 'aircashPaymentAndPayoutCtrl',
            templateUrl: 'app/aircash_paymentAndPayout/aircash_paymentAndPayout.html'
        });
});

aircashPaymentAndPayoutModule.service("aircashPaymentAndPayoutService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        checkCode: checkCode,
        confirmTransaction: confirmTransaction,
        getTransactions: getTransactions
    });
    function checkCode(barCode, locationID) {
        console.log(config);
        var request = $http({
            method: 'POST',
            url: "https://localhost:44374/api/AircashPaymentAndPayout/CheckCode",
            data: {
                BarCode: barCode,
                LocationID: locationID
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function confirmTransaction(barCode, locationID) {
        console.log(config);
        var request = $http({
            method: 'POST',
            url: "https://localhost:44374/api/AircashPaymentAndPayout/ConfirmTransaction",
            data: {
                BarCode: barCode,
                LocationID: locationID
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function checkTransactionStatus(barCode, locationID) {
        console.log(config);
        var request = $http({
            method: 'POST',
            url: "https://localhost:44374/api/AircashPaymentAndPayout/CheckTransactionStatus",
            data: {
                PartnerTransactionID: partnerTransactionID
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function getTransactions(transactionAmountFactor) {
        console.log(config);
        console.log(transactionAmountFactor);
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "Transaction/GetTransactions",
            params: {
                TransactionAmountFactor: transactionAmountFactor
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

aircashPaymentAndPayoutModule.controller("aircashPaymentAndPayoutCtrl", ['$scope', '$state', 'aircashPaymentAndPayoutService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope', function ($scope, $state, aircashPaymentAndPayoutService, $filter, $http, JwtParser, $uibModal, $rootScope) {
    $scope.checkCodeModel = {
        barCode: null,
        locationID: '123'
    };

    $scope.confirmTransactionModel = {
        barCode: null,
        locationID: '123'
    };

    $scope.checkTransactionStatusModel = {
        partnerTransactionID: null
    };

    $scope.checkCodeServiceBusy = false;
    $scope.checkCodeServiceResponded = false;

    $scope.confirmTransactionServiceBusy = false;
    $scope.confirmTransactionServiceResponded = false;

    $scope.checkTransactionStatusServiceBusy = false;
    $scope.checkTransactionStatusServiceResponded = false;

    $scope.transactions = null;
    $scope.transactionAmountFactor = 0;

    $scope.checkCode = function () {
        console.log($scope.checkCodeModel.barCode);
        console.log($scope.checkCodeModel.locationID);
        $scope.checkCodeServiceBusy = true;
        aircashPaymentAndPayoutService.checkCode($scope.checkCodeModel.barCode, $scope.checkCodeModel.locationID)
            .then(function (response) {

                if (response) {
                    console.log(response);
                    $scope.checkCodeRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.checkCodeResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.checkCodeSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.checkCodeServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.checkCodeServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.checkCodeServiceBusy = false;
                $scope.checkCodeServiceResponded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.confirmTransaction = function () {
        console.log($scope.confirmTransactionModel.barCode);
        console.log($scope.confirmTransactionModel.locationID);
        $scope.confirmTransactionServiceBusy = true;
        aircashPaymentAndPayoutService.checkCode($scope.checkCodeModel.barCode, $scope.checkCodeModel.locationID)
            .then(function (response) {

                if (response) {
                    console.log(response);
                    $scope.confirmTransactionRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.confirmTransactionResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.confirmTransactionSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.confirmTransactionServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.confirmTransactionServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.confirmTransactionServiceBusy = false;
                $scope.confirmTransactionServiceResponded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.checkTransactionStatus = function () {
        console.log($scope.checkTransactionStatusModel.partnerTransactionID);
        $scope.checkTransactionStatusServiceBusy = true;
        aircashPaymentAndPayoutService.checkTransactionStatus($scope.checkTransactionStatusModel.partnerTransactionID)
            .then(function (response) {

                if (response) {
                    console.log(response);
                    $scope.checkTransactionStatusRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.checkTransactionStatusResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.checkTransactionStatusSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.checkTransactionStatusServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.checkTransactionStatusServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.checkTransactionStatusServiceBusy = false;
                $scope.checkTransactionStatusServiceResponded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.getTransactions = function () {
        console.log($scope.transactionAmountFactor);
        $scope.transactionAmountFactor = $scope.transactionAmountFactor + 1;
        aircashPaymentAndPayoutService.getTransactions($scope.transactionAmountFactor)
            .then(function (responseGetTransactions) {
                console.log(responseGetTransactions);
                if (responseGetTransactions) {
                    $scope.transactions = responseGetTransactions;
                    console.log($scope.transactions[1].transactionId);
                }
            }, () => {
                console.log("error");
            });
    }
}]);