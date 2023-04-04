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
    });
    function generateTransaction(amount, description, locationID) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashInAppPay/CashierGenerateTransaction",
            data: {
                Amount: amount,
                Description: description,
                LocationID: locationID
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
        $scope.busy = false;
    };

    $scope.generateBusy = false;
    $scope.generateTransaction = function () {
        $scope.generateBusy = true;
        inAppPayService.generateTransaction($scope.generateTransactionModel.amount, $scope.generateTransactionModel.description, $scope.generateTransactionModel.locationID)
            .then(function (response) {
                $scope.generateBusy = false;
                window.open(response.serviceResponse.url, '_blank');
            }, () => {
                console.log("error");
            });
    }

    $scope.setDefaults();

    
}]);