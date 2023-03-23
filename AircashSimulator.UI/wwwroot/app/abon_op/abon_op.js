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
        var request = $http({
            method: 'POST',
            url: config.baseUrl +"AbonOnlinePartner/ConfirmTransaction",
            data: {
                CouponCode: couponCode
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

}
]);

abonOpModule.controller("abonOpCtrl", ['$scope', '$state', '$filter', 'abonOpService', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', function ($scope, $state, $filter, abonOpService, $http, JwtParser, $uibModal, $rootScope, $localStorage) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    if ($scope.partnerRoles.indexOf("AbonDeposit") == -1) {
        $location.path('/forbidden');
    }

    $scope.validateCouponModel = {
        couponCode: ""
    };
    $scope.confirmTransactionModel = {
        couponCode: ""
    };
    $scope.showCoupon = function () {
        $("#couponModal").modal("show");
    }

    $scope.validateResponded = false;
    $scope.validateBusy = false;
    $scope.validateCoupon = function () {
        $scope.validateBusy = true;
        $scope.validateResponded = false;
        abonOpService.validateCoupon($scope.validateCouponModel.couponCode)
            .then(function (response) {
                if (response) {
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
        $scope.confirmBusy = true;
        $scope.confirmResponded = false;
        abonOpService.confirmTransaction($scope.confirmTransactionModel.couponCode)
            .then(function (response) {
                if (response) {
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

    $scope.aBonDeposit = {
        validateCoupon: {
            requestExample: {
                couponCode: "5460446045144493",
                providerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                signature: "BPz2mGu8UG..."
            },
            responseExample: {
                couponValue: 50.0,
                isValid: true,
                ISOCurrency: "HRK",
                providerTransactionId: "",
                salePartnerId: "31dce332-1d55-4459-b166-d8d33a78226c",
                isoCountryCode: null,
                originalISOCurrency: "HRK",
                originalCouponValue: 50.0
            },
            errorResponseExample: {
                code: 1,
                message: "Invalid ProviderId",
                additionalData: null
            }
        },
        confirmTransaction: {
            requestExample: {
                couponCode: "5460446045144493",
                providerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                providerTransactionId: "d711c31b-9e20-48dd-a749-91778627b569",
                userId: "574f32a7-4ecb-48b2-9723-ac660b9c835d",
                signature: "CVrMFUqDzg..."
            },
            responseExample: {
                couponValue: 50.0,
                ISOCurrency: "HRK",
                providerTransactionId: "33352406-f672-4c27-a415-e26eb3ecd691",
            },
            errorResponseExample: {
                code: 4,
                message: "Coupon Already Used",
                additionalData: {
                    couponValue: 50.0,
                    ISOCurrency: "HRK",
                    providerTransactionId: "33352406-f672-4c27-a415-e26eb3ecd691",
                }
            }
        }
    };


}]);
