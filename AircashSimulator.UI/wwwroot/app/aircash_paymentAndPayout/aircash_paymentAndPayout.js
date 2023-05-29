var aircashPaymentAndPayoutModule = angular.module('aircashPaymentAndPayout', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.aircashPaymentAndPayout', {
            data: {
                pageTitle: 'Aircash payment And payout'
            },
            url: "/aircashPaymentAndPayout",                                                                                                                            
            controller: 'aircashPaymentAndPayoutCtrl',
            templateUrl: 'app/aircash_paymentAndPayout/aircash_paymentAndPayout.html'
        });
});

aircashPaymentAndPayoutModule.service("aircashPaymentAndPayoutService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        checkCode: checkCode,
        checkCodeV2: checkCodeV2,
        confirmTransaction: confirmTransaction,
        getTransactions: getTransactions,
        checkTransactionStatus: checkTransactionStatus,
        cancelTransaction: cancelTransaction,
        checkCodeSimulateError: checkCodeSimulateError,
        confirmSimulateError: confirmSimulateError,
        checkTransactionStatusSimulateError: checkTransactionStatusSimulateError,
        cancelSimulateError: cancelSimulateError,
    });
    function checkCode(barCode, locationID) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl+"AircashPaymentAndPayout/CheckCode",
            data: {
                BarCode: barCode,
                LocationID: locationID
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function checkCodeV2(barCode, locationID) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl +"AircashPaymentAndPayout/CheckCodeV2",
            data: {
                BarCode: barCode,
                LocationID: locationID
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function confirmTransaction(barCode, locationID) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl+"AircashPaymentAndPayout/ConfirmTransaction",
            data: {
                BarCode: barCode,
                LocationID: locationID
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function checkTransactionStatus(partnerTransactionID) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl+"AircashPaymentAndPayout/CheckTransactionStatus",
            data: {
                PartnerTransactionID: partnerTransactionID
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function cancelTransaction(partnerTransactionID,locationID) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl+"AircashPaymentAndPayout/CancelTransaction",
            data: {
                PartnerTransactionID: partnerTransactionID,
                LocationID: locationID
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function getTransactions(pageSize, pageNumber, services) {
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "Transaction/GetTransactions",
            params: {
                PageSize: pageSize,
                PageNumber: pageNumber,
                Services: services
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function checkCodeSimulateError(errCode) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPaymentAndPayout/CheckCodeSimulateError",
            data: errCode
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function checkTransactionStatusSimulateError() {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPaymentAndPayout/CheckTransactionStatusSimulateError",
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function confirmSimulateError(errCode) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPaymentAndPayout/ConfirmTransactionSimulateError",
            data: errCode
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function cancelSimulateError(errCode) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPaymentAndPayout/CancelTransactionSimulateError",
            data: errCode
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

aircashPaymentAndPayoutModule.controller("aircashPaymentAndPayoutCtrl", ['$scope', '$state', 'aircashPaymentAndPayoutService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', function ($scope, $state, aircashPaymentAndPayoutService, $filter, $http, JwtParser, $uibModal, $rootScope, $localStorage) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    if ($scope.partnerRoles.indexOf("SalePartner") == -1) {
        $location.path('/forbidden');
    }

    $scope.copyToClipboard = function (data) {
        navigator.clipboard.writeText(data);
    }

    $scope.checkCodeModel = {
        barCode: null,
        locationID: '123'
    };

    $scope.checkCodeV2Model = {
        barCode: null,
        locationID: '123'
    };

    $scope.confirmTransactionModel = {
        barCode: null,
        locationID: '123'
    };

    $scope.setDefaults = function () {
        $scope.checkTransactions = [];
        $scope.cancelTransactions = [];
        $scope.checkPageSize = 5;
        $scope.cancelPageSize = 5;
        $scope.checkPageNumber = 1;
        $scope.cancelPageNumber = 1;
        $scope.checkTotalLoaded = 0;
        $scope.cancelTotalLoaded = 0;
        $scope.checkBusy = false;
        $scope.cancelBusy = false;
    };

    $scope.checkTransactionStatusModel = {
        partnerTransactionID: null
    };

    $scope.cancelTransactionModel = {
        partnerTransactionID: null,
        locationID: 123
    };

    $scope.checkCodeServiceBusy = false;
    $scope.checkCodeServiceResponded = false;

    $scope.confirmTransactionServiceBusy = false;
    $scope.confirmTransactionServiceResponded = false;

    $scope.checkTransactionStatusServiceBusy = false;
    $scope.checkTransactionStatusServiceResponded = false;

    $scope.cancelTransactionServiceBusy = false;
    $scope.cancelTransactionServiceResponded = false;

    $scope.checkTransactions = null;
    $scope.cancelTransactions = null;
    $scope.transactionAmountFactor = 0;

    $scope.checkCode = function () {
        $scope.checkCodeServiceResponded = false;
        $scope.checkCodeServiceBusy = true;
        aircashPaymentAndPayoutService.checkCode($scope.checkCodeModel.barCode, $scope.checkCodeModel.locationID)
            .then(function (response) {

                if (response) {
                    $scope.checkCodeRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.checkCodeResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.checkCodeSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.checkCodeServiceResponseObject = response.serviceResponse;
                    $scope.checkCodeServiceRequestObject = response.serviceRequest;
                    $scope.checkCodeServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.checkCodeServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.checkCodeServiceBusy = false;
                $scope.checkCodeServiceResponded = true;
               
            }, () => {
                console.log("error");
            });
    }

    $scope.checkCodeV2 = function () {
        $scope.checkCodeV2ServiceResponded = false;
        $scope.checkCodeV2ServiceBusy = true;
        aircashPaymentAndPayoutService.checkCodeV2($scope.checkCodeV2Model.barCode, $scope.checkCodeV2Model.locationID)
            .then(function (response) {

                if (response) {
                    $scope.checkCodeV2RequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.checkCodeV2ResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.checkCodeV2Sequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.checkCodeV2ServiceResponseObject = response.serviceResponse;
                    $scope.checkCodeV2ServiceRequestObject = response.serviceRequest;
                    $scope.checkCodeV2ServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.checkCodeV2ServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.checkCodeV2ServiceBusy = false;
                $scope.checkCodeV2ServiceResponded = true;
               
            }, () => {
                console.log("error");
            });
    }

    $scope.confirmTransaction = function () {
        $scope.confirmTransactionServiceBusy = true;
        $scope.confirmTransactionServiceResponded = false;
        aircashPaymentAndPayoutService.confirmTransaction($scope.confirmTransactionModel.barCode, $scope.confirmTransactionModel.locationID)
            .then(function (response) {

                if (response) {
                    $scope.confirmTransactionRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.confirmTransactionResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.confirmTransactionSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.confirmTransactionServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.confirmTransactionServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.getCheckTransactions(true);
                    $scope.getCancelTransactions(true);
                }
                $scope.confirmTransactionServiceBusy = false;
                $scope.confirmTransactionServiceResponded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.checkTransactionStatus = function (transactionId) {
        $scope.checkTransactionStatusServiceBusy = true;
        $scope.checkTransactionStatusServiceResponded = false;
        aircashPaymentAndPayoutService.checkTransactionStatus(transactionId)
            .then(function (response) {
                if (response) {
                    $scope.checkTransactionStatusRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.checkTransactionStatusResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.checkTransactionStatusSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.checkTransactionStatusServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.checkTransactionStatusServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.checkTransactionStatusServiceBusy = false;
                $scope.checkTransactionStatusServiceResponded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.cancelTransaction = function (transactionId, pointOFSaleId) {
        $scope.cancelTransactionServiceBusy = true;
        $scope.cancelTransactionServiceResponded = false;
        aircashPaymentAndPayoutService.cancelTransaction(transactionId, pointOFSaleId)
            .then(function (response) {
                if (response) {
                    $scope.cancelTransactionRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.cancelTransactionResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.cancelTransactionSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.cancelTransactionServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.cancelTransactionServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.cancelTransactionServiceBusy = false;
                $scope.cancelTransactionServiceResponded = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.getCheckTransactions = function (reset) {
        if (reset) $scope.setDefaults();
        aircashPaymentAndPayoutService.getTransactions($scope.checkPageSize, $scope.checkPageNumber, [9, 10])
            .then(function (response) {
                $scope.checkPageNumber += 1;
                if (response) {
                    $scope.checkTotalLoaded = response.length;
                    $scope.checkTransactions = $scope.checkTransactions.concat(response);
                }
            }, () => {
                console.log("error");
            });
    }

    $scope.getCancelTransactions = function (reset) {
        if (reset) $scope.setDefaults();
        aircashPaymentAndPayoutService.getTransactions($scope.cancelPageSize, $scope.cancelPageNumber, [9, 10])
            .then(function (response) {
                $scope.cancelPageNumber += 1;
                if (response) {
                    $scope.cancelTotalLoaded = response.length;
                    $scope.cancelTransactions = $scope.cancelTransactions.concat(response);
                }
            }, () => {
                console.log("error");
            });
    }

    $scope.checkCodeCurrentErrorCode = 0;
    $scope.errorCheckCodeResponded = false;
    $scope.errorCheckCodeServiceBusy = false;
    $scope.checkCodeSimulateError = (err) => {
        $scope.errorCheckCodeResponded = false;
        $scope.errorCheckCodeServiceBusy = true;
        aircashPaymentAndPayoutService.checkCodeSimulateError(err)
            .then(function (response) {
                if (response) {
                    $scope.errorCheckRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.errorCheckResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.errorCheckSequence = response.sequence;
                    $scope.errorCheckRequestCopy = JSON.stringify(response.serviceRequest, null, 4);
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.errorCheckResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.errorCheckRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.errorCheckCodeResponded = true;
                $scope.errorCheckCodeServiceBusy = false;
                $scope.checkCodeCurrentErrorCode = err;
            }, () => {
                console.log("error");
            });
    }

    $scope.confirmCurrentErrorCode = 0;
    $scope.errorConfirmResponded = false;
    $scope.errorConfirmServiceBusy = false;
    $scope.confirmSimulateError = (errCode) => {
        $scope.errorConfirmResponded = false;
        $scope.errorConfirmServiceBusy = true;
        aircashPaymentAndPayoutService.confirmSimulateError(errCode)
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
                $scope.confirmCurrentErrorCode = errCode;
                $scope.errorConfirmResponded = true;
                $scope.errorConfirmServiceBusy = false;
            }, () => {
                console.log("error");
            });
    }

    $scope.cancellCurrentErrorCode = 0;
    $scope.errorCancelResponded = false;
    $scope.errorCancelServiceBusy = false;
    $scope.cancelSimulateError = (errCode) => {
        $scope.errorCancelResponded = false;
        $scope.errorCancelServiceBusy = true;
        aircashPaymentAndPayoutService.cancelSimulateError(errCode)
            .then(function (response) {
                if (response) {
                    $scope.errorCancellRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.errorCancellResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.errorCancellSequence = response.sequence;
                    $scope.errorCancellRequestCopy = JSON.stringify(response.serviceRequest, null, 4);
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.errorCancellResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.errorCancellRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.cancellCurrentErrorCode = errCode;
                $scope.errorCancelResponded = true;
                $scope.errorCancelServiceBusy = false;
            }, () => {
                console.log("error");
            });
    }

    $scope.errorCheckTransactionResponded = false;
    $scope.errorCheckTransactionServiceBusy = false;
    $scope.checkTransactionStatusSimulateError = () => {
        $scope.errorCheckTransactionResponded = false;
        $scope.errorCheckTransactionServiceBusy = true;
        aircashPaymentAndPayoutService.checkTransactionStatusSimulateError()
            .then(function (response) {
                if (response) {
                    $scope.errorCheckTransactionRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.errorCheckTransactionResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.errorCheckTransactionSequence = response.sequence;
                    $scope.errorCheckTransactionRequestCopy = JSON.stringify(response.serviceRequest, null, 4);
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.errorCheckTransactionResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.errorCheckTransactionRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.errorCheckTransactionResponded = true;
                $scope.errorCheckTransactionServiceBusy = false;
            }, () => {
                console.log("error");
            });
    }

    $scope.checkLoadMore = function (pageSize) {
        $scope.checkPageSize = pageSize;
        $scope.getCheckTransactions(false);
    };

    $scope.cancelLoadMore = function (pageSize) {
        $scope.cancelPageSize = pageSize;
        $scope.getCancelTransactions(false);
    };

    $scope.setDefaults();

    $scope.getCheckTransactions();

    $scope.getCancelTransactions();

    $scope.errorExamples = {
        CheckCode: {
            error1: {
                request: {
                    "partnerID": "e747a837-85d9-4287-a412-ffbb5d1b0ad8",
                    "barCode": "AC95890684887483",
                    "locationID": "123",
                    "signature": "bEJ4wjEcax..."
                },
                response: {
                    "errorCode": 1,
                    "errorMessage": "Invalid bar code "
                }
            },
            error2: {
                request: {
                    "partnerID": "e747a837-85d9-4287-a412-ffbb5d1b0ad8",
                    "barCode": "AC15694794016276",
                    "locationID": "123",
                    "signature": "ShZjKjbLsZ..."
                },
                response: {
                    "errorCode": 2,
                    "errorMessage": "Bar code already used "
                }
            },
            error3: {
                request: {
                },
                response: {

                }
            },
        },
        ConfirmTransaction: {
            error2: {
                request: {
                    "partnerID": "e747a837-85d9-4287-a412-ffbb5d1b0ad8",
                    "barCode": "AC15694794016276",
                    "partnerTransactionID": "d8b5649c-3001-4c12-bc45-f024d67585c6",
                    "locationID": "123",
                    "signature": "Nwo+VIViBN..."
                },
                response: {
                    "errorCode": 2,
                    "errorMessage": "Bar code already used "
                }
            },
            error3: {
                request: {
                },
                response: {

                }
            },
            error4: {
                request: {
                    "partnerID": "e747a837-85d9-4287-a412-ffbb5d1b0ad8",
                    "barCode": "AC16758848507711",
                    "partnerTransactionID": "c456eee8-ccaa-4c10-b6e9-7f8c9ca3d2d8",
                    "locationID": "123",
                    "signature": "EiCU4uxtTE..."
                },
                response: {
                    "errorCode": 4,
                    "errorMessage": "PartnerTransactionID is not unique"
                }
            },
            error6: {
                request: {
                    "partnerID": "e747a837-85d9-4287-a412-ffbb5d1b0ad8",
                    "barCode": "AC16004150724597",
                    "partnerTransactionID": "b9258777-26bd-4863-a9fd-4046e7e4df71",
                    "locationID": "123",
                    "signature": "PktsXrq/lp..."
                },
                response: {
                    "errorCode": 6,
                    "errorMessage": "Unable to confirm transaction without calling check bar code first"
                }
            }
        },
        CheckTransaction: {
            error5: {
                request: {
                    "partnerID": "e747a837-85d9-4287-a412-ffbb5d1b0ad8",
                    "partnerTransactionID": "6fec1de6-c1c5-483d-9bfc-1b689c6d22ef",
                    "signature": "SQY/a8b7Fr..."
                },
                response: {
                    "errorCode": 5,
                    "errorMessage": "Transaction doesn’t exist in partner system"
                }
            }
        },
        CancelTransaction: {
            error7: {
                request: {
                    "partnerID": "e747a837-85d9-4287-a412-ffbb5d1b0ad8",
                    "partnerTransactionID": "289812f6-4f7b-4b43-b2df-77e6a803d946",
                    "locationID": "123",
                    "signature": "AMR8FuR0Ms..."
                },
                response: {
                    "errorCode": 7,
                    "errorMessage": "Unable to cancel payout"
                }
            },
            error8: {
                request: {
                    "partnerID": "e747a837-85d9-4287-a412-ffbb5d1b0ad8",
                    "partnerTransactionID": "a2853f63-2eeb-44a5-9440-8848f93f15da",
                    "locationID": "123",
                    "signature": "LMkB2B10Oa..."
                },
                response: {
                    "errorCode": 8,
                    "errorMessage": "Transaction already canceled"
                }
            },
            error9: {
                request: {

                },
                response: {

                }
            },
            error10: {
                request: {

                },
                response: {

                }
            }
        }
    }

    $scope.SalesPartner = {
        CheckCode: {
            RequestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                barCode: "AC23436263654000",
                locationID: "123",
                signature: "IAo...WJo="
            },
            ResponseExample: {
                barCode: "AC23436263654000",
                amount: -100.00
            },
            ErrorResponseExample: {
                errorCode: 1,
                errorMessage: "Invalid bar code "
            },
            ResponseExampleV2: {
                barCode: "AC23436263654000",
                amount: -100.00,
                currencyId: 978,
                firstName: "John",
                lastName: "Doe",
                dateOfBirth: "1990-01-01"
            }
        },
        ConfirmTransaction: {
            RequestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                barCode: "AC23436263654000",
                partnerTransactionID: "c88dcc81-8b43-4808-8ac5-da498bf08439",
                locationID: "123",
                signature: "OFD...DfI = "
            },
            ResponseExample: {
                barCode: "AC23436263654000",
                amount: -100,
                aircashTransactionID: "cd9484bb-e0ce-4186-ad3e-5243721bf280"
            },
            ErrorResponseExample: {
                errorCode: 4,
                errorMessage: "PartnerTransactionID is not unique"
            }
        },
        CheckTransactionStatus: {
            RequestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionID: "c88dcc81-8b43-4808-8ac5-da498bf08439",
                signature: "pzu...Xhg="
            },
            ResponseExample: {
                amount: 100,
                aircashTransactionID: "cd9484bb-e0ce-4186-ad3e-5243721bf280",
                locationID: "123"
            },
            ErrorResponseExample: {
                errorCode: 5,
                errorMessage: "Transaction doesn't exist in partner system"
            }
        },
        CancelTransaction: {
            RequestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionID: "c88dcc81-8b43-4808-8ac5-da498bf08439",
                locationID: "123",
                signature: "caa...hVI="
            },
            ErrorResponseExample: {
                errorCode: 7,
                errorMessage: "Unable to cancel payout"
            }
        }

    }
}]);