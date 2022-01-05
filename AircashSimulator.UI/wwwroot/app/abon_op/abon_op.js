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
        confirmTransaction: confirmTransaction,
        getUnusedCoupon: getUnusedCoupon
    });
    function validateCoupon(couponCode) {
        console.log(config);
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonOnlinePartner/ValidateCoupon",
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
            url: config.baseUrl +"AbonOnlinePartner/ConfirmTransaction",
            data: {
                CouponCode: couponCode
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function getUnusedCoupon(selected) {
        console.log(config);
        switch (selected.Currency) {
            case "EUR":
                currency = 977;
                break;
            case "HRK":
                currency = 191;
                break;
            }
        var request = $http({
            method: 'POST',
            url: config.baseUrl +"Coupon/GetUnusedCoupon",
            data: {
                PurchasedCurrency: currency,
                Value: selected.Value
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

    $scope.selected = null;
    $scope.items = [
        {
            "Currency": "EUR",
            "Value": 10
        },
        {
            "Currency": "EUR",
            "Value": 50
        },
        {
            "Currency": "EUR",
            "Value": 200
        },
        {
            "Currency": "EUR",
            "Value": 500
        },
        {
            "Currency": "HRK",
            "Value": 25
        },
        {
            "Currency": "HRK",
            "Value": 50
        },
        {
            "Currency": "HRK",
            "Value": 100
        },
        {
            "Currency": "HRK",
            "Value": 200
        },
        {
            "Currency": "HRK",
            "Value": 500
        }
    ];

    $scope.showCoupon = function () {
        console.log("test");
        $("#couponModal").modal("show");
    }

    $scope.validateResponded = false;
    $scope.validateBusy = false;
    $scope.validateCoupon = function () {
        console.log($scope.validateCouponModel.couponCode);
        $scope.validateBusy = true;
        abonOpService.validateCoupon($scope.validateCouponModel.couponCode)
            .then(function (response) {
                if (response) {
                    console.log(response);
                    $scope.ValidateRequestDateTimeUTC = response.requestDateTimeUTC;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.ValidateServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.sequenceValidate = response.sequence;
                    $scope.ValidateResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.ValidateServiceResponse = JSON.stringify(response.serviceResponse, null, 4);

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
                    $scope.ConfirmRequestDateTimeUTC = response.requestDateTimeUTC;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.ConfirmServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.sequenceConfirm = response.sequence;
                    $scope.ConfirmResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.ConfirmServiceResponse = JSON.stringify(response.serviceResponse, null, 4);

                }
                $scope.confirmBusy = false;
                $scope.confirmResponded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.getUnusedCouponValidate = function (selectedValidate) {
        console.log(selectedValidate);
        abonOpService.getUnusedCoupon(selectedValidate)
            .then(function (response) {
                if (response) {
                    console.log(response);
                    $scope.validateCouponModel.couponCode = response.couponCode;
                }
            }, () => {
                console.log("error");
            });
    }

    $scope.getUnusedCouponConfirm = function (selectedConfirm) {
        console.log(selectedConfirm);
        abonOpService.getUnusedCoupon(selectedConfirm)
            .then(function (response) {
                if (response) {
                    console.log(response);
                    $scope.confirmTransactionModel.couponCode = response.couponCode;
                }
            }, () => {
                console.log("error");
            });
    }

}]);
