var acFrameV2Module = angular.module('acFrameV2', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.aircashFrameV2', {
            data: {
                pageTitle: 'Aircash Frame V2'
            },
            url: "/aircashFrameV2",
            controller: 'acFrameV2Ctrl',
            templateUrl: 'app/aircashFrameV2/aircashFrameV2.html'
        });
});

acFrameV2Module.service("acFrameV2Service", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        initiateRedirectCheckout: initiateRedirectCheckout,
        initiateWindowCheckout: initiateWindowCheckout,
        getTransactions: getTransactions,
        transactionStatus: transactionStatus
    });

    function initiateRedirectCheckout(payType, payMethod, amount, currency, successUrl, declineUrl, cancelUrl, originUrl) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/InitiateV2",
            data: {
                PayType: payType,
                PayMethod: payMethod,
                Amount: amount,
                Currency: currency,
                SuccessUrl: successUrl,
                DeclineUrl: declineUrl,
                CancelUrl: cancelUrl,
                OriginUrl: originUrl
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function initiateWindowCheckout(payType, payMethod, amount, currency, originUrl) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/InitiateV2",
            data: {
                PayType: payType,
                PayMethod: payMethod,
                Amount: amount,
                Currency: currency,
                OriginUrl:originUrl
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function transactionStatus(transactionId) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrameV2/TransactionStatus",
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

acFrameV2Module.controller("acFrameV2Ctrl", ['$scope', '$state', '$filter', 'acFrameV2Service', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', function ($scope, $state, $filter, acFrameV2Service, $http, JwtParser, $uibModal, $rootScope, $localStorage) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    if ($scope.partnerRoles.indexOf("AircashFrameV2") == -1) {
        $location.path('/forbidden');
    }

    //$scope.successUrl = "https://localhost:44317/#!/success";
    //$scope.declineUrl = "https://localhost:44317/#!/decline";
    //$scope.cancelUrl = "https://localhost:44317/#!/decline";
    $scope.originUrl = "https://localhost:44317";

    $scope.initiateModels = [0, 1, 2];

    $scope.initiateModelSelected = $scope.initiateModels[0];

    $scope.initiateModels =
        [
            {
                payType: 0,
                payMethod: 2,
                amount: 10,
                selected: true
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
                selected: true
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
    $scope.initiateRedirectCheckout = function () {
        $scope.initiateBusy = true;
        acFrameV2Service.initiateRedirectCheckout(
            $scope.initiateModel.payType,
            $scope.initiateModel.payMethod,
            $scope.initiateModel.amount,
            $scope.initiateModel.currency,
            $scope.successUrl,
            $scope.declineUrl,
            $scope.cancelUrl)
            .then(function (response) {
                console.log(response);
                if (response) {
                    $scope.InitiateRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.InitiateResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.sequenceInitiate = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.InitiateServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.InitiateServiceResponse = JSON.stringify(response.serviceResponse, null, 4);

                    //$scope.getRedirectModal(response.serviceResponse.transactionId);
                    new AircashFrame.WindowCheckout({
                        transactionId: response.serviceResponse.transactionId,
                        onSuccess: $scope.onSuccess,
                        onDecline: $scope.onDecline,
                        onCancel: $scope.onCancel,
                        originUrl: "https://localhost:44317/",
                        debug: true
                    });

                    $scope.getTransactions(true);
                }
                $scope.initiateBusy = false;
                $scope.initiateResponded = true;
            }, () => {
                console.log("error");
            });
    };

    $scope.onSuccess = function (obj) {
        console.log(obj);
        alert("Success:" + obj.amount);
    };

    $scope.onDecline = function (obj) {

    };

    $scope.onCancel = function (obj) {

    };


    $scope.getRedirectModal = function (transactionId) {
        var transactionInfoModal = $uibModal.open({
            templateUrl: 'app/aircashFrameV2/aircashFrameV2RedirectModal.html',
            controller: 'AircashFrameV2RedirectModalCtrl',
            backdrop: 'static',
            size: 'lg',
            resolve: {
                transactionId: function () {
                    return transactionId;
                }
            }
        });
        transactionInfoModal.result.then(function () {
        }, function () {
        });
    };

    

    $scope.statusResponded = false;
    $scope.statusBusy = false;
    $scope.transactionStatus = function (transactionId) {
        $scope.statusBusy = true;
        acFrameV2Service.transactionStatus(transactionId)
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
        acFrameV2Service.getTransactions($scope.pageSize, $scope.pageNumber)
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

acFrameV2Module.controller('AircashFrameV2RedirectModalCtrl', function ($scope, transactionId) {
    console.log(transactionId);
    /*
    new AircashFrame.RedirectCheckout({
        transactionId: transactionId,
        debug: true
    });

        */
});