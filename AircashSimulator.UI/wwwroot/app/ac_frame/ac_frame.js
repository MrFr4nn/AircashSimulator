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

acFrameModule.controller("acFrameCtrl", ['$scope', '$state', '$filter', 'acFrameService', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', function ($scope, $state, $filter, acFrameService, $http, JwtParser, $uibModal, $rootScope, $localStorage) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    if ($scope.partnerRoles.indexOf("AircashFrame") == -1) {
        $location.path('/forbidden');
    }

    $scope.initiateModels = [0, 1, 2];

    $scope.initiateModelSelected = $scope.initiateModels[0];

    $scope.initiateModels =
    [
        {
            payType: 0,
            payMethod: 2,
            amount: 10,
            selected :true
        },
        {
            payType: 0,
            payMethod: 0,
            amount: 0,
            selected: true
        },
        {
            payType: 1,
            payMethod: 10,
            amount: 10,
            selected :true
        }
    ];
    $scope.initiateModel = $scope.initiateModels[0];

    $scope.setInititateModel = function (value) {
        $scope.initiateModel = $scope.initiateModels[value.initiateModelSelected];
        $scope.initiateModelSelected = value.initiateModelSelected;
    };

    $scope.transactionId;

    $scope.showFrame = function () {
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
        $scope.initiateBusy = true;
        acFrameService.initiate($scope.initiateModel.payType, $scope.initiateModel.payMethod, $scope.initiateModel.amount, $scope.initiateModel.currency)
            .then(function (response) {
                if (response) {
                    $scope.InitiateRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.InitiateResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.sequenceInitiate = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.InitiateServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.InitiateServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.frameUrl = response.serviceResponse.url;
                    $scope.getTransactions(true);
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
        $scope.statusBusy = true;
        acFrameService.transactionStatus(transactionId)
            .then(function (response) {
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

    $scope.getTransactions = function (reset) {
        if (reset) $scope.setDefaults();
        acFrameService.getTransactions($scope.pageSize, $scope.pageNumber)
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

    $scope.aircashFrame = {
        initiate: {
            requestExample: {
                partnerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerUserId: "574f32a7-4ecb-48b2-9723-ac660b9c835d",
                partnerTransactionId: "3d3dbc8d-9547-4f49-b035-5a8aab8cb1ac",
                amount: "10",
                currencyId: 191,
                payType: 0,
                payMethod: 2,
                notificationUrl: "https://aircash.eu",
                successUrl: "https://localhost:44317/#!/success",
                declineUrl: "https://localhost:44317/#!/decline",
                locale: "en-US",
                signature: "CsXX21BpQg..."
            },
            responseExample: {
                url: "https://aircash.eu?Id=3d3dbc8d-9547-4f49-b035-5a8aab8cb1ac"
            },
            errorResponseExample: {
                code: 1,
                message: "Invalid ProviderId",
                additionalData: null
            },
        },
        transactionStatus: {
            requestExample: {
                partnerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionId: "3d3dbc8d-9547-4f49-b035-5a8aab8cb1ac",
                signature: "dUrE4gtau5..."
            },
            errorResponseExample: {
                code: 1003,
                message: "Transaction not processed",
                additionalData: null
            }
        }
    };

}]);