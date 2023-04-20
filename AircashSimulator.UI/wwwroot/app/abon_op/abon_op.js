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
        validateSimulateError: validateSimulateError,
        confirmSimulateError: confirmSimulateError,
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

    function validateSimulateError(errorCode) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonOnlinePartner/ValidateCouponSimulateError",
            data: errorCode

        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function confirmSimulateError(errorCode) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonOnlinePartner/ConfirmTransactionSimulateError",
            data: errorCode

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

    $scope.currentErrorCode = 0;
    $scope.errorValidateResponded = false;
    $scope.errorValidateServiceBusy = false;
    $scope.validateSimulateError = (errCode) => {
        $scope.errorValidateResponded = false;
        $scope.errorValidateServiceBusy = true;
        abonOpService.validateSimulateError(errCode)
            .then(function (response) {
                if (response) {
                    $scope.errorRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.errorResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.errorSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.errorResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.errorRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.currentErrorCode = errCode;
                $scope.errorValidateResponded = true;
                $scope.errorValidateServiceBusy = false;
            }, (err) => {

                console.log(err);
                console.log("error");
            });
    }

    $scope.currentErrorCode = 0;
    $scope.errorConfirmResponded = false;
    $scope.errorConfirmServiceBusy = false;
    $scope.confirmSimulateError = (errCode) => {
        $scope.errorConfirmResponded = false;
        $scope.errorConfirmServiceBusy = true;
        abonOpService.confirmSimulateError(errCode)
            .then(function (response) {
                if (response) {
                    $scope.errorRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.errorResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.errorSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.errorResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.errorRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.currentErrorCode = errCode;
                $scope.errorConfirmResponded = true;
                $scope.errorConfirmServiceBusy = false;
            }, () => {
                console.log("error");
            });
    }

    $scope.errorExamples = {
        ValidateTransaction: {
            error1: {
                request: {
                    "couponCode": "5078671448576226",
                    "providerId": "8db69a48-7d61-48e7-9be8-3160549c7f17",
                    "signature": "McbLduO7CA..."
                },
                response: {
                    "code": 1,
                    "message": "Invalid ProviderId",
                    "additionalData": null
                }
            },
            error2: {
                request: {
                    "couponCode": "5078671448576226",
                    "providerId": "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                    "signature": "RXwGW/EUTq..."
                },
                response: {
                    "code": 2,
                    "message": "Invalid Signature",
                    "additionalData": null
                }
            },
            error3: {
                request: {
                    "couponCode": "0000000000000000",
                    "providerId": "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                    "signature": "KR5hiHwACW..."
                },
                response: {
                    "code": 3,
                    "message": "Invalid Coupon Code",
                    "additionalData": null
                }
            },
            error4: {
                request: {},
                response: {}
            }
        },
        ConfirmTransaction: {
            error1: {
                request: {
                    "couponCode": "6377944739582437",
                    "providerId": "8db69a48-7d61-48e7-9be8-3160549c7f17",
                    "providerTransactionId": "6bcd471c-3fdc-4a55-b3f1-ea719ccab739",
                    "userId": "a3876902-b3e4-4557-aace-a57a506e38ca",
                    "signature": "dxCr+RT4wh..."
                },
                response: {
                    "code": 1,
                    "message": "Invalid ProviderId",
                    "additionalData": null
                }
            },
            error2: {
                request: {
                    "couponCode": "6377944739582437",
                    "providerId": "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                    "providerTransactionId": "8bb80a3d-3b78-42b0-8bbc-e821fc1135b0",
                    "userId": "a3876902-b3e4-4557-aace-a57a506e38ca",
                    "signature": "oFE8LyHQHp..."
                },
                response: {
                    "code": 2,
                    "message": "Invalid Signature",
                    "additionalData": null
                }
            },
            error3: {
                request: {
                    "couponCode": "0000000000000000",
                    "providerId": "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                    "providerTransactionId": "efb4a25a-6e04-41b5-a2eb-47c0e83d5f60",
                    "userId": "a3876902-b3e4-4557-aace-a57a506e38ca",
                    "signature": "a3nEjfehBs..."
                },
                response: {
                    "code": 3,
                    "message": "Invalid coupon code.",
                    "additionalData": null
                }
            },
            error4: {
                request: {
                    "couponCode": "5557573568498952",
                    "providerId": "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                    "providerTransactionId": "7c6acb4d-d65d-4927-9115-b507035387b8",
                    "userId": "a3876902-b3e4-4557-aace-a57a506e38ca",
                    "signature": "jpeUoazH+L..."
                },
                response: {
                    "code": 4,
                    "message": "Coupon Already Used",
                    "additionalData": {
                        "couponValue": 0,
                        "isoCurrency": "EUR",
                        "providerTransactionId": "aa3d5cfa-8579-4625-84f3-953be4d4cadc"
                    }
                }
            },
            error5: {
                request: {},
                response: {}
            }
        }
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
