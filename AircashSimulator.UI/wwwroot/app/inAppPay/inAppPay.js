var inAppPayModule = angular.module('inAppPay', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('inAppPay', {
            data: {
                pageTitle: 'In App Pay'
            },
            url: "/inAppPay",
            controller: 'InAppPayCtrl',
            templateUrl: 'app/inAppPay/inAppPay.html'
        });
});

inAppPayModule.service("inAppPayService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        generateTransaction: generateTransaction,
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

inAppPayModule.controller("InAppPayCtrl", ['$scope', '$state', '$filter', 'inAppPayService', '$http', 'JwtParser', '$uibModal', '$rootScope', function ($scope, $state, $filter, inAppPayService, $http, JwtParser, $uibModal, $rootScope) {
    $scope.generateTransactionModel = {
        amount: null,
        description: null
    };

    $scope.setDefaults = function () {
        $scope.transactions = [];
        $scope.pageSize = 5;
        $scope.pageNumber = 1;
        $scope.totalLoaded = 0;
        $scope.busy = false;
    };

    $scope.generateBusy = false;
    $scope.generateTransaction = function () {
        $scope.generateBusy = true;
        inAppPayService.generateTransaction($scope.generateTransactionModel.amount, $scope.generateTransactionModel.description, $scope.generateTransactionModel.locationID)
            .then(function (response) {
                if (response) {
                    $scope.getTransactions(true);
                }
                $scope.generateBusy = false;
                window.open(response.serviceResponse.url, '_blank');
            }, () => {
                console.log("error");
            });
    }

    $scope.getTransactions = function (reset) {
        if (reset) $scope.setDefaults();
        inAppPayService.getTransactions($scope.pageSize, $scope.pageNumber)
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