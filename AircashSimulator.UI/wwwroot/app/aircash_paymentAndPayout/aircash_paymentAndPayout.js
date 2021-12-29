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
        getTransactions: getTransactions,
        checkTransactionStatus: checkTransactionStatus,
        cancelTransaction: cancelTransaction
    });
    function checkCode(barCode, locationID) {
        console.log(config);
        var request = $http({
            method: 'POST',
            url: config.baseUrl+"AircashPaymentAndPayout/CheckCode",
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
            url: config.baseUrl+"AircashPaymentAndPayout/ConfirmTransaction",
            data: {
                BarCode: barCode,
                LocationID: locationID
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function checkTransactionStatus(partnerTransactionID) {
        console.log(config);
        var request = $http({
            method: 'POST',
            url: config.baseUrl+"AircashPaymentAndPayout/CheckTransactionStatus",
            data: {
                PartnerTransactionID: partnerTransactionID
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function cancelTransaction(partnerTransactionID,locationID) {
        console.log(partnerTransactionID);
        console.log(locationID);
        var request = $http({
            method: 'POST',
            url: config.baseUrl+"AircashPaymentAndPayout/CancelTransaction",
            data: {
                PartnerTransactionID: partnerTransactionID,
                LocationID: locationID
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function getTransactions(pageSize, pageNumber, services) {
        console.log(config);
        console.log(pageSize);
        console.log(pageNumber);
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "Transaction/GetTransactions",
            params: {
                PageSize: pageSize,
                PageNumber: pageNumber,
                Services: services
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

    $scope.setDefaults = function () {
        $scope.checkTransactions = [];
        $scope.cancelTransactions = [];
        $scope.checkPageSize = 5;
        $scope.cancelPageSize = 5;
        $scope.checkPageNumber = 1;
        $scope.cancelPageNumber = 1;
        $scope.checkTotalLoaded = 0;
        $scope.cancelTotalLoaded = 0;
        $scope.checkBusy = false;
        $scope.cancelBusy = false;
    };

    $scope.checkTransactionStatusModel = {
        partnerTransactionID: null
    };

    $scope.cancelTransactionModel = {
        partnerTransactionID: null,
        locationID: 123
    };

    $scope.checkCodeServiceBusy = false;
    $scope.checkCodeServiceResponded = false;

    $scope.confirmTransactionServiceBusy = false;
    $scope.confirmTransactionServiceResponded = false;

    $scope.checkTransactionStatusServiceBusy = false;
    $scope.checkTransactionStatusServiceResponded = false;

    $scope.cancelTransactionServiceBusy = false;
    $scope.cancelTransactionServiceResponded = false;

    $scope.checkTransactions = null;
    $scope.cancelTransactions = null;
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
        aircashPaymentAndPayoutService.confirmTransaction($scope.confirmTransactionModel.barCode, $scope.confirmTransactionModel.locationID)
            .then(function (response) {

                if (response) {
                    console.log(response);
                    $scope.confirmTransactionRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.confirmTransactionResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.confirmTransactionSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.confirmTransactionServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.confirmTransactionServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.getCheckTransactions(true);
                    $scope.getCancelTransactions(true);
                }
                $scope.confirmTransactionServiceBusy = false;
                $scope.confirmTransactionServiceResponded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.checkTransactionStatus = function (transactionId) {
        console.log($scope.checkTransactionStatusModel.partnerTransactionID);
        $scope.checkTransactionStatusServiceBusy = true;
        aircashPaymentAndPayoutService.checkTransactionStatus(transactionId)
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

    $scope.cancelTransaction = function (transactionId, pointOFSaleId) {
        console.log(transactionId);
        console.log($scope.cancelTransactionModel.partnerTransactionID);
        console.log($scope.cancelTransactionModel.locationID);
        $scope.cancelTransactionServiceBusy = true;
        console.log($scope.cancelTransactionServiceBusy);
        aircashPaymentAndPayoutService.cancelTransaction(transactionId, pointOFSaleId)
            .then(function (response) {
                if (response) {
                    console.log(response);
                    $scope.cancelTransactionRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.cancelTransactionResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.cancelTransactionSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.cancelTransactionServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.cancelTransactionServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.cancelTransactionServiceBusy = false;
                $scope.cancelTransactionServiceResponded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.getCheckTransactions = function (reset) {
        if (reset) $scope.setDefaults();
        console.log($scope.checkPageSize);
        console.log($scope.checkPageNumber);
        aircashPaymentAndPayoutService.getTransactions($scope.checkPageSize, $scope.checkPageNumber, [1, 2])
            .then(function (response) {
                console.log(response);
                $scope.checkPageNumber += 1;
                if (response) {
                    $scope.checkTotalLoaded = response.length;
                    $scope.checkTransactions = $scope.checkTransactions.concat(response);
                }
            }, () => {
                console.log("error");
            });
    }

    $scope.getCancelTransactions = function (reset) {
        if (reset) $scope.setDefaults();
        console.log($scope.cancelPageSize);
        console.log($scope.cancelPageNumber);
        aircashPaymentAndPayoutService.getTransactions($scope.cancelPageSize, $scope.cancelPageNumber, [1, 2])
            .then(function (response) {
                console.log(response);
                $scope.cancelPageNumber += 1;
                if (response) {
                    $scope.cancelTotalLoaded = response.length;
                    $scope.cancelTransactions = $scope.cancelTransactions.concat(response);
                }
            }, () => {
                console.log("error");
            });
    }

    $scope.checkLoadMore = function (pageSize) {
        $scope.checkPageSize = pageSize;
        console.log(pageSize);
        $scope.getCheckTransactions(false);
    };

    $scope.cancelLoadMore = function (pageSize) {
        $scope.cancelPageSize = pageSize;
        console.log(pageSize);
        $scope.getCancelTransactions(false);
    };

    $scope.setDefaults();

    $scope.getCheckTransactions();

    $scope.getCancelTransactions();

}]);