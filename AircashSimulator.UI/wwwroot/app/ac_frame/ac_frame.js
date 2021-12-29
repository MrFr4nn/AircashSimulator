var acFrameModule = angular.module('acFrame', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.acFrame', {
            data: {
                pageTitle: 'Aircash Frame'
            },
            url: "/aircashFrame",
            controller: 'acFrameCtrl',
            templateUrl: 'app/ac_frame/ac_frame.html'
        });
});

acFrameModule.service("acFrameService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        initiate: initiate,
        getTransactions: getTransactions,
        transactionStatus: transactionStatus
    });

    function initiate(payType, payMethod, amount, currency) {
        console.log(config);
        console.log($rootScope);
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/Initiate",
            data: {
                PayType: payType,
                PayMethod: payMethod,
                Amount: amount,
                Currency: currency
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function transactionStatus(transactionId) {
        console.log(config);
        console.log($rootScope);
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/TransactionStatus",
            data: {
                TransactionId: transactionId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function getTransactions(pageSize, pageNumber) {
        console.log(config);
        console.log(pageSize);
        console.log(pageNumber);
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "Transaction/GetAircashFramePreparedTransactions",
            params: {
                PageSize: pageSize,
                PageNumber: pageNumber
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

acFrameModule.controller("acFrameCtrl", ['$scope', '$state', '$filter', 'acFrameService', '$http', 'JwtParser', '$uibModal', '$rootScope', function ($scope, $state, $filter, acFrameService, $http, JwtParser, $uibModal, $rootScope) {
    $scope.initiateModel = {
        payType: 0,
        payMethod: 2,
        amount: 25,
        currency: 191
    };

    $scope.transactionId;

    $scope.showFrame = function () {
        console.log("test");
        $("#frameModal").modal("show");
    }

    $scope.setDefaults = function () {
        $scope.transactions = [];
        $scope.pageSize = 5;
        $scope.pageNumber = 1;
        $scope.totalLoaded = 0;
        $scope.busy = false;
    };

    $scope.initiateResponded = false;
    $scope.initiateBusy = false;
    $scope.initiate = function () {
        console.log($scope.initiateModel.payType);
        console.log($scope.initiateModel.payMethod);
        console.log($scope.initiateModel.amount);
        console.log($scope.initiateModel.currency);
        $scope.initiateBusy = true;
        acFrameService.initiate($scope.initiateModel.payType, $scope.initiateModel.payMethod, $scope.initiateModel.amount, $scope.initiateModel.currency)
            .then(function (response) {
                console.log(response);
                if (response) {
                    $scope.InitiateRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.InitiateResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.sequenceInitiate = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.InitiateServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.InitiateServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.frameUrl = response.serviceResponse.url;
                    console.log($scope.frameUrl);
                }
                $scope.initiateBusy = false;
                $scope.initiateResponded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.statusResponded = false;
    $scope.statusBusy = false;
    $scope.transactionStatus = function (transactionId) {
        console.log(transactionId);
        $scope.statusBusy = true;
        acFrameService.transactionStatus(transactionId)
            .then(function (response) {
                console.log(response);
                if (response) {
                    $scope.StatusRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.StatusResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.sequenceStatus = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.StatusServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                    if (response.serviceResponse.signature) {
                        response.serviceResponse.signature = response.serviceResponse.signature.substring(0, 10) + "...";
                    }
                    $scope.StatusServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                }
                $scope.statusBusy = false;
                $scope.statusResponded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.getTransactions = function () {
        console.log($scope.pageSize);
        console.log($scope.pageNumber);
        acFrameService.getTransactions($scope.pageSize, $scope.pageNumber)
            .then(function (response) {
                console.log(response);
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
        console.log(pageSize);
        $scope.getTransactions();
    };

    $scope.setDefaults();

    $scope.getTransactions();

}]);