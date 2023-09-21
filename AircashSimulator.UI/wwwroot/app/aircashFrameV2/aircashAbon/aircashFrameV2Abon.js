var acFrameV2AbonModule = angular.module('acFrameV2Abon', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.acFrameV2Abon', {
            data: {
                pageTitle: 'Aircash business site'
            },
            url: "/ac_frame_Abon",
            controller: 'acFrameV2AbonCtrl',
            templateUrl: 'app/aircashFrameV2/aircashAbon/aircashFrameV2Abon.html?v=' + Global.appVersion
        });
});
acFrameV2AbonModule.service("acFrameV2AbonService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
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
    }
]);
acFrameV2AbonModule.controller("acFrameV2AbonCtrl",
    ['$scope', '$location', '$state', '$filter', 'HelperService', 'acFrameV2AbonService', '$http', 'JwtParser', '$uibModal', '$rootScope', '$window', '$localStorage', 'config',
        function ($scope, $location, $state, $filter, HelperService, acFrameV2AbonService, $http, JwtParser, $uibModal, $rootScope, $window, $localStorage, config) {
            $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
            $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
            $scope.partnerIds = JSON.parse($scope.decodedToken.partnerIdsDTO);
            if ($scope.partnerRoles.indexOf("AircashFrameV2Abon") == -1) {
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

            $scope.initiateModels = [
                {
                    name: "Abon deposit",
                    payType: 0,
                    payMethod: 0,
                    amount: 0,
                }
            ];

            $scope.config = {};
            $scope.config.useMatchPersonalData = false;

            $scope.initiateModelSelected = {};
            $scope.initiateModel = {};
            $scope.initiateModelSelected.data = $scope.initiateModels[0];

            $scope.transactionModel = {};
            $scope.transactionModelV2 = {};
            $scope.transactionModelV3 = {};

            $scope.setInititateModel = function () {
                $scope.initiateModel.payType = $scope.initiateModelSelected.data.payType;
                $scope.initiateModel.payMethod = $scope.initiateModelSelected.data.payMethod;
                $scope.initiateModel.amount = $scope.initiateModelSelected.data.amount;
                $scope.config.useMatchPersonalData = false;
                $scope.initiateModel.firstName = "";
                $scope.initiateModel.lastName = "";
            };

            $scope.setInititateModel();

            $scope.useMatchPersonalDataChanged = function () {
                if ($scope.config.useMatchPersonalData && $scope.initiateModel.partnerId == $scope.partnerIds.AircashFramePartnerId) {
                    $scope.initiateModel.partnerId = $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData;
                    $scope.transactionModel.partnerId = $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData;
                    $scope.transactionModelV2.partnerId = $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData;
                    $scope.transactionModelV3.partnerId = $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData;
                    $rootScope.showGritter("", "PartnerId changed to PartnerId that uses match personal data");
                } else if (!$scope.config.useMatchPersonalData && $scope.initiateModel.partnerId == $scope.partnerIds.AircashFramePartnerIdWithMatchPersonalData) {
                    $scope.initiateModel.partnerId = $scope.partnerIds.AircashFramePartnerId;
                    $scope.transactionModel.partnerId = $scope.partnerIds.AircashFramePartnerId;
                    $scope.transactionModelV2.partnerId = $scope.partnerIds.AircashFramePartnerId;
                    $scope.transactionModelV3.partnerId = $scope.partnerIds.AircashFramePartnerId;
                    $rootScope.showGritter("", "PartnerId changed to PartnerId that dosen't uses match personal data");
                }
            }

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
                }
                $scope.showButtonCopyUrl = false;
                $scope.initiateModel.locale = $scope.locale.languageInput.toLowerCase() + "-" + $scope.locale.countryISOCodeInput.toUpperCase();
                acFrameV2AbonService.initiateRedirectCheckout($scope.initiateModel, matchParameters)
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
                acFrameV2AbonService.initiateSimulateError(errCode)
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
                acFrameV2AbonService.transactionStatus($scope.transactionModel)
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
                acFrameV2AbonService.getCurlTransactionStatus($scope.transactionModel)
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
                acFrameV2AbonService.transactionStatusV2($scope.transactionModelV2)
                    .then(function (response) {
                        if (response) {
                            $scope.StatusV2RequestDateTimeUTC = response.requestDateTimeUTC;
                            $scope.StatusV2ResponseDateTimeUTC = response.responseDateTimeUTC;
                            $scope.sequenceStatusV2 = response.sequence;
                            response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                            $scope.StatusV2ServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                            if (response.serviceResponse.responseObject && response.serviceResponse.responseObject.signature) {
                                response.serviceResponse.responseObject.signature = response.serviceResponse.responseObject.signature.substring(0, 10) + "...";
                                $scope.StatusV2ServiceResponse = JSON.stringify(response.serviceResponse.responseObject, null, 4);
                                $scope.StatusV2ServiceResponseSequence = response.serviceResponse.responseSequence;
                            } else {
                                $scope.StatusV2ServiceResponse = JSON.stringify(response.serviceResponse, null, 4);;
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
                acFrameV2AbonService.getCurlTransactionStatusV2($scope.transactionModelV2)
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
                acFrameV2AbonService.transactionStatusV3($scope.transactionModelV3)
                    .then(function (response) {
                        if (response) {
                            $scope.StatusV3RequestDateTimeUTC = response.requestDateTimeUTC;
                            $scope.StatusV3ResponseDateTimeUTC = response.responseDateTimeUTC;
                            $scope.sequenceStatusV3 = response.sequence;
                            response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                            $scope.StatusV3ServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                            if (response.serviceResponse.responseObject && response.serviceResponse.responseObject.signature) {
                                response.serviceResponse.responseObject.signature = response.serviceResponse.responseObject.signature.substring(0, 10) + "...";
                                $scope.StatusV3ServiceResponse = JSON.stringify(response.serviceResponse.responseObject, null, 4);
                                $scope.StatusV3ServiceResponseSequence = response.serviceResponse.responseSequence;
                            } else {
                                $scope.StatusV3ServiceResponse = JSON.stringify(response.serviceResponse, null, 4);;
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
                acFrameV2AbonService.getCurlTransactionStatusV3($scope.transactionModelV3)
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
                acFrameV2AbonService.transactionStatusSimulateError(errCode)
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

            $scope.currentTransactionStatusV2V2ErrorCode = 0;
            $scope.errorTransactionStatusV2Responded = false;
            $scope.errorTransactionStatusV2ServiceBusy = false;
            $scope.transactionStatusV2SimulateError = (errCode) => {
                $scope.currentTransactionStatusV2ErrorCode = 0;
                $scope.errorTransactionStatusV2Responded = false;
                $scope.errorTransactionStatusV2ServiceBusy = true;
                acFrameV2AbonService.transactionStatusV2SimulateError(errCode)
                    .then(function (response) {
                        if (response) {
                            $scope.errorTransactionStatusV2RequestDateTimeUTC = response.requestDateTimeUTC;
                            $scope.errorTransactionStatusV2ResponseDateTimeUTC = response.responseDateTimeUTC;
                            $scope.errorTransactionStatusV2Sequence = response.sequence;
                            $scope.errorTransactionStatusV2RequestCopy = JSON.stringify(response.serviceRequest, null, 4);
                            response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                            $scope.errorTransactionStatusV2Response = JSON.stringify(response.serviceResponse, null, 4);
                            $scope.errorTransactionStatusV2Request = JSON.stringify(response.serviceRequest, null, 4);
                        }
                        $scope.currentTransactionStatusV2ErrorCode = errCode;
                        $scope.errorTransactionStatusV2Responded = true;
                        $scope.errorTransactionStatusV2ServiceBusy = false;
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

            $scope.showVideoAbon = function () {
                $("#videoModalAbon").modal("show");
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
                            "successUrl": null,
                            "declineUrl": null,
                            "cancelUrl": null,
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
                            "successUrl": null,
                            "declineUrl": null,
                            "cancelUrl": null,
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
                            "successUrl": null,
                            "declineUrl": null,
                            "cancelUrl": null,
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
                            "successUrl": null,
                            "declineUrl": null,
                            "cancelUrl": null,
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
                TransactionStatusV2: {
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
            }

            $scope.aircashFrameV2 = {
                initiate: {
                    requestExample: {
                        "customParameters": [
                            {
                                "key": "PayerFirstName",
                                "value": "John"
                            },
                            {
                                "key": "PayerLastName",
                                "value": "Doe"
                            },
                            {
                                "key": "PayerBirthDate",
                                "value": "1990-01-01"
                            }
                        ],
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
                        "signature": "mGkC7OpmRf..."
                    },
                    errorResponseExample: {
                        code: 1003,
                        message: "Transaction not processed",
                        additionalData: null
                    }
                },
                transactionStatusV3: {
                    responseExample:
                    {

                        "status": 1,
                        "currencyId": 978,
                        "aircashTransactionId": "95ff5846-f10c-4870-bcf1-e5a0014d0e37",
                        "parameters": [],
                        "events": [
                            {
                                "dateTimeUTC": "2023-09-01T06:07:38",
                                "description": "Frame is initiated by user.",
                                "code": 100
                            },
                            {
                                "dateTimeUTC": "2023-09-01T06:07:43",
                                "description": "QR code is generated and displayed to user.",
                                "code": 101
                            },
                            {
                                "dateTimeUTC": "2023-09-01T06:07:59",
                                "description": "The user is not active with phone number: 385*******00",
                                "code": 103
                            }
                        ],
                        "signature": "Y7hXZ90VSu...",
                    }
                },
            };
        }
        
    ]);