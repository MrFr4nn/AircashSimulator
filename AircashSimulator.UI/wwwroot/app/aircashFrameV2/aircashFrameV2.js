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
        transactionStatus: transactionStatus,
        getCurlTransactionStatus: getCurlTransactionStatus,
        getCurlConfirmPayout: getCurlConfirmPayout,
        confirmPayout: confirmPayout,
        initiateSimulateError: initiateSimulateError,
        confirmSimulateError: confirmSimulateError,
        transactionStatusSimulateError: transactionStatusSimulateError,
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
                OriginUrl:originUrl
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

    function initiateSimulateError(errorCode) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/InitiateSimulateError",
            data: errorCode

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

    function transactionStatusSimulateError(errorCode) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/TransactionStatusSimulateError",
            data: errorCode

        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

acFrameV2Module.controller("acFrameV2Ctrl", ['$scope', '$location', '$state', '$filter', 'HelperService', 'acFrameV2Service', '$http', 'JwtParser', '$uibModal', '$rootScope', '$window', '$localStorage', 'config', function ($scope, $location, $state, $filter, HelperService, acFrameV2Service, $http, JwtParser, $uibModal, $rootScope, $window, $localStorage, config) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    $scope.partnerIds = JSON.parse($scope.decodedToken.partnerIdsDTO);
    $scope.environment = $scope.decodedToken.enviroment;
    if ($scope.partnerRoles.indexOf("AircashFrameV2") == -1) {
        $location.path('/forbidden');
    }

    console.log($scope.partnerIds);
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

    $scope.initiateModels =[
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

    $scope.config = {};
    $scope.config.useMatchPersonalData = false;

    $scope.initiateModelSelected = {};
    $scope.initiateModel = {};
    $scope.initiateModelSelected.data = $scope.initiateModels[0];

    $scope.transactionModel = {};
    $scope.confirmModel = {};

    $scope.setInititateModel = function () {
        $scope.initiateModel.payType = $scope.initiateModelSelected.data.payType;
        $scope.initiateModel.payMethod = $scope.initiateModelSelected.data.payMethod;
        $scope.initiateModel.amount = $scope.initiateModelSelected.data.amount;
        $scope.config.useMatchPersonalData = false;
        $scope.initiateModel.firstName = "";
        $scope.initiateModel.lastName = "";
    };

    $scope.setInititateModel();

    $scope.setDefaultInitiateModel = function () {
        $scope.locale.languageInput = "en";
        $scope.locale.countryISOCodeInput = "HR"

        $scope.initiateModel.partnerId = $scope.config.useMatchPersonalData ? $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData : $scope.partnerIds.AircashFramePartnerId;
        $scope.initiateModel.partnerUserId = HelperService.NewGuid();
        $scope.initiateModel.notificationUrl = $location.absUrl();
        $scope.initiateModel.partnerTransactionId = HelperService.NewGuid();
        $scope.initiateModel.currency = 978;
        $scope.initiateModel.locale = $scope.locale.languageInput.toLowerCase() + "-" + $scope.locale.countryISOCodeInput.toUpperCase();
        $scope.initiateModel.successUrl = $location.absUrl().replace($location.url(), "/success");
        $scope.initiateModel.declineUrl = $location.absUrl().replace($location.url(), "/decline");
        $scope.initiateModel.cancelUrl = $location.absUrl().replace($location.url(), "/cancel");
        $scope.initiateModel.originUrl = "";

        $scope.confirmModel.partnerId = $scope.config.useMatchPersonalData ? $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData : $scope.partnerIds.AircashFramePartnerId;
        $scope.confirmModel.currencyId = 978;
        $scope.transactionModel.partnerId = $scope.config.useMatchPersonalData ? $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData : $scope.partnerIds.AircashFramePartnerId;
    }

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
        }
        $scope.showButtonCopyUrl = false;
        $scope.initiateModel.locale = $scope.locale.languageInput.toLowerCase() + "-" + $scope.locale.countryISOCodeInput.toUpperCase();
        acFrameV2Service.initiateRedirectCheckout($scope.initiateModel, matchParameters)
            .then(function (response) {
                if (response) {
                    $scope.InitiateRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.InitiateResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.sequenceInitiate = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.InitiateServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.InitiateServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.InitiateServiceResponseObject = response.serviceResponse;
                    $scope.showButtonCopyUrl = false;
                    if ($scope.InitiateServiceResponseObject.url != undefined) {
                        $scope.showButtonCopyUrl = true;
                    }

                    //$scope.getRedirectModal(response.serviceResponse.transactionId);
                    /*new AircashFrame.WindowCheckout({
                        transactionId: response.serviceResponse.transactionId,
                        onSuccess: $scope.onSuccess,
                        onDecline: $scope.onDecline,
                        onCancel: $scope.onCancel,
                        originUrl: "https://localhost:44317/",
                        debug: true
                    });*/

                    $scope.getTransactions(true);
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


    $scope.confirmResponded = false;
    $scope.confirmBusy = false;
    $scope.confirmPayout = function () {
        $scope.confirmBusy = true;
        $scope.confirmResponded = false;
        acFrameV2Service.confirmPayout($scope.confirmModel)
            .then(function (response) {
                if (response) {
                    $scope.ConfirmRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.ConfirmResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.sequenceConfirm = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.ConfirmServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                    if (response.serviceResponse.signature) {
                        response.serviceResponse.signature = response.serviceResponse.signature.substring(0, 10) + "...";
                    }
                    $scope.ConfirmServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
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
                    $scope.errorInitiateRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.errorInitiateResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.errorInitiateSequence = response.sequence;
                    $scope.errorInitiateRequestCopy = JSON.stringify(response.serviceRequest, null, 4);
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.errorInitiateResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.errorInitiateRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.currentInitiateErrorCode = errCode;
                $scope.errorInitiateResponded = true;
                $scope.errorInitiateServiceBusy = false;
            }, (err) => {

                console.log(err);
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
                    $scope.errorConfirmRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.errorConfirmResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.errorConfirmSequence = response.sequence;
                    $scope.errorConfirmRequestCopy = JSON.stringify(response.serviceRequest, null, 4);
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.errorConfirmResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.errorConfirmRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.currentConfirmErrorCode = errCode;
                $scope.errorConfirmResponded = true;
                $scope.errorConfirmServiceBusy = false;
            }, (err) => {

                console.log(err);
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
                    $scope.errorTransactionStatusRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.errorTransactionStatusResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.errorTransactionStatusSequence = response.sequence;
                    $scope.errorTransactionStatusRequestCopy = JSON.stringify(response.serviceRequest, null, 4);
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.errorTransactionStatusResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.errorTransactionStatusRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.currentTransactionStatusErrorCode = errCode;
                $scope.errorTransactionStatusResponded = true;
                $scope.errorTransactionStatusServiceBusy = false;
            }, (err) => {

                console.log(err);
                console.log("error");
            });
    }

    $scope.loadMore = function (pageSize) {
        $scope.pageSize = pageSize;
        $scope.getTransactions();
    };

    $scope.setDate = function (date) {
        $scope.initiateModel.birthDate = date;
    }

    $scope.setDefaultInitiateModel();

    $scope.setDefaults();

    $scope.getTransactions();

    $scope.showVideoAcPay = function () {
        $("#videoModalAcPay").modal("show");
    }

    $scope.showVideoAbon = function () {
        $("#videoModalAbon").modal("show");
    }

    $scope.showVideoWithdrawal = function () {
        $("#videoModalWithdrawal").modal("show");
    }

    $scope.errorExamples = {
        Initiate: {
            error1: {
                request: {
                    "partnerId": "c02142bb-b5d4-4c40-9c85-ca90bd0f1fba",
                    "partnerUserId": "a3876902-b3e4-4557-aace-a57a506e38ca",
                    "partnerTransactionId": "622e7787-afa8-4ae0-adad-d356e8f91164",
                    "amount": 10,
                    "currencyId": 978,
                    "payType": 1,
                    "payMethod": 10,
                    "notificationUrl": "https://aircash.eu",
                    "successUrl": "",
                    "declineUrl": "",
                    "cancelUrl": "",
                    "originUrl": "https://aircash.eu",
                    "locale": "en-HR",
                    "signature": "elhPTBJ/hH..."
                },
                response: {
                    "code": 1,
                    "message": "Invalid signature or partner id."
                }
            },
            error3: {
                request: {
                    "partnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "partnerUserId": "a3876902-b3e4-4557-aace-a57a506e38ca",
                    "partnerTransactionId": "aa1ccf34-cd9c-4f31-84c6-10e9130ad231",
                    "amount": 10,
                    "currencyId": 978,
                    "payType": 1,
                    "payMethod": 10,
                    "notificationUrl": "https://aircash.eu",
                    "successUrl": "",
                    "declineUrl": "",
                    "cancelUrl": "",
                    "originUrl": "https://aircash.eu",
                    "locale": "",
                    "signature": "Qlh2vKRfvQ..."
                },
                response: {
                    "code": 3,
                    "message": "Locale cannot be empty."
                }
            },
            error1004: {
                request: {
                    "partnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "partnerUserId": "a3876902-b3e4-4557-aace-a57a506e38ca",
                    "partnerTransactionId": "c456eee8-ccaa-4c10-b6e9-7f8c9ca3d2d8",
                    "amount": 10,
                    "currencyId": 978,
                    "payType": 1,
                    "payMethod": 10,
                    "notificationUrl": "https://aircash.eu",
                    "successUrl": "",
                    "declineUrl": "",
                    "cancelUrl": "",
                    "originUrl": "https://aircash.eu",
                    "locale": "en-HR",
                    "signature": "MnfnyRyBEF..."
                },
                response: {
                    "code": 1004,
                    "message": "Partner transaction already exists."
                }
            },
            error3000: {
                request: {
                    "partnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "partnerUserId": "a3876902-b3e4-4557-aace-a57a506e38ca",
                    "partnerTransactionId": "21f2098d-471f-4d5c-a68b-a855dc52d5b4",
                    "amount": 10,
                    "currencyId": 191,
                    "payType": 1,
                    "payMethod": 10,
                    "notificationUrl": "https://aircash.eu",
                    "successUrl": "",
                    "declineUrl": "",
                    "cancelUrl": "",
                    "originUrl": "https://aircash.eu",
                    "locale": "en-HR",
                    "signature": "dZiRP20OMA..."
                },
                response: {
                    "code": 3000,
                    "message": "Invalid currency."
                }
            }

        },
        TransactionStatus: {
            error1: {
                request: {
                    "partnerId": "fbea7431-e796-4472-8689-afddc013e723",
                    "partnerTransactionId": "fd9d8fce-6548-4cb1-839b-57a599984b8f",
                    "signature": "KLzsXlvjAW..."
                },
                response: {
                    "code": 1,
                    "message": "Invalid signature or partner id."
                }
            },
            error3: {
                request: {},
                response: {}
            },
            error1002: {
                request: {
                    "partnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "partnerTransactionId": "c6935dce-1e91-434f-93b6-bbaa2a270b29",
                    "signature": "Se0NO0yJaZ..."
                },
                response: {
                    "code": 1002,
                    "message": "Transaction doesn't exist."
                }
            },
            error1003: {
                request: {
                    "partnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "partnerTransactionId": "fad535bd-c413-4434-851f-fb2ebce7da06",
                    "signature": "Ba+zwZ9OxE..."
                },
                response: {
                    "code": 1003,
                    "message": "Transaction not processed."
                }
            }
        },
        Confirm: {
            error1000: {
                request: {
                    "partnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "partnerTransactionId": "60526f94-9d61-482f-b577-8c92a551da5d",
                    "amount": 10,
                    "currencyId": 978,
                    "signature": "Nv62frlxIJ..."
                },
                response: {
                    "code": 1000,
                    "message": "Transaction doesn't exist or it is already processed."
                }
            },
            error1005: {
                request: {
                    "partnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "partnerTransactionId": "6f68fa9f-065e-43a0-b8d2-4760f94f9ea3",
                    "amount": 10,
                    "currencyId": 978,
                    "signature": "uFLUm25tf1..."
                },
                response: {
                    "code": 1005,
                    "message": "Transaction confirmation not allowed. Wrong PayType/PayMethod or status not allowed."
                }
            },
            error3016: {
                request: {
                    "partnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    "partnerTransactionId": "0fea9fbc-939f-4010-88c2-44a6ef0ac9f4",
                    "amount": 12,
                    "currencyId": 978,
                    "signature": "DavAirjGS6..."
                },
                response: {
                    "code": 3016,
                    "message": "Amount mismatch."
                }
            }
        }

    }

    $scope.aircashFrameV2 = {
        initiate: {
            requestExample: {
                partnerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerUserId: "574f32a7-4ecb-48b2-9723-ac660b9c835d",
                partnerTransactionId: "1a74bb41-36fe-4493-9ccf-30879b994766",
                amount: 100,
                currencyId: 978,
                payType: 0,
                payMethod: 2,
                notificationUrl: "https://aircash.eu",
                successUrl: null,
                declineUrl: null,
                cancelUrl: null,
                originUrl: null,
                locale: "en-US",
                signature: "tc5NZjj7hO..."
            },
            responseExample: {
                transactionId: "e22cd71a-276e-47e1-b7af-3d3a504e0ef9",
                url: "https://stage-frame.aircash.eu/e22cd71a-276e-47e1-b7af-3d3a504e0ef9"
            },
            errorResponseExample: {
                code: 1,
                message: "Invalid ProviderId",
                additionalData: null
            }
        },
        transactionStatus: {
            requestExample: {
                "partnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                "partnerTransactionId": "571fd959-fe70-412b-90d5-e6db6df953ea",
                "signature": "JmdPLkrzTZ..."
            },
            responseExample: {
                "status": 2,
                "amount": 10,
                "currencyId": 978,
                "aircashTransactionId": "11da2e60-f35e-43a9-be63-26cf34b12e3b",
                "signature": "SsRvc7uHsL..."
            },
            errorResponseExample: {
                code: 1003,
                message: "Transaction not processed",
                additionalData: null
            }
        },
        transactionStatusV2: {
            requestExample: {
                "partnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
                "partnerTransactionId": "571fd959-fe70-412b-90d5-e6db6df953ea",
                "signature": "JmdPLkrzTZ..."
            },
            responseExample: {
                "status": 2,
                "amount": 10,
                "currencyId": 978,
                "aircashTransactionId": "11da2e60-f35e-43a9-be63-26cf34b12e3b",
                "parameters": [{
                    Key: "AircashUserID",
                    Value: "ccc1b67f-c871-45ff-9226-81b9e84d07a0"
                }],
                "signature": "ljkUcvi4iM..."
            },
            errorResponseExample: {
                code: 1003,
                message: "Transaction not processed",
                additionalData: null
            }
        },
        confirm: {
            requestExample: {
                partnerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionId: "1a74bb41-36fe-4493-9ccf-30879b994766",
                amount: 100,
                currencyId: 978,
                signature: "jBMpdollER..."
            },
            responseExample: {
                aircashTransactionId: "b74854c8-db9d-48d7-985a-59f587637a75"
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