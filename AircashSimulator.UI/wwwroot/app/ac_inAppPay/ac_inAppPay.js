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
        $scope.generateResponded = false;
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

    $scope.inAppPay = {
        generateTransaction: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                amount: 123.45,
                currencyID: 978,
                partnerTransactionID: "92597e93-6050-4478-85d4-1956dea450ff",
                description: "Invoice 52",
                signature: "12345....abc"
            },
            responseExample: {
                url: " https://aircashtest.page.link/?link=https%3a%2f%2faircash.eu%2facpay%3ftype%3d3%26code%3d369564fc-053a-4787-b000-3a28c6607281&apn=com.aircash.aircash.test&ibi=com.aircash.aircash.test&afl=https://aircash.eu/acpay&ifl=https://aircash.eu/acpay "
            },
            errorResponseExample: {
                code: 6,
                message: "Transaction exist in Aircash system but authorization time has expired",
                additionalData: null,
            }
        },
        confirmTransaction: {
            requestExample: {
                amount: 123.45,
                currencyID: 978,
                aircashTransactionID: "Aircash transaction id,",
                partnerTransactionID: "92597e93-6050-4478-85d4-1956dea450ff",
                user: "user 232",
                signature: "12345....abc"
            }
        },
        checkTransactionStatus: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionID: "92597e93-6050-4478-85d4-1956dea450ff",
                signature: "12345....abc"
            },
            responseExample: {
                amount: 123.45,
                currencyID: 978,
                aircashTransactionID: "92597e93-6050-4478-85d4-1956dea450ff",
                user: "user 232",
                signature: "12345....abc"
            },
            errorResponseExample: {
                code: 6,
                message: "Transaction exist in Aircash system but authorization time has expired",
                additionalData: null,
            }
        },
    };

}]);
