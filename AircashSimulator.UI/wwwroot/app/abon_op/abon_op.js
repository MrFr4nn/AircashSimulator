var abonOpModule = angular.module('abonOp', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.abonOp', {
            data: {
                pageTitle: 'A-bon deposit'
            },
            url: "/abonDeposit",
            controller: 'abonOpCtrl',
            templateUrl: 'app/abon_op/abon_op.html'
        });
});

abonOpModule.service("abonOpService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        validateCoupon: validateCoupon,
        confirmTransaction: confirmTransaction
    });
    function validateCoupon(couponCode) {
        console.log(config);
        var request = $http({
            method: 'POST',
            url: "https://localhost:44374/api/AbonOnlinePartner/ValidateCoupon",
            data: {
                CouponCode: couponCode
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function confirmTransaction(couponCode) {
        console.log(config);
        var request = $http({
            method: 'POST',
            url: "https://localhost:44374/api/AbonOnlinePartner/ConfirmTransaction",
            data: {
                CouponCode: couponCode
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

abonOpModule.controller("abonOpCtrl", ['$scope', '$state', '$filter', 'abonOpService', '$http', 'JwtParser', '$uibModal', '$rootScope', function ($scope, $state, $filter, abonOpService, $http, JwtParser, $uibModal, $rootScope) {
    $scope.validateCouponModel = {
        couponCode: ""
    };
    $scope.confirmTransactionModel = {
        couponCode: ""
    };

    $scope.validateResponded = false;
    $scope.validateBusy = false;
    $scope.validateCoupon = function () {
        console.log($scope.validateCouponModel.couponCode);
        $scope.validateBusy = true;
        abonOpService.validateCoupon($scope.validateCouponModel.couponCode)
            .then(function (response) {
                if (response) {
                    console.log(response);
                    $scope.RequestDateTimeUTC = response.requestDateTimeUTC;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.ServiceRequest = JSON.stringify(response.serviceRequest, null, 4);

                    $scope.ResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.ServiceResponse = JSON.stringify(response.serviceResponse, null, 4);

                }
                $scope.validateBusy = false;
                $scope.validateResponded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.confirmResponded = false;
    $scope.confirmBusy = false;
    $scope.confirmTransaction = function () {
        console.log($scope.confirmTransactionModel.couponCode);
        $scope.confirmBusy = true;
        abonOpService.confirmTransaction($scope.confirmTransactionModel.couponCode)
            .then(function (response) {
                if (response) {
                    console.log(response);
                    $scope.RequestDateTimeUTC = response.requestDateTimeUTC;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.ServiceRequest = JSON.stringify(response.serviceRequest, null, 4);

                    $scope.ResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.ServiceResponse = JSON.stringify(response.serviceResponse, null, 4);

                }
                $scope.confirmBusy = false;
                $scope.confirmResponded = true;
            }, () => {
                console.log("error");
            });
    }

}]);