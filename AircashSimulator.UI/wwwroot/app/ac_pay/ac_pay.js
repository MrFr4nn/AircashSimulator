var acPayModule = angular.module('acPay', []);

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
        cancelTransaction: cancelTransaction
    });
    function generatePartnerCode(amount, description, locationID) {
        console.log(config);
        console.log($rootScope);
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
        console.log(config);
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPay/CancelTransaction",
            data: {
                partnerTransactionID: partnerTransactionID
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

acPayModule.controller("acPayCtrl", ['$scope', '$state', '$filter', 'acPayService', '$http', 'JwtParser', '$uibModal', '$rootScope', function ($scope, $state, $filter, acPayService, $http, JwtParser, $uibModal, $rootScope) {
    $scope.generatePartnerCodeModel = {
        amount: 10.00,
        description: "desc",
        locationID: "loc"
    };

    $scope.cancelTransactionModel = {
        partnerTransactionID: ""
    };

    $scope.showQRCode = function () {
        console.log("test");
        $("#QRModal").modal("show");
    }

    $scope.generateResponded = false;
    $scope.generateBusy = false;
    $scope.generatePartnerCode = function () {
        console.log($scope.generatePartnerCodeModel.amount);
        console.log($scope.generatePartnerCodeModel.description);
        console.log($scope.generatePartnerCodeModel.locationID);
        $scope.generateBusy = true;
        acPayService.generatePartnerCode($scope.generatePartnerCodeModel.amount, $scope.generatePartnerCodeModel.description, $scope.generatePartnerCodeModel.locationID)
            .then(function (responseGenerate) {
                console.log(responseGenerate);
                if (responseGenerate) {
                    $scope.GenerateRequestDateTimeUTC = responseGenerate.requestDateTimeUTC;
                    $scope.GenerateResponseDateTimeUTC = responseGenerate.responseDateTimeUTC;

                    responseGenerate.serviceRequest.signature = responseGenerate.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.GenerateServiceRequest = JSON.stringify(responseGenerate.serviceRequest, null, 4);
                    $scope.GenerateServiceResponse = JSON.stringify(responseGenerate.serviceResponse, null, 4);

                    $scope.codeLink = responseGenerate.serviceResponse.codeLink;
                    new QRCode(document.getElementById("qrcode"), $scope.codeLink);

                }
                $scope.generateBusy = false;
                $scope.generateResponded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.cancelResponded = false;
    $scope.cancelBusy = false;
    $scope.cancelTransaction = function () {
        console.log($scope.cancelTransactionModel.partnerTransactionID);
        $scope.cancelBusy = true;
        acPayService.cancelTransaction($scope.cancelTransactionModel.partnerTransactionID)
            .then(function (responseCancel) {
                console.log(responseCancel);
                if (responseCancel) {
                    $scope.CancelRequestDateTimeUTC = responseCancel.requestDateTimeUTC;
                    $scope.CancelResponseDateTimeUTC = responseCancel.responseDateTimeUTC;

                    responseCancel.serviceRequest.signature = responseCancel.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.CancelServiceRequest = JSON.stringify(responseCancel.serviceRequest, null, 4);
                    $scope.CancelServiceResponse = JSON.stringify(responseCancel.serviceResponse, null, 4);
                }
                $scope.cancelBusy = false;
                $scope.cancelResponded = true;
            }, () => {
                console.log("error");
            });
    }

}]);