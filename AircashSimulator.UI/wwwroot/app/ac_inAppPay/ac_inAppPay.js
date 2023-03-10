var acInAppPayModule = angular.module('acInAppPay', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.acInAppPay', {
            data: {
                pageTitle: 'Aircash In App Pay'
            },
            url: "/aircashInAppPay",
            controller: 'acInAppPayCtrl',
            templateUrl: 'app/ac_inAppPay/ac_inAppPay.html'
        });
});

acInAppPayModule.service("acInAppPayService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        generateTransaction: generateTransaction,
        cancelTransaction: cancelTransaction,
        refundTransaction: refundTransaction,
        getTransactions: getTransactions,
    });
    function generateTransaction(amount, description, locationID) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashInAppPay/GenerateTransaction",
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
            url: config.baseUrl + "AircashInAppPay/CancelTransaction",
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

    function refundTransaction(transactionId, amount) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashInAppPay/RefundTransaction",
            data: {
                PartnerTransactionID: transactionId,
                Amount: amount
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

}
]);

acInAppPayModule.controller("acInAppPayCtrl", ['$scope', '$state', '$filter', 'acInAppPayService', '$http', 'JwtParser', '$uibModal', '$rootScope', function ($scope, $state, $filter, acInAppPayService, $http, JwtParser, $uibModal, $rootScope) {
    $scope.generateTransactionModel = {
        amount: null,
        description: null
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
    $scope.generateTransaction = function () {
        $scope.generateBusy = true;
        acInAppPayService.generateTransaction($scope.generateTransactionModel.amount, $scope.generateTransactionModel.description, $scope.generateTransactionModel.locationID)
            .then(function (response) {
                if (response) {
                    $scope.GenerateRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.GenerateResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.sequenceGenerate = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.GenerateServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.GenerateServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.codeLink = response.serviceResponse.url;
                    $scope.getTransactions(true);
                }
                $scope.generateBusy = false;
                $scope.generateResponded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.refundModel = {
        transcationId: null,
        amount: null
    };

    $scope.refundResponded = false;
    $scope.refundBusy = false;
    $scope.refundTransaction = function (transactionId) {
        $scope.refundBusy = true;
        acInAppPayService.refundTransaction(transactionId, $scope.refundTransactionModel.amount)
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
        acInAppPayService.getTransactions($scope.pageSize, $scope.pageNumber)
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
