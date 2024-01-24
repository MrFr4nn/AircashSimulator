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
        getCashierDenominations: getCashierDenominations,
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
    function getCashierDenominations(partnerId) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "Denominations/GetCashierDenominations",
            data: {
                PartnerId: partnerId
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
        customParameters: [{ key: "PersonalIdentificationCode", value: "RSSMRAURTMLARSNL" }]
    };

    $scope.cancelCouponModel = {
        cancelSerialNumber: '',
        cancelPointOfSaleId: 'TestLocation',
        cancelPartnerId: $scope.partnerIds.AbonGeneratePartnerId,
        cancelPartnerTransactionId: ''
    };

    $scope.abon = {};
    $scope.abon.partners = [
        { country: "Custom", partnerId: $scope.partnerIds.AbonGeneratePartnerId, isoCurrencySymbol: "EUR"},
        { country: "HR", partnerId: "261d648d-6bd8-4f5c-baf6-d3fcd336f985", isoCurrencySymbol: "EUR" },
        { country: "CZ", partnerId: "15246f56-53a8-446c-855a-39b427ba1e3d", isoCurrencySymbol: "CZK" },
        /*{ country: "GB", partnerId: "12d6dd08-ae11-4dc3-80bd-14b2ac71bbc9", isoCurrencySymbol: "GBP" },*/
        { country: "FR", partnerId: "9ed97bd7-dbc8-4839-ae9b-5c13cf5afb0f", isoCurrencySymbol: "EUR" },
        { country: "DE", partnerId: "c3678f7c-dda3-4044-90c6-71f9dbdbbd7b", isoCurrencySymbol: "EUR" },
        { country: "GR", partnerId: "5daed4c7-0667-451d-b870-3fddd4217935", isoCurrencySymbol: "EUR" },
        { country: "IT", partnerId: "842fe19a-426b-4507-95e4-933a6a367164", isoCurrencySymbol: "EUR" },
        { country: "PL", partnerId: "1eda4d60-4113-40bf-a20e-031bc290fc36", isoCurrencySymbol: "PLN" },
        { country: "RO", partnerId: "9be565cb-762a-403b-bb77-420ffdf46c61", isoCurrencySymbol: "RON" },
        { country: "SK", partnerId: "78d6d87b-ff1d-41a7-af2b-f46a5df0e0d3", isoCurrencySymbol: "EUR" },
        { country: "SI", partnerId: "a0686939-f4e9-4fe7-8e1e-7896b67f08a6", isoCurrencySymbol: "EUR" },
        { country: "ES", partnerId: "e982453d-9280-4a3a-8244-fb44027a9007", isoCurrencySymbol: "EUR" },
    ];
    $scope.loadDenominations = function () {
        $scope.abon.partners.forEach(x => {
            if (x.partnerId != $scope.partnerIds.AbonGeneratePartnerId) {
                abonSpService.getCashierDenominations(x.partnerId)
                    .then(function (response) {
                        if (response) {
                            $scope.abon.partners[$scope.abon.partners.indexOf(x)].denominations = response.join(', ');
                        }
                    }, () => {
                        console.log("error");

                    });
            }
        });
    };
    $scope.loadDenominations();
    $scope.abon.partners[0].denominations = false;
    $scope.abon.selectedAbonPartner = $scope.abon.partners[0];

    $scope.createCouponChangePartnerId = function (showMesssage) {
        $scope.createCouponModel.partnerId = $scope.abon.selectedAbonPartner.partnerId;
        $scope.createCouponModel.isoCurrencySymbol = $scope.abon.selectedAbonPartner.isoCurrencySymbol;
        if (showMesssage)$rootScope.showGritter("", "PartnerId and IsoCurrencySymbol changed");
    }
    $scope.createCouponChangePartnerId(false);

    $scope.createCouponInputPartnerIdChanged = function () {
        var searchAbonPartners = $scope.abon.partners.find(x => x.partnerId == $scope.createCouponModel.partnerId);
        if (searchAbonPartners == undefined) $scope.abon.selectedAbonPartner = $scope.abon.partners[0];
        else $scope.abon.selectedAbonPartner = $scope.abon.partners[$scope.abon.partners.indexOf(searchAbonPartners)];
    }

    $scope.abon.selectedAbonPartnerCreateMultipleV1 = $scope.abon.partners[0];
    $scope.createMultipleCouponChangePartnerIdV1 = function (showMesssage) {
        $scope.createMultipleCouponsModel.partnerId = $scope.abon.selectedAbonPartnerCreateMultipleV1.partnerId;
        $scope.createMultipleCouponsModel.isoCurrencySymbol = $scope.abon.selectedAbonPartnerCreateMultipleV1.isoCurrencySymbol;
        if (showMesssage) $rootScope.showGritter("", "PartnerId and IsoCurrencySymbol changed");
    }
    $scope.createMultipleCouponChangePartnerIdV1(false);
    $scope.createMultipleCouponInputPartnerIdChangedV1 = function () {
        var searchAbonPartners = $scope.abon.partners.find(x => x.partnerId == $scope.createMultipleCouponsModel.partnerId);
        if (searchAbonPartners == undefined) $scope.abon.selectedAbonPartnerCreateMultipleV1 = $scope.abon.partners[0];
        else $scope.abon.selectedAbonPartnerCreateMultipleV1 = $scope.abon.partners[$scope.abon.partners.indexOf(searchAbonPartners)];
    }

    $scope.abon.selectedAbonPartnerCreateMultipleV2 = $scope.abon.partners[0];
    $scope.createMultipleCouponChangePartnerIdV2 = function (showMesssage) {
        $scope.createMultipleCouponsV2Model.partnerId = $scope.abon.selectedAbonPartnerCreateMultipleV2.partnerId;
        $scope.createMultipleCouponsV2Model.isoCurrencySymbol = $scope.abon.selectedAbonPartnerCreateMultipleV2.isoCurrencySymbol;
        if (showMesssage) $rootScope.showGritter("", "PartnerId and IsoCurrencySymbol changed");
    }
    $scope.createCouponChangePartnerId(false);
    $scope.createMultipleCouponInputPartnerIdChangedV2 = function () {
        var searchAbonPartners = $scope.abon.partners.find(x => x.partnerId == $scope.createMultipleCouponsV2Model.partnerId);
        if (searchAbonPartners == undefined) $scope.abon.selectedAbonPartnerCreateMultipleV2 = $scope.abon.partners[0];
        else $scope.abon.selectedAbonPartnerCreateMultipleV2 = $scope.abon.partners[$scope.abon.partners.indexOf(searchAbonPartners)];
    }

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
                    "partnerId": "52f46879-294d-4904-be7e-368ab0161771",
                    "value": 25,
                    "pointOfSaleId": "test",
                    "isoCurrencySymbol": "EUR",
                    "partnerTransactionId": "80684973-6f8d-4b37-b7a0-3bc164b6e68f",
                    "contentType": null,
                    "contentWidth": null,
                    "signature": "P1qrIXBNu8..."
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
                "partnerId": "52f46879-294d-4904-be7e-368ab0161771",
                "pointOfSaleId": "TestLocation",
                "isoCurrencySymbol": "EUR",
                "contentType": null,
                "contentWidth": null,
                "denominations": [
                    {
                        "value": 50,
                        "partnerTransactionId": "f0f7d988-5349-45f4-ac3d-3e97e7be48ab"
                    },
                    {
                        "value": 50,
                        "partnerTransactionId": "a55a0eea-63f5-45ff-b59c-06fad1c5d517"
                    }
                ],
                "signature": "RHmGUOihbr..."
            },
            responseExample: [
                {
                    "serialNumber": "9089484019368710",
                    "couponCode": "8027490436031769",
                    "value": 50,
                    "isoCurrencySymbol": "EUR",
                    "content": "PD94bWwgdmVyc2lvbj0iMS4wIj8+DQo8Y291cG9uPg0KCTxsb2dvPlUwcGliV2xZY25GNWNVaDFRemhRYzFSRlVIaHFaV1l4ZW5WbUsyNHJTVXBXWTBOcFRWUlNUV0Z2TlUxdlVFcHdZVlZ3TVRCUGNHcHBiekZhZERVcmMwNDRaMDVtT0dWdGMwcHRUVVp3YmtZMlpsTmhNak5oTDNKa1ozVmxWVFF2VkhOaU5IRnFSVFpGZGtoVFFpdFhWVzlYWW1wemJrSkRkVkJJVkVGcFMyOXhUVVJaWlVWblJrdFJiVWRWUjJ3MVoyWnJNRk5HYm0wcldXMVVkRE51VVZkVmNIaHBjbkZ4VTNOeVlYRnlWV3h0WjBFM2JYbG9hazgwYTNKeE5uWndLM2R2WTFkNFN6aDRNWFJTVEUxM1kydEpkSE5PT1hnNGJrcDRjVUZDTURsUGNqTk1NMWhFVEV0VmRHbFBkRFJrUjFrMk5FTkhOM1Z5V0RjNVdGQmlkVXh2T1dRdllUZE5NM0kwVGxoYVUyWklZamhQTTNoV1VUTTNlamxMWldweGJIbEdhamxDVVcxa1RFTjFXSEk1TlVSNVZYVm9TMlpRTkZFeGNTOHJWVEJRZGtzMFJXVlNSR2RSWjNKVGJsQkhVa2RTU1dobmRFcHVjWGN4T0VJMmMyMWpWVEl5WlhwcmEybEtUV2xCV2xKQmRrNWFlbGRKWjJ4VGVXUTJZM2x3UlhOdEsyOVZVMFp3YUU5S2FtbHNWWEF3Um1wdGFuZHhkR0ZxVTNCV2RpOVdWRlZ4VEhWS1RIQkdSMEprY0hsTFRWZDJXbVJIUTBScmF6RnhSa00wUVhKSVQzaGhjVEZNQ2prck5WbDJSeTlZV25aVGNrNXRNV2QzV1dwcE5IRjNTeXRQTldkMWJraHNOVzR4YzA5UGVscDRSbEZ1Vnk4d1RDdExibWwyV0ZWcWRUQlhjM1EzU214dWNHZDZZamd6VFhWWVNrcHdiVEEzTjNWVGJ6SldPWE4zY1dOd01EaGlUSFJUZEc4eFlVbFlhelUwZEhVM1ltOTJZVWgwUm10bU4zVnNSRkF6WW1NelJ5dGxaRzB5T1hsS1YwdzFVMUkyT1hGcVdISTJWVzF4TUM5NFdrMTZkbm8yTWt0SVpVUXJieXRNVmpKMGJHVkdia281YjA5MVJEUjZlWE42UWxRNGJuUTVNVVkyVFdkS1dXOVpVWHBvYUNzNFdsZ3pSVlp5T1N0aVkwMW5Ua2hPYUdnMWJqZzBNMWRZUnpoT1dGRlpZbWM0WlZWa2NIUjJOaXR0TWtoNlZWWkxibWRYWXpjdk5YQm9WbmhGZG1KR016SnZhV0ZyVGs5VFowaGxTbmxEVEdwelVuaG9OSGRrTUVacGFtcFVVR2syU1ZkUGExQkRXV2haT0M5QmFXMUdhMFJ6VXpaaFMxSlRlVU5hY0VwTUwwMWtiV2RyTURsRFYyRkRWV3d4UkZwdWNGVktXVzl0YVd4b09YbHBXblZZVGpSS1NtOXdhRzF1YW14Q1FWRkJOdz09PC9sb2dvPg0KICAgIDxkYXRlVGltZT4yNC4wMS4yMDI0LiAvIDEyOjAwPC9kYXRlVGltZT4NCiAgICA8c2VsbGVyPkFib25TYWxlc1BhcnRuZXI8L3NlbGxlcj4NCiAgICA8cG9pbnRPZlNhbGU+VGVzdExvY2F0aW9uIDwvcG9pbnRPZlNhbGU+DQogICAgPHZhbHVlT2ZBYm9uPjUwLDAwPC92YWx1ZU9mQWJvbj4NCiAgICA8c2l4dGVlbkRpZ2l0Q29kZT44MDI3IDQ5MDQgMzYwMyAxNzY5PC9zaXh0ZWVuRGlnaXRDb2RlPg0KICAgIDxxUkNvZGU+aVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU1zQUFBRExDQVlBQUFEQSsyY3pBQUFBQVhOU1IwSUFyczRjNlFBQUFBUm5RVTFCQUFDeGp3djhZUVVBQUFBSmNFaFpjd0FBRHNNQUFBN0RBY2R2cUdRQUFBMWRTVVJCVkhoZTdkTkJiaTA1REVQUjdIL1R2MGVjWFJDQ0ZETjJ0UTV3WjRSZDlaTDYrYmZXS3RtUFphMmkvVmpXS3RxUFphMmkvVmpXS3RxUFphMmkvVmpXS3RxUFphMmkvVmpXS3RxUFphMmkvVmpXS3RxUFphMmkvVmpXS3RxUFphMmkvVmpXS3RxUFphMmkvVmpXS3RxUFphMmkvVmpXS3RxUFphMmkvVmpXS3RxUFphMmkvVmpXS3RxUFphMmkvVmpXS3RxUFphMmkvVmpXS3RxUFphMmkrTWZ5OC9QemZGMTBsa3FqWjNpdHRQMVlHblhSV1NxTm51RzEwdlpqYWRSRlo2azBlb2JYU3R1UHBWRVhuYVhTNkJsZUsyMC9sa1pkZEpaS28yZDRyYlQ5V0JwMTBWa3FqWjdodGRMMlkyblVSV2VwTkhxRzEwcTc2bU81Q1QyZmNtaGZLWTJlUWQyRW5rK2x4VytrbDFZM29lZFREdTBycGRFenFKdlE4Nm0wK0kzMDB1b205SHpLb1gybE5Ib0dkUk42UHBVV3Y1RmVXdDJFbms4NXRLK1VScytnYmtMUHA5TGlOOUpMcTV2UTh5bUg5cFhTNkJuVVRlajVWRnI4Um5wcGRSTjZQdVhRdmxJYVBZTzZDVDJmU292ZlNDK3Ria0xQcHh6YVYwcWpaMUEzb2VkVGFmRWI2YVdWUS90cER1MlZRL3RLRHUwck9iUlhEdTJuT2JSWGFmRWI2YVdWUS90cER1MlZRL3RLRHUwck9iUlhEdTJuT2JSWGFmRWI2YVdWUS90cER1MlZRL3RLRHUwck9iUlhEdTJuT2JSWGFmRWI2YVdWUS90cER1MlZRL3RLRHUwck9iUlhEdTJuT2JSWGFmRWI2YVdWUS90cER1MlZRL3RLRHUwck9iUlhEdTJuT2JSWGFmRWI2YVdWUS90cER1MlZRL3RLRHUwck9iUlhEdTJuT2JSWGFmRWI2YVdWUS90cER1MlZRL3RLRHUwck9iUlhEdTJuT2JSWGFmRWI2YVdWUS90cER1MlZRM3ZsMEg2YVEzdmwwSDZhUTN1VkZyK1JYbG81dEovbTBGNDV0RmNPN2FjNXRGY083YWM1dEZkcDhSdnBwWlZEKzJrTzdaVkRlK1hRZnBwRGUrWFFmcHBEZTVVV3Y1RmVXam0wbitiUVhqbTBWdzd0cHptMFZ3N3Rwem0wVjJueEcrbWxsVVA3YVE3dGxVTjc1ZEIrbWtONzVkQitta043bFJhL2tWNWFPYlNmNXRCZU9iUlhEdTJuT2JSWER1Mm5PYlJYYWZFYjZhV1ZRL3RwRHUyVlEzdmwwSDZhUTN2bDBINmFRM3VWRnIrUlhsbzV0Si9tMEY0NXRLL2swRjUxMFZuS29mMDBoL1lxTFg0anZiUnlhRC9Ob2IxeWFGL0pvYjNxb3JPVVEvdHBEdTFWV3Z4R2VtbmwwSDZhUTN2bDBMNlNRM3ZWUldjcGgvYlRITnFydFBpTjlOTEtvZjAwaC9iS29YMGxoL2FxaTg1U0R1Mm5PYlJYYWZFYjZhV1ZRL3RwRHUyVlEvdEtEdTFWRjUybEhOcFBjMml2MHVJMzBrc3JoL2JUSE5vcmgvYVZITnFyTGpwTE9iU2Y1dEJlcGNWdnBKZFdEdTJuT2JSWER1MHJPYlJYWFhTV2NtZy96YUc5U292ZlNDK3Ria0xQcHh6YXE1dlE4Nm1iMFBPcHRQaU45TkxxSnZSOHlxRzl1Z2s5bjdvSlBaOUtpOTlJTDYxdVFzK25ITnFybTlEenFadlE4Nm0wK0kzMDB1b205SHpLb2IyNkNUMmZ1Z2s5bjBxTDMwZ3ZyVzVDejZjYzJxdWIwUE9wbTlEenFiVDRqZlRTNmliMGZNcWh2Ym9KUForNkNUMmZTb3ZmU0MrdGJrTFBweHphcTV2UTg2bWIwUE9wdFBpTjlOS3Y1ZEJlT2JSWER1MlZRL3ZYU292ZlNDLzlXZzd0bFVONzVkQmVPYlIvcmJUNGpmVFNyK1hRWGptMFZ3N3RsVVA3MTBxTDMwZ3YvVm9PN1pWRGUrWFFYam0wZjYyMCtJMzAwcS9sMEY0NXRGY083WlZEKzlkS2k5OUlMLzFhRHUyVlEzdmwwRjQ1dEgrdHRQaU45Tkt2NWRCZU9iUlhEdTJWUS92WFNzdmYrRDlHZjNEbDBGNnRuUDIxZytpZlhUbTBWeXRuZiswZyttZFhEdTNWeXRsZk80aisyWlZEZTdWeTl0Y09vbjkyNWRCZXJaejl0WVBvbjEwNXRGY3JaMy90SVBwblZ3N3QxY3A1NXRlbWZ4VFZSV2Vkckl2T1VnN3RsVVA3ditvbWR6Mk5RVCtrNnFLelR0WkZaeW1IOXNxaC9WOTFrN3VleHFBZlVuWFJXU2Zyb3JPVVEzdmwwUDZ2dXNsZFQyUFFENm02Nkt5VGRkRlp5cUc5Y21qL1Y5M2tycWN4NklkVVhYVFd5YnJvTE9YUVhqbTAvNnR1Y3RmVEdQUkRxaTQ2NjJSZGRKWnlhSzhjMnY5Vk43bnJhUXo2SVZVWG5YV3lManBMT2JSWER1My9xcHRjOVRUMFkwMDdnZTZaMWtWblZVcWpaMUFPN1ZWYS9rYURmcEJwSjlBOTA3cm9yRXBwOUF6S29iMUt5OTlvMEE4eTdRUzZaMW9YblZVcGpaNUJPYlJYYWZrYkRmcEJwcDFBOTB6cm9yTXFwZEV6S0lmMktpMS9vMEUveUxRVDZKNXBYWFJXcFRSNkJ1WFFYcVhsYnpUb0I1bDJBdDB6cll2T3FwUkd6NkFjMnF1MC9JMEcvU0RUVHFCN3BuWFJXWlhTNkJtVVEzdVZsci9Sb0I5RWRkRlowN3JvckVvTzdWVVhuVldwaTg2cWxKYS8wYUFmUkhYUldkTzY2S3hLRHUxVkY1MVZxWXZPcXBTV3Y5R2dIMFIxMFZuVHV1aXNTZzd0VlJlZFZhbUx6cXFVbHIvUm9COUVkZEZaMDdyb3JFb083VlVYblZXcGk4NnFsSmEvMGFBZlJIWFJXZE82Nkt4S0R1MVZGNTFWcVl2T3FwU1d2OUdnSDBSMTBWblR1dWlzU2c3dFZSZWRWYW1MenFxVWxyL1JvQjlFZGRGWjA3cm9yRW9PN1ZVWG5WV3BpODZxbEJhL2tWNTZXaGVkcFJ6YVYzSm9QNjJMemxKZGRKWnlhSy9TNGpmU1MwL3Jvck9VUS90S0R1Mm5kZEZacW92T1VnN3RWVnI4Um5ycGFWMTBsbkpvWDhtaC9iUXVPa3QxMFZuS29iMUtpOTlJTHoydGk4NVNEdTByT2JTZjFrVm5xUzQ2U3ptMFYybnhHK21scDNYUldjcWhmU1dIOXRPNjZDelZSV2NwaC9ZcUxYNGp2ZlMwTGpwTE9iU3Y1TkIrV2hlZHBicm9MT1hRWHFYRmI2U1hudFpGWnltSDlwVWMyay9yb3JOVUY1MmxITnFydFBpTjlOS1Z1dWlza3ptMFZ3N3RLem0wcjNRQzNWTXBMWDRqdlhTbExqcnJaQTd0bFVQN1NnN3RLNTFBOTFSS2k5OUlMMTJwaTg0Nm1VTjc1ZEMra2tQN1NpZlFQWlhTNGpmU1MxZnFvck5PNXRCZU9iU3Y1TkMrMGdsMFQ2VzArSTMwMHBXNjZLeVRPYlJYRHUwck9iU3ZkQUxkVXlrdGZpTzlkS1V1T3V0a0R1MlZRL3RLRHUwcm5VRDNWRXFMMzBndlhhbUx6anFaUTN2bDBMNlNRL3RLSjlBOWxkTHlOMzRjL1ZFcnBkRXpxQzQ2U3ptMHI1UzJIOHN2b3o5cXBUUjZCdFZGWnltSDlwWFM5bVA1WmZSSHJaUkd6NkM2NkN6bDBMNVMybjRzdjR6K3FKWFM2QmxVRjUybEhOcFhTdHVQNVpmUkg3VlNHajJENnFLemxFUDdTbW43c2Z3eStxTldTcU5uVUYxMGxuSm9YeWx0UDVaZlJuL1VTbW4wREtxTHpsSU83U3VseFcra2wzNHRoL1luYzJqL3BkTDJZMm5rMFA1a0R1Mi9WTnArTEkwYzJwL01vZjJYU3R1UHBaRkQrNU01dFA5U2FmdXhOSEpvZnpLSDlsOHFiVCtXUmc3dFQrYlEva3VsN2NmU3lLSDl5UnphZjZtMHF6NldtOUR6S1lmMjZnUzZwNUpEKzBwZkYzOUQrcEhWVGVqNWxFTjdkUUxkVThtaGZhV3ZpNzhoL2NqcUp2Ujh5cUc5T29IdXFlVFF2dExYeGQrUWZtUjFFM28rNWRCZW5VRDNWSEpvWCtucjRtOUlQN0s2Q1QyZmNtaXZUcUI3S2ptMHIvUjE4VGVrSDFuZGhKNVBPYlJYSjlBOWxSemFWL3E2K0J2U2o2eHVRcytuSE5xckUraWVTZzd0SzMxZC9BM3BSMVlPN2FjNXRGY24wRDJxaTg1U0R1MlZRM3ZWUldlcHRQaU45TkxLb2YwMGgvYnFCTHBIZGRGWnlxRzljbWl2dXVnc2xSYS9rVjVhT2JTZjV0QmVuVUQzcUM0NlN6bTBWdzd0VlJlZHBkTGlOOUpMSzRmMjB4emFxeFBvSHRWRlp5bUg5c3FodmVxaXMxUmEvRVo2YWVYUWZwcERlM1VDM2FPNjZDemwwRjQ1dEZkZGRKWktpOTlJTDYwYzJrOXphSzlPb0h0VUY1MmxITm9yaC9hcWk4NVNhZkViNmFXVlEvdHBEdTNWQ1hTUDZxS3psRU43NWRCZWRkRlpLaTErSTcyMGNtZy96YUc5T29IdU9Wa2FQWU42UmZ4SjZjZFNEdTJuT2JSWEo5QTlKMHVqWjFDdmlEOHAvVmpLb2YwMGgvYnFCTHJuWkduMERPb1Y4U2VsSDBzNXRKL20wRjZkUVBlY0xJMmVRYjBpL3FUMFl5bUg5dE1jMnFzVDZKNlRwZEV6cUZmRW41UitMT1hRZnBwRGUzVUMzWE95TkhvRzlZcjRrOUtQcFJ6YVQzTm9yMDZnZTA2V1JzK2dYaEYvVXZxeGxFUDdhUTd0bFVQN1NnN3RWUmVkcGRMb0dTcWx4VytrbDFZTzdhYzV0RmNPN1NzNXRGZGRkSlpLbzJlb2xCYS9rVjVhT2JTZjV0QmVPYlN2NU5CZWRkRlpLbzJlb1ZKYS9FWjZhZVhRZnBwRGUrWFF2cEpEZTlWRlo2azBlb1pLYWZFYjZhV1ZRL3RwRHUyVlEvdEtEdTFWRjUybDB1Z1pLcVhGYjZTWFZnN3Rwem0wVnc3dEt6bTBWMTEwbGtxalo2aVVGcitSWGxvNXRKL20wRjQ1dEsvazBGNTEwVmtxalo2aFVscjhSbnBwZFJONlB0VkZaMDFMbzJkUUR1MHIzU1QrTlBTRHFKdlE4Nmt1T210YUdqMkRjbWhmNlNieHA2RWZSTjJFbms5MTBWblQwdWdabEVQN1NqZUpQdzM5SU9vbTlIeXFpODZhbGtiUG9CemFWN3BKL0dub0IxRTNvZWRUWFhUV3REUjZCdVhRdnRKTjRrOURQNGk2Q1QyZjZxS3pwcVhSTXlpSDlwVnVFbjhhK2tIVVRlajVWQmVkTlMyTm5rRTV0Szkway9qVDBBL3lXaWZRUGRNYzJpdUg5c3FoL2JTMCtJMzAwcTkxQXQwenphRzljbWl2SE5wUFM0dmZTQy85V2lmUVBkTWMyaXVIOXNxaC9iUzArSTMwMHE5MUF0MHp6YUc5Y21pdkhOcFBTNHZmU0MvOVdpZlFQZE1jMml1SDlzcWgvYlMwK0kzMDBxOTFBdDB6emFHOWNtaXZITnBQUzR2ZlNDLzlXaWZRUGRNYzJpdUg5c3FoL2JTMC9JMXJQV28vbHJXSzltTlpxMmcvbHJXSzltTlpxMmcvbHJXSzltTlpxMmcvbHJXSzltTlpxMmcvbHJXSzltTlpxMmcvbHJXSzltTlpxMmcvbHJXSzltTlpxMmcvbHJXSzltTlpxMmcvbHJXSzltTlpxMmcvbHJXSzltTlpxMmcvbHJXSzltTlpxMmcvbHJXSzltTlpxMmcvbHJXSzltTlpxMmcvbHJWSy92MzdEMHJHOEFMY01GS0NBQUFBQUVsRlRrU3VRbUNDPC9xUkNvZGU+DQoJPGluc3RydWN0aW9uc0ZvclVzZXJzPlZuZXNpdGUgMTYtbWVzdG5vIGtvZG8ga3Vwb25hIG5hIHNwbGV0bmkgc3RyYW5pIHRyZ292aW5lIGFsaSBzdHJhbmkgcG9udWRuaWthIHNwbGV0bmloIHN0b3JpdGV2LjwvaW5zdHJ1Y3Rpb25zRm9yVXNlcnM+DQogICAgPHNlcmlhbE51bWJlcj45MDg5NDg0MDE5MzY4NzEwPC9zZXJpYWxOdW1iZXI+DQogICAgPGFkZGl0aW9uYWxJbmZvcm1hdGlvbj5BYm9uIGl6ZGEgQWlyY2FzaCwgaW5zdGl0dWNpamEgemEgaXpkYWpvIGVsZWt0cm9uc2tlZ2EgZGVuYXJqYSwgcmVnaXN0cmlyYW5hIHYgcmVnaXN0cnUgRXZyb3Bza2VnYSBiYW7EjW5lZ2EgemRydcW+ZW5qYSAoRUJBKSBwb2QgxaF0ZXZpbGtvIElFTjExNi4NCiAgICAgUHJlYmVyaXRlIHNwbG/FoW5lIHBvZ29qZSBuYSB3d3cuYWJvbi5jYXNoL3NpLjwvYWRkaXRpb25hbEluZm9ybWF0aW9uPg0KICAgIDxlbWFpbD5FbWFpbDogaW5mb0BhYm9uLmNhc2g8L2VtYWlsPg0KICAgIDxwaG9uZU51bWJlcj5UZWxlZm9uOiAwODAgNzU1IDU0NTwvcGhvbmVOdW1iZXI+DQo8L2NvdXBvbj4NCg==",
                    "partnerTransactionId": "f0f7d988-5349-45f4-ac3d-3e97e7be48ab"
                },
                {
                    "serialNumber": "6457082571593610",
                    "couponCode": "8425575483390881",
                    "value": 50,
                    "isoCurrencySymbol": "EUR",
                    "content": "PD94bWwgdmVyc2lvbj0iMS4wIj8+DQo8Y291cG9uPg0KCTxsb2dvPlUwcGliV2xZY25GNWNVaDFRemhRYzFSRlVIaHFaV1l4ZW5WbUsyNHJTVXBXWTBOcFRWUlNUV0Z2TlUxdlVFcHdZVlZ3TVRCUGNHcHBiekZhZERVcmMwNDRaMDVtT0dWdGMwcHRUVVp3YmtZMlpsTmhNak5oTDNKa1ozVmxWVFF2VkhOaU5IRnFSVFpGZGtoVFFpdFhWVzlYWW1wemJrSkRkVkJJVkVGcFMyOXhUVVJaWlVWblJrdFJiVWRWUjJ3MVoyWnJNRk5HYm0wcldXMVVkRE51VVZkVmNIaHBjbkZ4VTNOeVlYRnlWV3h0WjBFM2JYbG9hazgwYTNKeE5uWndLM2R2WTFkNFN6aDRNWFJTVEUxM1kydEpkSE5PT1hnNGJrcDRjVUZDTURsUGNqTk1NMWhFVEV0VmRHbFBkRFJrUjFrMk5FTkhOM1Z5V0RjNVdGQmlkVXh2T1dRdllUZE5NM0kwVGxoYVUyWklZamhQTTNoV1VUTTNlamxMWldweGJIbEdhamxDVVcxa1RFTjFXSEk1TlVSNVZYVm9TMlpRTkZFeGNTOHJWVEJRZGtzMFJXVlNSR2RSWjNKVGJsQkhVa2RTU1dobmRFcHVjWGN4T0VJMmMyMWpWVEl5WlhwcmEybEtUV2xCV2xKQmRrNWFlbGRKWjJ4VGVXUTJZM2x3UlhOdEsyOVZVMFp3YUU5S2FtbHNWWEF3Um1wdGFuZHhkR0ZxVTNCV2RpOVdWRlZ4VEhWS1RIQkdSMEprY0hsTFRWZDJXbVJIUTBScmF6RnhSa00wUVhKSVQzaGhjVEZNQ2prck5WbDJSeTlZV25aVGNrNXRNV2QzV1dwcE5IRjNTeXRQTldkMWJraHNOVzR4YzA5UGVscDRSbEZ1Vnk4d1RDdExibWwyV0ZWcWRUQlhjM1EzU214dWNHZDZZamd6VFhWWVNrcHdiVEEzTjNWVGJ6SldPWE4zY1dOd01EaGlUSFJUZEc4eFlVbFlhelUwZEhVM1ltOTJZVWgwUm10bU4zVnNSRkF6WW1NelJ5dGxaRzB5T1hsS1YwdzFVMUkyT1hGcVdISTJWVzF4TUM5NFdrMTZkbm8yTWt0SVpVUXJieXRNVmpKMGJHVkdia281YjA5MVJEUjZlWE42UWxRNGJuUTVNVVkyVFdkS1dXOVpVWHBvYUNzNFdsZ3pSVlp5T1N0aVkwMW5Ua2hPYUdnMWJqZzBNMWRZUnpoT1dGRlpZbWM0WlZWa2NIUjJOaXR0TWtoNlZWWkxibWRYWXpjdk5YQm9WbmhGZG1KR016SnZhV0ZyVGs5VFowaGxTbmxEVEdwelVuaG9OSGRrTUVacGFtcFVVR2syU1ZkUGExQkRXV2haT0M5QmFXMUdhMFJ6VXpaaFMxSlRlVU5hY0VwTUwwMWtiV2RyTURsRFYyRkRWV3d4UkZwdWNGVktXVzl0YVd4b09YbHBXblZZVGpSS1NtOXdhRzF1YW14Q1FWRkJOdz09PC9sb2dvPg0KICAgIDxkYXRlVGltZT4yNC4wMS4yMDI0LiAvIDEyOjAwPC9kYXRlVGltZT4NCiAgICA8c2VsbGVyPkFib25TYWxlc1BhcnRuZXI8L3NlbGxlcj4NCiAgICA8cG9pbnRPZlNhbGU+VGVzdExvY2F0aW9uIDwvcG9pbnRPZlNhbGU+DQogICAgPHZhbHVlT2ZBYm9uPjUwLDAwPC92YWx1ZU9mQWJvbj4NCiAgICA8c2l4dGVlbkRpZ2l0Q29kZT44NDI1IDU3NTQgODMzOSAwODgxPC9zaXh0ZWVuRGlnaXRDb2RlPg0KICAgIDxxUkNvZGU+aVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU1zQUFBRExDQVlBQUFEQSsyY3pBQUFBQVhOU1IwSUFyczRjNlFBQUFBUm5RVTFCQUFDeGp3djhZUVVBQUFBSmNFaFpjd0FBRHNNQUFBN0RBY2R2cUdRQUFBMC9TVVJCVkhoZTdkTkJidTFJREVQUnYvOU5kNDg0dXlFRUNTTEtpUTV3WjBTVi9STC8rKytjVTNJZnl6bEY5N0djVTNRZnl6bEY5N0djVTNRZnl6bEY5N0djVTNRZnl6bEY5N0djVTNRZnl6bEY5N0djVTNRZnl6bEY5N0djVTNRZnl6bEY5N0djVTNRZnl6bEY5N0djVTNRZnl6bEY5N0djVTNRZnl6bEY5N0djVTNRZnl6bEY5N0djVTNRZnl6bEY5N0djVTNRZnl6bEY5N0djVTNRZnl6bEY4WS9sMzc5L244K2gvYlFOZE0vWFNydVBwWkZEKzJrYjZKNnZsWFlmU3lPSDl0TTIwRDFmSyswK2xrWU83YWR0b0h1K1Z0cDlMSTBjMmsvYlFQZDhyYlQ3V0JvNXRKKzJnZTc1V21uM3NUUnlhRDl0QTkzenRkS2UrbGhlUXMrbnV1aXNhVjEwbG5vSlBaOUtpOTlJTDYxZVFzK251dWlzYVYxMGxub0pQWjlLaTk5SUw2MWVRcytudXVpc2FWMTBsbm9KUFo5S2k5OUlMNjFlUXMrbnV1aXNhVjEwbG5vSlBaOUtpOTlJTDYxZVFzK251dWlzYVYxMGxub0pQWjlLaTk5SUw2MWVRcytudXVpc2FWMTBsbm9KUFo5S2k5OUlMNjFlUXMrbnV1aXNhVjEwbG5vSlBaOUtpOTlJTDYwYzJrOXphSys2Nkt4cFhYU1djbWcvemFHOVNvdmZTQyt0SE5wUGMyaXZ1dWlzYVYxMGxuSm9QODJodlVxTDMwZ3ZyUnphVDNOb3I3cm9yR2xkZEpaeWFEL05vYjFLaTk5SUw2MGMyazl6YUsrNjZLeHBYWFNXY21nL3phRzlTb3ZmU0MrdEhOcFBjMml2dXVpc2FWMTBsbkpvUDgyaHZVcUwzMGd2clJ6YVQzTm9yN3JvckdsZGRKWnlhRC9Ob2IxS2k5OUlMNjBjMms5emFLKzY2S3hwWFhTV2NtZy96YUc5U292ZlNDK3RITnBQYzJpdkhOcFg2cUt6bEVONzVkQitta043bFJhL2tWNWFPYlNmNXRCZU9iU3YxRVZuS1lmMnlxSDlOSWYyS2kxK0k3MjBjbWcvemFHOWNtaGZxWXZPVWc3dGxVUDdhUTd0VlZyOFJucHA1ZEIrbWtONzVkQytVaGVkcFJ6YUs0ZjIweHphcTdUNGpmVFN5cUg5TklmMnlxRjlwUzQ2U3ptMFZ3N3Rwem0wVjJueEcrbWxsVVA3YVE3dGxVUDdTbDEwbG5Kb3J4emFUM05vcjlMaU45SkxLNGYyMHh6YUs0ZjJsYnJvTE9YUVhqbTBuK2JRWHFYRmI2U1hWZzd0cHptMFZ4dm9ubWtPN1pWRCsya083VlZhL0VaNmFlWFFmcHBEZTdXQjdwbm0wRjQ1dEovbTBGNmx4VytrbDFZTzdhYzV0RmNiNko1cER1MlZRL3RwRHUxVld2eEdlbW5sMEg2YVEzdTFnZTZaNXRCZU9iU2Y1dEJlcGNWdnBKZFdEdTJuT2JSWEcraWVhUTd0bFVQN2FRN3RWVnI4Um5wcDVkQitta043dFlIdW1lYlFYam0wbitiUVhxWEZiNlNYVmc3dHB6bTBWeHZvbm1rTzdaVkQrMmtPN1ZWYS9FWjZhZlVTZWo2MWdlNlo1dEJldllTZVQ2WEZiNlNYVmkraDUxTWI2SjVwRHUzVlMrajVWRnI4Um5wcDlSSjZQcldCN3BubTBGNjloSjVQcGNWdnBKZFdMNkhuVXh2b25ta083ZFZMNlBsVVd2eEdlbW4xRW5vK3RZSHVtZWJRWHIyRW5rK2x4VytrbDFZdm9lZFRHK2llYVE3dDFVdm8rVlJhL0VaNmFmVVNlajYxZ2U2WjV0QmV2WVNlVDZYRmI2U1gvbG9PN1pWRGUrWFFYam0wLzFwcDhSdnBwYitXUTN2bDBGNDV0RmNPN2I5V1d2eEdldW12NWRCZU9iUlhEdTJWUS91dmxSYS9rVjc2YXptMFZ3N3RsVU43NWREK2E2WEZiNlNYL2xvTzdaVkRlK1hRWGptMC8xcHA4UnZwcGIrV1EzdmwwRjQ1dEZjTzdiOVdXdnhHZXVtdjVkQmVPYlJYRHUyVlEvdXZsWmEvOFEralA3aHlhSzlPenYzYVFmVFByaHphcTVOenYzWVEvYk1yaC9icTVOeXZIVVQvN01xaHZUbzU5MnNIMFQrN2NtaXZUczc5MmtIMHo2NGMycXVUYzc5MkVQMnpLNGYyNnVSODV0ZW1meFRsMEg2YVEvdEtHK2dldFlIdVVWMTBsa3JMMzloRVA1WnlhRC9Ob1gybERYU1Aya0QzcUM0NlM2WGxiMnlpSDBzNXRKL20wTDdTQnJwSGJhQjdWQmVkcGRMeU56YlJqNlVjMms5emFGOXBBOTJqTnRBOXFvdk9VbW41RzV2b3gxSU83YWM1dEsrMGdlNVJHK2dlMVVWbnFiVDhqVTMwWXltSDl0TWMybGZhUVBlb0RYU1A2cUt6VkZyK3hpYjZzWlJEKzJrTzdTdHRvSHZVQnJwSGRkRlpLaTErSTczME5JZjJxb3ZPVW1uMERKVWMyaXVIOXB1bHhXK2tsNTdtMEY1MTBWa3FqWjZoa2tONzVkQitzN1Q0amZUUzB4emFxeTQ2UzZYUk0xUnlhSzhjMm0rV0ZyK1JYbnFhUTN2VlJXZXBOSHFHU2c3dGxVUDd6ZExpTjlKTFQzTm9yN3JvTEpWR3oxREpvYjF5YUw5Wld2eEdldWxwRHUxVkY1MmwwdWdaS2ptMFZ3N3ROMHVMMzBndlBjMmh2ZXFpczFRYVBVTWxoL2JLb2YxbWFmRWI2YVduT2JSWER1Mm5PYlNmdG9IdVVRN3QxVmZFbjVSK3JHa083WlZEKzJrTzdhZHRvSHVVUTN2MUZmRW5wUjlybWtONzVkQitta1A3YVJ2b0h1WFFYbjFGL0VucHg1cm0wRjQ1dEovbTBIN2FCcnBIT2JSWFh4Ri9VdnF4cGptMFZ3N3Rwem0wbjdhQjdsRU83ZFZYeEorVWZxeHBEdTJWUS90cER1Mm5iYUI3bEVONzlSWHhKNlVmYTVwRGUrWFFmcHBEKzJrYjZCN2wwRjU5UmZ4SjZjZFNhZlFNeXFGOUpZZjJhZ1Bkbzdyb3JHa3ZpVDhOL1NBcWpaNUJPYlN2NU5CZWJhQjdWQmVkTmUwbDhhZWhIMFNsMFRNb2gvYVZITnFyRFhTUDZxS3pwcjBrL2pUMGc2ZzBlZ2JsMEw2U1EzdTFnZTVSWFhUV3RKZkVuNForRUpWR3o2QWMybGR5YUs4MjBEMnFpODZhOXBMNDA5QVBvdExvR1pSRCswb083ZFVHdWtkMTBWblRYaEovR3ZwQlZCbzlnM0pvWDhtaHZkcEE5Nmd1T212YVM1NTZHdnF4bEVONzVkQitzeTQ2cTVKRGUrWFF2cEpEKzBwcCtSc04ra0dVUTN2bDBINnpManFya2tONzVkQytra1A3U21uNUd3MzZRWlJEZStYUWZyTXVPcXVTUTN2bDBMNlNRL3RLYWZrYkRmcEJsRU43NWRCK3N5NDZxNUpEZStYUXZwSkQrMHBwK1JzTitrR1VRM3ZsMEg2ekxqcXJra043NWRDK2trUDdTbW41R3czNlFaUkRlK1hRZnJNdU9xdVNRM3ZsMEw2U1EvdEthZmtiRGZwQmxFTjc1ZEIrc3k0NnE1SkRlK1hRdnBKRCswcHArUnQvT2ZxalZuSm9yeHphSzRmMktvMmVRYVhsYi96bDZJOWF5YUc5Y21pdkhOcXJOSG9HbFphLzhaZWpQMm9saC9iS29iMXlhSy9TNkJsVVd2N0dYNDcrcUpVYzJpdUg5c3FodlVxaloxQnArUnQvT2ZxalZuSm9yeHphSzRmMktvMmVRYVhsYi96bDZJOWF5YUc5Y21pdkhOcXJOSG9HbFphLzhaZWpQMm9saC9iS29iMXlhSy9TNkJsVVd2eEdldW12MVVWbnZkaEw2UGxVMm4wc2picm9yQmQ3Q1QyZlNydVBwVkVYbmZWaUw2SG5VMm4zc1RUcW9yTmU3Q1gwZkNydFBwWkdYWFRXaTcyRW5rK2wzY2ZTcUl2T2VyR1gwUE9wdFB0WUduWFJXUy8yRW5vK2xmYlV4L0lTZWo3bDBGNDV0Sy8wRW5vKzVkQmV2U1QrTlBTRHFKZlE4eW1IOXNxaGZhV1gwUE1waC9icUpmR25vUjlFdllTZVR6bTBWdzd0SzcyRW5rODV0RmN2aVQ4Ti9TRHFKZlI4eXFHOWNtaGY2U1gwZk1xaHZYcEovR25vQjFFdm9lZFREdTJWUS90S0w2SG5Vdzd0MVV2aVQwTS9pSG9KUFo5eWFLOGMybGQ2Q1QyZmNtaXZYaEovR3ZwQjFFdm8rWlJEZStYUXZ0Skw2UG1VUTN2MWt2alQwQStpSE5wUGMyaXZITm9yaC9hVkhOcHYxa1ZuVlVxTDMwZ3ZyUnphVDNOb3J4emFLNGYybFJ6YWI5WkZaMVZLaTk5SUw2MGMyazl6YUs4YzJpdUg5cFVjMm0vV1JXZFZTb3ZmU0MrdEhOcFBjMml2SE5vcmgvYVZITnB2MWtWblZVcUwzMGd2clJ6YVQzTm9yeHphSzRmMmxSemFiOVpGWjFWS2k5OUlMNjBjMms5emFLOGMyaXVIOXBVYzJtL1dSV2RWU292ZlNDK3RITnBQYzJpdkhOb3JoL2FWSE5wdjFrVm5WVXFMMzBndnJSemFUM05vcjdyb3JFcGRkSlp5YUs4MjBEM3FKZkdub1I5RU9iU2Y1dEJlZGRGWmxicm9MT1hRWG0yZ2U5Ukw0azlEUDRoeWFEL05vYjNxb3JNcWRkRlp5cUc5MmtEM3FKZkVuNForRU9YUWZwcERlOVZGWjFYcW9yT1VRM3UxZ2U1Ukw0ay9EZjBneXFIOU5JZjJxb3ZPcXRSRlp5bUg5bW9EM2FOZUVuOGEra0dVUS90cER1MVZGNTFWcVl2T1VnN3QxUWE2Ujcway9qVDBneWlIOXRNYzJxc3VPcXRTRjUybEhOcXJEWFNQZWtuOGFlZ0hVUTd0cHptMFZ3N3RLNzJFbms5MTBWbktvYjFLaTk5SUw2MGMyazl6YUs4YzJsZDZDVDJmNnFLemxFTjdsUmEva1Y1YU9iU2Y1dEJlT2JTdjlCSjZQdFZGWnltSDlpb3RmaU85dEhKb1A4Mmh2WEpvWCtrbDlIeXFpODVTRHUxVld2eEdlbW5sMEg2YVEzdmwwTDdTUytqNVZCZWRwUnphcTdUNGpmVFN5cUg5TklmMnlxRjlwWmZRODZrdU9rczV0RmRwOFJ2cHBaVkQrMmtPN1pWRCswb3ZvZWRUWFhTV2NtaXYwdUkzMGt1cmw5RHpxUTEwaitxaXM2YjlaZmV4L0lDZVQyMmdlMVFYblRYdEw3dVA1UWYwZkdvRDNhTzY2S3hwZjlsOUxEK2c1MU1iNkI3VlJXZE4rOHZ1WS9rQlBaL2FRUGVvTGpwcjJsOTJIOHNQNlBuVUJycEhkZEZaMC82eSsxaCtRTStuTnRBOXFvdk9tdmFYUGZXeGZLVXVPbXZhQnJwbk00ZjJLdTArbGtaZGROYTBEWFRQWmc3dFZkcDlMSTI2Nkt4cEcraWV6UnphcTdUN1dCcDEwVm5UTnRBOW16bTBWMm4zc1RUcW9yT21iYUI3Tm5Ob3I5THVZMm5VUldkTjIwRDNiT2JRWHFYZHg5S29pODZhdG9IdTJjeWh2VXJMMzNqT1I5M0hjazdSZlN6bkZOM0hjazdSZlN6bkZOM0hjazdSZlN6bkZOM0hjazdSZlN6bkZOM0hjazdSZlN6bkZOM0hjazdSZlN6bkZOM0hjazdSZlN6bkZOM0hjazdSZlN6bkZOM0hjazdSZlN6bkZOM0hjazdSZlN6bkZOM0hjazdSZlN6bkZOM0hjazdSZlN6bkZOM0hjazdSZlN6bkZOM0hjazdKZi8vOUQ5ZmRPZVBhMzBJV0FBQUFBRWxGVGtTdVFtQ0M8L3FSQ29kZT4NCgk8aW5zdHJ1Y3Rpb25zRm9yVXNlcnM+Vm5lc2l0ZSAxNi1tZXN0bm8ga29kbyBrdXBvbmEgbmEgc3BsZXRuaSBzdHJhbmkgdHJnb3ZpbmUgYWxpIHN0cmFuaSBwb251ZG5pa2Egc3BsZXRuaWggc3Rvcml0ZXYuPC9pbnN0cnVjdGlvbnNGb3JVc2Vycz4NCiAgICA8c2VyaWFsTnVtYmVyPjY0NTcwODI1NzE1OTM2MTA8L3NlcmlhbE51bWJlcj4NCiAgICA8YWRkaXRpb25hbEluZm9ybWF0aW9uPkFib24gaXpkYSBBaXJjYXNoLCBpbnN0aXR1Y2lqYSB6YSBpemRham8gZWxla3Ryb25za2VnYSBkZW5hcmphLCByZWdpc3RyaXJhbmEgdiByZWdpc3RydSBFdnJvcHNrZWdhIGJhbsSNbmVnYSB6ZHJ1xb5lbmphIChFQkEpIHBvZCDFoXRldmlsa28gSUVOMTE2Lg0KICAgICBQcmViZXJpdGUgc3Bsb8WhbmUgcG9nb2plIG5hIHd3dy5hYm9uLmNhc2gvc2kuPC9hZGRpdGlvbmFsSW5mb3JtYXRpb24+DQogICAgPGVtYWlsPkVtYWlsOiBpbmZvQGFib24uY2FzaDwvZW1haWw+DQogICAgPHBob25lTnVtYmVyPlRlbGVmb246IDA4MCA3NTUgNTQ1PC9waG9uZU51bWJlcj4NCjwvY291cG9uPg0K",
                    "partnerTransactionId": "a55a0eea-63f5-45ff-b59c-06fad1c5d517"
                }
            ]
        },
        multipleCouponsCreationV2: {
            requestExample: {
                "partnerId": "52f46879-294d-4904-be7e-368ab0161771",
                "pointOfSaleId": "TestLocation",
                "isoCurrencySymbol": "EUR",
                "contentType": null,
                "contentWidth": null,
                "denominations": [
                    {
                        "value": 50,
                        "partnerTransactionId": "834225b1-9934-4bae-8fd5-2e2c29e3b623"
                    },
                    {
                        "value": 50,
                        "partnerTransactionId": "1c38093e-013e-47a3-9cb7-343be7b67328"
                    }
                ],
                "customParameters": [
                    {
                        "key": "PersonalIdentificationCode",
                        "value": "RSSMRAURTMLARSNL"
                    }
                ],
                "signature": "ubcY0+s5OV..."
            },
            responseExample: [
                {
                    "serialNumber": "9619481157826595",
                    "couponCode": "6978275996471899",
                    "value": 50,
                    "isoCurrencySymbol": "EUR",
                    "content": "PD94bWwgdmVyc2lvbj0iMS4wIj8+DQo8Y291cG9uPg0KCTxsb2dvPlUwcGliV2xZY25GNWNVaDFRemhRYzFSRlVIaHFaV1l4ZW5WbUsyNHJTVXBXWTBOcFRWUlNUV0Z2TlUxdlVFcHdZVlZ3TVRCUGNHcHBiekZhZERVcmMwNDRaMDVtT0dWdGMwcHRUVVp3YmtZMlpsTmhNak5oTDNKa1ozVmxWVFF2VkhOaU5IRnFSVFpGZGtoVFFpdFhWVzlYWW1wemJrSkRkVkJJVkVGcFMyOXhUVVJaWlVWblJrdFJiVWRWUjJ3MVoyWnJNRk5HYm0wcldXMVVkRE51VVZkVmNIaHBjbkZ4VTNOeVlYRnlWV3h0WjBFM2JYbG9hazgwYTNKeE5uWndLM2R2WTFkNFN6aDRNWFJTVEUxM1kydEpkSE5PT1hnNGJrcDRjVUZDTURsUGNqTk1NMWhFVEV0VmRHbFBkRFJrUjFrMk5FTkhOM1Z5V0RjNVdGQmlkVXh2T1dRdllUZE5NM0kwVGxoYVUyWklZamhQTTNoV1VUTTNlamxMWldweGJIbEdhamxDVVcxa1RFTjFXSEk1TlVSNVZYVm9TMlpRTkZFeGNTOHJWVEJRZGtzMFJXVlNSR2RSWjNKVGJsQkhVa2RTU1dobmRFcHVjWGN4T0VJMmMyMWpWVEl5WlhwcmEybEtUV2xCV2xKQmRrNWFlbGRKWjJ4VGVXUTJZM2x3UlhOdEsyOVZVMFp3YUU5S2FtbHNWWEF3Um1wdGFuZHhkR0ZxVTNCV2RpOVdWRlZ4VEhWS1RIQkdSMEprY0hsTFRWZDJXbVJIUTBScmF6RnhSa00wUVhKSVQzaGhjVEZNQ2prck5WbDJSeTlZV25aVGNrNXRNV2QzV1dwcE5IRjNTeXRQTldkMWJraHNOVzR4YzA5UGVscDRSbEZ1Vnk4d1RDdExibWwyV0ZWcWRUQlhjM1EzU214dWNHZDZZamd6VFhWWVNrcHdiVEEzTjNWVGJ6SldPWE4zY1dOd01EaGlUSFJUZEc4eFlVbFlhelUwZEhVM1ltOTJZVWgwUm10bU4zVnNSRkF6WW1NelJ5dGxaRzB5T1hsS1YwdzFVMUkyT1hGcVdISTJWVzF4TUM5NFdrMTZkbm8yTWt0SVpVUXJieXRNVmpKMGJHVkdia281YjA5MVJEUjZlWE42UWxRNGJuUTVNVVkyVFdkS1dXOVpVWHBvYUNzNFdsZ3pSVlp5T1N0aVkwMW5Ua2hPYUdnMWJqZzBNMWRZUnpoT1dGRlpZbWM0WlZWa2NIUjJOaXR0TWtoNlZWWkxibWRYWXpjdk5YQm9WbmhGZG1KR016SnZhV0ZyVGs5VFowaGxTbmxEVEdwelVuaG9OSGRrTUVacGFtcFVVR2syU1ZkUGExQkRXV2haT0M5QmFXMUdhMFJ6VXpaaFMxSlRlVU5hY0VwTUwwMWtiV2RyTURsRFYyRkRWV3d4UkZwdWNGVktXVzl0YVd4b09YbHBXblZZVGpSS1NtOXdhRzF1YW14Q1FWRkJOdz09PC9sb2dvPg0KICAgIDxkYXRlVGltZT4yNC4wMS4yMDI0LiAvIDExOjU5PC9kYXRlVGltZT4NCiAgICA8c2VsbGVyPkFib25TYWxlc1BhcnRuZXI8L3NlbGxlcj4NCiAgICA8cG9pbnRPZlNhbGU+VGVzdExvY2F0aW9uIDwvcG9pbnRPZlNhbGU+DQogICAgPHZhbHVlT2ZBYm9uPjUwLDAwPC92YWx1ZU9mQWJvbj4NCiAgICA8c2l4dGVlbkRpZ2l0Q29kZT42OTc4IDI3NTkgOTY0NyAxODk5PC9zaXh0ZWVuRGlnaXRDb2RlPg0KICAgIDxxUkNvZGU+aVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU1zQUFBRExDQVlBQUFEQSsyY3pBQUFBQVhOU1IwSUFyczRjNlFBQUFBUm5RVTFCQUFDeGp3djhZUVVBQUFBSmNFaFpjd0FBRHNNQUFBN0RBY2R2cUdRQUFBMHBTVVJCVkhoZTdkTkJqdVE2RWdUUnZ2K2wvNnhzWiswSUJKc0JLaWNlWURzSFJXV1YvdnkzMWlyWmoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdkdQNWMrZlA1OHZzZjFwaWUwcHNmM1htcllmUzZQRTlxY2x0cWZFOWw5cjJuNHNqUkxibjViWW5oTGJmNjFwKzdFMFNteC9XbUo3U216L3RhYnR4OUlvc2YxcGllMHBzZjNYbXJZZlM2UEU5cWNsdHFmRTlsOXIybjRzalJMYm41YlluaExiZjYxcFQzMHNMN0g3VVdMNzB4TGJVMko3ZW9uZGo2YU5QOUZlbWw1aTk2UEU5cWNsdHFmRTl2UVN1eDlORzMraXZUUzl4TzVIaWUxUFMyeFBpZTNwSlhZL21qYitSSHRwZW9uZGp4TGJuNWJZbmhMYjAwdnNmalJ0L0luMjB2UVN1eDhsdGo4dHNUMGx0cWVYMlAxbzJ2Z1Q3YVhwSlhZL1NteC9XbUo3U214UEw3SDcwYlR4SjlwTDAwdnNmcFRZL3JURTlwVFlubDVpOTZOcDQwKzBsNmJFOXFjbHRxY3VPNHU2N0N4S2JFK0o3VTlMYkUvVHhwOW9MMDJKN1U5TGJFOWRkaFoxMlZtVTJKNFMyNStXMko2bWpUL1JYcG9TMjUrVzJKNjY3Q3pxc3JNb3NUMGx0ajh0c1QxTkczK2l2VFFsdGo4dHNUMTEyVm5VWldkUlludEtiSDlhWW51YU52NUVlMmxLYkg5YVludnFzck9veTg2aXhQYVUyUDYweFBZMGJmeUo5dEtVMlA2MHhQYlVaV2RSbDUxRmllMHBzZjFwaWUxcDJ2Z1Q3YVVwc2YxcGllMnB5ODZpTGp1TEV0dFRZdnZURXR2VHRQRW4ya3RUWXZ2VEV0dFRZbnZxc3JNcUpiYW54UGFuSmJhbmFlTlB0SmVteFBhbkpiYW54UGJVWldkVlNteFBpZTFQUzJ4UDA4YWZhQzlOaWUxUFMyeFBpZTJweTg2cWxOaWVFdHVmbHRpZXBvMC8wVjZhRXR1Zmx0aWVFdHRUbDUxVktiRTlKYlkvTGJFOVRSdC9vcjAwSmJZL0xiRTlKYmFuTGp1clVtSjdTbXgvV21KN21qYitSSHRwU214L1dtSjdTbXhQWFhaV3BjVDJsTmordE1UMk5HMzhpZmJTbE5qK3RNVDJsTmlldXV5c1NvbnRLYkg5YVludGFkcjRFKzJsS2JIOWFZbnRLYkU5SmJZL0xiRTlKYlkvTGJFOVRSdC9vcjAwSmJZL0xiRTlKYmFueFBhbkpiYW54UGFuSmJhbmFlTlB0SmVteFBhbkpiYW54UGFVMlA2MHhQYVUyUDYweFBZMGJmeUo5dEtVMlA2MHhQYVUySjRTMjUrVzJKNFMyNStXMko2bWpUL1JYcG9TMjUrVzJKNFMyMU5pKzlNUzIxTmkrOU1TMjlPMDhTZmFTMU5pKzlNUzIxTmllMHBzZjFwaWUwcHNmMXBpZTVvMi9rUjdhVXBzZjFwaWUwcHNUNG50VDB0c1Q0bnRUMHRzVDlQR24yZ3ZUUyt4KzFGaWUrcXlzeW9sdHFlWDJQMW8ydmdUN2FYcEpYWS9TbXhQWFhaV3BjVDI5Qks3SDAwYmY2SzlOTDNFN2tlSjdhbkx6cXFVMko1ZVl2ZWphZU5QdEplbWw5ajlLTEU5ZGRsWmxSTGIwMHZzZmpSdC9JbjIwdlFTdXg4bHRxY3VPNnRTWW50NmlkMlBwbzAvMFY2YVhtTDNvOFQyMUdWblZVcHNUeSt4KzlHMDhTZmFTOU5MN0g2VTJKNjY3S3hLaWUzcEpYWS9tamIrUkh2cHI1WFluaExiVTJKN1Ntei90YWFOUDlGZSttc2x0cWZFOXBUWW5oTGJmNjFwNDArMGwvNWFpZTBwc1QwbHRxZkU5bDlyMnZnVDdhVy9WbUo3U214UGllMHBzZjNYbWpiK1JIdnByNVhZbmhMYlUySjdTbXovdGFhTlA5RmUrbXNsdHFmRTlwVFluaExiZjYxcDQwKzBsLzVhaWUwcHNUMGx0cWZFOWw5cjJ2d1QvNC9aSC94bTY5L2FYM1NRL1VQZmJQMWIrNHNPc24vb202MS9hMy9SUWZZUGZiUDFiKzB2T3NqK29XKzIvcTM5UlFmWlAvVE4xcisxditnZys0ZSsyZnEzZnVJWHRYOFU2ckt6NkFaN0RrMnpPNXlXMkw3U3RQa25YbUEvSkhYWldYU0RQWWVtMlIxT1MyeGZhZHI4RXkrd0g1SzY3Q3k2d1o1RDArd09weVcycnpSdC9va1gyQTlKWFhZVzNXRFBvV2wyaDlNUzIxZWFOdi9FQyt5SHBDNDdpMjZ3NTlBMHU4TnBpZTByVFp0LzRnWDJRMUtYblVVMzJITm9tdDNodE1UMmxhYk5QL0VDK3lHcHk4NmlHK3c1Tk0zdWNGcGkrMHJUeHA5b0wwMko3U214UGQxZ3o2SEU5aS9XWldmUlY0emYxSDRzU214UGllM3BCbnNPSmJaL3NTNDdpNzVpL0tiMlkxRmllMHBzVHpmWWN5aXgvWXQxMlZuMEZlTTN0UitMRXR0VFludTZ3WjVEaWUxZnJNdk9vcThZdjZuOVdKVFluaExiMHczMkhFcHMvMkpkZGhaOXhmaE43Y2VpeFBhVTJKNXVzT2RRWXZzWDY3S3o2Q3ZHYjJvL0ZpVzJwOFQyZElNOWh4TGJ2MWlYblVWZjhaMmJCdllIcUpUWS9tWmRkaGE5eE81WDZTWDdzZnlGN1cvV1pXZlJTK3grbFY2eUg4dGYyUDVtWFhZV3ZjVHVWK2tsKzdIOGhlMXYxbVZuMFV2c2ZwVmVzaC9MWDlqK1psMTJGcjNFN2xmcEpmdXgvSVh0YjlabFo5Rkw3SDZWWHJJZnkxL1kvbVpkZGhhOXhPNVg2U1hqdDdFZmhCTGIwelM3UTZVdU8rdG1YWFpXcGE4WXY2bjlXSlRZbnFiWkhTcDEyVmszNjdLektuM0YrRTN0eDZMRTlqVE43bENweTg2NldaZWRWZWtyeG05cVB4WWx0cWRwZG9kS1hYYld6YnJzckVwZk1YNVQrN0Vvc1QxTnN6dFU2ckt6YnRabFoxWDZpdkdiMm85RmllMXBtdDJoVXBlZGRiTXVPNnZTVjR6ZjFINHNTbXhQMCt3T2xicnNySnQxMlZtVnZtTDhwdlpqVmVxeXN5aXhQWFhaV2RSbFoxRmllMXB1L0pleFAwNmxManVMRXR0VGw1MUZYWFlXSmJhbjVjWi9HZnZqVk9xeXN5aXhQWFhaV2RSbFoxRmllMXB1L0pleFAwNmxManVMRXR0VGw1MUZYWFlXSmJhbjVjWi9HZnZqVk9xeXN5aXhQWFhaV2RSbFoxRmllMXB1L0pleFAwNmxManVMRXR0VGw1MUZYWFlXSmJhbjVjWi9HZnZqVk9xeXN5aXhQWFhaV2RSbFoxRmllMXB1ZjVsL3pQNzVUa3RzVHpmWWN5aXhQU1cycDJuelQveHg5a2M5TGJFOTNXRFBvY1QybE5pZXBzMC84Y2ZaSC9XMHhQWjBnejJIRXR0VFludWFOdi9FSDJkLzFOTVMyOU1OOWh4S2JFK0o3V25hL0JOL25QMVJUMHRzVHpmWWN5aXhQU1cycDJuelQveHg5a2M5TGJFOTNXRFBvY1QybE5pZXBzMC84Y2ZaSC9XMHhQWjBnejJIRXR0VFludWFOdjVFZSttdjlSSzczODBTMjlNdjJJK2wwVXZzZmpkTGJFKy9ZRCtXUmkreCs5MHNzVDM5Z3YxWUdyM0U3bmV6eFBiMEMvWmphZlFTdTkvTkV0dlRMOWlQcGRGTDdINDNTMnhQdjJBL2xrWXZzZnZkTExFOS9ZS25QcGFYMlAxb210MkJFdHRUbDUxRlhYWVd2V1Q4TnZhRDBFdnNmalRON2tDSjdhbkx6cUl1TzR0ZU1uNGIrMEhvSlhZL21tWjNvTVQyMUdWblVaZWRSUzhadjQzOUlQUVN1eDlOc3p0UVludnFzck9veTg2aWw0emZ4bjRRZW9uZGo2YlpIU2l4UFhYWldkUmxaOUZMeG05alB3aTl4TzVIMCt3T2xOaWV1dXdzNnJLejZDWGp0N0VmaEY1aTk2TnBkZ2RLYkU5ZGRoWjEyVm4wa3ZIYjJBOUNpZTFQUzJ4UFhYYld6UkxiVTJMNzB4TGIwN1R4SjlwTFUyTDcweExiVTVlZGRiUEU5cFRZL3JURTlqUnQvSW4yMHBUWS9yVEU5dFJsWjkwc3NUMGx0ajh0c1QxTkczK2l2VFFsdGo4dHNUMTEyVmszUzJ4UGllMVBTMnhQMDhhZmFDOU5pZTFQUzJ4UFhYYld6UkxiVTJMNzB4TGIwN1R4SjlwTFUyTDcweExiVTVlZGRiUEU5cFRZL3JURTlqUnQvSW4yMHBUWS9yVEU5dFJsWjkwc3NUMGx0ajh0c1QxTkczK2l2VFFsdGo4dHNUMGx0cWZFOW5TRFBhZFNZbnRLYkY5cDJ2Z1Q3YVVwc2YxcGllMHBzVDBsdHFjYjdEbVZFdHRUWXZ0SzA4YWZhQzlOaWUxUFMyeFBpZTBwc1QzZFlNK3BsTmllRXR0WG1qYitSSHRwU214L1dtSjdTbXhQaWUzcEJudE9wY1QybE5pKzByVHhKOXBMVTJMNzB4TGJVMko3U214UE45aHpLaVcycDhUMmxhYU5QOUZlbWhMYm41YlluaExiVTJKN3VzR2VVeW14UFNXMnJ6UnQvSW4yMHBUWS9yVEU5cFRZbmhMYjB3MzJuRXFKN1NteGZhVnA0MCswbDZiRTlxY2x0cWN1TzR1NjdLeWJKYmFuTGp1THBvMC8wVjZhRXR1Zmx0aWV1dXdzNnJLemJwYllucnJzTEpvMi9rUjdhVXBzZjFwaWUrcXlzNmpMenJwWlludnFzck5vMnZnVDdhVXBzZjFwaWUycHk4NmlManZyWm9udHFjdk9vbW5qVDdTWHBzVDJweVcycHk0N2k3cnNySnNsdHFjdU80dW1qVC9SWHBvUzI1K1cySjY2N0N6cXNyTnVsdGlldXV3c21qYitSSHRwU214L1dtSjc2ckt6cU12T3VsbGllK3F5czJqYStCUHRwZWtsZGorYVpuZWd4UGFWRXR2ZjdDWGp0N0VmaEY1aTk2TnBkZ2RLYkY4cHNmM05YakorRy90QjZDVjJQNXBtZDZERTlwVVMyOS9zSmVPM3NSK0VYbUwzbzJsMkIwcHNYeW14L2MxZU1uNGIrMEhvSlhZL21tWjNvTVQybFJMYjMrd2w0N2V4SDRSZVl2ZWphWFlIU214ZktiSDl6VjR5Zmh2N1FlZ2xkaithWm5lZ3hQYVZFdHZmN0NYanQ3RWY1R3U5eE81M1dtTDdTcjlnUDVaR0w3SDduWmJZdnRJdjJJK2wwVXZzZnFjbHRxLzBDL1pqYWZRU3U5OXBpZTByL1lMOVdCcTl4TzUzV21MN1NyOWdQNVpHTDdIN25aYll2dEl2MkkrbDBVdnNmcWNsdHEvMEMzN2pMZFlhc0IvTFdrWDdzYXhWdEIvTFdrWDdzYXhWdEIvTFdrWDdzYXhWdEIvTFdrWDdzYXhWdEIvTFdrWDdzYXhWdEIvTFdrWDdzYXhWdEIvTFdrWDdzYXhWdEIvTFdrWDdzYXhWdEIvTFdrWDdzYXhWdEIvTFdrWDdzYXhWdEIvTFdrWDdzYXhWdEIvTFdrWDdzYXhWdEIvTFdrWDdzYXhWdEIvTFdpWC8vZmMvNGdlRHRVcFJhM01BQUFBQVNVVk9SSzVDWUlJPTwvcVJDb2RlPg0KCTxpbnN0cnVjdGlvbnNGb3JVc2Vycz5WbmVzaXRlIDE2LW1lc3RubyBrb2RvIGt1cG9uYSBuYSBzcGxldG5pIHN0cmFuaSB0cmdvdmluZSBhbGkgc3RyYW5pIHBvbnVkbmlrYSBzcGxldG5paCBzdG9yaXRldi48L2luc3RydWN0aW9uc0ZvclVzZXJzPg0KICAgIDxzZXJpYWxOdW1iZXI+OTYxOTQ4MTE1NzgyNjU5NTwvc2VyaWFsTnVtYmVyPg0KICAgIDxhZGRpdGlvbmFsSW5mb3JtYXRpb24+QWJvbiBpemRhIEFpcmNhc2gsIGluc3RpdHVjaWphIHphIGl6ZGFqbyBlbGVrdHJvbnNrZWdhIGRlbmFyamEsIHJlZ2lzdHJpcmFuYSB2IHJlZ2lzdHJ1IEV2cm9wc2tlZ2EgYmFuxI1uZWdhIHpkcnXFvmVuamEgKEVCQSkgcG9kIMWhdGV2aWxrbyBJRU4xMTYuDQogICAgIFByZWJlcml0ZSBzcGxvxaFuZSBwb2dvamUgbmEgd3d3LmFib24uY2FzaC9zaS48L2FkZGl0aW9uYWxJbmZvcm1hdGlvbj4NCiAgICA8ZW1haWw+RW1haWw6IGluZm9AYWJvbi5jYXNoPC9lbWFpbD4NCiAgICA8cGhvbmVOdW1iZXI+VGVsZWZvbjogMDgwIDc1NSA1NDU8L3Bob25lTnVtYmVyPg0KPC9jb3Vwb24+DQo=",
                    "partnerTransactionId": "834225b1-9934-4bae-8fd5-2e2c29e3b623"
                },
                {
                    "serialNumber": "4680110351174952",
                    "couponCode": "8969283966968682",
                    "value": 50,
                    "isoCurrencySymbol": "EUR",
                    "content": "PD94bWwgdmVyc2lvbj0iMS4wIj8+DQo8Y291cG9uPg0KCTxsb2dvPlUwcGliV2xZY25GNWNVaDFRemhRYzFSRlVIaHFaV1l4ZW5WbUsyNHJTVXBXWTBOcFRWUlNUV0Z2TlUxdlVFcHdZVlZ3TVRCUGNHcHBiekZhZERVcmMwNDRaMDVtT0dWdGMwcHRUVVp3YmtZMlpsTmhNak5oTDNKa1ozVmxWVFF2VkhOaU5IRnFSVFpGZGtoVFFpdFhWVzlYWW1wemJrSkRkVkJJVkVGcFMyOXhUVVJaWlVWblJrdFJiVWRWUjJ3MVoyWnJNRk5HYm0wcldXMVVkRE51VVZkVmNIaHBjbkZ4VTNOeVlYRnlWV3h0WjBFM2JYbG9hazgwYTNKeE5uWndLM2R2WTFkNFN6aDRNWFJTVEUxM1kydEpkSE5PT1hnNGJrcDRjVUZDTURsUGNqTk1NMWhFVEV0VmRHbFBkRFJrUjFrMk5FTkhOM1Z5V0RjNVdGQmlkVXh2T1dRdllUZE5NM0kwVGxoYVUyWklZamhQTTNoV1VUTTNlamxMWldweGJIbEdhamxDVVcxa1RFTjFXSEk1TlVSNVZYVm9TMlpRTkZFeGNTOHJWVEJRZGtzMFJXVlNSR2RSWjNKVGJsQkhVa2RTU1dobmRFcHVjWGN4T0VJMmMyMWpWVEl5WlhwcmEybEtUV2xCV2xKQmRrNWFlbGRKWjJ4VGVXUTJZM2x3UlhOdEsyOVZVMFp3YUU5S2FtbHNWWEF3Um1wdGFuZHhkR0ZxVTNCV2RpOVdWRlZ4VEhWS1RIQkdSMEprY0hsTFRWZDJXbVJIUTBScmF6RnhSa00wUVhKSVQzaGhjVEZNQ2prck5WbDJSeTlZV25aVGNrNXRNV2QzV1dwcE5IRjNTeXRQTldkMWJraHNOVzR4YzA5UGVscDRSbEZ1Vnk4d1RDdExibWwyV0ZWcWRUQlhjM1EzU214dWNHZDZZamd6VFhWWVNrcHdiVEEzTjNWVGJ6SldPWE4zY1dOd01EaGlUSFJUZEc4eFlVbFlhelUwZEhVM1ltOTJZVWgwUm10bU4zVnNSRkF6WW1NelJ5dGxaRzB5T1hsS1YwdzFVMUkyT1hGcVdISTJWVzF4TUM5NFdrMTZkbm8yTWt0SVpVUXJieXRNVmpKMGJHVkdia281YjA5MVJEUjZlWE42UWxRNGJuUTVNVVkyVFdkS1dXOVpVWHBvYUNzNFdsZ3pSVlp5T1N0aVkwMW5Ua2hPYUdnMWJqZzBNMWRZUnpoT1dGRlpZbWM0WlZWa2NIUjJOaXR0TWtoNlZWWkxibWRYWXpjdk5YQm9WbmhGZG1KR016SnZhV0ZyVGs5VFowaGxTbmxEVEdwelVuaG9OSGRrTUVacGFtcFVVR2syU1ZkUGExQkRXV2haT0M5QmFXMUdhMFJ6VXpaaFMxSlRlVU5hY0VwTUwwMWtiV2RyTURsRFYyRkRWV3d4UkZwdWNGVktXVzl0YVd4b09YbHBXblZZVGpSS1NtOXdhRzF1YW14Q1FWRkJOdz09PC9sb2dvPg0KICAgIDxkYXRlVGltZT4yNC4wMS4yMDI0LiAvIDExOjU5PC9kYXRlVGltZT4NCiAgICA8c2VsbGVyPkFib25TYWxlc1BhcnRuZXI8L3NlbGxlcj4NCiAgICA8cG9pbnRPZlNhbGU+VGVzdExvY2F0aW9uIDwvcG9pbnRPZlNhbGU+DQogICAgPHZhbHVlT2ZBYm9uPjUwLDAwPC92YWx1ZU9mQWJvbj4NCiAgICA8c2l4dGVlbkRpZ2l0Q29kZT44OTY5IDI4MzkgNjY5NiA4NjgyPC9zaXh0ZWVuRGlnaXRDb2RlPg0KICAgIDxxUkNvZGU+aVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU1zQUFBRExDQVlBQUFEQSsyY3pBQUFBQVhOU1IwSUFyczRjNlFBQUFBUm5RVTFCQUFDeGp3djhZUVVBQUFBSmNFaFpjd0FBRHNNQUFBN0RBY2R2cUdRQUFBenpTVVJCVkhoZTdkTkJqdVE2RWdUUnZ2K2wvNnhzWjNBRWdzMUlxaWNlWURzSEtXV1YvdnkzMWlyWmoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdjFZMWlyYWoyV3RvdkdQNWMrZlA1K3Z5ODZpTGp1TEV0dC9yV243c1RUcXNyT295ODZpeFBaZmE5cCtMSTI2N0N6cXNyTW9zZjNYbXJZZlM2TXVPNHU2N0N4S2JQKzFwdTNIMHFqTHpxSXVPNHNTMjMrdGFmdXhOT3F5czZqTHpxTEU5bDlyMm40c2picnNMT3F5c3lpeC9kZWE5dFRIOGhKN1BrcHNUNG50SzNYWldmUVNlejZhTm42anZUUzl4SjZQRXR0VFl2dEtYWFlXdmNTZWo2YU4zMmd2VFMreDU2UEU5cFRZdmxLWG5VVXZzZWVqYWVNMzJrdlRTK3o1S0xFOUpiYXYxR1ZuMFV2cytXamErSTMyMHZRU2V6NUtiRStKN1N0MTJWbjBFbnMrbWpaK283MDB2Y1NlanhMYlUyTDdTbDEyRnIzRW5vK21qZDlvTDAwdnNlZWp4UGFVMkw1U2w1MUZMN0hubzJuak45cExVMkw3MHhMYlUyTDdTb250cWN2T29zVDJweVcycDJuak45cExVMkw3MHhMYlUyTDdTb250cWN2T29zVDJweVcycDJuak45cExVMkw3MHhMYlUyTDdTb250cWN2T29zVDJweVcycDJuak45cExVMkw3MHhMYlUyTDdTb250cWN2T29zVDJweVcycDJuak45cExVMkw3MHhMYlUyTDdTb250cWN2T29zVDJweVcycDJuak45cExVMkw3MHhMYlUyTDdTb250cWN2T29zVDJweVcycDJuak45cExVMkw3MHhMYlUyTDdTb250cWN2T29zVDJweVcycDJuak45cExVMkw3MHhMYlUySjdTbXhQTjlnOWxOait0TVQyTkczOFJudHBTbXgvV21KN1NteFBpZTNwQnJ1SEV0dWZsdGllcG8zZmFDOU5pZTFQUzJ4UGllMHBzVDNkWVBkUVl2dlRFdHZUdFBFYjdhVXBzZjFwaWUwcHNUMGx0cWNiN0I1S2JIOWFZbnVhTm42anZUUWx0ajh0c1QwbHRxZkU5blNEM1VPSjdVOUxiRS9UeG0rMGw2YkU5cWNsdHFmRTlwVFlubTZ3ZXlpeC9XbUo3V25hK0kzMjBwVFkvclRFOXBUWW5oTGIwdzEyRHlXMlB5MnhQVTBidjlGZW1oTGJuNWJZbmhMYlU1ZWRSVjEyRmlXMlB5MnhQVTBidjlGZW1oTGJuNWJZbmhMYlU1ZWRSVjEyRmlXMlB5MnhQVTBidjlGZW1oTGJuNWJZbmhMYlU1ZWRSVjEyRmlXMlB5MnhQVTBidjlGZW1oTGJuNWJZbmhMYlU1ZWRSVjEyRmlXMlB5MnhQVTBidjlGZW1oTGJuNWJZbmhMYlU1ZWRSVjEyRmlXMlB5MnhQVTBidjlGZW1oTGJuNWJZbmhMYlU1ZWRSVjEyRmlXMlB5MnhQVTBidjlGZW1oTGJuNWJZbmhMYlU1ZWRSVjEyRmlXMlB5MnhQVTBidjlGZW1sNWl6MGVKN1N0MTJWbVUySjVlWXM5SDA4WnZ0SmVtbDlqelVXTDdTbDEyRmlXMnA1Zlk4OUcwOFJ2dHBla2w5bnlVMkw1U2w1MUZpZTNwSmZaOE5HMzhSbnRwZW9rOUh5VzJyOVJsWjFGaWUzcUpQUjlORzcvUlhwcGVZczlIaWUwcmRkbFpsTmllWG1MUFI5UEdiN1NYcHBmWTgxRmkrMHBkZGhZbHRxZVgyUFBSdFBFYjdhWHBKZlo4bE5pK1VwZWRSWW50NlNYMmZEUnQvRVo3NmErVjJKNFMyMU5pZTBwcy83V21qZDlvTC8yMUV0dFRZbnRLYkUrSjdiL1d0UEViN2FXL1ZtSjdTbXhQaWUwcHNmM1htalorbzczMDEwcHNUNG50S2JFOUpiYi9XdFBHYjdTWC9scUo3U214UFNXMnA4VDJYMnZhK0kzMjBsOHJzVDBsdHFmRTlwVFkvbXRORzcvUlh2cHJKYmFueFBhVTJKNFMyMyt0YWZNMy9oK3pQL2hwYTg3KzJvUHNuLzIwTldkLzdVSDJ6MzdhbXJPLzlpRDdaejl0emRsZmU1RDlzNSsyNXV5dlBjaisyVTliYy9iWEhtVC83S2V0T1ovNXRlMGZoYnJzckYrVjJQNjB4UGEvNmlYN3NUeFNZdnZURXR2L3FwZnN4L0pJaWUxUFMyei9xMTZ5SDhzakpiWS9MYkg5cjNySmZpeVBsTmordE1UMnYrb2wrN0U4VW1MNzB4TGIvNnFYN01meVNJbnRUMHRzLzZ0ZU12NDA5b1BjN0FhN2g3cnNyRW92c2VlcjlCWDdzVFRZUGRSbFoxVjZpVDFmcGEvWWo2WEI3cUV1TzZ2U1MrejVLbjNGZml3TmRnOTEyVm1WWG1MUFYra3I5bU5wc0h1b3k4NnE5Qko3dmtwZnNSOUxnOTFEWFhaV3BaZlk4MVg2aXYxWUd1d2U2ckt6S3IzRW5xL1NWM3puU1FQN0EveXF4UGJVWldkUll2dWJKYmF2TkczK3hndnNoL3hWaWUycHk4Nml4UFkzUzJ4ZmFkcjhqUmZZRC9tckV0dFRsNTFGaWUxdmx0aSswclQ1R3krd0gvSlhKYmFuTGp1TEV0dmZMTEY5cFduek4xNWdQK1N2U214UFhYWVdKYmEvV1dMN1N0UG1iN3pBZnNoZmxkaWV1dXdzU214L3M4VDJsYWJOMzNpQi9aQy9LckU5ZGRsWmxOaitab250SzAwYnY5RmV1bEppZTBwc1Q0bnRiM2FEM1VPSjdTbXhQWDNGK0pQYWoxVXBzVDBsdHFmRTlqZTd3ZTZoeFBhVTJKNitZdnhKN2NlcWxOaWVFdHRUWXZ1YjNXRDNVR0o3U214UFh6SCtwUFpqVlVwc1Q0bnRLYkg5elc2d2V5aXhQU1cycDY4WWYxTDdzU29sdHFmRTlwVFkvbVkzMkQyVTJKNFMyOU5YakQrcC9WaVZFdHRUWW50S2JIK3pHK3dlU214UGllM3BLOGFmMUg2c1NvbnRLYkU5SmJhLzJRMTJEeVcycDhUMjlCVlBQYW45a0pUWW5ycnNyRXJUN0Jtb3k4NzZWUzk1Nm1uc3g2TEU5dFJsWjFXYVpzOUFYWGJXcjNySlUwOWpQeFlsdHFjdU82dlNOSHNHNnJLemZ0Vkxubm9hKzdFb3NUMTEyVm1WcHRrelVKZWQ5YXRlOHRUVDJJOUZpZTJweTg2cU5NMmVnYnJzckYvMWtxZWV4bjRzU214UFhYWldwV24yRE5SbFovMnFsenoxTlBaalVXSjc2ckt6S2syelo2QXVPK3RYdmVTdHAva0gyQitjRXR0VFl2dlRwdGt6VkpxMkg4dGZabjlVU214UGllMVBtMmJQVUduYWZpeC9tZjFSS2JFOUpiWS9iWm85UTZWcCs3SDhaZlpIcGNUMmxOait0R24yREpXbTdjZnlsOWtmbFJMYlUyTDcwNmJaTTFTYXRoL0xYMlovVkVwc1Q0bnRUNXRtejFCcDJuNHNmNW45VVNteFBTVzJQMjJhUFVPbGFlTTMya3QvcmNUMmRJUGRRNG50S2JFOUpiWS9iZHI0amZiU1h5dXhQZDFnOTFCaWUwcHNUNG50VDVzMmZxTzk5TmRLYkU4MzJEMlUySjRTMjFOaSs5T21qZDlvTC8yMUV0dlREWFlQSmJhbnhQYVUyUDYwYWVNMzJrdC9yY1QyZElQZFE0bnRLYkU5SmJZL2JkcjRqZmJTWHl1eFBkMWc5MUJpZTBwc1Q0bnRUNXMyZnFPOTlOZEtiRTgzMkQyVTJKNFMyMU5pKzlPbWpkOW9MMDB2c2VlanhQYjBMN0Qzb3NUMjlCWGpUMm8vRnIzRW5vOFMyOU8vd042TEV0dlRWNHcvcWYxWTlCSjdQa3BzVC84Q2V5OUtiRTlmTWY2azltUFJTK3o1S0xFOS9RdnN2U2l4UFgzRitKUGFqMFV2c2VlanhQYjBMN0Qzb3NUMjlCWGpUMm8vRnIzRW5vOFMyOU8vd042TEV0dlRWNHcvcWYxWTlCSjdQa3BzVC84Q2V5OUtiRTlmTWY2azltTlJZdnZURXR0VGw1MVZxY3ZPcXBUWS9yVEU5alJ0L0VaN2FVcHNmMXBpZStxeXN5cDEyVm1WRXR1Zmx0aWVwbzNmYUM5TmllMVBTMnhQWFhaV3BTNDdxMUppKzlNUzI5TzA4UnZ0cFNteC9XbUo3YW5MenFyVVpXZFZTbXgvV21KN21qWitvNzAwSmJZL0xiRTlkZGxabGJyc3JFcUo3VTlMYkUvVHhtKzBsNmJFOXFjbHRxY3VPNnRTbDUxVktiSDlhWW50YWRyNGpmYlNsTmordE1UMjFHVm5WZXF5c3lvbHRqOHRzVDFORzcvUlhwb1MyNStXMko2NjdLeWJKYmIvVlY4eC9xVDJZMUZpKzlNUzIxT1huWFd6eFBhLzZpdkduOVIrTEVwc2YxcGllK3F5czI2VzJQNVhmY1g0azlxUFJZbnRUMHRzVDExMjFzMFMyLytxcnhoL1V2dXhLTEg5YVludHFjdk91bGxpKzEvMUZlTlBhajhXSmJZL0xiRTlkZGxaTjB0cy82dStZdnhKN2NlaXhQYW5KYmFuTGp2clpvbnRmOVZYakQrcC9WaVUyUDYweFBhVTJKNXVzSHVveTg1NnNXbmpOOXBMVTJMNzB4TGJVMko3dXNIdW9TNDc2OFdtamQ5b0wwMko3VTlMYkUrSjdla0d1NGU2N0t3WG16WitvNzAwSmJZL0xiRTlKYmFuRyt3ZTZyS3pYbXphK0kzMjBwVFkvclRFOXBUWW5tNndlNmpMem5xeGFlTTMya3RUWXZ2VEV0dFRZbnU2d2U2aExqdnJ4YWFOMzJndlRZbnRUMHRzVDRudDZRYTdoN3JzckJlYk5uNmp2VFM5eEo2UGJyQjdidFpsWjFGaSswb3ZHWDhhKzBIb0pmWjhkSVBkYzdNdU80c1MyMWQ2eWZqVDJBOUNMN0hub3h2c25wdDEyVm1VMkw3U1M4YWZ4bjRRZW9rOUg5MWc5OXlzeTg2aXhQYVZYakwrTlBhRDBFdnMrZWdHdStkbVhYWVdKYmF2OUpMeHA3RWZoRjVpejBjMzJEMDM2N0t6S0xGOXBaZU1QNDM5SVBRU2V6NjZ3ZTY1V1plZFJZbnRLNzFrL0duc0IvbGFOOWc5djZyTHpxTEU5cFdtN2NmUzZBYTc1MWQxMlZtVTJMN1N0UDFZR3QxZzkveXFManVMRXR0WG1yWWZTNk1iN0o1ZjFXVm5VV0w3U3RQMlkybDBnOTN6cTdyc0xFcHNYMm5hZml5TmJyQjdmbFdYblVXSjdTdE4yNCtsMFExMno2L3Fzck1vc1gybGFmTTNydlZSKzdHc1ZiUWZ5MXBGKzdHc1ZiUWZ5MXBGKzdHc1ZiUWZ5MXBGKzdHc1ZiUWZ5MXBGKzdHc1ZiUWZ5MXBGKzdHc1ZiUWZ5MXBGKzdHc1ZiUWZ5MXBGKzdHc1ZiUWZ5MXBGKzdHc1ZiUWZ5MXBGKzdHc1ZiUWZ5MXBGKzdHc1ZiUWZ5MXBGKzdHc1ZiUWZ5MXBGKzdHc1ZiUWZ5MXBGKzdHc1ZmTGZmLzhERUxpbU1BbVMycjBBQUFBQVNVVk9SSzVDWUlJPTwvcVJDb2RlPg0KCTxpbnN0cnVjdGlvbnNGb3JVc2Vycz5WbmVzaXRlIDE2LW1lc3RubyBrb2RvIGt1cG9uYSBuYSBzcGxldG5pIHN0cmFuaSB0cmdvdmluZSBhbGkgc3RyYW5pIHBvbnVkbmlrYSBzcGxldG5paCBzdG9yaXRldi48L2luc3RydWN0aW9uc0ZvclVzZXJzPg0KICAgIDxzZXJpYWxOdW1iZXI+NDY4MDExMDM1MTE3NDk1Mjwvc2VyaWFsTnVtYmVyPg0KICAgIDxhZGRpdGlvbmFsSW5mb3JtYXRpb24+QWJvbiBpemRhIEFpcmNhc2gsIGluc3RpdHVjaWphIHphIGl6ZGFqbyBlbGVrdHJvbnNrZWdhIGRlbmFyamEsIHJlZ2lzdHJpcmFuYSB2IHJlZ2lzdHJ1IEV2cm9wc2tlZ2EgYmFuxI1uZWdhIHpkcnXFvmVuamEgKEVCQSkgcG9kIMWhdGV2aWxrbyBJRU4xMTYuDQogICAgIFByZWJlcml0ZSBzcGxvxaFuZSBwb2dvamUgbmEgd3d3LmFib24uY2FzaC9zaS48L2FkZGl0aW9uYWxJbmZvcm1hdGlvbj4NCiAgICA8ZW1haWw+RW1haWw6IGluZm9AYWJvbi5jYXNoPC9lbWFpbD4NCiAgICA8cGhvbmVOdW1iZXI+VGVsZWZvbjogMDgwIDc1NSA1NDU8L3Bob25lTnVtYmVyPg0KPC9jb3Vwb24+DQo=",
                    "partnerTransactionId": "1c38093e-013e-47a3-9cb7-343be7b67328"
                }
            ],
            errorResponseExample: {
                code: 9,
                message: "Invalid personal identification code",
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