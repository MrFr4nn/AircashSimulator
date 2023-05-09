﻿var acFrameV2Module = angular.module('acFrameV2', []);

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
        initiateSimulateError: initiateSimulateError,
        transactionStatusSimulateError: transactionStatusSimulateError,
    });

    function initiateRedirectCheckout(payType, payMethod, amount, currency, locale, successUrl, declineUrl, cancelUrl, originUrl) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/InitiateV2",
            data: {
                PayType: payType,
                PayMethod: payMethod,
                Amount: amount,
                Currency: currency,
                Locale: locale,
                SuccessUrl: successUrl,
                DeclineUrl: declineUrl,
                CancelUrl: cancelUrl,
                OriginUrl: "https://domain.com"
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

    function transactionStatus(transactionId) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/TransactionStatusFrameV2",
            data: {
                TransactionId: transactionId
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

acFrameV2Module.controller("acFrameV2Ctrl", ['$scope', '$state', '$filter', 'acFrameV2Service', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', function ($scope, $state, $filter, acFrameV2Service, $http, JwtParser, $uibModal, $rootScope, $localStorage) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    if ($scope.partnerRoles.indexOf("AircashFrameV2") == -1) {
        $location.path('/forbidden');
    }


    $scope.copyToClipboard = function (data) {
        navigator.clipboard.writeText(data);
    }
    //$scope.successUrl = "https://localhost:44317/#!/success";
    //$scope.declineUrl = "https://localhost:44317/#!/decline";
    //$scope.cancelUrl = "https://localhost:44317/#!/decline";
    $scope.originUrl = "https://localhost:44317";

    $scope.initiateModels = [0, 1, 2];

    $scope.initiateModelSelected = $scope.initiateModels[0];

    $scope.initiateModels =
        [
            {
                payType: 0,
                payMethod: 2,
                amount: 10,
                selected: true
            },
            {
                payType: 0,
                payMethod: 0,
                amount: 0,
                selected: true
            },
            {
                payType: 1,
                payMethod: 10,
                amount: 10,
                selected: true
            }
        ];
    $scope.initiateModel = $scope.initiateModels[0];

    $scope.setInititateModel = function (value) {
        $scope.initiateModel = $scope.initiateModels[value.initiateModelSelected];
        $scope.initiateModelSelected = value.initiateModelSelected;
    };

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
        $scope.locale.value = $scope.locale.languageInput.toLowerCase() + "-" + $scope.locale.countryISOCodeInput.toUpperCase();
        acFrameV2Service.initiateRedirectCheckout(
            $scope.initiateModel.payType,
            $scope.initiateModel.payMethod,
            $scope.initiateModel.amount,
            $scope.initiateModel.currency,
            $scope.locale.value,
            $scope.successUrl,
            $scope.declineUrl,
            $scope.cancelUrl)
            .then(function (response) {
                if (response) {
                    $scope.InitiateRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.InitiateResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.sequenceInitiate = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.InitiateServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.InitiateServiceResponse = JSON.stringify(response.serviceResponse, null, 4);

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
                console.log("error");
            });
    };

    $scope.onSuccess = function (obj) {
        console.log(obj);
        alert("Success:" + obj.amount);
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
    $scope.transactionStatus = function (transactionId) {
        $scope.statusBusy = true;
        $scope.statusResponded = false;
        acFrameV2Service.transactionStatus(transactionId)
            .then(function (response) {
                if (response) {
                    console.log(response);
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

    $scope.setDefaults();

    $scope.getTransactions();

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
        }

    }

    $scope.aircashFrameV2 = {
        initiate: {
            requestExample: {
                partnerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerUserId: "574f32a7-4ecb-48b2-9723-ac660b9c835d",
                partnerTransactionId: "1a74bb41-36fe-4493-9ccf-30879b994766",
                amount: "100",
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
                partnerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionId: "1a74bb41-36fe-4493-9ccf-30879b994766",
                signature: "dUrE4gtau5..."
            },
            responseExample: {
                aircashTransactionId: "b74854c8-db9d-48d7-985a-59f587637a75",
                status: 2,
                currencyId: 978,
                amount: 1.78,
                signature: "jBMpdollER..."
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
                amount: "100",
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