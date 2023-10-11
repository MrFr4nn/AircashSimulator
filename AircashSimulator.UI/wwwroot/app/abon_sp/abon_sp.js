var abonSpModule = angular.module('abonSp', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.abonSp', {
            data: {
                pageTitle: 'Abon generate'
            },
            url: "/abonGenerator",
            controller: 'abonSpCtrl',
            templateUrl: 'app/abon_sp/abon_sp.html?v=' + Global.appVersion
        });
});

abonSpModule.service("abonSpService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        createCoupon: createCoupon,
        createMultipleCoupons: createMultipleCoupons,
        cancelCoupon: cancelCoupon,
        getDenominations: getDenominations,
        createSimulateError: createSimulateError,
        createSimulateErrorMultiple: createSimulateErrorMultiple,
        cancelSimulateError: cancelSimulateError,
        createMultipleCouponsV2: createMultipleCouponsV2
    });
    function createCoupon(value, pointOfSaleId, partnerId, partnerTransactionId, isoCurrencySymbol, contentType, contentWidth) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonSalePartner/CreateCoupon",
            data: {
                Value: value,
                PointOfSaleId: pointOfSaleId,
                PartnerId: partnerId,
                PartnerTransactionId: partnerTransactionId,
                IsoCurrencySymbol: isoCurrencySymbol,
                ContentType: contentType,
                ContentWidth: contentWidth
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function createMultipleCoupons(createMultipleCouponsModel) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonSalePartner/CreateMultipleCoupons",
            data: {
                PartnerId: createMultipleCouponsModel.partnerId,
                PointOfSaleId: createMultipleCouponsModel.pointOfSaleId,
                IsoCurrencySymbol: createMultipleCouponsModel.isoCurrencySymbol,
                ContentType: createMultipleCouponsModel.contentType,
                ContentWidth: createMultipleCouponsModel.contentWidth,
                Denominations: createMultipleCouponsModel.denominations
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function createMultipleCouponsV2(createMultipleCouponsV2Model) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonSalePartner/CreateMultipleCouponsV2",
            data: {
                PartnerId: createMultipleCouponsV2Model.partnerId,
                PointOfSaleId: createMultipleCouponsV2Model.pointOfSaleId,
                IsoCurrencySymbol: createMultipleCouponsV2Model.isoCurrencySymbol,
                ContentType: createMultipleCouponsV2Model.contentType,
                ContentWidth: createMultipleCouponsV2Model.contentWidth,
                Denominations: createMultipleCouponsV2Model.denominations,
                CustomParameters: createMultipleCouponsV2Model.customParameters
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function cancelCoupon(partnerId, serialNumber, partnerTransactionId, cancelPointOfSaleId) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonSalePartner/CancelCoupon",
            data: {
                PartnerId: partnerId,
                SerialNumber: serialNumber,
                PartnerTransactionId: partnerTransactionId,
                PointOfSaleId: cancelPointOfSaleId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function getDenominations() {
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "Denominations/GetDenominations",
            params: {
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function createSimulateError(errorCode) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonSalePartner/CreateCouponSimulateError",
            data: errorCode

        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function createSimulateErrorMultiple(errorCode) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonSalePartner/CreateMultipleCouponsSimulateError",
            data: errorCode

        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function cancelSimulateError(errorCode) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonSalePartner/CancelCouponSimulateError",
            data: errorCode

        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

abonSpModule.controller("abonSpCtrl", ['HelperService', '$scope', '$state', 'abonSpService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', function (HelperService, $scope, $state, abonSpService, $filter, $http, JwtParser, $uibModal, $rootScope, $localStorage) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    $scope.partnerIds = JSON.parse($scope.decodedToken.partnerIdsDTO);
    if ($scope.partnerRoles.indexOf("AbonGenerate") == -1) {
        $location.path('/forbidden');
    }

    $scope.select = {}

    $scope.createCouponModel = {
        value: 50,
        pointOfSaleId: 'TestLocation',
        partnerId: $scope.partnerIds.AbonGeneratePartnerId,
        partnerTransactionId: HelperService.NewGuid(),
        isoCurrencySymbol: 'EUR',
        contentType: null,
        contentWidth: null
    };

    $scope.createMultipleCouponsModel = {
        pointOfSaleId: 'TestLocation',
        partnerId: $scope.partnerIds.AbonGeneratePartnerId,
        isoCurrencySymbol: 'EUR',
        contentType: null,
        contentWidth: null,
        denominations: [{ value: 50, partnerTransactionId: HelperService.NewGuid() }]
    };

    $scope.createMultipleCouponsV2Model = {
        pointOfSaleId: 'TestLocation',
        partnerId: $scope.partnerIds.AbonGeneratePartnerId,
        isoCurrencySymbol: 'EUR',
        contentType: null,
        contentWidth: null,
        denominations: [{ value: 50, partnerTransactionId: HelperService.NewGuid() }],
        customParameters: [{ key: "FiscalCode", value: "RSSMRAURTMLARSNL" }]
    };

    $scope.cancelCouponModel = {
        cancelSerialNumber: '',
        cancelPointOfSaleId: 'TestLocation',
        cancelPartnerId: $scope.partnerIds.AbonGeneratePartnerId,
        cancelPartnerTransactionId: ''
    };

    $scope.createServiceBusy = false;
    $scope.createServiceResponse = false;

    $scope.cancelServiceBusy = false;
    $scope.cancelServiceResponse = false;

    $scope.setDefaults = function () {
        $scope.denominations = [];
        $scope.busy = false;
    };

    $scope.showCoupon = function () {
        $("#couponModal").modal("show");
    }

    $scope.showContent = function () {
        $("#contentModal").modal("show");
    }

    $scope.QRcode = {};
    $scope.generateQRcode = function (event) {
        if (event) {
            if ('0123456789'.indexOf(event.keyCode) < 0) {
                $scope.QRcode.couponCode = $scope.QRcode.couponCode.replaceAll(/[^0-9]/g, '');;
            }
            if ($scope.QRcode.couponCode.length > 16) {
                $scope.QRcode.couponCode = $scope.QRcode.couponCode.substring(0, 16);
            }
            if (document.getElementById("qrcodeDiv") && $scope.QRcode.couponCode.length == 16) {
                $("#qrcodeDiv").empty();
                new QRCode(document.getElementById("qrcodeDiv"), $scope.QRcode.couponCode);
            }
        }
    }
    $scope.generateQRcode();

    $scope.QRcodeMultiple = {};
    $scope.generateQRcodeMultiple = function (event) {
        if (event) {
            if ('0123456789'.indexOf(event.keyCode) < 0) {
                $scope.QRcodeMultiple.couponCode = $scope.QRcodeMultiple.couponCode.replaceAll(/[^0-9]/g, '');;
            }
            if ($scope.QRcodeMultiple.couponCode.length > 16) {
                $scope.QRcodeMultiple.couponCode = $scope.QRcodeMultiple.couponCode.substring(0, 16);
            }
            if (document.getElementById("qrcodeDivMultiple") && $scope.QRcodeMultiple.couponCode.length == 16) {
                $("#qrcodeDivMultiple").empty();
                new QRCode(document.getElementById("qrcodeDivMultiple"), $scope.QRcodeMultiple.couponCode);
            }
        }
    }
    $scope.generateQRcode();

    $scope.QRcodeMultipleV2 = {};
    $scope.generateQRcodeMultipleV2 = function (event) {
        if (event) {
            if ('0123456789'.indexOf(event.keyCode) < 0) {
                $scope.QRcodeMultipleV2.couponCode = $scope.QRcodeMultipleV2.couponCode.replaceAll(/[^0-9]/g, '');;
            }
            if ($scope.QRcodeMultipleV2.couponCode.length > 16) {
                $scope.QRcodeMultipleV2.couponCode = $scope.QRcodeMultipleV2.couponCode.substring(0, 16);
            }
            if (document.getElementById("qrcodeDivMultipleV2") && $scope.QRcodeMultipleV2.couponCode.length == 16) {
                $("#qrcodeDivMultipleV2").empty();
                new QRCode(document.getElementById("qrcodeDivMultipleV2"), $scope.QRcodeMultipleV2.couponCode);
            }
        }
    }
    $scope.generateQRcodeMultipleV2();

    $scope.createCoupon = function () {
        $scope.createServiceBusy = true;
        $scope.createServiceResponse = false;
        $scope.showPerview = false;
        abonSpService.createCoupon($scope.createCouponModel.value, $scope.createCouponModel.pointOfSaleId, $scope.createCouponModel.partnerId, $scope.createCouponModel.partnerTransactionId, $scope.createCouponModel.isoCurrencySymbol, $scope.createCouponModel.contentType, $scope.createCouponModel.contentWidth)
            .then(function (response) {
                if (response) {
                    $scope.requestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.responseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.sequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.serviceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.serviceRequest = JSON.stringify(response.serviceRequest, null, 4);
                    if (response.serviceResponse.content) {
                        $scope.showPerview = true;
                        $scope.content = response.serviceResponse.content;
                        $scope.decodedContent = decodeURIComponent($scope.content);
                        console.log($scope.decodedContent);
                        document.querySelector('#content1').innerHTML = $scope.decodedContent;
                    }
                }
                $scope.createServiceBusy = false;
                $scope.createServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.createMultipleCoupons = function () {
        $scope.createServiceBusy = true;
        $scope.createServiceResponseMultiple = false;
        abonSpService.createMultipleCoupons($scope.createMultipleCouponsModel)
            .then(function (response) {
                if (response) {
                    $scope.requestMultipleDateTimeUTC = response.requestDateTimeUTC;
                    $scope.responseMultipleDateTimeUTC = response.responseDateTimeUTC;
                    $scope.sequenceMultiple = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature?.substring(0, 10) + "...";
                    $scope.serviceResponseMultiple = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.serviceRequestMultiple = JSON.stringify(response.serviceRequest, null, 4);
                    if (response.serviceResponse.content) {
                        $scope.contentMultiple = response.serviceResponse.content;
                        $scope.decodedContentMultiple = decodeURIComponent($scope.contentMultiple);
                        console.log($scope.decodedContent);
                        document.querySelector('#content1').innerHTML = $scope.decodedContent;
                    }
                }
                $scope.createServiceBusy = false;
                $scope.createServiceResponseMultiple = true;
            }, () => {
                console.log("error");
                $scope.createServiceBusy = false;
            });
    }

    $scope.createMultipleCouponsV2 = function () {
        $scope.createServiceBusy = true;
        $scope.createServiceResponseMultipleV2 = false;
        abonSpService.createMultipleCouponsV2($scope.createMultipleCouponsV2Model)
            .then(function (response) {
                if (response) {
                    $scope.requestMultipleV2DateTimeUTC = response.requestDateTimeUTC;
                    $scope.responseMultipleV2DateTimeUTC = response.responseDateTimeUTC;
                    $scope.sequenceMultipleV2 = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature?.substring(0, 10) + "...";
                    $scope.serviceResponseMultipleV2 = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.serviceRequestMultipleV2 = JSON.stringify(response.serviceRequest, null, 4);
                    if (response.serviceResponse.content) {
                        $scope.contentMultipleV2 = response.serviceResponse.content;
                        $scope.decodedContentMultipleV2 = decodeURIComponent($scope.contentMultipleV2);
                        document.querySelector('#content1').innerHTML = $scope.decodedContentMultipleV2;
                    }
                }
                $scope.createServiceBusy = false;
                $scope.createServiceResponseMultipleV2 = true;
            }, () => {
                console.log("error");
                $scope.createServiceBusy = false;
            });
    }

    $scope.cancelCoupon = function () {
        $scope.cancelServiceBusy = true;
        $scope.cancelServiceResponse = false;
        abonSpService.cancelCoupon($scope.cancelCouponModel.cancelPartnerId, $scope.cancelCouponModel.cancelSerialNumber, $scope.cancelCouponModel.cancelPartnerTransactionId, $scope.cancelCouponModel.cancelPointOfSaleId)
            .then(function (response) {
                if (response) {
                    $scope.cancelRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.cancelResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.cancelSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.cancelResponse = response.serviceResponse;
                    $scope.cancelServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.cancelServiceBusy = false;
                $scope.cancelServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.getDenominations = function () {
        abonSpService.getDenominations()
            .then(function (response) {
                if (response) {
                    $scope.denominations = $scope.denominations.concat(response);
                }
            }, () => {
                console.log("error");
            });
    }

    $scope.addDenomination = function () {
        $scope.createMultipleCouponsModel.denominations.push({ value: 50, partnerTransactionId: HelperService.NewGuid() });
    }

    $scope.addDenominationV2 = function () {
        $scope.createMultipleCouponsV2Model.denominations.push({ value: 50, partnerTransactionId: HelperService.NewGuid() });
    }

    $scope.addCustomParameterV2 = function () {
        $scope.createMultipleCouponsV2Model.customParameters.push({ key: "", value: "" });
    }

    $scope.currentCreateErrorCode = 0;
    $scope.currentCreateErrorCodeMultiple = 0;
    $scope.errorCreateResponded = false;
    $scope.errorCreateRespondedMultiple = false;
    $scope.errorCreateServiceBusy = false;
    $scope.createSimulateError = (errCode) => {
        $scope.errorCreateResponded = false;
        $scope.errorCreateServiceBusy = true;
        abonSpService.createSimulateError(errCode)
            .then(function (response) {
                if (response) {
                    $scope.errorCreateRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.errorCreateResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.errorCreateSequence = response.sequence;
                    $scope.errorCreateRequestCopy = JSON.stringify(response.serviceRequest, null, 4);
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.errorCreateResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.errorCreateRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.currentCreateErrorCode = errCode;
                $scope.errorCreateResponded = true;
                $scope.errorCreateServiceBusy = false;
            }, () => {
                console.log("error");
            });
    }

    $scope.createSimulateErrorMultiple = (errCode) => {
        $scope.errorCreateRespondedMultiple = false;
        $scope.errorCreateServiceBusy = true;
        abonSpService.createSimulateErrorMultiple(errCode)
            .then(function (response) {
                if (response) {
                    $scope.errorCreateRequestMultipleDateTimeUTC = response.requestDateTimeUTC;
                    $scope.errorCreateResponseMultipleDateTimeUTC = response.responseDateTimeUTC;
                    $scope.errorCreateSequenceMultiple = response.sequence;
                    $scope.errorCreateRequestCopyMultiple = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.errorCreateResponseMultiple = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.errorCreateRequestMultiple = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.currentCreateErrorCodeMultiple = errCode;
                $scope.errorCreateRespondedMultiple = true;
                $scope.errorCreateServiceBusy = false;
            }, () => {
                console.log("error");
            });
    }

    $scope.currentErrorCode = 0;
    $scope.errorCancelResponded = false;
    $scope.errorCancelServiceBusy = false;
    $scope.cancelSimulateError = (errCode) => {
        $scope.errorCancelResponded = false;
        $scope.errorCancelServiceBusy = true;
        abonSpService.cancelSimulateError(errCode)
            .then(function (response) {
                if (response) {
                    $scope.errorCancelRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.errorCancelResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.errorCancelSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.errorCancelResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.errorCancelRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.currentErrorCode = errCode;
                $scope.errorCancelResponded = true;
                $scope.errorCancelServiceBusy = false;
            }, () => {
                console.log("error");
            });
    }

    $scope.setDefaults();

    $scope.getDenominations();

    $scope.errorExamples = {
        CreateTransaction: {
            error1: {
                request: {
                    "partnerId": "f3e66373-11a9-4847-8611-53a7ee12cbfb",
                    "value": 25,
                    "pointOfSaleId": "test",
                    "isoCurrencySymbol": "EUR",
                    "partnerTransactionId": "ad065e76-2047-4633-93e7-85660a09e2f2",
                    "contentType": null,
                    "contentWidth": null,
                    "signature": "D9pwlT9cKs..."
                },
                response: {
                    "code": 1,
                    "message": "Invalid PartnerId",
                    "additionalData": null
                }
            },
            error2: {
                request: {
                    "contentType": "pdf",
                    "contentWidth": 50,
                    "isoCurrencySymbol": "EUR",
                    "partnerId": "52f46879-294d-4904-be7e-368ab0161771",
                    "pointOfSaleId": "TestLocation",
                    "denominations": [
                        {
                            "value": 50,
                            "partnerTransactionId": "ae132377-03d9-4bf9-91ce-0b43f1ef6af5"
                        },
                        {
                            "value": 25,
                            "partnerTransactionId": "eb418b62-98e4-467e-b6d0-a9af2554d232"
                        }
                    ],
                    "signature": "Iww1xTuZm+g2dq1ka6TM2FXnDnPm47KkVpjHhhTt2OxH+cnlZ2KCdA6ovVff5qgRnMssFgEjDPeOyGdPEOzxMfqDS43OaBDPTOVEX2O6cHyUdhTxP09tqfRR40T0FduYgbrDc3hnDY60v4VjOaHRmnWeJ0hymPMTHMtH4XhJt2tZMfXNNLuoEWftF6GQ626O6AHZwYqH3zDcidd/O7gmPU+t3A5TnxSE1cb4SfdvPAMzPG9m9kZjd7FF8oD2AljrByVRbs4KDg7WxSZhLA4g8ienekBvhKRNwMK7LESCZX5zOieE24wBIJtyfmzYKsIZnnAyI2Jd7ib8t8LukWeHJpxXGW31xnobRuWQQb+OIgfxVum33IR5SX/uABVErHicEbcBU/qDvtWM326PdbHVSVdVetZ/OBouvXydD2AmsV3nm2OcL/+BnuuDJ4Kzjyu8QAwejbhsBf8Mt+P8ubjbFCS8edOVJDEjYY4+vhdMDHSaJWEVuy6i0S8BuJbWo9bAe3WbyaD+so0/vbwBrUXVCiLsQVrr+3/61WirgEtMb7I0gC8Sihx75mvQyjROZBHggVqfHeFWHrrN1bSFNdIm0GgOjrdqasofvDXi4PW5DrUhT3EaTjW+nZ3Q+gHdZQ/QMdKh1YkIhGASzprgYpkLZPdvbTCyFzIKjPrcS9aAG1s=",
                    "additionalParameter": 10
                },
                response: {
                    "code": 2,
                    "message": "Invalid Signature",
                    "additionalData": null
                }
            },
            error3: {
                request: {
                    "partnerId": "52f46879-294d-4904-be7e-368ab0161771",
                    "value": 11,
                    "pointOfSaleId": "test",
                    "isoCurrencySymbol": "EUR",
                    "partnerTransactionId": "894b1f8a-755c-4b74-a96f-044a39e49079",
                    "contentType": null,
                    "contentWidth": null,
                    "signature": "jM/M6gVl+i..."
                },
                response: {
                    "code": 3,
                    "message": "Invalid CouponValue",
                    "additionalData": null
                }
            },
            error5: {
                request: {
                    "partnerId": "52f46879-294d-4904-be7e-368ab0161771",
                    "value": 25,
                    "pointOfSaleId": "test",
                    "isoCurrencySymbol": "EUr",
                    "partnerTransactionId": "36b1a803-8a0e-476f-ab6e-61f28236a9b6",
                    "contentType": null,
                    "contentWidth": null,
                    "signature": "WNyv7BrcfG..."
                },
                response: {
                    "code": 5,
                    "message": "Invalid CurrencySymbol",
                    "additionalData": null
                }
            },
            error6: {
                request: {
                    "partnerId": "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                    "value": 25,
                    "pointOfSaleId": "test",
                    "isoCurrencySymbol": "EUR",
                    "partnerTransactionId": "84ba908f-cef9-4713-9396-edad8f8c2c12",
                    "contentType": null,
                    "contentWidth": null,
                    "signature": "RCrcUGLLK6..."
                },
                response: {
                    "code": 6,
                    "message": "Coupon exists for the given PartnerTransactionId",
                    "additionalData": {
                        "serialNumber": "2453730818247605",
                        "value": 25,
                        "isoCurrencySymbol": "EUR",
                        "partnerTransactionId": "84ba908f-cef9-4713-9396-edad8f8c2c12"
                    }
                }
            },
            error8: {
                request: {
                    "partnerId": "ef104874-0bc4-459d-945a-fb461e8eae28",
                    "value": 25,
                    "pointOfSaleId": "test",
                    "isoCurrencySymbol": "EUR",
                    "partnerTransactionId": "381f7f80-8a04-4be7-bf60-28a940d8772c",
                    "contentType": null,
                    "contentWidth": null,
                    "signature": "KAvRKfwCeV..."
                },
                response: {
                    "code": 8,
                    "message": "Limit exceeded",
                    "additionalData": null
                }
            }
        },
        CreateMultipleTransactions: {
            error1: {
                request: {
                    "contentType": "pdf",
                    "contentWidth": 50,
                    "isoCurrencySymbol": "EUR",
                    "partnerId": "",
                    "pointOfSaleId": "TestLocation",
                    "denominations": [
                        {
                            "value": 50,
                            "partnerTransactionId": "192502a3-97b8-4477-bba7-1338das1abbe"
                        },
                        {
                            "value": 25,
                            "partnerTransactionId": "512122a3-97b8-4477-bba7-1338dga1abbe"
                        }
                    ],
                    "signature": "D9pwlT9cKs..."
                },
                response: {
                    "code": 1,
                    "message": "Invalid PartnerId",
                    "additionalData": null
                }
            },
            error2: {
                request: {
                    "contentType": "pdf",
                    "contentWidth": 50,
                    "isoCurrencySymbol": "EUR",
                    "partnerId": "52f46879-294d-4904-be7e-368ab0161771",
                    "pointOfSaleId": "TestLocation",
                    "denominations": [
                        {
                            "value": 50,
                            "partnerTransactionId": "ae132377-03d9-4bf9-91ce-0b43f1ef6af5"
                        },
                        {
                            "value": 25,
                            "partnerTransactionId": "eb418b62-98e4-467e-b6d0-a9af2554d232"
                        }
                    ],
                    "signature": "Iww1xTuZm+g2dq1ka6TM2FXnDnPm47KkVpjHhhTt2OxH+cnlZ2KCdA6ovVff5qgRnMssFgEjDPeOyGdPEOzxMfqDS43OaBDPTOVEX2O6cHyUdhTxP09tqfRR40T0FduYgbrDc3hnDY60v4VjOaHRmnWeJ0hymPMTHMtH4XhJt2tZMfXNNLuoEWftF6GQ626O6AHZwYqH3zDcidd/O7gmPU+t3A5TnxSE1cb4SfdvPAMzPG9m9kZjd7FF8oD2AljrByVRbs4KDg7WxSZhLA4g8ienekBvhKRNwMK7LESCZX5zOieE24wBIJtyfmzYKsIZnnAyI2Jd7ib8t8LukWeHJpxXGW31xnobRuWQQb+OIgfxVum33IR5SX/uABVErHicEbcBU/qDvtWM326PdbHVSVdVetZ/OBouvXydD2AmsV3nm2OcL/+BnuuDJ4Kzjyu8QAwejbhsBf8Mt+P8ubjbFCS8edOVJDEjYY4+vhdMDHSaJWEVuy6i0S8BuJbWo9bAe3WbyaD+so0/vbwBrUXVCiLsQVrr+3/61WirgEtMb7I0gC8Sihx75mvQyjROZBHggVqfHeFWHrrN1bSFNdIm0GgOjrdqasofvDXi4PW5DrUhT3EaTjW+nZ3Q+gHdZQ/QMdKh1YkIhGASzprgYpkLZPdvbTCyFzIKjPrcS9aAG1s=",
                    "additionalParameter": 10
                },
                response:
                {
                    "code": 2,
                    "message": "Invalid Signature",
                    "additionalData": null
                }
            },
            error3: {
                request: {
                    "contentType": "pdf",
                    "contentWidth": 50,
                    "isoCurrencySymbol": "EUR",
                    "partnerId": "52f46879-294d-4904-be7e-368ab0161771",
                    "pointOfSaleId": "TestLocation",
                    "denominations": [
                        {
                            "value": 50,
                            "partnerTransactionId": "192502a3-97b8-4477-foma-1338das1abbe"
                        },
                        {
                            "value": 100,
                            "partnerTransactionId": "512122a3-97b8-4477-fasf-1338dga1abbe"
                        }
                    ],
                    "signature": "D9pwlT9cKs..."
                },
                response: {
                    "code": 3,
                    "message": "Invalid CouponValue",
                    "additionalData": null
                }
            },
            error5: {
                request: {
                    "contentType": "pdf",
                    "contentWidth": 50,
                    "isoCurrencySymbol": "EUr",
                    "partnerId": "52F46879-294D-4904-BE7E-368AB0161771",
                    "pointOfSaleId": "TestLocation",
                    "denominations": [
                        {
                            "value": 50,
                            "partnerTransactionId": "192502a3-97b8-4477-bba7-1338das1abbe"
                        },
                        {
                            "value": 25,
                            "partnerTransactionId": "512122a3-97b8-4477-bba7-1338dga1abbe"
                        }
                    ],
                    "signature": "D9pwlT9cKs..."
                },
                response: {
                    "code": 5,
                    "message": "Invalid CurrencySymbol",
                    "additionalData": null
                }

            },
            error6: {
                request: {
                    "contentType": "pdf",
                    "contentWidth": 50,
                    "isoCurrencySymbol": "EUR",
                    "partnerId": "52f46879-294d-4904-be7e-368ab0161771",
                    "pointOfSaleId": "TestLocation",
                    "denominations": [
                        {
                            "value": 50,
                            "partnerTransactionId": "192502a3-97b8-4477-asdf-1338das1abbe"
                        },
                        {
                            "value": 25,
                            "partnerTransactionId": "192502a3-97b8-4477-asdf-1338das1abbe"
                        }
                    ],
                    "signature": "D9pwlT9cKs..."
                },
                response:
                {
                    "code": 6,
                    "message": "Coupon exists for the given PartnerTransactionId",
                    "additionalData": {
                        "serialNumber": "7831729896718976",
                        "value": 50.00,
                        "isoCurrencySymbol": "EUR",
                        "partnerTransactionId": "192502a3-97b8-4477-bba7-1338das1abbe"
                    }
                }


            },
            error8: {
                request: {
                    "contentType": "pdf",
                    "contentWidth": 50,
                    "isoCurrencySymbol": "EUR",
                    "partnerId": "ef104874-0bc4-459d-945a-fb461e8eae28",
                    "pointOfSaleId": "TestLocation",
                    "denominations": [
                        {
                            "value": 50,
                            "partnerTransactionId": "192502a3-97b8-4477-bba7-1338das1abbe"
                        },
                        {
                            "value": 25,
                            "partnerTransactionId": "512122a3-97b8-4477-bba7-1338dga1abbe"
                        }
                    ],
                    "signature": "D9pwlT9cKs..."
                },
                response: {
                    "code": 8,
                    "message": "Limit exceeded",
                    "additionalData": null
                }
            }
        },
        CancelTransaction: {
            error1: {
                request: {
                    "partnerId": "0b7ecd90-800a-4aa0-8cae-f3630b441608",
                    "serialNumber": "3521314447254926",
                    "partnerTransactionId": null,
                    "pointOfSaleId": "test",
                    "signature": "Q37XjSbUcP..."
                },
                response: {
                    "code": 1,
                    "message": "Invalid PartnerId",
                    "additionalData": null
                }
            },
            error2: {
                request: {
                    "partnerId": "52f46879-294d-4904-be7e-368ab0161771",
                    "serialNumber": "3521314447254926",
                    "partnerTransactionId": null,
                    "pointOfSaleId": "test",
                    "signature": "H9UQYqen55..."
                },
                response: {
                    "code": 2,
                    "message": "Invalid Signature",
                    "additionalData": null
                }
            },
            error4: {
                request: {
                    "partnerId": "52f46879-294d-4904-be7e-368ab0161771",
                    "serialNumber": "0513316595342864",
                    "partnerTransactionId": null,
                    "pointOfSaleId": "test",
                    "signature": "WRXR0bbbxG..."
                },
                response: {
                    "code": 4,
                    "message": "Invalid coupon serial number or partner transaction id",
                    "additionalData": null
                }
            },
            error5: {
                request: {
                    "partnerId": "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                    "serialNumber": "3521314447254926",
                    "partnerTransactionId": null,
                    "pointOfSaleId": "test",
                    "signature": "b+qkNiQugX..."
                },
                response: {
                    "code": 5,
                    "message": "PartnerIds do not match",
                    "additionalData": null
                }
            },
            error6: {
                request: {
                    "partnerId": "52f46879-294d-4904-be7e-368ab0161771",
                    "serialNumber": "3521314447254926",
                    "partnerTransactionId": null,
                    "pointOfSaleId": "error",
                    "signature": "JLCbn/1AIz..."
                },
                response: {
                    "code": 6,
                    "message": "PointOfSaleIds do not match",
                    "additionalData": null
                }
            },
            error7: {
                request: {
                    "partnerId": "52f46879-294d-4904-be7e-368ab0161771",
                    "serialNumber": "3448230981812314",
                    "partnerTransactionId": null,
                    "pointOfSaleId": "test",
                    "signature": "MzL4jkd+9m..."
                },
                response: {
                    "code": 7,
                    "message": "Coupon has been already cancelled",
                    "additionalData": null
                }
            },
            error8: {
                request: {
                    "partnerId": "52f46879-294d-4904-be7e-368ab0161771",
                    "serialNumber": "3844898791528058",
                    "partnerTransactionId": null,
                    "pointOfSaleId": "test",
                    "signature": "Qn1RHluAc9..."
                },
                response: {
                    "code": 8,
                    "message": "Coupon has been already used",
                    "additionalData": null
                }
            },
            error9: {
                request: {
                    "partnerId": "52f46879-294d-4904-be7e-368ab0161771",
                    "serialNumber": "0573140441237604",
                    "partnerTransactionId": null,
                    "pointOfSaleId": "test",
                    "signature": "rE7kmJGW9V..."
                },
                response: {
                    "code": 9,
                    "message": "Coupon has already expired",
                    "additionalData": null
                }
            },
            error10: {
                request: {
                    "partnerId": "52f46879-294d-4904-be7e-368ab0161771",
                    "serialNumber": "5036566273639964",
                    "partnerTransactionId": null,
                    "pointOfSaleId": "test",
                    "signature": "keAMXi5GCd..."
                },
                response: {
                    "code": 10,
                    "message": "Coupon cannot be cancelled",
                    "additionalData": null
                }
            },
        },

    }


    $scope.aBonGenerate = {
        couponCreation: {
            requestExample: {
                "partnerId": "52f46879-294d-4904-be7e-368ab0161771",
                "value": 50,
                "pointOfSaleId": "TestLocation",
                "isoCurrencySymbol": "EUR",
                "partnerTransactionId": "086b9ada-f1af-4213-b5fb-f788efab546a",
                "contentType": null,
                "contentWidth": null,
                "signature": "CO+V..."
            },
            responseExample: {
                "serialNumber": "8842344421341962",
                "couponCode": "1198730494773419",
                "value": 50.0,
                "isoCurrencySymbol": "EUR",
                "content": "PD94bWwgdmVyc2lvbj0iMS4wIj8+DQo8Y291cG9uPg0KCTxsb2dvPlUwcGliV2xZY25GNWNVaDFRemhRYzFSRlVIaHFaV1l4ZW5WbUsyNHJTVXBXWTBOcFRWUlNUV0Z2TlUxdlVFcHdZVlZ3TVRCUGNHcHBiekZhZERVcmMwNDRaMDVtT0dWdGMwcHRUVVp3YmtZMlpsTmhNak5oTDNKa1ozVmxWVFF2VkhOaU5IRnFSVFpGZGtoVFFpdFhWVzlYWW1wemJrSkRkVkJJVkVGcFMyOXhUVVJaWlVWblJrdFJiVWRWUjJ3MVoyWnJNRk5HYm0wcldXMVVkRE51VVZkVmNIaHBjbkZ4VTNOeVlYRnlWV3h0WjBFM2JYbG9hazgwYTNKeE5uWndLM2R2WTFkNFN6aDRNWFJTVEUxM1kydEpkSE5PT1hnNGJrcDRjVUZDTURsUGNqTk1NMWhFVEV0VmRHbFBkRFJrUjFrMk5FTkhOM1Z5V0RjNVdGQmlkVXh2T1dRdllUZE5NM0kwVGxoYVUyWklZamhQTTNoV1VUTTNlamxMWldweGJIbEdhamxDVVcxa1RFTjFXSEk1TlVSNVZYVm9TMlpRTkZFeGNTOHJWVEJRZGtzMFJXVlNSR2RSWjNKVGJsQkhVa2RTU1dobmRFcHVjWGN4T0VJMmMyMWpWVEl5WlhwcmEybEtUV2xCV2xKQmRrNWFlbGRKWjJ4VGVXUTJZM2x3UlhOdEsyOVZVMFp3YUU5S2FtbHNWWEF3Um1wdGFuZHhkR0ZxVTNCV2RpOVdWRlZ4VEhWS1RIQkdSMEprY0hsTFRWZDJXbVJIUTBScmF6RnhSa00wUVhKSVQzaGhjVEZNQ2prck5WbDJSeTlZV25aVGNrNXRNV2QzV1dwcE5IRjNTeXRQTldkMWJraHNOVzR4YzA5UGVscDRSbEZ1Vnk4d1RDdExibWwyV0ZWcWRUQlhjM1EzU214dWNHZDZZamd6VFhWWVNrcHdiVEEzTjNWVGJ6SldPWE4zY1dOd01EaGlUSFJUZEc4eFlVbFlhelUwZEhVM1ltOTJZVWgwUm10bU4zVnNSRkF6WW1NelJ5dGxaRzB5T1hsS1YwdzFVMUkyT1hGcVdISTJWVzF4TUM5NFdrMTZkbm8yTWt0SVpVUXJieXRNVmpKMGJHVkdia281YjA5MVJEUjZlWE42UWxRNGJuUTVNVVkyVFdkS1dXOVpVWHBvYUNzNFdsZ3pSVlp5T1N0aVkwMW5Ua2hPYUdnMWJqZzBNMWRZUnpoT1dGRlpZbWM0WlZWa2NIUjJOaXR0TWtoNlZWWkxibWRYWXpjdk5YQm9WbmhGZG1KR016SnZhV0ZyVGs5VFowaGxTbmxEVEdwelVuaG9OSGRrTUVacGFtcFVVR2syU1ZkUGExQkRXV2haT0M5QmFXMUdhMFJ6VXpaaFMxSlRlVU5hY0VwTUwwMWtiV2RyTURsRFYyRkRWV3d4UkZwdWNGVktXVzl0YVd4b09YbHBXblZZVGpSS1NtOXdhRzF1YW14Q1FWRkJOdz09PC9sb2dvPg0KICAgIDxkYXRlVGltZT4xMS4xMC4yMDIzLiAvIDEwOjAzPC9kYXRlVGltZT4NCiAgICA8c2VsbGVyPkFib25TYWxlc1BhcnRuZXI8L3NlbGxlcj4NCiAgICA8cG9pbnRPZlNhbGU+VGVzdExvY2F0aW9uIDwvcG9pbnRPZlNhbGU+DQogICAgPHZhbHVlT2ZBYm9uPjUwLDAwPC92YWx1ZU9mQWJvbj4NCiAgICA8c2l4dGVlbkRpZ2l0Q29kZT4xMTk4IDczMDQgOTQ3NyAzNDE5PC9zaXh0ZWVuRGlnaXRDb2RlPg0KICAgIDxxUkNvZGU+aVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU1zQUFBRExDQVlBQUFEQSsyY3pBQUFBQVhOU1IwSUFyczRjNlFBQUFBUm5RVTFCQUFDeGp3djhZUVVBQUFBSmNFaFpjd0FBRHNNQUFBN0RBY2R2cUdRQUFBMkJTVVJCVkhoZTdkUEJqdXc2RGdUUjkvOC9QYk9LWFNCQlVGY3N1Y0VEeEM0aDJkWHQvLzYzMWlyWmoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdkdQNWIvLy92dDhmNEc5MTllYXRoOUxvNy9BM3V0clRkdVBwZEZmWU8vMXRhYnR4OUxvTDdEMytsclQ5bU5wOUJmWWUzMnRhZnV4TlBvTDdMMisxclQ5V0JyOUJmWmVYMnZhVXgvTFMrejU2QWE3NTdURTl2UVNlejZhTm42anZUUzl4SjZQYnJCN1RrdHNUeSt4NTZOcDR6ZmFTOU5MN1Bub0Jydm50TVQyOUJKN1BwbzJmcU85TkwzRW5vOXVzSHRPUzJ4UEw3SG5vMm5qTjlwTDAwdnMrZWdHdStlMHhQYjBFbnMrbWpaK283MDB2Y1NlajI2d2UwNUxiRTh2c2VlamFlTTMya3ZUUyt6NTZBYTc1N1RFOXZRU2V6NmFObjZqdlRRbHRqOHRzVDExMlZtVTJKNjY3Q3hLYkg5YVludWFObjZqdlRRbHRqOHRzVDExMlZtVTJKNjY3Q3hLYkg5YVludWFObjZqdlRRbHRqOHRzVDExMlZtVTJKNjY3Q3hLYkg5YVludWFObjZqdlRRbHRqOHRzVDExMlZtVTJKNjY3Q3hLYkg5YVludWFObjZqdlRRbHRqOHRzVDExMlZtVTJKNjY3Q3hLYkg5YVludWFObjZqdlRRbHRqOHRzVDExMlZtVTJKNjY3Q3hLYkg5YVludWFObjZqdlRRbHRqOHRzVDExMlZtVTJKNjY3Q3hLYkg5YVludWFObjZqdlRRbHRqOHRzVDNkWVBkUVludEtiRStKN1U5TGJFL1R4bSswbDZiRTlxY2x0cWNiN0I1S2JFK0o3U214L1dtSjdXbmErSTMyMHBUWS9yVEU5blNEM1VPSjdTbXhQU1cyUHkyeFBVMGJ2OUZlbWhMYm41YllubTZ3ZXlpeFBTVzJwOFQycHlXMnAybmpOOXBMVTJMNzB4TGIwdzEyRHlXMnA4VDJsTmordE1UMk5HMzhSbnRwU214L1dtSjd1c0h1b2NUMmxOaWVFdHVmbHRpZXBvM2ZhQzlOaWUxUFMyeFBOOWc5bE5pZUV0dFRZdnZURXR2VHRQRWI3YVVwc2YxcGllMHBzZjJ2U214UGllMVBTMnhQMDhadnRKZW14UGFuSmJhbnhQYS9LckU5SmJZL0xiRTlUUnUvMFY2YUV0dWZsdGllRXR2L3FzVDJsTmordE1UMk5HMzhSbnRwU214L1dtSjdTbXovcXhMYlUyTDcweExiMDdUeEcrMmxLYkg5YVludEtiSDlyMHBzVDRudFQwdHNUOVBHYjdTWHBzVDJweVcycDhUMnZ5cXhQU1cyUHkyeFBVMGJ2OUZlbWhMYm41YlluaExiLzZyRTlwVFkvclRFOWpSdC9FWjdhWHFKUFI5MTJWblVaV2RSWW50NmlUMGZUUnUvMFY2YVhtTFBSMTEyRm5YWldaVFlubDVpejBmVHhtKzBsNmFYMlBOUmw1MUZYWFlXSmJhbmw5anowYlR4RysybDZTWDJmTlJsWjFHWG5VV0o3ZWtsOW53MGJmeEdlMmw2aVQwZmRkbFoxR1ZuVVdKN2VvazlIMDBidjlGZW1sNWl6MGRkZGhaMTJWbVUySjVlWXM5SDA4WnZ0SmVtbDlqelVaZWRSVjEyRmlXMnA1Zlk4OUcwOFJ2dHBiOVdZbnRLYkUrSjdTbXgvZGVhTm42anZmVFhTbXhQaWUwcHNUMGx0djlhMDhadnRKZitXb250S2JFOUpiYW54UFpmYTlyNGpmYlNYeXV4UFNXMnA4VDJsTmorYTAwYnY5RmUrbXNsdHFmRTlwVFluaExiZjYxcDR6ZmFTMyt0eFBhVTJKNFMyMU5pKzY4MWJmeEdlK212bGRpZUV0dFRZbnRLYlArMXBzM2YrTWZaSDVYV3QrMWY4Qit6ajRUV3QrMWY4Qit6ajRUV3QrMWY4Qit6ajRUV3QrMWY4Qit6ajRUV3QrMWY4Qit6ajRUV3QrMWY4Qit6ajRUV3QzM21MMmovZkpXNjdLeWJKYmFueFBhVkV0dlRYL2VaTjdRL1RxVXVPK3RtaWUwcHNYMmx4UGIwMTMzbURlMlBVNm5MenJwWlludEtiRjhwc1QzOWRaOTVRL3ZqVk9xeXMyNlcySjRTMjFkS2JFOS8zV2ZlMFA0NGxicnNySnNsdHFmRTlwVVMyOU5mOTVrM3REOU9wUzQ3NjJhSjdTbXhmYVhFOXZUWGZlWU43WTlUcWN2T3VsbGllMHBzWHlteFBmMTFUNzJoL1FFcUpiYXYxR1ZuVmVxeXN5aXhmYVhFOXBUWXZ0SzArUnNEKzBFcUpiYXYxR1ZuVmVxeXN5aXhmYVhFOXBUWXZ0SzArUnNEKzBFcUpiYXYxR1ZuVmVxeXN5aXhmYVhFOXBUWXZ0SzArUnNEKzBFcUpiYXYxR1ZuVmVxeXN5aXhmYVhFOXBUWXZ0SzArUnNEKzBFcUpiYXYxR1ZuVmVxeXN5aXhmYVhFOXBUWXZ0SzArUnNEKzBFcUpiYXYxR1ZuVmVxeXN5aXhmYVhFOXBUWXZ0SzArUnNEKzBFcUpiYXYxR1ZuVmVxeXN5aXhmYVhFOXBUWXZ0SzA4UnZ0cFNzbHRxY3VPK3RySmJhbmFmWU1sYWFOMzJndlhTbXhQWFhaV1Y4cnNUMU5zMmVvTkczOFJudnBTb250cWN2TytscUo3V21hUFVPbGFlTTMya3RYU214UFhYYlcxMHBzVDlQc0dTcE5HNy9SWHJwU1ludnFzck8rVm1KN21tYlBVR25hK0kzMjBwVVMyMU9YbmZXMUV0dlROSHVHU3RQR2I3U1hycFRZbnJyc3JLK1YySjZtMlROVW1qWi9ZMkEvU0tYRTlwVnVzSHVveTg3NlZZbnRLYkU5VFp1L01iQWZwRkppKzBvMzJEM1VaV2Y5cXNUMmxOaWVwczNmR05nUFVpbXhmYVViN0I3cXNyTitWV0o3U214UDArWnZET3dIcVpUWXZ0SU5kZzkxMlZtL0tyRTlKYmFuYWZNM0J2YURWRXBzWCtrR3U0ZTY3S3hmbGRpZUV0dlR0UGtiQS90QktpVzJyM1NEM1VOZGR0YXZTbXhQaWUxcDJ2eU5nZjBnbFJMYlY3ckI3cUV1Tyt0WEpiYW54UFkwYmY3R1lmWWpVMko3U214L1dwZWRkYk11TzR0ZTh0YlRYR0IvQUVwc1Q0bnRUK3V5czI3V1pXZlJTOTU2bWd2c0QwQ0o3U214L1dsZGR0Yk51dXdzZXNsYlQzT0IvUUVvc1QwbHRqK3R5ODY2V1plZFJTOTU2Mmt1c0Q4QUpiYW54UGFuZGRsWk4rdXlzK2dsYnozTkJmWUhvTVQybE5qK3RDNDc2MlpkZGhhOTVLMm51Y0QrQUpUWW5oTGJuOVpsWjkyc3k4NmlsN3oxTkgrQS9jR3B5ODZpeFBhblRiTm5vR243c2Z4ajlrZWxManVMRXR1Zk5zMmVnYWJ0eC9LUDJSK1Z1dXdzU214LzJqUjdCcHEySDhzL1puOVU2ckt6S0xIOWFkUHNHV2phZml6L21QMVJxY3ZPb3NUMnAwMnpaNkJwKzdIOFkvWkhwUzQ3aXhMYm56Yk5ub0dtN2NmeWo5a2ZsYnJzTEVwc2Y5bzBld2FhTm42anZmVFhTbXhQaWUycHk4NjZXWmVkUlM4WmZ4cjdRYjVXWW50S2JFOWRkdGJOdXV3c2VzbjQwOWdQOHJVUzIxTmllK3F5czI3V1pXZlJTOGFmeG42UXI1WFluaExiVTVlZGRiTXVPNHRlTXY0MDlvTjhyY1QybE5pZXV1eXNtM1haV2ZTUzhhZXhIK1JySmJhbnhQYlVaV2Zkck12T29wZU1QNDM5SUY4cnNUMGx0cWN1Tyt0bVhYWVd2V1Q4YWV3SG9aZlk4OUVOZHM5cGllM3BCcnVIdm1MOFNlM0hvcGZZODlFTmRzOXBpZTNwQnJ1SHZtTDhTZTNIb3BmWTg5RU5kczlwaWUzcEJydUh2bUw4U2UzSG9wZlk4OUVOZHM5cGllM3BCcnVIdm1MOFNlM0hvcGZZODlFTmRzOXBpZTNwQnJ1SHZtTDhTZTNIb3BmWTg5RU5kczlwaWUzcEJydUh2bUw4U2UzSG9wZlk4OUVOZHM5cGllM3BCcnVIdm1MOFNlM0hvc1QycHlXMnB5NDdpeExiVTJKN1NteFBYWGJXYWRQR2I3U1hwc1QycHlXMnB5NDdpeExiVTJKN1NteFBYWGJXYWRQR2I3U1hwc1QycHlXMnB5NDdpeExiVTJKN1NteFBYWGJXYWRQR2I3U1hwc1QycHlXMnB5NDdpeExiVTJKN1NteFBYWGJXYWRQR2I3U1hwc1QycHlXMnB5NDdpeExiVTJKN1NteFBYWGJXYWRQR2I3U1hwc1QycHlXMnB5NDdpeExiVTJKN1NteFBYWGJXYWRQR2I3U1hwc1QycHlXMnB5NDdpeExiVTJKN1NteFBYWGJXYWRQR2I3U1hwc1QycHlXMnA4VDJsUkxiVTJKN1NteGZxY3ZPb3BlTVA0MzlJSlRZL3JURTlwVFl2bEppZTBwc1Q0bnRLM1haV2ZTUzhhZXhINFFTMjUrVzJKNFMyMWRLYkUrSjdTbXhmYVV1TzR0ZU12NDA5b05RWXZ2VEV0dFRZdnRLaWUwcHNUMGx0cS9VWldmUlM4YWZ4bjRRU214L1dtSjdTbXhmS2JFOUpiYW54UGFWdXV3c2VzbjQwOWdQUW9udFQwdHNUNG50S3lXMnA4VDJsTmkrVXBlZFJTOFpmeHI3UVNpeC9XbUo3U214ZmFYRTlwVFluaExiVitxeXMrZ2w0MDlqUHdnbHRqOHRzVDBsdGo4dHNUMGx0cWN1TzZ2U1Y0dy9xZjFZbE5qK3RNVDJsTmordE1UMmxOaWV1dXlzU2w4eC9xVDJZMUZpKzlNUzIxTmkrOU1TMjFOaWUrcXlzeXA5eGZpVDJvOUZpZTFQUzJ4UGllMVBTMnhQaWUycHk4NnE5QlhqVDJvL0ZpVzJQeTJ4UFNXMlB5MnhQU1cycHk0N3E5SlhqRCtwL1ZpVTJQNjB4UGFVMlA2MHhQYVUySjY2N0t4S1h6SCtwUFpqVVdMNzB4TGJVMkw3MHhMYlUySjc2ckt6S24zRitKUGFqMFV2c2VlakxqdUx1dXdzNnJLektuWFpXWldtamQ5b0wwMHZzZWVqTGp1THV1d3M2ckt6S25YWldaV21qZDlvTDAwdnNlZWpManVMdXV3czZyS3pLblhaV1pXbWpkOW9MMDB2c2VlakxqdUx1dXdzNnJLektuWFpXWldtamQ5b0wwMHZzZWVqTGp1THV1d3M2ckt6S25YWldaV21qZDlvTDAwdnNlZWpManVMdXV3czZyS3pLblhaV1pXbWpkOW9MMDB2c2VlakxqdUx1dXdzNnJLektuWFpXWldtamQ5b0wvMjF1dXdzU214UE45Zzl2K29sKzdFMDZyS3pLTEU5M1dEMy9LcVg3TWZTcU12T29zVDJkSVBkODZ0ZXNoOUxveTQ3aXhMYjB3MTJ6Njk2eVg0c2picnNMRXBzVHpmWVBiL3FKZnV4Tk9xeXN5aXhQZDFnOS95cWwrekgwcWpMenFMRTluU0QzZk9yWHZMVzA2ejFzUDFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyNTMvLytELzI3T2VQUGhSU0hBQUFBQUVsRlRrU3VRbUNDPC9xUkNvZGU+DQoJPGluc3RydWN0aW9uc0ZvclVzZXJzPlZuZXNpdGUgMTYtbWVzdG5vIGtvZG8ga3Vwb25hIG5hIHNwbGV0bmkgc3RyYW5pIHRyZ292aW5lIGFsaSBzdHJhbmkgcG9udWRuaWthIHNwbGV0bmloIHN0b3JpdGV2LjwvaW5zdHJ1Y3Rpb25zRm9yVXNlcnM+DQogICAgPHNlcmlhbE51bWJlcj44ODQyMzQ0NDIxMzQxOTYyPC9zZXJpYWxOdW1iZXI+DQogICAgPGFkZGl0aW9uYWxJbmZvcm1hdGlvbj5BYm9uIGl6ZGEgQWlyY2FzaCwgaW5zdGl0dWNpamEgemEgaXpkYWpvIGVsZWt0cm9uc2tlZ2EgZGVuYXJqYSwgcmVnaXN0cmlyYW5hIHYgcmVnaXN0cnUgRXZyb3Bza2VnYSBiYW7EjW5lZ2EgemRydcW+ZW5qYSAoRUJBKSBwb2QgxaF0ZXZpbGtvIElFTjExNi4NCiAgICAgUHJlYmVyaXRlIHNwbG/FoW5lIHBvZ29qZSBuYSB3d3cuYWJvbi5jYXNoL3NpLjwvYWRkaXRpb25hbEluZm9ybWF0aW9uPg0KICAgIDxlbWFpbD5FbWFpbDogaW5mb0BhYm9uLmNhc2g8L2VtYWlsPg0KICAgIDxwaG9uZU51bWJlcj5UZWxlZm9uOiAwODAgNzU1IDU0NTwvcGhvbmVOdW1iZXI+DQo8L2NvdXBvbj4NCg==",
                "partnerTransactionId": "086b9ada-f1af-4213-b5fb-f788efab546a"
            },
            errorResponseExample: {
                code: 6,
                message: "Coupon exists for the given PartnerTransactionId",
                additionalData: {
                    serialNumber: "8023200631484066",
                    value: 100.00,
                    isoCurrencySymbol: "EUR",
                    partnerTransactionId: "9059ca5c-675a-48b5-b41a-e04ab5b981ae"
                }
            }
        },
        multipleCouponsCreation: {
            requestExample: {
                "contentType": "pdf",
                "contentWidth": 50,
                "isoCurrencySymbol": "EUR",
                "partnerId": "52F46879-294D-4904-BE7E-368AB0161771",
                "pointOfSaleId": "TestLocation",
                "denominations": [
                    {
                        "value": 50,
                        "partnerTransactionId": "192502a3-97b8-4477-bba7-1338das1abbe"
                    },
                    {
                        "value": 25,
                        "partnerTransactionId": "512122a3-97b8-4477-bba7-1338dga1abbe"
                    }
                ]
            },
            responseExample: [
                {
                    "serialNumber": "0533690820961905",
                    "couponCode": "0900149851237665",
                    "value": 25,
                    "isoCurrencySymbol": "EUR",
                    "content": "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/8RiYIECBAoM9GgZn////yGpxEgcH5i/////+Qy+giUZLjREFB//////5BrgEC4IEJ6Bg//////kMugIGIIGRNQQI0f////iJiDQCPCDH///yGWXggXNEEbv/////mAxgoM0DB/////5qZEiYhEESj//////wQIGYjAYBj//////4IEbuDNQl3//////+ODBApEoan////8cEMwR6B////4iIj/////////ABABACmVuZHN0cmVhbQplbmRvYmoKNyAwIG9iago8PC9MZW5ndGggMTIwOS9GaWx0ZXIvRmxhdGVEZWNvZGU+PnN0cmVhbQp4nJVWy3LiRhTd8xU3O00ViH7oySqespN4MjVjx0wWmfGigR7SAqkZPXAVn5BPmIU/z+VlPiG3WwKMkBKnKBcX677OuS99G7ydDgiEQQDTBQqjRrqaDm4H3+wfg3f44GcjQ0RcCgQ/PABO3IhBSH2YpzBW6ZLApYZb47DWoS9UpumgsUXno6OIcV7o09glMQRxZPTHP1FA4evAuRRllY5/z1UiUzmxWqHLCOMujIHSCQ/eTJOWKwwdQBC1PE3zpd6K+QQuZjq7E2tZ3Ii8zGR+7oAFrh9CELY83OR6IZJMQ5rIotQTmOLXez0XpdJZ4+XbgLgcHgaf0dc9ENeHRfMfSt2AQxB4kA4oNywYeT24az3n+OSoYX4ZnRNuj65sfgwoMwl+HsVRyNzwfvquBcjzMETg0z0eSi2g612mC7gYISHinAUamgxYWBtxYDaIw/whIXD16bfXIqb8iAflM8SUvURsf/UhRvNXIkZnCNeP/RZkGox2mUhlthJFqWClFx3lJy6LwA/jPXLqWVsSI3DqYYv6lHFjt7fwfQTkBzaYg2Pk77kBRFXr4DclBoTHvf3U0LOpOapMLSPN0Bykl3wbquk9Gp3y7bEjm0bu4dI8eiWXjQEltYEHsaXj06YqJewEkpir76XMEjnp6KLYjTzgseceSrE3V98VOjivCOz7seUjshk7mYCizEWm5goe5AxKM9gqk6DWCnS2RrHDOAjrBJxNXj2KUq4TAVWxrpbi0MdnkDuypm6jftsB0vdOlW90uc0XBmS1WeMi+5dIbVN2jPNfBeceORTcyD0FN4/+V8E5i08LfoPrDznXpj5VV6lrMxqdQrmTuL2LlYJZrhNb28lJfWorYoM5xOc8iEnESBzQmPh9UVjcijLNRSKwBSGTqth3pF72xWNRHQ9nvT4ontsbKuSnPFwiD6Xpt+yrzlOkpLvxa+OAneb5cfOE7bBNJHbFJtfPqhQJiq2Gr219G9h5eHhwBeJw56L4c6w3czWyDlRvUK8V1K54UDs8XxIuVG4cwcLV+BnCH2KZy9mwIz6v4/+1lSLH2wl0CB+v304gjiPOQ8opoV1mzPayc331gdKO89xokeiU1Q9io3EL9FNJ47BFZbmqNrbAkOpHCQWWZLfNcasoHDhV6vQ8OVq/FpglIkepUOuJLeOPB36HUO06zOpj4GxM6VeymYEhYALzCsyAdxqRZuPIhX42+xFmIlvprenLXDxXmERX3WlQL7qVThQ8neLa6G0uSvjidAb0WQNulYlFZXazthxlYisXMqug6jDy6ipjY6q07kyVii9veueB8s7uQnRyLVdlrjP1jNOembct23MZ1Fe25YbVce0ub3clGOwdNtQ7MFqUYmuWuNmsmcIqoqMKG6jsBEnq5V+kCnc+ErMyXWOCpMLwW+Xy7yqR54ZxYO26kAF6esSDJfS5WWRb1ZnJ3VKX5jrhSoLCZr3VJuUn3FUdpa9fOZ1czwSosTlo9Y3qLcZ+veyn6FedlWJV9g7R8R2w1r/qHII+6/0JOSxdiaaEjj0/HHGfh+1Xwp6LxYLDwUKx516x4NXnKnZpDLR1qX/ZirWZL6hWYicynZrZSWSOc1j90CT6D6muMeIKZW5kc3RyZWFtCmVuZG9iago5IDAgb2JqCjw8L1R5cGUvUGFnZS9NZWRpYUJveFswIDAgMTQxLjczIDc2Nl0vUmVzb3VyY2VzPDwvRm9udDw8L0YxIDIgMCBSL0YyIDMgMCBSL0YzIDQgMCBSL0Y0IDYgMCBSPj4vWE9iamVjdDw8L2ltZzAgMSAwIFIvaW1nMSA1IDAgUj4+Pj4vQ29udGVudHMgNyAwIFIvUGFyZW50IDggMCBSPj4KZW5kb2JqCjEwIDAgb2JqCjw8L1R5cGUvRm9udERlc2NyaXB0b3IvQXNjZW50IDcyOC9DYXBIZWlnaHQgNjk5L0Rlc2NlbnQgLTIxMC9Gb250QkJveFstMTgyIC0zMDYgOTk5IDEwODVdL0ZvbnROYW1lL0FyaWFsTmFycm93L0l0YWxpY0FuZ2xlIDAvU3RlbVYgODAvRmxhZ3MgMzI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UcnVlVHlwZS9CYXNlRm9udC9BcmlhbE5hcnJvdy9FbmNvZGluZzw8L1R5cGUvRW5jb2RpbmcvRGlmZmVyZW5jZXNbMzIvc3BhY2UvZXhjbGFtIDQwL3BhcmVubGVmdC9wYXJlbnJpZ2h0IDQ0L2NvbW1hL2h5cGhlbi9wZXJpb2Qvc2xhc2gvemVyby9vbmUvdHdvL3RocmVlL2ZvdXIvZml2ZS9zaXgvc2V2ZW4vZWlnaHQvbmluZS9jb2xvbiA2NC9hdC9BL0IgNjgvRC9FIDcyL0gvSSA3Ni9MIDc4L04vTy9QIDgzL1MvVC9VL1YgOTAvWiA5Ny9hL2IvYy9kL2UvZi9nL2gvaS9qL2svbC9tL24vby9wIDExNC9yL3MvdC91L3YvdyAxMjIveiAxMzgvU2Nhcm9uIDE1NC9zY2Fyb24gMTU4L3pjYXJvbiAyMzAvY2FjdXRlIDIzMi9jY2Fyb24gMjQwL2Rjcm9hdF0+Pi9GaXJzdENoYXIgMzIvTGFzdENoYXIgMjQwL1dpZHRoc1syMjggMjI4IDAgMCAwIDAgMCAwIDI3MiAyNzIgMCAwIDIyOCAyNzIgMjI4IDIyOCA0NTYgNDU2IDQ1NiA0NTYgNDU2IDQ1NiA0NTYgNDU2IDQ1NiA0NTYgMjI4IDAgMCAwIDAgMCA4MzIgNTQ2IDU0NiAwIDU5MSA1NDYgMCAwIDU5MSAyMjggMCAwIDQ1NiAwIDU5MSA2MzggNTQ2IDAgMCA1NDYgNTAwIDU5MSA1NDYgMCAwIDAgNTAwIDAgMCAwIDAgMCAwIDQ1NiA0NTYgNDEwIDQ1NiA0NTYgMjI4IDQ1NiA0NTYgMTgyIDE4MiA0MTAgMTgyIDY4MyA0NTYgNDU2IDQ1NiAwIDI3MiA0MTAgMjI4IDQ1NiA0MTAgNTkxIDAgMCA0MTAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgNTQ2IDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDQxMCAwIDAgMCA0MTAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDQxMCAwIDQxMCAwIDAgMCAwIDAgMCAwIDQ1M10vRm9udERlc2NyaXB0b3IgMTAgMCBSPj4KZW5kb2JqCjMgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhL0VuY29kaW5nL1dpbkFuc2lFbmNvZGluZz4+CmVuZG9iagoxMSAwIG9iago8PC9UeXBlL0ZvbnREZXNjcmlwdG9yL0FzY2VudCA3MjgvQ2FwSGVpZ2h0IDcxNS9EZXNjZW50IC0yMTAvRm9udEJCb3hbLTYyNyAtMzc2IDIwMDAgMTA1NV0vRm9udE5hbWUvQXJpYWwtQm9sZE1UL0l0YWxpY0FuZ2xlIDAvU3RlbVYgODAvRmxhZ3MgMjYyMTc2Pj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHJ1ZVR5cGUvQmFzZUZvbnQvQXJpYWwtQm9sZE1UL0VuY29kaW5nPDwvVHlwZS9FbmNvZGluZy9EaWZmZXJlbmNlc1szMi9zcGFjZSA0NC9jb21tYSA0OC96ZXJvL29uZS90d28vdGhyZWUvZm91ci9maXZlL3NpeC9zZXZlbi9laWdodC9uaW5lIDY5L0UgODIvUiA4NS9VXT4+L0ZpcnN0Q2hhciAzMi9MYXN0Q2hhciA4NS9XaWR0aHNbMjc3IDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAyNzcgMCAwIDAgNTU2IDU1NiA1NTYgNTU2IDU1NiA1NTYgNTU2IDU1NiA1NTYgNTU2IDAgMCAwIDAgMCAwIDAgMCAwIDAgMCA2NjYgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgNzIyIDAgMCA3MjJdL0ZvbnREZXNjcmlwdG9yIDExIDAgUj4+CmVuZG9iagoxMiAwIG9iago8PC9UeXBlL0ZvbnREZXNjcmlwdG9yL0FzY2VudCA3MjgvQ2FwSGVpZ2h0IDY5OS9EZXNjZW50IC0yMTAvRm9udEJCb3hbLTEzNyAtMzA2IDk5OSAxMTA4XS9Gb250TmFtZS9BcmlhbE5hcnJvdy1Cb2xkL0l0YWxpY0FuZ2xlIDAvU3RlbVYgODAvRmxhZ3MgMjYyMTc2Pj4KZW5kb2JqCjYgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHJ1ZVR5cGUvQmFzZUZvbnQvQXJpYWxOYXJyb3ctQm9sZC9FbmNvZGluZzw8L1R5cGUvRW5jb2RpbmcvRGlmZmVyZW5jZXNbMzIvc3BhY2UgNTgvY29sb24gNjgvRCA3NS9LIDc4L04gODAvUCA4NS9VIDk3L2EvYi9jL2QvZS9mIDEwNS9pL2ovayAxMDkvbS9uL28vcCAxMTQvciAxMTYvdC91IDEyMi96IDE1NC9zY2Fyb25dPj4vRmlyc3RDaGFyIDMyL0xhc3RDaGFyIDE1NC9XaWR0aHNbMjI4IDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMjcyIDAgMCAwIDAgMCAwIDAgMCAwIDU5MSAwIDAgMCAwIDAgMCA1OTEgMCAwIDU5MSAwIDU0NiAwIDAgMCAwIDU5MSAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgNDU2IDUwMCA0NTYgNTAwIDQ1NiAyNzIgMCAwIDIyOCAyMjggNDU2IDAgNzI5IDUwMCA1MDAgNTAwIDAgMzE4IDAgMjcyIDUwMCAwIDAgMCAwIDQxMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDQ1Nl0vRm9udERlc2NyaXB0b3IgMTIgMCBSPj4KZW5kb2JqCjggMCBvYmoKPDwvVHlwZS9QYWdlcy9Db3VudCAxL0tpZHNbOSAwIFJdPj4KZW5kb2JqCjEzIDAgb2JqCjw8L1R5cGUvQ2F0YWxvZy9QYWdlcyA4IDAgUj4+CmVuZG9iagoxNCAwIG9iago8PC9Qcm9kdWNlcihpVGV4dFNoYXJwkiA1LjUuMTMuMSCpMjAwMC0yMDE5IGlUZXh0IEdyb3VwIE5WIFwoQUdQTC12ZXJzaW9uXCkpL0NyZWF0aW9uRGF0ZShEOjIwMjMwNzE5MTEzNjU2KzAyJzAwJykvTW9kRGF0ZShEOjIwMjMwNzE5MTEzNjU2KzAyJzAwJyk+PgplbmRvYmoKeHJlZgowIDE1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDA5OTA2IDAwMDAwIG4gCjAwMDAwMTA5MTggMDAwMDAgbiAKMDAwMDAxMTE3MyAwMDAwMCBuIAowMDAwMDA3NzYyIDAwMDAwIG4gCjAwMDAwMTE3MzEgMDAwMDAgbiAKMDAwMDAwODI5MiAwMDAwMCBuIAowMDAwMDEyMzA3IDAwMDAwIG4gCjAwMDAwMDk1NjkgMDAwMDAgbiAKMDAwMDAwOTc0NSAwMDAwMCBuIAowMDAwMDExMDA2IDAwMDAwIG4gCjAwMDAwMTE1NjEgMDAwMDAgbiAKMDAwMDAxMjM1OCAwMDAwMCBuIAowMDAwMDEyNDA0IDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSAxNS9Sb290IDEzIDAgUi9JbmZvIDE0IDAgUi9JRCBbPDYwNzYzNGIyZjFiMDNhNjE5ZmMxMWMyZWFiNGMwMzJhPjw2MDc2MzRiMmYxYjAzYTYxOWZjMTFjMmVhYjRjMDMyYT5dPj4KJWlUZXh0LTUuNS4xMy4xCnN0YXJ0eHJlZgoxMjU3MAolJUVPRgo=",
                    "partnerTransactionId": "60015e86-3bff-4faa-a472-5abc7114437d"
                }
            ]
        },
        multipleCouponsCreationV2: {
            requestExample: {
                "contentType": "pdf",
                "contentWidth": 50,
                "isoCurrencySymbol": "EUR",
                "partnerId": "52F46879-294D-4904-BE7E-368AB0161771",
                "pointOfSaleId": "TestLocation",
                "denominations": [
                    {
                        "value": 50,
                        "partnerTransactionId": "192502a3-97b8-4477-bba7-1338das1abbe"
                    },
                    {
                        "value": 25,
                        "partnerTransactionId": "512122a3-97b8-4477-bba7-1338dga1abbe"
                    }
                ],
                "customParameters": [
                    {
                        "key": "FiscalCode",
                        "value": "RSSMRAURTMLAR6NZ"
                    }
                ]
            },
            responseExample: [
                {
                    "serialNumber": "0533690820961905",
                    "couponCode": "0900149851237665",
                    "value": 25,
                    "isoCurrencySymbol": "EUR",
                    "content": "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/8RiYIECBAoM9GgZn////yGpxEgcH5i/////+Qy+giUZLjREFB//////5BrgEC4IEJ6Bg//////kMugIGIIGRNQQI0f////iJiDQCPCDH///yGWXggXNEEbv/////mAxgoM0DB/////5qZEiYhEESj//////wQIGYjAYBj//////4IEbuDNQl3//////+ODBApEoan////8cEMwR6B////4iIj/////////ABABACmVuZHN0cmVhbQplbmRvYmoKNyAwIG9iago8PC9MZW5ndGggMTIwOS9GaWx0ZXIvRmxhdGVEZWNvZGU+PnN0cmVhbQp4nJVWy3LiRhTd8xU3O00ViH7oySqespN4MjVjx0wWmfGigR7SAqkZPXAVn5BPmIU/z+VlPiG3WwKMkBKnKBcX677OuS99G7ydDgiEQQDTBQqjRrqaDm4H3+wfg3f44GcjQ0RcCgQ/PABO3IhBSH2YpzBW6ZLApYZb47DWoS9UpumgsUXno6OIcV7o09glMQRxZPTHP1FA4evAuRRllY5/z1UiUzmxWqHLCOMujIHSCQ/eTJOWKwwdQBC1PE3zpd6K+QQuZjq7E2tZ3Ii8zGR+7oAFrh9CELY83OR6IZJMQ5rIotQTmOLXez0XpdJZ4+XbgLgcHgaf0dc9ENeHRfMfSt2AQxB4kA4oNywYeT24az3n+OSoYX4ZnRNuj65sfgwoMwl+HsVRyNzwfvquBcjzMETg0z0eSi2g612mC7gYISHinAUamgxYWBtxYDaIw/whIXD16bfXIqb8iAflM8SUvURsf/UhRvNXIkZnCNeP/RZkGox2mUhlthJFqWClFx3lJy6LwA/jPXLqWVsSI3DqYYv6lHFjt7fwfQTkBzaYg2Pk77kBRFXr4DclBoTHvf3U0LOpOapMLSPN0Bykl3wbquk9Gp3y7bEjm0bu4dI8eiWXjQEltYEHsaXj06YqJewEkpir76XMEjnp6KLYjTzgseceSrE3V98VOjivCOz7seUjshk7mYCizEWm5goe5AxKM9gqk6DWCnS2RrHDOAjrBJxNXj2KUq4TAVWxrpbi0MdnkDuypm6jftsB0vdOlW90uc0XBmS1WeMi+5dIbVN2jPNfBeceORTcyD0FN4/+V8E5i08LfoPrDznXpj5VV6lrMxqdQrmTuL2LlYJZrhNb28lJfWorYoM5xOc8iEnESBzQmPh9UVjcijLNRSKwBSGTqth3pF72xWNRHQ9nvT4ontsbKuSnPFwiD6Xpt+yrzlOkpLvxa+OAneb5cfOE7bBNJHbFJtfPqhQJiq2Gr219G9h5eHhwBeJw56L4c6w3czWyDlRvUK8V1K54UDs8XxIuVG4cwcLV+BnCH2KZy9mwIz6v4/+1lSLH2wl0CB+v304gjiPOQ8opoV1mzPayc331gdKO89xokeiU1Q9io3EL9FNJ47BFZbmqNrbAkOpHCQWWZLfNcasoHDhV6vQ8OVq/FpglIkepUOuJLeOPB36HUO06zOpj4GxM6VeymYEhYALzCsyAdxqRZuPIhX42+xFmIlvprenLXDxXmERX3WlQL7qVThQ8neLa6G0uSvjidAb0WQNulYlFZXazthxlYisXMqug6jDy6ipjY6q07kyVii9veueB8s7uQnRyLVdlrjP1jNOembct23MZ1Fe25YbVce0ub3clGOwdNtQ7MFqUYmuWuNmsmcIqoqMKG6jsBEnq5V+kCnc+ErMyXWOCpMLwW+Xy7yqR54ZxYO26kAF6esSDJfS5WWRb1ZnJ3VKX5jrhSoLCZr3VJuUn3FUdpa9fOZ1czwSosTlo9Y3qLcZ+veyn6FedlWJV9g7R8R2w1r/qHII+6/0JOSxdiaaEjj0/HHGfh+1Xwp6LxYLDwUKx516x4NXnKnZpDLR1qX/ZirWZL6hWYicynZrZSWSOc1j90CT6D6muMeIKZW5kc3RyZWFtCmVuZG9iago5IDAgb2JqCjw8L1R5cGUvUGFnZS9NZWRpYUJveFswIDAgMTQxLjczIDc2Nl0vUmVzb3VyY2VzPDwvRm9udDw8L0YxIDIgMCBSL0YyIDMgMCBSL0YzIDQgMCBSL0Y0IDYgMCBSPj4vWE9iamVjdDw8L2ltZzAgMSAwIFIvaW1nMSA1IDAgUj4+Pj4vQ29udGVudHMgNyAwIFIvUGFyZW50IDggMCBSPj4KZW5kb2JqCjEwIDAgb2JqCjw8L1R5cGUvRm9udERlc2NyaXB0b3IvQXNjZW50IDcyOC9DYXBIZWlnaHQgNjk5L0Rlc2NlbnQgLTIxMC9Gb250QkJveFstMTgyIC0zMDYgOTk5IDEwODVdL0ZvbnROYW1lL0FyaWFsTmFycm93L0l0YWxpY0FuZ2xlIDAvU3RlbVYgODAvRmxhZ3MgMzI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UcnVlVHlwZS9CYXNlRm9udC9BcmlhbE5hcnJvdy9FbmNvZGluZzw8L1R5cGUvRW5jb2RpbmcvRGlmZmVyZW5jZXNbMzIvc3BhY2UvZXhjbGFtIDQwL3BhcmVubGVmdC9wYXJlbnJpZ2h0IDQ0L2NvbW1hL2h5cGhlbi9wZXJpb2Qvc2xhc2gvemVyby9vbmUvdHdvL3RocmVlL2ZvdXIvZml2ZS9zaXgvc2V2ZW4vZWlnaHQvbmluZS9jb2xvbiA2NC9hdC9BL0IgNjgvRC9FIDcyL0gvSSA3Ni9MIDc4L04vTy9QIDgzL1MvVC9VL1YgOTAvWiA5Ny9hL2IvYy9kL2UvZi9nL2gvaS9qL2svbC9tL24vby9wIDExNC9yL3MvdC91L3YvdyAxMjIveiAxMzgvU2Nhcm9uIDE1NC9zY2Fyb24gMTU4L3pjYXJvbiAyMzAvY2FjdXRlIDIzMi9jY2Fyb24gMjQwL2Rjcm9hdF0+Pi9GaXJzdENoYXIgMzIvTGFzdENoYXIgMjQwL1dpZHRoc1syMjggMjI4IDAgMCAwIDAgMCAwIDI3MiAyNzIgMCAwIDIyOCAyNzIgMjI4IDIyOCA0NTYgNDU2IDQ1NiA0NTYgNDU2IDQ1NiA0NTYgNDU2IDQ1NiA0NTYgMjI4IDAgMCAwIDAgMCA4MzIgNTQ2IDU0NiAwIDU5MSA1NDYgMCAwIDU5MSAyMjggMCAwIDQ1NiAwIDU5MSA2MzggNTQ2IDAgMCA1NDYgNTAwIDU5MSA1NDYgMCAwIDAgNTAwIDAgMCAwIDAgMCAwIDQ1NiA0NTYgNDEwIDQ1NiA0NTYgMjI4IDQ1NiA0NTYgMTgyIDE4MiA0MTAgMTgyIDY4MyA0NTYgNDU2IDQ1NiAwIDI3MiA0MTAgMjI4IDQ1NiA0MTAgNTkxIDAgMCA0MTAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgNTQ2IDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDQxMCAwIDAgMCA0MTAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDQxMCAwIDQxMCAwIDAgMCAwIDAgMCAwIDQ1M10vRm9udERlc2NyaXB0b3IgMTAgMCBSPj4KZW5kb2JqCjMgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhL0VuY29kaW5nL1dpbkFuc2lFbmNvZGluZz4+CmVuZG9iagoxMSAwIG9iago8PC9UeXBlL0ZvbnREZXNjcmlwdG9yL0FzY2VudCA3MjgvQ2FwSGVpZ2h0IDcxNS9EZXNjZW50IC0yMTAvRm9udEJCb3hbLTYyNyAtMzc2IDIwMDAgMTA1NV0vRm9udE5hbWUvQXJpYWwtQm9sZE1UL0l0YWxpY0FuZ2xlIDAvU3RlbVYgODAvRmxhZ3MgMjYyMTc2Pj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHJ1ZVR5cGUvQmFzZUZvbnQvQXJpYWwtQm9sZE1UL0VuY29kaW5nPDwvVHlwZS9FbmNvZGluZy9EaWZmZXJlbmNlc1szMi9zcGFjZSA0NC9jb21tYSA0OC96ZXJvL29uZS90d28vdGhyZWUvZm91ci9maXZlL3NpeC9zZXZlbi9laWdodC9uaW5lIDY5L0UgODIvUiA4NS9VXT4+L0ZpcnN0Q2hhciAzMi9MYXN0Q2hhciA4NS9XaWR0aHNbMjc3IDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAyNzcgMCAwIDAgNTU2IDU1NiA1NTYgNTU2IDU1NiA1NTYgNTU2IDU1NiA1NTYgNTU2IDAgMCAwIDAgMCAwIDAgMCAwIDAgMCA2NjYgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgNzIyIDAgMCA3MjJdL0ZvbnREZXNjcmlwdG9yIDExIDAgUj4+CmVuZG9iagoxMiAwIG9iago8PC9UeXBlL0ZvbnREZXNjcmlwdG9yL0FzY2VudCA3MjgvQ2FwSGVpZ2h0IDY5OS9EZXNjZW50IC0yMTAvRm9udEJCb3hbLTEzNyAtMzA2IDk5OSAxMTA4XS9Gb250TmFtZS9BcmlhbE5hcnJvdy1Cb2xkL0l0YWxpY0FuZ2xlIDAvU3RlbVYgODAvRmxhZ3MgMjYyMTc2Pj4KZW5kb2JqCjYgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHJ1ZVR5cGUvQmFzZUZvbnQvQXJpYWxOYXJyb3ctQm9sZC9FbmNvZGluZzw8L1R5cGUvRW5jb2RpbmcvRGlmZmVyZW5jZXNbMzIvc3BhY2UgNTgvY29sb24gNjgvRCA3NS9LIDc4L04gODAvUCA4NS9VIDk3L2EvYi9jL2QvZS9mIDEwNS9pL2ovayAxMDkvbS9uL28vcCAxMTQvciAxMTYvdC91IDEyMi96IDE1NC9zY2Fyb25dPj4vRmlyc3RDaGFyIDMyL0xhc3RDaGFyIDE1NC9XaWR0aHNbMjI4IDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMjcyIDAgMCAwIDAgMCAwIDAgMCAwIDU5MSAwIDAgMCAwIDAgMCA1OTEgMCAwIDU5MSAwIDU0NiAwIDAgMCAwIDU5MSAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgNDU2IDUwMCA0NTYgNTAwIDQ1NiAyNzIgMCAwIDIyOCAyMjggNDU2IDAgNzI5IDUwMCA1MDAgNTAwIDAgMzE4IDAgMjcyIDUwMCAwIDAgMCAwIDQxMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDQ1Nl0vRm9udERlc2NyaXB0b3IgMTIgMCBSPj4KZW5kb2JqCjggMCBvYmoKPDwvVHlwZS9QYWdlcy9Db3VudCAxL0tpZHNbOSAwIFJdPj4KZW5kb2JqCjEzIDAgb2JqCjw8L1R5cGUvQ2F0YWxvZy9QYWdlcyA4IDAgUj4+CmVuZG9iagoxNCAwIG9iago8PC9Qcm9kdWNlcihpVGV4dFNoYXJwkiA1LjUuMTMuMSCpMjAwMC0yMDE5IGlUZXh0IEdyb3VwIE5WIFwoQUdQTC12ZXJzaW9uXCkpL0NyZWF0aW9uRGF0ZShEOjIwMjMwNzE5MTEzNjU2KzAyJzAwJykvTW9kRGF0ZShEOjIwMjMwNzE5MTEzNjU2KzAyJzAwJyk+PgplbmRvYmoKeHJlZgowIDE1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDA5OTA2IDAwMDAwIG4gCjAwMDAwMTA5MTggMDAwMDAgbiAKMDAwMDAxMTE3MyAwMDAwMCBuIAowMDAwMDA3NzYyIDAwMDAwIG4gCjAwMDAwMTE3MzEgMDAwMDAgbiAKMDAwMDAwODI5MiAwMDAwMCBuIAowMDAwMDEyMzA3IDAwMDAwIG4gCjAwMDAwMDk1NjkgMDAwMDAgbiAKMDAwMDAwOTc0NSAwMDAwMCBuIAowMDAwMDExMDA2IDAwMDAwIG4gCjAwMDAwMTE1NjEgMDAwMDAgbiAKMDAwMDAxMjM1OCAwMDAwMCBuIAowMDAwMDEyNDA0IDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSAxNS9Sb290IDEzIDAgUi9JbmZvIDE0IDAgUi9JRCBbPDYwNzYzNGIyZjFiMDNhNjE5ZmMxMWMyZWFiNGMwMzJhPjw2MDc2MzRiMmYxYjAzYTYxOWZjMTFjMmVhYjRjMDMyYT5dPj4KJWlUZXh0LTUuNS4xMy4xCnN0YXJ0eHJlZgoxMjU3MAolJUVPRgo=",
                    "partnerTransactionId": "60015e86-3bff-4faa-a472-5abc7114437d"
                }
            ],
            errorResponseExample: {
                code: 9,
                message: "Invalid fiscal code",
                additionalData: null
            }
        },
        couponCancellation: {
            requestExample: {
                partnerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                serialNumber: "9889251688979846",
                partnerTransactionId: "76b266ae-4d61-414b-baa9-44f9da1182e1",
                pointOfSaleId: "test",
                signature: "XwTgMtFG/K..."
            },
            errorResponseExample: {
                code: 7,
                message: "Coupon has been already cancelled",
                additionalData: null
            }
        }
    };
}]);