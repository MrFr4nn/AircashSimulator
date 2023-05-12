var aircashPayoutModule = angular.module('aircashPayout', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.aircashPayout', {
            data: {
                pageTitle: 'Payout'
            },
            url: "/Payout",
            controller: 'aircashPayoutCtrl', 
            templateUrl: 'app/aircash_payout/aircash_payout.html'
        });
});

aircashPayoutModule.service("aircashPayoutService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        checkUser: checkUser,
        createPayout: createPayout,
        getTransactions: getTransactions,
        checkTransactionStatus: checkTransactionStatus,
        simulatePayoutError: simulatePayoutError,
    });
    function checkUser(phoneNumber) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/CheckUser",
            data: {
                PhoneNumber: phoneNumber
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function createPayout(phoneNumber, amount) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/CreatePayout",
            data: {
                PhoneNumber: phoneNumber,
                Amount: amount
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function checkTransactionStatus(partnerTransactionId) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/CheckTransactionStatus",
            data: {
                PartnerTransactionId: partnerTransactionId
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
    function simulatePayoutError(errorCode) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/CreatePayoutSimulateError",
            data: errorCode

        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

aircashPayoutModule.controller("aircashPayoutCtrl", ['$scope', '$state', 'aircashPayoutService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', function ($scope, $state, aircashPayoutService, $filter, $http, JwtParser, $uibModal, $rootScope, $localStorage) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    if ($scope.partnerRoles.indexOf("AircashPayout") == -1) {
        $location.path('/forbidden');
    }

    $scope.copyToClipboard = function (data) {
        navigator.clipboard.writeText(data);
    }

    $scope.checkUserModel = {
        phoneNumber: '38512345678'
    };

    $scope.createPayoutModel = {
        phoneNumber: '38512345678',
        amount: 100
    };

    $scope.setDefaults = function () {
        $scope.transactions = [];
        $scope.pageSize = 5;
        $scope.pageNumber = 1;
        $scope.totalLoaded = 0;
        $scope.busy = false;
    };

    $scope.checkTransactionStatusModel = {
        partnerTransactionId: null
    };

    $scope.checkUserServiceBusy = false;
    $scope.checkUserServiceResponse = false;

    $scope.createPayoutServiceBusy = false;
    $scope.createPayoutServiceResponse = false;

    $scope.checkTransactionStatusServiceBusy = false;
    $scope.checkTransactionStatusServiceResponse = false;

    $scope.checkUser = function () {
        $scope.checkUserServiceBusy = true;
        $scope.checkUserServiceResponse = false;
        aircashPayoutService.checkUser($scope.checkUserModel.phoneNumber)
            .then(function (response) {

                if (response) {
                    $scope.checkUserRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.checkUserResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.checkUserSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.checkUserResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.checkUserRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.checkUserServiceBusy = false;
                $scope.checkUserServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.createPayout = function () {
        $scope.createPayoutServiceBusy = true;
        $scope.createPayoutServiceResponse = false;
        aircashPayoutService.createPayout($scope.createPayoutModel.phoneNumber, $scope.createPayoutModel.amount)
            .then(function (response) {

                if (response) {
                    $scope.createPayoutRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.createPayoutResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.createPayoutSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.createPayoutResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.createPayoutRequest = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.getTransactions(true);
                }
                $scope.createPayoutServiceBusy = false;
                $scope.createPayoutServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.checkTransactionStatus = function (transactionId) {
        $scope.checkTransactionStatusServiceBusy = true;
        $scope.checkTransactionStatusServiceResponse = false;
        aircashPayoutService.checkTransactionStatus(transactionId)
            .then(function (response) {

                if (response) {
                    $scope.checkTransactionStatusRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.checkTransactionStatusResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.checkTransactionStatusSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.checkTransactionStatusResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.checkTransactionStatusRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.checkTransactionStatusServiceBusy = false;
                $scope.checkTransactionStatusServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.getTransactions = function (reset) {
        if (reset) $scope.setDefaults();
        aircashPayoutService.getTransactions($scope.pageSize, $scope.pageNumber, [1, 2])
            .then(function (response) {
                $scope.checkPageNumber += 1;
                if (response) {
                    $scope.totalLoaded = response.length;
                    $scope.transactions = $scope.transactions.concat(response);
                }
            }, () => {
                console.log("error");
            });
    }

    $scope.currentPayoutErrorCode = 0;
    $scope.errorPayoutResponded = false;
    $scope.errorPayoutServiceBusy = false;
    $scope.simulatePayoutError = (errCode) => {
        $scope.errorPayoutResponded = false;
        $scope.errorPayoutServiceBusy = true;
        aircashPayoutService.simulatePayoutError(errCode)
            .then(function (response) {
                if (response) {
                    $scope.errorPayoutRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.errorPayoutResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.errorPayoutSequence = response.sequence;
                    $scope.errorPayoutRequestCopy = JSON.stringify(response.serviceRequest, null, 4);
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.errorPayoutResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.errorPayoutRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.currentPayoutErrorCode = errCode;
                $scope.errorPayoutResponded = true;
                $scope.errorPayoutServiceBusy = false;
            }, () => {
                console.log("error");
            });
    }

    $scope.loadMore = function (pageSize) {
        $scope.pageSize = pageSize;
        $scope.getTransactions(false);
    };

    $scope.setDefaults();

    $scope.getTransactions();

    $scope.errorExamples = {
        createPayout: {
            error4000: {
                request: {
                    "partnerID": "0a13af2f-9d8e-4afd-b3e0-8f4c24095cd6",
                    "partnerTransactionID": "b14643f4-1458-44a2-aa98-45c9bc3578f9",
                    "amount": 25,
                    "phoneNumber": "524838804872",
                    "partnerUserID": "7b50c438-0260-4364-b5ee-2ba1036e2485",
                    "currencyID": 978,
                    "signature": "mdu9UmM80A..."
                },
                response: {
                    "code": 4000,
                    "message": "Unknown phone number"
                }
            },
            error4002: {
                request: {
                    "partnerID": "0a13af2f-9d8e-4afd-b3e0-8f4c24095cd6",
                    "partnerTransactionID": "c456eee8-ccaa-4c10-b6e9-7f8c9ca3d2d8",
                    "amount": 25,
                    "phoneNumber": "385992500001",
                    "partnerUserID": "44aa69e2-a732-4d9c-b016-70b0b9fee532",
                    "currencyID": 978,
                    "signature": "krrCSLivxM..."
                },
                response: {
                    "code": 4002,
                    "message": "PartnerTransactionID already exists"
                }
            },
            error4003: {
                request: {
                    "partnerID": "0a13af2f-9d8e-4afd-b3e0-8f4c24095cd6",
                    "partnerTransactionID": "caed783c-6489-4101-b2f0-f9d71d330548",
                    "amount": 0.5,
                    "phoneNumber": "385992500001",
                    "partnerUserID": "1b678be1-1e76-4f0a-98ba-01aa2f9c4572",
                    "currencyID": 978,
                    "signature": "uOMgRYbq38..."
                },
                response: {
                    "code": 4003,
                    "message": "Amount too small"
                }
            },
            error4004: {
                request: {
                    "partnerID": "0a13af2f-9d8e-4afd-b3e0-8f4c24095cd6",
                    "partnerTransactionID": "a7f9d376-9b48-481b-a945-2f9c039c0435",
                    "amount": 1100,
                    "phoneNumber": "385992500001",
                    "partnerUserID": "66459117-bcae-4edb-a7c4-e4aa68ecec49",
                    "currencyID": 978,
                    "signature": "MlrpYRnPcm..."
                },
                response: {
                    "code": 4004,
                    "message": "Amount too big"
                }
            },
            error4005: {
                request: {
                    "partnerID": "0a13af2f-9d8e-4afd-b3e0-8f4c24095cd6",
                    "partnerTransactionID": "e73dd1e2-c3fe-4942-9d81-510bc63cf2e5",
                    "amount": 25,
                    "phoneNumber": "385992500002",
                    "partnerUserID": "6d091d23-c1d0-4637-b26a-186c1237fa0d",
                    "currencyID": 978,
                    "signature": "TEJfUGtSFY..."
                },
                response: {
                    "code": 4005,
                    "message": "User reached transaction limit or user is blocked"
                }
            },
            error4006: {
                request: {
                    "partnerID": "0a13af2f-9d8e-4afd-b3e0-8f4c24095cd6",
                    "partnerTransactionID": "5c7242ab-05cf-4188-9f0c-f00971c38c12",
                    "amount": 25,
                    "phoneNumber": "385992500001",
                    "partnerUserID": "f8a95979-d6ab-4583-9bbd-a43d0ccb7e66",
                    "currencyID": 191,
                    "signature": "e+4hug1AGI..."
                },
                response: {
                    "code": 4006,
                    "message": "Currencies do not match"
                }
            }
        }
    }

    $scope.aircashPayout = {
        checkUser: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerUserID: "574f32a7-4ecb-48b2-9723-ac660b9c835d",
                phoneNumber: 385995712738,
                signature: "VA514erV6V..."
            },
            responseExample: {
                status: 3
            },
            errorResponseExample: {
                message: "An error has occurred."
            }
        },
        createPayout: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionID: "45c38393-274b-4761-902e-23db30736563",
                amount: 100,
                phoneNumber: "385995712738",
                partnerUserID: "574f32a7-4ecb-48b2-9723-ac660b9c835d",
                currencyID: 191,
                signature: "Hm38lRCyOP..."
            },
            responseExample: {
                aircashTransactionID: "760aed25-b409-450b-937d-ba4f0ffa33cc "
            },
            errorResponseExample: {
                code: 4002,
                message: "PartnerTransactionID already exists"
            }
        },
        checkTransactionStatus: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionID: "45c38393-274b-4761-902e-23db30736563",
                aircashTransactionID: null,
                signature: "BBjas91N8B..."
            },
            responseExample: {
                status: 2,
                aircashTransactionID: "760aed25-b409-450b-937d-ba4f0ffa33cc "
            },
            errorResponseExample: {
                message: "An error has occurred."
            }
        }
    };

}]);