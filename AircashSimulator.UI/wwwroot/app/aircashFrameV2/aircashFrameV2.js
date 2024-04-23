var acFrameV2Module = angular.module('acFrameV2', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.aircashFrameV2', {
            data: {
                pageTitle: 'Aircash Frame V2'
            },
            url: "/aircashFrameV2",
            controller: 'acFrameV2Ctrl',
            templateUrl: 'app/aircashFrameV2/aircashFrameV2.html?v=' + Global.appVersion
        });
});

acFrameV2Module.service("acFrameV2Service", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        initiateRedirectCheckout: initiateRedirectCheckout,
        initiateWindowCheckout: initiateWindowCheckout,
        transactionStatus: transactionStatus,
        transactionStatusV2: transactionStatusV2,
        transactionStatusV3: transactionStatusV3,
        getCurlTransactionStatus: getCurlTransactionStatus,
        getCurlTransactionStatusV2: getCurlTransactionStatusV2,
        getCurlTransactionStatusV3: getCurlTransactionStatusV3,
        initiateSimulateError: initiateSimulateError,
        transactionStatusSimulateError: transactionStatusSimulateError,
        transactionStatusV2SimulateError: transactionStatusV2SimulateError,

        cancelPayoutSimulateError: cancelPayoutSimulateError,
        cancelPayout: cancelPayout,
        getCurlCancelPayout: getCurlCancelPayout,
        getCurlConfirmPayout: getCurlConfirmPayout,
        confirmPayout: confirmPayout,
        confirmSimulateError: confirmSimulateError,

        createAndSaveCoupons: createAndSaveCoupons,
        getDenominations: getDenominations,
    });

    function initiateRedirectCheckout(initiateModel, matchParameters) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/InitiateV2",
            data: {
                PartnerId: initiateModel.partnerId,
                UserId: initiateModel.partnerUserId,
                NotificationUrl: initiateModel.notificationUrl,
                PayType: initiateModel.payType,
                PayMethod: initiateModel.payMethod,
                Amount: initiateModel.amount,
                PartnerTransactionId: initiateModel.partnerTransactionId,
                Currency: initiateModel.currency,
                Locale: initiateModel.locale,
                SuccessUrl: initiateModel.successUrl,
                DeclineUrl: initiateModel.declineUrl,
                CancelUrl: initiateModel.cancelUrl,
                OriginUrl: initiateModel.originUrl,
                matchParameters: matchParameters
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
                OriginUrl: originUrl
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function transactionStatus(transactionModel) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/TransactionStatusFrameV2",
            data: {
                TransactionId: transactionModel.transactionId,
                PartnerId: transactionModel.partnerId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function transactionStatusV2(transactionModel) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/TransactionStatusV2FrameV2",
            data: {
                TransactionId: transactionModel.transactionId,
                PartnerId: transactionModel.partnerId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function transactionStatusV3(transactionModel) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/TransactionStatusV3FrameV2",
            data: {
                TransactionId: transactionModel.transactionId,
                PartnerId: transactionModel.partnerId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function getCurlTransactionStatus(transactionModel) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/GetCurlTransactionStatusFrameV2",
            data: {
                TransactionId: transactionModel.transactionId,
                PartnerId: transactionModel.partnerId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function getCurlTransactionStatusV2(transactionModel) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/GetCurlTransactionStatusV2FrameV2",
            data: {
                TransactionId: transactionModel.transactionId,
                PartnerId: transactionModel.partnerId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function getCurlTransactionStatusV3(transactionModel) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/GetCurlTransactionStatusV3FrameV2",
            data: {
                TransactionId: transactionModel.transactionId,
                PartnerId: transactionModel.partnerId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function initiateSimulateError(errorCode) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/InitiateSimulateError",
            data: errorCode

        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function transactionStatusSimulateError(errorCode) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/TransactionStatusSimulateError",
            data: errorCode

        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function transactionStatusV2SimulateError(errorCode) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/TransactionStatusV2SimulateError",
            data: errorCode

        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function confirmPayout(confirmModel) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/ConfirmPayoutFrameV2",
            data: {
                PartnerId: confirmModel.partnerId,
                PartnerTransactionId: confirmModel.transactionId,
                CurrencyId: parseInt(confirmModel.currencyId),
                Amount: confirmModel.amount
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function getCurlConfirmPayout(confirmModel) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/GetCurlConfirmPayoutFrameV2",
            data: {
                PartnerId: confirmModel.partnerId,
                PartnerTransactionId: confirmModel.transactionId,
                CurrencyId: parseInt(confirmModel.currencyId),
                Amount: confirmModel.amount
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function confirmSimulateError(errorCode) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/ConfirmSimulateError",
            data: errorCode

        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function cancelPayoutSimulateError(errorCode) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/CancelPayoutSimulateError",
            data: errorCode

        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function cancelPayout(cancelModel) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/CancelPayoutFrameV2",
            data: {
                PartnerId: cancelModel.partnerId,
                PartnerTransactionId: cancelModel.transactionId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function getCurlCancelPayout(cancelModel) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/GetCurlCancelPayoutFrameV2",
            data: {
                PartnerId: cancelModel.partnerId,
                PartnerTransactionId: cancelModel.transactionId
            }
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

acFrameV2Module.controller("acFrameV2Ctrl", ['$scope', '$location', '$state', '$filter', 'HelperService', 'acFrameV2Service', '$http', 'JwtParser', '$uibModal', '$rootScope', '$window', '$localStorage', 'config', function ($scope, $location, $state, $filter, HelperService, acFrameV2Service, $http, JwtParser, $uibModal, $rootScope, $window, $localStorage, config) {
    
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    $scope.partnerIds = JSON.parse($scope.decodedToken.partnerIdsDTO);
    if ($scope.partnerRoles.indexOf("AircashFrameV2Withdrawal") == -1 && $scope.partnerRoles.indexOf("AircashFrameV2Abon") == -1 && $scope.partnerRoles.indexOf("AircashFrameV2AcPay") == -1) {
        $location.path('/forbidden');
    }
    $scope.copyToClipboard = function (data) {
        navigator.clipboard.writeText(data);
    }
    //$scope.successUrl = "https://localhost:44317/#!/success";
    //$scope.declineUrl = "https://localhost:44317/#!/decline";
    //$scope.cancelUrl = "https://localhost:44317/#!/decline";
    //$scope.originUrl = "https://localhost:44317";

    $scope.currencyOptions = [
        {
            currencyIsoCode: "EUR",
            currencyId: 978
        },
        {
            currencyIsoCode: "BAM",
            currencyId: 977
        },
        {
            currencyIsoCode: "RON",
            currencyId: 946
        },
        {
            currencyIsoCode: "CHF",
            currencyId: 756
        },
    ];

    $scope.payMethodOptions = [
        {
            name: "Abon",
            code: 0
        },
        {
            name: "AcPay",
            code: 2
        },
        {
            name: "Payout",
            code: 10
        }
    ];

    $scope.payTypeOptions = [
        {
            name: "Payment",
            code: 0
        },
        {
            name: "Payout",
            code: 1
        }
    ];

    //dont change------------
    $scope.initiateModels = [
        {
            name: "Aircash Pay",
            payType: 0,
            payMethod: 2,
            amount: 10,
        },
        {
            name: "Abon deposit",
            payType: 0,
            payMethod: 0,
            amount: 0,
        },
        {
            name: "Aircash withdrawal",
            payType: 1,
            payMethod: 10,
            amount: 10,
        }
    ];
    //-----------------------------

    $scope.config = {};
    $scope.config.useMatchPersonalData = false;
    $scope.config.sendPhoneNumber = false;

    $scope.initiateModelSelected = {};
    $scope.initiateModel = {};
    $scope.initate = {};
    $scope.initiateModelSelected.data = $scope.initiateModels[0];

    $scope.transactionModel = {};
    $scope.transactionModelV2 = {};
    $scope.transactionModelV3 = {};

    $scope.confirmModel = {};
    $scope.cancelModel = {};

    $scope.setInititateModel = function () {
        $scope.initiateModel.payType = $scope.initiateModelSelected.data.payType;
        $scope.initiateModel.payMethod = $scope.initiateModelSelected.data.payMethod;
        $scope.initiateModel.amount = $scope.initiateModelSelected.data.amount;
        $scope.config.useMatchPersonalData = false;
        $scope.initiateModel.firstName = "";
        $scope.initiateModel.lastName = "";
        if ($scope.initiateModelSelected.data.payType == 0 && $scope.initiateModelSelected.data.payMethod == 2) {
            $scope.initate.sequenceExample = "Amount=100&CancelUrl=&CurrencyId=978&DeclineUrl=&Locale=en-US&NotificationUrl=https://aircash.eu&OriginUrl=&PartnerId=8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf&PartnerTransactionId=1a74bb41-36fe-4493-9ccf-30879b994766&PartnerUserId=574f32a7-4ecb-48b2-9723-ac660b9c835d&PayMethod=2&PayType=0&SuccessUrl=";
        } else if ($scope.initiateModelSelected.data.payType == 0 && $scope.initiateModelSelected.data.payMethod == 0) {
            $scope.initate.sequenceExample = "Amount=100&CancelUrl=&CurrencyId=978&DeclineUrl=&Locale=en-US&NotificationUrl=https://aircash.eu&OriginUrl=&PartnerId=8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf&PartnerTransactionId=1a74bb41-36fe-4493-9ccf-30879b994766&PartnerUserId=574f32a7-4ecb-48b2-9723-ac660b9c835d&PayMethod=0&PayType=0&SuccessUrl=";
        } else {
            $scope.initate.sequenceExample = "Amount=100&CancelUrl=&CurrencyId=978&DeclineUrl=&Locale=en-US&NotificationUrl=https://aircash.eu&OriginUrl=&PartnerId=8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf&PartnerTransactionId=1a74bb41-36fe-4493-9ccf-30879b994766&PartnerUserId=574f32a7-4ecb-48b2-9723-ac660b9c835d&PayMethod=10&PayType=1&SuccessUrl=";
        }
    };


    $scope.useMatchPersonalDataChanged = function () {
        if ($scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData != $scope.partnerIds.AircashFramePartnerId) {
            if ($scope.config.useMatchPersonalData && $scope.initiateModel.partnerId == $scope.partnerIds.AircashFramePartnerId) {
                $scope.initiateModel.partnerId = $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData;
                $scope.confirmModel.partnerId = $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData;
                $scope.cancelModel.partnerId = $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData;
                $scope.transactionModel.partnerId = $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData;
                $scope.transactionModelV2.partnerId = $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData;
                $scope.transactionModelV3.partnerId = $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData;
                $rootScope.showGritter("", "PartnerId changed to PartnerId that uses match personal data");
            } else if (!$scope.config.useMatchPersonalData && $scope.initiateModel.partnerId == $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData) {
                $scope.initiateModel.partnerId = $scope.partnerIds.AircashFramePartnerId;
                $scope.confirmModel.partnerId = $scope.partnerIds.AircashFramePartnerId;
                $scope.cancelModel.partnerId = $scope.partnerIds.AircashFramePartnerId;
                $scope.transactionModel.partnerId = $scope.partnerIds.AircashFramePartnerId;
                $scope.transactionModelV2.partnerId = $scope.partnerIds.AircashFramePartnerId;
                $scope.transactionModelV3.partnerId = $scope.partnerIds.AircashFramePartnerId;
                $rootScope.showGritter("", "PartnerId changed to PartnerId that dosen't uses match personal data");
            }
        }
    }

    $scope.setDefaultInitiateModel = function () {
        $scope.locale.languageInput = "en";
        $scope.locale.countryISOCodeInput = "HR"

        $scope.initiateModel.partnerId = $scope.config.useMatchPersonalData ? $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData : $scope.partnerIds.AircashFramePartnerId;
        $scope.initiateModel.partnerUserId = HelperService.NewGuid();
        $scope.initiateModel.notificationUrl = config.baseUrl +"AircashFrame/NotificationCashierFrameV2";
        $scope.initiateModel.partnerTransactionId = HelperService.NewGuid();
        $scope.initiateModel.currency = 978;
        $scope.initiateModel.locale = $scope.locale.languageInput.toLowerCase() + "-" + $scope.locale.countryISOCodeInput.toUpperCase();
        $scope.initiateModel.successUrl = $location.absUrl().replace($location.url(), "/success");
        $scope.initiateModel.declineUrl = $location.absUrl().replace($location.url(), "/decline");
        $scope.initiateModel.cancelUrl = $location.absUrl().replace($location.url(), "/cancel");
        $scope.initiateModel.originUrl = "";
        $scope.initiateModel.phoneNumber = "";

        $scope.confirmModel.partnerId = $scope.config.useMatchPersonalData ? $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData : $scope.partnerIds.AircashFramePartnerId;
        $scope.confirmModel.currencyId = 978;
        $scope.cancelModel.partnerId = $scope.config.useMatchPersonalData ? $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData : $scope.partnerIds.AircashFramePartnerId;
        $scope.transactionModel.partnerId = $scope.config.useMatchPersonalData ? $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData : $scope.partnerIds.AircashFramePartnerId;
        $scope.transactionModelV2.partnerId = $scope.config.useMatchPersonalData ? $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData : $scope.partnerIds.AircashFramePartnerId;
        $scope.transactionModelV3.partnerId = $scope.config.useMatchPersonalData ? $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData : $scope.partnerIds.AircashFramePartnerId;
    }

    $scope.transactionId;

    $scope.showFrame = function () {
        $("#frameModal").modal("show");
    }

    $scope.setDefaults = function () {
        $scope.busy = false;
    };
    $scope.locale = {
        languageInput: "en",
        countryISOCodeInput: "HR"
    }


    $scope.initiateResponded = false;
    $scope.initiateBusy = false;
    $scope.initiateRedirectCheckout = function () {
        $scope.initiateBusy = true;
        $scope.initiateResponded = false;
        matchParameters = [];
        if ($scope.config.useMatchPersonalData) {
            matchParameters = [
                {
                    key: "PayerFirstName",
                    value: $scope.initiateModel.firstName
                },
                {
                    key: "PayerLastName",
                    value: $scope.initiateModel.lastName
                },
                {
                    key: "PayerBirthDate",
                    value: $scope.initiateModel.birthDate.toLocaleDateString('en-CA')
                }
            ];
        } else if ($scope.config.sendPhoneNumber){
            matchParameters.push(
                {
                    key: "PartnerUserPhoneNumber",
                    value: $scope.initiateModel.phoneNumber
                }
            );
        }
        $scope.showButtonCopyUrl = false;
        $scope.initiateModel.locale = $scope.locale.languageInput.toLowerCase() + "-" + $scope.locale.countryISOCodeInput.toUpperCase();
        acFrameV2Service.initiateRedirectCheckout($scope.initiateModel, matchParameters)
            .then(function (response) {
                if (response) {
                    console.log(response);
                    $scope.InitiateRequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.InitiateResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.sequenceInitiate = response.Sequence;
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.InitiateServiceRequest = JSON.stringify(response.ServiceRequest, null, 4);
                    $scope.InitiateServiceResponse = JSON.stringify(response.ServiceResponse, null, 4);
                    $scope.InitiateServiceResponseObject = response.ServiceResponse;
                    $scope.showButtonCopyUrl = false;
                    if ($scope.InitiateServiceResponseObject.Url != undefined) {
                        $scope.showButtonCopyUrl = true;
                    }

                    //$scope.getRedirectModal(response.ServiceResponse.TransactionId);
                    /*new AircashFrame.WindowCheckout({
                        transactionId: response.ServiceResponse.TransactionId,
                        onSuccess: $scope.onSuccess,
                        onDecline: $scope.onDecline,
                        onCancel: $scope.onCancel,
                        originUrl: "https://localhost:44317/",
                        debug: true
                    });*/

                }
                $scope.initiateBusy = false;
                $scope.initiateResponded = true;
            }, () => {
                $scope.showButtonCopyUrl = false;
                $scope.initiateBusy = false;
                console.log("error");
            });
    };

    $scope.onSuccess = function (obj) {
        $rootScope.showGritter("Success");
    };

    $scope.onDecline = function (obj) {

    };

    $scope.onCancel = function (obj) {

    };

    $scope.currentInitiateErrorCode = 0;
    $scope.errorInitiateResponded = false;
    $scope.errorInitiateServiceBusy = false;
    $scope.initiateSimulateError = (errCode) => {
        $scope.currentInitiateErrorCode = 0;
        $scope.errorInitiateResponded = false;
        $scope.errorInitiateServiceBusy = true;
        acFrameV2Service.initiateSimulateError(errCode)
            .then(function (response) {
                if (response) {
                    $scope.errorInitiateRequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.errorInitiateResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.errorInitiateSequence = response.Sequence;
                    $scope.errorInitiateRequestCopy = JSON.stringify(response.ServiceRequest, null, 4);
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.errorInitiateResponse = JSON.stringify(response.ServiceResponse, null, 4);
                    $scope.errorInitiateRequest = JSON.stringify(response.ServiceRequest, null, 4);
                }
                $scope.currentInitiateErrorCode = errCode;
                $scope.errorInitiateResponded = true;
                $scope.errorInitiateServiceBusy = false;
            }, (err) => {

                console.log(err);
                console.log("error");
            });
    }


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
    $scope.transactionStatus = function () {
        $scope.statusBusy = true;
        $scope.statusResponded = false;
        acFrameV2Service.transactionStatus($scope.transactionModel)
            .then(function (response) {
                if (response) {
                    $scope.StatusRequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.StatusResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.sequenceStatus = response.Sequence;
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.StatusServiceRequest = JSON.stringify(response.ServiceRequest, null, 4);
                    if (response.ServiceResponse.Signature) {
                        response.ServiceResponse.Signature = response.ServiceResponse.Signature.substring(0, 10) + "...";
                    }
                    $scope.StatusServiceResponse = JSON.stringify(response.ServiceResponse, null, 4);
                }
                $scope.statusBusy = false;
                $scope.statusResponded = true;
            }, () => {
                console.log("error");
            });
    }
    $scope.curlStatusResponded = false;
    $scope.curlStatusBusy = false;
    $scope.getCurlTransactionStatus = function () {
        $scope.curlStatusBusy = true;
        $scope.curlStatusResponded = false;
        acFrameV2Service.getCurlTransactionStatus($scope.transactionModel)
            .then(function (response) {
                if (response) {
                    $scope.CurlStatusServiceResponse = response;
                }
                $scope.curlStatusBusy = false;
                $scope.curlStatusResponded = true;
            }, () => {
                console.log("error");
            });
    }
    $scope.transactionStatusV2 = function () {
        $scope.statusV2Busy = true;
        $scope.statusV2Responded = false;
        $scope.StatusV2ServiceResponseSequence = null;
        acFrameV2Service.transactionStatusV2($scope.transactionModelV2)
            .then(function (response) {
                if (response) {
                    $scope.StatusV2RequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.StatusV2ResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.sequenceStatusV2 = response.Sequence;
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.StatusV2ServiceRequest = JSON.stringify(response.ServiceRequest, null, 4);
                    if (response.ServiceResponse.ResponseObject && response.ServiceResponse.ResponseObject.Signature) {
                        response.ServiceResponse.ResponseObject.Signature = response.ServiceResponse.ResponseObject.Signature.substring(0, 10) + "...";
                        $scope.StatusV2ServiceResponse = JSON.stringify(response.ServiceResponse.ResponseObject, null, 4);
                        $scope.StatusV2ServiceResponseSequence = response.ServiceResponse.ResponseSequence;
                    } else {
                        $scope.StatusV2ServiceResponse = JSON.stringify(response.ServiceResponse, null, 4);;
                    }

                }
                $scope.statusV2Busy = false;
                $scope.statusV2Responded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.curlStatusV2Responded = false;
    $scope.curlStatusV2Busy = false;
    $scope.getCurlTransactionStatusV2 = function () {
        $scope.curlStatusV2Busy = true;
        $scope.curlStatusV2Responded = false;
        acFrameV2Service.getCurlTransactionStatusV2($scope.transactionModelV2)
            .then(function (response) {
                if (response) {
                    $scope.CurlStatusV2ServiceResponse = response;
                }
                $scope.curlStatusV2Busy = false;
                $scope.curlStatusV2Responded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.statusV3Busy = false;
    $scope.statusV3Responded = false;
    $scope.transactionStatusV3 = function () {
        $scope.statusV3Busy = true;
        $scope.statusV3Responded = false;
        $scope.StatusV3ServiceResponseSequence = null;
        acFrameV2Service.transactionStatusV3($scope.transactionModelV3)
            .then(function (response) {
                if (response) {
                    $scope.StatusV3RequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.StatusV3ResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.sequenceStatusV3 = response.Sequence;
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.StatusV3ServiceRequest = JSON.stringify(response.ServiceRequest, null, 4);
                    if (response.ServiceResponse.ResponseObject && response.ServiceResponse.ResponseObject.Signature) {
                        response.ServiceResponse.ResponseObject.Signature = response.ServiceResponse.ResponseObject.Signature.substring(0, 10) + "...";
                        $scope.StatusV3ServiceResponse = JSON.stringify(response.ServiceResponse.ResponseObject, null, 4);
                        $scope.StatusV3ServiceResponseSequence = response.ServiceResponse.ResponseSequence;
                    } else {
                        $scope.StatusV3ServiceResponse = JSON.stringify(response.ServiceResponse, null, 4);;
                    }

                }
                $scope.statusV3Busy = false;
                $scope.statusV3Responded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.curlStatusV3Responded = false;
    $scope.curlStatusV3Busy = false;
    $scope.getCurlTransactionStatusV3 = function () {
        $scope.curlStatusV3Busy = true;
        $scope.curlStatusV3Responded = false;
        acFrameV2Service.getCurlTransactionStatusV3($scope.transactionModelV3)
            .then(function (response) {
                if (response) {
                    $scope.CurlStatusV3ServiceResponse = response;
                }
                $scope.curlStatusV3Busy = false;
                $scope.curlStatusV3Responded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.currentTransactionStatusErrorCode = 0;
    $scope.errorTransactionStatusResponded = false;
    $scope.errorTransactionStatusServiceBusy = false;
    $scope.transactionStatusSimulateError = (errCode) => {
        $scope.currentTransactionStatusErrorCode = 0;
        $scope.errorTransactionStatusResponded = false;
        $scope.errorTransactionStatusServiceBusy = true;
        acFrameV2Service.transactionStatusSimulateError(errCode)
            .then(function (response) {
                if (response) {
                    $scope.errorTransactionStatusRequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.errorTransactionStatusResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.errorTransactionStatusSequence = response.Sequence;
                    $scope.errorTransactionStatusRequestCopy = JSON.stringify(response.ServiceRequest, null, 4);
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.errorTransactionStatusResponse = JSON.stringify(response.ServiceResponse, null, 4);
                    $scope.errorTransactionStatusRequest = JSON.stringify(response.ServiceRequest, null, 4);
                }
                $scope.currentTransactionStatusErrorCode = errCode;
                $scope.errorTransactionStatusResponded = true;
                $scope.errorTransactionStatusServiceBusy = false;
            }, (err) => {

                console.log(err);
                console.log("error");
            });
    }

    $scope.currentTransactionStatusV2V2ErrorCode = 0;
    $scope.errorTransactionStatusV2Responded = false;
    $scope.errorTransactionStatusV2ServiceBusy = false;
    $scope.transactionStatusV2SimulateError = (errCode) => {
        $scope.currentTransactionStatusV2ErrorCode = 0;
        $scope.errorTransactionStatusV2Responded = false;
        $scope.errorTransactionStatusV2ServiceBusy = true;
        acFrameV2Service.transactionStatusV2SimulateError(errCode)
            .then(function (response) {
                if (response) {
                    $scope.errorTransactionStatusV2RequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.errorTransactionStatusV2ResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.errorTransactionStatusV2Sequence = response.Sequence;
                    $scope.errorTransactionStatusV2RequestCopy = JSON.stringify(response.ServiceRequest, null, 4);
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.errorTransactionStatusV2Response = JSON.stringify(response.ServiceResponse, null, 4);
                    $scope.errorTransactionStatusV2Request = JSON.stringify(response.ServiceRequest, null, 4);
                }
                $scope.currentTransactionStatusV2ErrorCode = errCode;
                $scope.errorTransactionStatusV2Responded = true;
                $scope.errorTransactionStatusV2ServiceBusy = false;
            }, (err) => {

                console.log(err);
                console.log("error");
            });
    }

    $scope.confirmResponded = false;
    $scope.confirmBusy = false;
    $scope.confirmPayout = function () {
        $scope.confirmBusy = true;
        $scope.confirmResponded = false;
        acFrameV2Service.confirmPayout($scope.confirmModel)
            .then(function (response) {
                if (response) {
                    $scope.ConfirmRequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.ConfirmResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.sequenceConfirm = response.Sequence;
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.ConfirmServiceRequest = JSON.stringify(response.ServiceRequest, null, 4);
                    if (response.ServiceResponse.Signature) {
                        response.ServiceResponse.Signature = response.ServiceResponse.Signature.substring(0, 10) + "...";
                    }
                    $scope.ConfirmServiceResponse = JSON.stringify(response.ServiceResponse, null, 4);
                }
                $scope.confirmBusy = false;
                $scope.confirmResponded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.curlConfirmResponded = false;
    $scope.curlConfirmBusy = false;
    $scope.getCurlConfirmPayout = function () {
        $scope.curlConfirmBusy = true;
        $scope.curlConfirmResponded = false;
        acFrameV2Service.getCurlConfirmPayout($scope.confirmModel)
            .then(function (response) {
                if (response) {
                    $scope.CurlConfirmPayoutResponse = response;
                }
                $scope.curlConfirmResponded = true;
                $scope.curlConfirmBusy = false;
            }, () => {
                console.log("error");
            });
    }

    $scope.currentConfirmErrorCode = 0;
    $scope.errorConfirmResponded = false;
    $scope.errorConfirmServiceBusy = false;
    $scope.confirmSimulateError = (errCode) => {
        $scope.currentConfirmErrorCode = 0;
        $scope.errorConfirmResponded = false;
        $scope.errorConfirmServiceBusy = true;
        acFrameV2Service.confirmSimulateError(errCode)
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
            }, (err) => {

                console.log(err);
                console.log("error");
            });
    }

    $scope.cancelBusy = false;
    $scope.cancelResponded = false;
    $scope.cancelPayout = function () {
        $scope.cancelBusy = true;
        $scope.cancelResponded = false;
        acFrameV2Service.cancelPayout($scope.cancelModel)
            .then(function (response) {
                if (response) {
                    $scope.CancelRequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.CancelResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.sequenceCancel = response.Sequence;
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.CancelServiceRequest = JSON.stringify(response.ServiceRequest, null, 4);
                    if (response.ServiceResponse.Signature) {
                        response.ServiceResponse.Signature = response.ServiceResponse.Signature.substring(0, 10) + "...";
                    }
                    $scope.CancelServiceResponse = JSON.stringify(response.ServiceResponse, null, 4);
                }
                $scope.cancelBusy = false;
                $scope.cancelResponded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.curlCancelBusy = false;
    $scope.curlCancelResponded = false;
    $scope.getCurlCancelPayout = function () {
        $scope.curlCancelBusy = true;
        $scope.curlCancelResponded = false;
        acFrameV2Service.getCurlCancelPayout($scope.cancelModel)
            .then(function (response) {
                if (response) {
                    $scope.CurlCancelPayoutResponse = response;
                }
                $scope.curlCancelResponded = true;
                $scope.curlCancelBusy = false;
            }, () => {
                console.log("error");
            });
    }

    $scope.currentCancelErrorCode = 0;
    $scope.errorCancelResponded = false;
    $scope.errorCancelServiceBusy = false;
    $scope.cancelPayoutSimulateError = (errCode) => {
        $scope.currentCancelErrorCode = 0;
        $scope.errorCancelResponded = false;
        $scope.errorCancelServiceBusy = true;
        acFrameV2Service.cancelPayoutSimulateError(errCode)
            .then(function (response) {
                if (response) {
                    $scope.errorCancelRequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.errorCancelResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.errorCancelSequence = response.Sequence;
                    $scope.errorCancelRequestCopy = JSON.stringify(response.ServiceRequest, null, 4);
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.errorCancelResponse = JSON.stringify(response.ServiceResponse, null, 4);
                    $scope.errorCancelRequest = JSON.stringify(response.ServiceRequest, null, 4);
                }
                $scope.currentCancelErrorCode = errCode;
                $scope.errorCancelResponded = true;
                $scope.errorCancelServiceBusy = false;
            }, (err) => {

                console.log(err);
                console.log("error");
            });
    }

    $scope.setDate = function (date) {
        $scope.initiateModel.birthDate = date;
    }

    $scope.setDefaultInitiateModel();

    $scope.setDefaults();

    $scope.showVideoWithdrawal = function () {
        $("#videoModalWithdrawal").modal("show");
    }

    $scope.createMultipleServiceBusy = false;
    $scope.abon = {};
    $scope.createAndSaveCoupons = function () {
        $scope.createMultipleServiceBusy = true;
        acFrameV2Service.createAndSaveCoupons($scope.abon.selectedAbonCountry.partnerId)
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
        acFrameV2Service.getDenominations($scope.abon.selectedAbonCountry.partnerId)
            .then(function (response) {
                if (response) {
                    $scope.abons = response;
                    console.log(response)
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
    $scope.getDenominations();

    $scope.errorExamples = {
        Initiate: {
            error1: {
                request: {
                    "PartnerId": "c02142bb-b5d4-4c40-9c85-ca90bd0f1fba",
                    "PartnerUserId": "a3876902-b3e4-4557-aace-a57a506e38ca",
                    "PartnerTransactionId": "622e7787-afa8-4ae0-adad-d356e8f91164",
                    "Amount": 10,
                    "CurrencyId": 978,
                    "PayType": 1,
                    "PayMethod": 10,
                    "NotificationUrl": "https://aircash.eu",
                    "SuccessUrl": null,
                    "DeclineUrl": null,
                    "CancelUrl": null,
                    "OriginUrl": "https://aircash.eu",
                    "Locale": "en-HR",
                    "Signature": "elhPTBJ/hH..."
                },
                response: {
                    "Code": 1,
                    "Message": "Invalid signature or partner id."
                }
            },
            error3: {
                request: {
                    "PartnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "PartnerUserId": "a3876902-b3e4-4557-aace-a57a506e38ca",
                    "PartnerTransactionId": "aa1ccf34-cd9c-4f31-84c6-10e9130ad231",
                    "Amount": 10,
                    "CurrencyId": 978,
                    "PayType": 1,
                    "PayMethod": 10,
                    "NotificationUrl": "https://aircash.eu",
                    "SuccessUrl": null,
                    "DeclineUrl": null,
                    "CancelUrl": null,
                    "OriginUrl": "https://aircash.eu",
                    "Locale": "",
                    "Signature": "Qlh2vKRfvQ..."
                },
                response: {
                    "Code": 3,
                    "Message": "Locale cannot be empty."
                }
            },
            error1004: {
                request: {
                    "PartnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "PartnerUserId": "a3876902-b3e4-4557-aace-a57a506e38ca",
                    "PartnerTransactionId": "c456eee8-ccaa-4c10-b6e9-7f8c9ca3d2d8",
                    "Amount": 10,
                    "CurrencyId": 978,
                    "PayType": 1,
                    "PayMethod": 10,
                    "NotificationUrl": "https://aircash.eu",
                    "SuccessUrl": null,
                    "DeclineUrl": null,
                    "CancelUrl": null,
                    "OriginUrl": "https://aircash.eu",
                    "Locale": "en-HR",
                    "Signature": "MnfnyRyBEF..."
                },
                response: {
                    "Code": 1004,
                    "Message": "Partner transaction already exists."
                }
            },
            error3000: {
                request: {
                    "PartnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "PartnerUserId": "a3876902-b3e4-4557-aace-a57a506e38ca",
                    "PartnerTransactionId": "21f2098d-471f-4d5c-a68b-a855dc52d5b4",
                    "Amount": 10,
                    "CurrencyId": 191,
                    "PayType": 1,
                    "PayMethod": 10,
                    "NotificationUrl": "https://aircash.eu",
                    "SuccessUrl": null,
                    "DeclineUrl": null,
                    "CancelUrl": null,
                    "OriginUrl": "https://aircash.eu",
                    "Locale": "en-HR",
                    "Signature": "dZiRP20OMA..."
                },
                response: {
                    "Code": 3000,
                    "Message": "Invalid currency."
                }
            }

        },
        TransactionStatus: {
            error1: {
                request: {
                    "PartnerId": "fbea7431-e796-4472-8689-afddc013e723",
                    "PartnerTransactionId": "fd9d8fce-6548-4cb1-839b-57a599984b8f",
                    "Signature": "KLzsXlvjAW..."
                },
                response: {
                    "Code": 1,
                    "Message": "Invalid signature or partner id."
                }
            },
            error3: {
                request: {},
                response: {}
            },
            error1002: {
                request: {
                    "PartnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "PartnerTransactionId": "c6935dce-1e91-434f-93b6-bbaa2a270b29",
                    "Signature": "Se0NO0yJaZ..."
                },
                response: {
                    "Code": 1002,
                    "Message": "Transaction doesn't exist."
                }
            },
            error1003: {
                request: {
                    "PartnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "PartnerTransactionId": "fad535bd-c413-4434-851f-fb2ebce7da06",
                    "Signature": "Ba+zwZ9OxE..."
                },
                response: {
                    "Code": 1003,
                    "Message": "Transaction not processed."
                }
            }
        },
        TransactionStatusV2: {
            error1: {
                request: {
                    "PartnerId": "fbea7431-e796-4472-8689-afddc013e723",
                    "PartnerTransactionId": "fd9d8fce-6548-4cb1-839b-57a599984b8f",
                    "Signature": "KLzsXlvjAW..."
                },
                response: {
                    "Code": 1,
                    "Message": "Invalid signature or partner id."
                }
            },
            error3: {
                request: {},
                response: {}
            },
            error1002: {
                request: {
                    "PartnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "PartnerTransactionId": "c6935dce-1e91-434f-93b6-bbaa2a270b29",
                    "Signature": "Se0NO0yJaZ..."
                },
                response: {
                    "Code": 1002,
                    "Message": "Transaction doesn't exist."
                }
            },
            error1003: {
                request: {
                    "PartnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "PartnerTransactionId": "fad535bd-c413-4434-851f-fb2ebce7da06",
                    "Signature": "Ba+zwZ9OxE..."
                },
                response: {
                    "Code": 1003,
                    "Message": "Transaction not processed."
                }
            }
        },
        Confirm: {
            error1: {
                request: {
                    "PartnerId": "8db69a48-7d61-48e7-9be8-3160549c7f17",
                    "PartnerTransactionId": "0fea9fbc-939f-4010-88c2-44a6ef0ac9f4",
                    "Amount": 10,
                    "CurrencyId": 978,
                    "Signature": "os0+rv9Mwp..."
                },
                response: {
                    "Code": 1,
                    "Message": "Invalid signature or partner id."
                }
            },
            error1000: {
                request: {
                    "PartnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "PartnerTransactionId": "60526f94-9d61-482f-b577-8c92a551da5d",
                    "Amount": 10,
                    "CurrencyId": 978,
                    "Signature": "Nv62frlxIJ..."
                },
                response: {
                    "Code": 1000,
                    "Message": "Transaction doesn't exist or it is already processed."
                }
            },
            error1005: {
                request: {
                    "PartnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "PartnerTransactionId": "6f68fa9f-065e-43a0-b8d2-4760f94f9ea3",
                    "Amount": 10,
                    "CurrencyId": 978,
                    "Signature": "uFLUm25tf1..."
                },
                response: {
                    "Code": 1005,
                    "Message": "Transaction confirmation not allowed. Wrong PayType/PayMethod or status not allowed."
                }
            },
            error3000: {
                request: {
                    "PartnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "PartnerTransactionId": "0fea9fbc-939f-4010-88c2-44a6ef0ac9f4",
                    "Amount": 10,
                    "CurrencyId": 977,
                    "Signature": "IOWErWP7eP..."
                },
                response: {
                    "Code": 3000,
                    "Message": "Invalid currency."
                }
            },
            error3016: {
                request: {
                    "PartnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "PartnerTransactionId": "0fea9fbc-939f-4010-88c2-44a6ef0ac9f4",
                    "Amount": 12,
                    "CurrencyId": 978,
                    "Signature": "DavAirjGS6..."
                },
                response: {
                    "Code": 3016,
                    "Message": "Amount mismatch."
                }
            }
        },
        CancelPayout: {
            error1: {
                request: {
                    "PartnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "PartnerTransactionId": "aa17d623-e8c0-4e40-8a5a-bba7e0852455",
                    "Signature": "lpF2sp9..."
                },
                response: {
                    "Code": 1,
                    "Message": "Invalid signature or partner id."
                }
            },
            error1000: {
                request: {
                    "PartnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "PartnerTransactionId": "60526f94-9d61-482f-b577-8c92a551da5d",
                    "Signature": "Nv62frlxIJ..."
                },
                response: {
                    "Code": 1000,
                    "Message": "Transaction doesn't exist or it is already processed."
                }
            }
        }
    }

    $scope.aircashFrameV2 = {
        initiate: {
            requestExamplePay: {
                "CustomParameters": [
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
                    }
                ],
                PartnerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                PartnerUserId: "574f32a7-4ecb-48b2-9723-ac660b9c835d",
                PartnerTransactionId: "1a74bb41-36fe-4493-9ccf-30879b994766",
                Amount: 100,
                CurrencyId: 978,
                PayType: 0,
                PayMethod: 2,
                NotificationUrl: "https://aircash.eu",
                SuccessUrl: null,
                DeclineUrl: null,
                CancelUrl: null,
                OriginUrl: null,
                Locale: "en-US",
                Signature: "tc5NZjj7hO..."
            },
            requestExampleAbon: {
                "CustomParameters": [
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
                    }
                ],
                PartnerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                PartnerUserId: "574f32a7-4ecb-48b2-9723-ac660b9c835d",
                PartnerTransactionId: "1a74bb41-36fe-4493-9ccf-30879b994766",
                Amount: 100,
                CurrencyId: 978,
                PayType: 0,
                PayMethod: 0,
                NotificationUrl: "https://aircash.eu",
                SuccessUrl: null,
                DeclineUrl: null,
                CancelUrl: null,
                OriginUrl: null,
                Locale: "en-US",
                Signature: "tc5NZjj7hO..."
            },
            requestExampleWithdrawal: {
                "CustomParameters": [
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
                    }
                ],
                PartnerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                PartnerUserId: "574f32a7-4ecb-48b2-9723-ac660b9c835d",
                PartnerTransactionId: "1a74bb41-36fe-4493-9ccf-30879b994766",
                Amount: 100,
                CurrencyId: 978,
                PayType: 1,
                PayMethod: 10,
                NotificationUrl: "https://aircash.eu",
                SuccessUrl: null,
                DeclineUrl: null,
                CancelUrl: null,
                OriginUrl: null,
                Locale: "en-US",
                Signature: "tc5NZjj7hO..."
            },
            responseExample: {
                TransactionId: "e22cd71a-276e-47e1-b7af-3d3a504e0ef9",
                Url: "https://stage-frame.aircash.eu/e22cd71a-276e-47e1-b7af-3d3a504e0ef9"
            },
            errorResponseExample: {
                Code: 1,
                Message: "Invalid ProviderId",
                AdditionalData: null
            }
        },
        transactionStatus: {
            requestExample: {
                "PartnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                "PartnerTransactionId": "571fd959-fe70-412b-90d5-e6db6df953ea",
                "Signature": "JmdPLkrzTZ..."
            },
            responseExample: {
                "Status": 2,
                "Amount": 10,
                "CurrencyId": 978,
                "AircashTransactionId": "11da2e60-f35e-43a9-be63-26cf34b12e3b",
                "Signature": "SsRvc7uHsL..."
            },
            errorResponseExample: {
                Code: 1003,
                Message: "Transaction not processed",
                AdditionalData: null
            }
        },
        transactionStatusV2: {
            requestExample: {
                "PartnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                "PartnerTransactionId": "571fd959-fe70-412b-90d5-e6db6df953ea",
                "Signature": "JmdPLkrzTZ..."
            },
            responseExample: {
                "Status": 2,
                "Amount": 10,
                "CurrencyId": 978,
                "AircashTransactionId": "11da2e60-f35e-43a9-be63-26cf34b12e3b",
                "Parameters": [{
                    Key: "AircashUserID",
                    Value: "ccc1b67f-c871-45ff-9226-81b9e84d07a0"
                }],
                "Signature": "mGkC7OpmRf..."
            },
            errorResponseExample: {
                Code: 1003,
                Message: "Transaction not processed",
                AdditionalData: null
            }
        },
        transactionStatusV3: {
            responseExample:
            {

                "Status": 1,
                "CurrencyId": 978,
                "AircashTransactionId": "95ff5846-f10c-4870-bcf1-e5a0014d0e37",
                "Parameters": [{
                    Key: "AircashUserID",
                    Value: "ccc1b67f-c871-45ff-9226-81b9e84d07a0"
                }],
                "Events": [
                    {
                        "DateTimeUTC": "2023-09-01T06:07:38",
                        "Description": "Frame is initiated by user.",
                        "Code": 100
                    },
                    {
                        "DateTimeUTC": "2023-09-01T06:07:43",
                        "Description": "QR code is generated and displayed to user.",
                        "Code": 101
                    },
                    {
                        "DateTimeUTC": "2023-09-01T06:07:59",
                        "Description": "The user is not active with phone number: 385*******00",
                        "Code": 103
                    }
                ],
                "Signature": "Y7hXZ90VSu...",
            }
        },
        confirm: {
            requestExample: {
                PartnerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                PartnerTransactionId: "1a74bb41-36fe-4493-9ccf-30879b994766",
                Amount: 100,
                CurrencyId: 978,
                Signature: "jBMpdollER..."
            },
            responseExample: {
                AircashTransactionId: "b74854c8-db9d-48d7-985a-59f587637a75"
            },
        },
        cancelPayout: {
            requestExample: {
                PartnerId: "5680e089-9e86-4105-b1a2-acd0cd77653c",
                PartnerTransactionId: "aa17d623-e8c0-4e40-8a5a-bba7e0852455",
                Signature: "lpF2sp9..."
            },
            responseExample: {
                AircashTransactionId: "4e32079c-4f2d-47e5-90a0-d0eb81c69670"
            },
        }
    };

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