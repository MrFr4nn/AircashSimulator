var abonOpModule = angular.module('abonOp', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.abonOp', {
            data: {
                pageTitle: 'Abon deposit'
            },
            url: "/abonDeposit",
            controller: 'abonOpCtrl',
            templateUrl: 'app/abon_op/abon_op.html?v=' + Global.appVersion
        });
});

abonOpModule.service("abonOpService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        validateCoupon: validateCoupon,
        checkStatusCoupon: checkStatusCoupon,
        getCurlValidateCoupon: getCurlValidateCoupon,
        getCurlConfirmTransaction:getCurlConfirmTransaction,
        confirmTransaction: confirmTransaction,
        confirmTransactionV2: confirmTransactionV2,
        validateSimulateError: validateSimulateError,
        confirmSimulateError: confirmSimulateError,
        createAndSaveCoupons: createAndSaveCoupons,
        getDenominations: getDenominations,
    });
    function validateCoupon(couponCode, providerId) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonOnlinePartner/ValidateCoupon",
            data: {
                CouponCode: couponCode,
                ProviderId: providerId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }    
    function getCurlValidateCoupon(couponCode, providerId) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonOnlinePartner/GetCurlValidateCoupon",
            data: {
                CouponCode: couponCode,
                ProviderId: providerId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function checkStatusCoupon(partnerId, couponCode, partnerTransactionId, notificationUrl, userId, userPhoneNumber, parameters) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonOnlinePartner/CheckStatusCoupon",
            data: {
                PartnerId: partnerId,
                CouponCode: couponCode,
                PartnerTransactionId: partnerTransactionId,
                NotificationUrl: notificationUrl,
                UserId: userId,
                UserPhoneNumber: userPhoneNumber,
                Parameters: parameters
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function confirmTransaction(confirmTransactionModel) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl +"AbonOnlinePartner/ConfirmTransaction",
            data: {
                CouponCode: confirmTransactionModel.couponCode,
                ProviderId: confirmTransactionModel.providerId,
                ProviderTransactionId: confirmTransactionModel.providerTransactionId,
                UserId: confirmTransactionModel.userId

            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function confirmTransactionV2(confirmTransactionV2Model) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonOnlinePartner/ConfirmTransactionV2",
            data: {
                CouponCode: confirmTransactionV2Model.couponCode,
                PartnerId: confirmTransactionV2Model.partnerId,
                PartnerTransactionId: confirmTransactionV2Model.partnerTransactionId,
                UserId: confirmTransactionV2Model.userId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function getCurlConfirmTransaction(confirmTransactionModel) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonOnlinePartner/GetCurlConfirmTransaction",
            data: {
                CouponCode: confirmTransactionModel.couponCode,
                ProviderId: confirmTransactionModel.providerId,
                ProviderTransactionId: confirmTransactionModel.providerTransactionId,
                UserId: confirmTransactionModel.userId
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

    function createAndSaveCoupons(partnerId) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonSalePartner/CreateMultipleCashierCoupon",
            data: {
                PartnerId: partnerId,
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function getDenominations(partnerId) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "Denominations/GetCashierDenominations",
            data: { partnerId: partnerId }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

abonOpModule.controller("abonOpCtrl", ['$scope', '$state', '$filter', 'abonOpService', '$http', 'JwtParser', '$uibModal', '$rootScope', 'HelperService', 'config', '$localStorage', function ($scope, $state, $filter, abonOpService, $http, JwtParser, $uibModal, $rootScope, HelperService, config, $localStorage) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    $scope.partnerIds = JSON.parse($scope.decodedToken.partnerIdsDTO);
    if ($scope.partnerRoles.indexOf("AbonDeposit") == -1) {
        $location.path('/forbidden');
    }
    $scope.abons = [];
    $scope.copyToClipboard = function (data) {
        navigator.clipboard.writeText(data);
    }
    $scope.validateCouponModel = {
        couponCode: null,
        providerId: $scope.partnerIds.AbonOnlinePartnerIdWithoutAuthorization
    };
    $scope.checkStatusCouponModel = {
        partnerId: $scope.partnerIds.AbonOnlinePartnerId,
        couponCode: null,
        partnerTransactionId: HelperService.NewGuid(),
        notificationUrl: config.baseUrl + "AbonOnlinePartner/AuthorizationNotification",
        userId: HelperService.NewGuid(),
        userPhoneNumber: $scope.decodedToken.userPhoneNumber,
        userFirstName: $scope.decodedToken.userFirstName,
        userLastName: $scope.decodedToken.userLastName,
        userBirthDate: new Date($scope.decodedToken.userBirthDate)
    };
    $scope.confirmTransactionModel = {
        couponCode: null,
        providerId: $scope.partnerIds.AbonOnlinePartnerIdWithoutAuthorization,
        providerTransactionId: HelperService.NewGuid(),
        userId: HelperService.NewGuid()
    };
    $scope.confirmTransactionV2Model = {
        couponCode: null,
        partnerId: $scope.partnerIds.AbonOnlinePartnerId,
        partnerTransactionId: HelperService.NewGuid(),
        userId: HelperService.NewGuid()
    };    

    $scope.showCoupon = function () {
        $("#couponModal").modal("show");
    }

    $scope.showVideoAbon = function () {
        $("#videoModalAbon").modal("show");
    }
    
    $scope.curlValidateBusy = false;
    $scope.curlValidateResponded = false;
    $scope.getCurlValidateCoupon = function () {
        $scope.curlValidateBusy = true;
        $scope.curlValidateResponded = false;
        abonOpService.getCurlValidateCoupon($scope.validateCouponModel.couponCode, $scope.validateCouponModel.providerId)
            .then(function (response) {
                if (response) {
                    $scope.CurlResponse = response;
                }
                $scope.curlValidateBusy = false;
                $scope.curlValidateResponded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.validateResponded = false;
    $scope.validateBusy = false;
    $scope.validateCoupon = function () {
        $scope.validateBusy = true;
        $scope.validateResponded = false;
        abonOpService.validateCoupon($scope.validateCouponModel.couponCode, $scope.validateCouponModel.providerId)
            .then(function (response) {
                if (response) {
                    $scope.ValidateRequestDateTimeUTC = response.RequestDateTimeUTC;
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.ValidateServiceRequest = JSON.stringify(response.ServiceRequest, null, 4);
                    $scope.sequenceValidate = response.Sequence;
                    $scope.ValidateResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.ValidateServiceResponse = JSON.stringify(response.ServiceResponse, null, 4);

                }
                $scope.validateBusy = false;
                $scope.validateResponded = true;
            }, () => {
                console.log("error");
            });
    }
    $scope.select = {};
    $scope.checkStatusSetDefaultAuthorizationValues = function () {
        $scope.checkStatusCouponModel.partnerTransactionId = HelperService.NewGuid();
        $scope.checkStatusCouponModel.notificationUrl = config.baseUrl + "AbonOnlinePartner/AuthorizationNotification";
        $scope.checkStatusCouponModel.userPhoneNumber = $scope.decodedToken.userPhoneNumber;
        $scope.checkStatusCouponModel.userFirstName = $scope.decodedToken.userFirstName;
        $scope.checkStatusCouponModel.userLastName = $scope.decodedToken.userLastName;
        $scope.checkStatusCouponModel.userBirthDate = new Date($scope.decodedToken.userBirthDate);
        $scope.checkStatusCouponModel.personalIdentificationCode = "RSSMRAURTMLARSNL";
    }
    $scope.checkStatusSetAuthorizationValuesToNull = function () {
        $scope.checkStatusCouponModel.partnerTransactionId = null;
        $scope.checkStatusCouponModel.notificationUrl = null;
        $scope.checkStatusCouponModel.userPhoneNumber = null;
        $scope.checkStatusCouponModel.userFirstName = null;
        $scope.checkStatusCouponModel.userLastName = null;
        $scope.checkStatusCouponModel.userBirthDate = null;
        $scope.checkStatusCouponModel.personalIdentificationCode = null;
    }
    $scope.checkStatusCouponResponded = false;
    $scope.checkStatusCouponBusy = false;
    $scope.checkStatusCoupon = function () {
        $scope.checkStatusCouponBusy = true;
        $scope.checkStatusCouponResponded = false;
        var parameters = [{ key: "PayerFirstName", value: $scope.checkStatusCouponModel.userFirstName }, { key: "PayerLastName", value: $scope.checkStatusCouponModel.userLastName }, { key: "PayerBirthDate", value: $scope.checkStatusCouponModel.userBirthDate.toLocaleDateString('en-CA') }, { key: "PersonalIdentificationCode", value: $scope.checkStatusCouponModel.personalIdentificationCode }];
        if ($scope.select.CheckStatusUseAuthorization == 1) {
            $scope.checkStatusSetAuthorizationValuesToNull();
            parameters = null;
        } 
        abonOpService.checkStatusCoupon($scope.checkStatusCouponModel.partnerId, $scope.checkStatusCouponModel.couponCode, $scope.checkStatusCouponModel.partnerTransactionId, $scope.checkStatusCouponModel.notificationUrl, $scope.checkStatusCouponModel.userId, $scope.checkStatusCouponModel.userPhoneNumber, parameters)
            .then(function (response) {
                console.log(response);
                if (response) {
                    $scope.checkStatusCouponRequestDateTimeUTC = response.RequestDateTimeUTC;
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.checkStatusCouponServiceRequest = JSON.stringify(response.ServiceRequest, null, 4);
                    $scope.checkStatusCouponSequence = response.Sequence;
                    $scope.checkStatusCouponResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.checkStatusCouponServiceResponse = JSON.stringify(response.ServiceResponse, null, 4);
                }
                if ($scope.select.CheckStatusUseAuthorization == 1) $scope.checkStatusSetDefaultAuthorizationValues();
                $scope.checkStatusCouponBusy = false;
                $scope.checkStatusCouponResponded = true;
            }, () => {
                console.log("error");
                if ($scope.select.CheckStatusUseAuthorization == 1) $scope.checkStatusSetDefaultAuthorizationValues();
            });
    }

    $scope.setCheckStatusDate = function (date) {
        $scope.checkStatusCouponModel.userBirthDate = date;
    }


    $scope.confirmResponded = false;
    $scope.confirmBusy = false;
    $scope.confirmTransaction = function () {
        $scope.confirmBusy = true;
        $scope.confirmResponded = false;
        abonOpService.confirmTransaction($scope.confirmTransactionModel)
            .then(function (response) {
                if (response) {
                    $scope.ConfirmRequestDateTimeUTC = response.RequestDateTimeUTC;
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.ConfirmServiceRequest = JSON.stringify(response.ServiceRequest, null, 4);
                    $scope.sequenceConfirm = response.Sequence;
                    $scope.ConfirmResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.ConfirmServiceResponse = JSON.stringify(response.ServiceResponse, null, 4);

                }
                $scope.confirmBusy = false;
                $scope.confirmResponded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.confirmV2Responded = false;
    $scope.confirmV2Busy = false;
    $scope.confirmTransactionV2 = function () {
        $scope.confirmV2Busy = true;
        $scope.confirmV2Responded = false;
        abonOpService.confirmTransactionV2($scope.confirmTransactionV2Model)
            .then(function (response) {
                if (response) {
                    $scope.ConfirmV2RequestDateTimeUTC = response.RequestDateTimeUTC;
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.ConfirmV2ServiceRequest = JSON.stringify(response.ServiceRequest, null, 4);
                    $scope.sequenceConfirmV2 = response.Sequence;
                    $scope.ConfirmV2ResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.ConfirmV2ServiceResponse = JSON.stringify(response.ServiceResponse, null, 4);
                }
                $scope.confirmV2Busy = false;
                $scope.confirmV2Responded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.curlConfirmResponded = false;
    $scope.curlConfirmBusy = false;
    $scope.getCurlConfirmTransaction = function () {
        $scope.curlConfirmBusy = true;
        $scope.curlConfirmResponded = false;
        abonOpService.getCurlConfirmTransaction($scope.confirmTransactionModel)
            .then(function (response) {
                if (response) {
                    $scope.CurlResponseConfirmTransaction = response;
                }
                $scope.curlConfirmBusy = false;
                $scope.curlConfirmResponded = true;
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
                    $scope.errorRequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.errorResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.errorSequence = response.Sequence;
                    $scope.errorRequestCopy = JSON.stringify(response.ServiceRequest, null, 4);
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.errorResponse = JSON.stringify(response.ServiceResponse, null, 4);
                    $scope.errorRequest = JSON.stringify(response.ServiceRequest, null, 4);
                }
                $scope.currentErrorCode = errCode;
                $scope.errorValidateResponded = true;
                $scope.errorValidateServiceBusy = false;
            }, (err) => {

                console.log(err);
                console.log("error");
            });
    }

    $scope.currentConfirmErrorCode = 0;
    $scope.errorConfirmResponded = false;
    $scope.errorConfirmServiceBusy = false;
    $scope.confirmSimulateError = (errCode) => {
        $scope.errorConfirmResponded = false;
        $scope.errorConfirmServiceBusy = true;
        abonOpService.confirmSimulateError(errCode)
            .then(function (response) {
                if (response) {
                    $scope.errorConfirmRequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.errorConfirmResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.errorConfirmSequence = response.Sequence;
                    $scope.errorConfirmRequestCopy = JSON.stringify(response.ServiceRequest, null, 4);
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.errorConfirmResponse = JSON.stringify(response.ServiceResponse, null, 4);
                    $scope.errorConfirmRequest = JSON.stringify(response.ServiceRequest, null, 4);
                }
                $scope.currentConfirmErrorCode = errCode;
                $scope.errorConfirmResponded = true;
                $scope.errorConfirmServiceBusy = false;
            }, () => {
                console.log("error");
            });
    }

    $scope.checkStatusAuthorizationOptionChanged = function () {
        if ($scope.select.CheckStatusUseAuthorization == 1 && $scope.checkStatusCouponModel.partnerId == $scope.partnerIds.AbonOnlinePartnerId) {
            $scope.checkStatusCouponModel.partnerId = $scope.partnerIds.AbonOnlinePartnerIdWithoutAuthorization;
            $scope.confirmTransactionV2Model.partnerId = $scope.partnerIds.AbonOnlinePartnerIdWithoutAuthorization;
            $rootScope.showGritter("", "PartnerId changed in CheckStatus and ConfirmTransaction to PartnerId that uses abon authorization");
        } else if ($scope.select.CheckStatusUseAuthorization == 2 && $scope.checkStatusCouponModel.partnerId == $scope.partnerIds.AbonOnlinePartnerIdWithoutAuthorization) {
            $scope.checkStatusCouponModel.partnerId = $scope.partnerIds.AbonOnlinePartnerId;
            $scope.confirmTransactionV2Model.partnerId = $scope.partnerIds.AbonOnlinePartnerId;
            $rootScope.showGritter("", "PartnerId changed in CheckStatus and ConfirmTransaction to PartnerId that dosen't use abon authorization");
        }
    }
   

    $scope.createMultipleServiceBusy = false;
    $scope.abon = {};
    $scope.createAndSaveCoupons = function () {
        $scope.createMultipleServiceBusy = true;
        abonOpService.createAndSaveCoupons($scope.abon.selectedAbonCountry.partnerId)
            .then(function (response) {
                var denominations = "";
                response.forEach(x => denominations += x + "\n");
                $scope.saveDonominations(denominations);
            }, () => {
                console.log("error");
                $scope.createMultipleServiceBusy = false;
            });
    }

    $scope.getDenominations = function () {
        abonOpService.getDenominations($scope.abon.selectedAbonCountry.partnerId)
            .then(function (response) {
                if (response) {
                    $scope.abons = response;
                }
            }, () => {
                console.log("error");
            });
    }

    $scope.saveDonominations = function (textToWrite) {
        let denominationsAsBlob = new Blob([textToWrite], { type: 'text/plain' });
        let downloadLink = document.createElement('a');
        downloadLink.download = "Denominations.txt";
        downloadLink.innerHTML = 'Download File';

        if (window.webkitURL != null) {
            downloadLink.href = window.webkitURL.createObjectURL(
                denominationsAsBlob
            );
        } else {
            downloadLink.href = window.URL.createObjectURL(denominationsAsBlob);
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
        }

        downloadLink.click();
        $scope.createMultipleServiceBusy = false;
    }

    $scope.setDefaults = function () {
        $scope.abon_countries = [
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

        $scope.abon.selectedAbonCountry = $scope.abon_countries[0];
    }

    $scope.setDefaults();
    $scope.getDenominations();

    $scope.errorExamples = {
        ValidateTransaction: {
            error1: {
                request: {
                    "couponCode": "6377944739582437",
                    "providerId": "5d2f43e4-c9b6-4a46-b08e-28037d027e0c",
                    "signature": "LhnJdwM0V5..."
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
                    "providerId": "e9fb671b-154e-4918-9788-84b6758fb082",
                    "signature": "PZjSOXZS/c..."
                },
                response: {
                    "code": 2,
                    "message": "Invalid Signature",
                    "additionalData": null
                }
            },
            error3: {
                request: {
                    "couponCode": "OQ4VTTXHO15QD621",
                    "providerId": "e9fb671b-154e-4918-9788-84b6758fb082",
                    "signature": "aociUqcF48..."
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
            },
            error7: {
                request: {
                    "couponCode": "1437861149152627",
                    "providerId": "e9fb671b-154e-4918-9788-84b6758fb082",
                    "signature": "HYoeiGKvpB..."
                },
                response: {
                    "code": 7,
                    "message": "Coupon Country Not Allowed",
                    "additionalData": null
                }
            }
        },
        ConfirmTransaction: {
            error1: {
                request: {
                    "couponCode": "6377944739582437",
                    "providerId": "7562aad0-aa14-4095-b73e-48170d4191cf",
                    "providerTransactionId": "13569d0e-8dfe-48a4-bd51-2d46b8968252",
                    "userId": "32789507-dac4-4a90-aaa2-98398bfc501a",
                    "signature": "Lo3AV/4d3s..."
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
                    "providerId": "e9fb671b-154e-4918-9788-84b6758fb082",
                    "providerTransactionId": "9c75b26b-b600-4f02-93de-45f4b6fff057",
                    "userId": "940a81aa-5696-4c1b-bbb0-80698ccf092e",
                    "signature": "MbtBc0O1OM..."
                },
                response: {
                    "code": 2,
                    "message": "Invalid Signature",
                    "additionalData": null
                }
            },
            error3: {
                request: {
                    "couponCode": "S4S152QJK6E83HC1",
                    "providerId": "e9fb671b-154e-4918-9788-84b6758fb082",
                    "providerTransactionId": "3c4c8d91-c8dd-43ae-835b-aca46eaa2a36",
                    "userId": "b8970b7a-22c6-4ba2-b866-bec9b8a2437f",
                    "signature": "IVdIC3iKNp..."
                },
                response: {
                    "code": 3,
                    "message": "Invalid coupon code.",
                    "additionalData": null
                }
            },
            error4: {
                request: {
                    "couponCode": "2981361437471469",
                    "providerId": "e9fb671b-154e-4918-9788-84b6758fb082",
                    "providerTransactionId": "ce44cff1-41f5-4610-be3d-5054293be353",
                    "userId": "750ce21e-7ce4-4ead-9e5b-5961e684e4c9",
                    "signature": "W5kU1chS2J..."
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
            },
            error7: {
                request: {
                    "couponCode": "1437861149152627",
                    "providerId": "e9fb671b-154e-4918-9788-84b6758fb082",
                    "providerTransactionId": "b6b215e6-379b-4b1f-8bad-0831be6489d3",
                    "userId": "32d2c793-a059-4743-89a4-7cefc00e4411",
                    "signature": "GE5/ex9iPk..."
                },
                response: {
                    "code": 7,
                    "message": "Coupon Country Not Allowed",
                    "additionalData": null
                }
            },
            error9: {
                request: {
                    "couponCode": "6377944739582437",
                    "providerId": "e9fb671b-154e-4918-9788-84b6758fb082",
                    "providerTransactionId": "228d8b14-675a-4ca8-afb9-8a995ed4c591",
                    "userId": "1a2b8324-e8d4-496d-a119-b571583668c7",
                    "signature": "dmNEmxcf/4..."
                },
                response: {
                    "code": 9,
                    "message": "Limit exceeded",
                    "additionalData": null
                }
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
                isoCurrency: "HRK",
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
        validateCouponWithAutorization: {
            requestExample: {
                "couponCode": "5460446045144493",
                "partnerId": "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                "partnerTransactionId": "4a4d9e48-77ca-4144-844b-cfe535af6a5c",
                "phoneNumber": "385981234567",
                "userId": "123",  
                "parameters": [
                    {
                        "Key": "PayerFirstName",
                        "Value": "John"
                    },
                    {
                        "Key": "PayerLastName",
                        "Value": "Doe"
                    },
                    {
                        "Key": "PayerBirthDate",
                        "Value": "1990-01-01"
                    },
                    {
                        "Key": "PersonalIdentificationCode",
                        "Value": "RSSMRAURTMLARSNL"
                    }
                ],
                "notificationUrl": "https://dev-simulator-api.aircash.eu/api/AbonOnlinePartner/AuthorizationNotification",
                "signature": "AtztaUw2Mj..."
            },
            responseExample: {
                "couponValue": 50,
                "status": 1,
                "isoCurrency": "HRK",
                "originalISOCurrency": "EUR",
                "originalCouponValue": 50,
                "currentCouponValue": 50,
                "aircashUserId": "ccc1b67f-c871-45ff-9226-81b9e84d07a0"
            },
            errorResponseExample: {
                "code": 4,
                "message": "coupon_already_used",
                "additionalData": {
                    "couponSerialNumber": "8088767004276952",
                    "couponValue": 50,
                    "isoCurrency": "EUR",
                    "partnerTransactionId": "b7159ef2-edfd-44b4-9c35-ee5b1079f132"
                }
            }
        },
        confirmTransaction: {
            requestExample: {
                "couponCode": "2326186935891516",
                "providerId": "e9fb671b-154e-4918-9788-84b6758fb082",
                "providerTransactionId": "e126aa6b-0073-4e5f-bb3c-9eeefb6d392f",
                "userId": "4149ba7d-e4f7-4c77-8393-d03e6691c03b",
                "signature": "eOplj4Cgfm..."
            },
            responseExample: {
                "couponValue": 50,
                "isoCurrency": "EUR",
                "providerTransactionId": "e126aa6b-0073-4e5f-bb3c-9eeefb6d392f",
                "salePartnerId": "52f46879-294d-4904-be7e-368ab0161771",
                "isoCountryCode": null
            },
            errorResponseExample: {
                code: 4,
                message: "Coupon Already Used",
                additionalData: {
                    couponValue: 50.0,
                    isoCurrency: "HRK",
                    providerTransactionId: "33352406-f672-4c27-a415-e26eb3ecd691",
                }
            }
        },
        confirmTransactionWithAutorization: {
            requestExample: {
                "couponCode": "2326186935891516",
                "partnerId": "e9fb671b-154e-4918-9788-84b6758fb082",
                "partnerTransactionId": "e126aa6b-0073-4e5f-bb3c-9eeefb6d392f",
                "userId": "4149ba7d-e4f7-4c77-8393-d03e6691c03b",
                "signature": "XJAit8JDaJ..."
            },
            responseExample: {
                "couponValue": 50,
                "isoCurrency": "EUR",
                "partnerTransactionId": "e126aa6b-0073-4e5f-bb3c-9eeefb6d392f",
                "salePartnerId": "52f46879-294d-4904-be7e-368ab0161771",
                "couponCode": "2326186935891516",
                "couponSerialNumber": "9874772993339010"
            },
            errorResponseExample: {
                "code": 4,
                "message": "coupon_already_used",
                "additionalData": {
                    "couponSerialNumber": "8088767004276952",
                    "couponValue": 50,
                    "isoCurrency": "EUR",
                    "partnerTransactionId": "b7159ef2-edfd-44b4-9c35-ee5b1079f132"
                }
            }
        }
    };


}]);
