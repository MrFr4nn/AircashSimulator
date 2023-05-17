﻿var aircashPayoutModule = angular.module('aircashPayout', []);

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
        getCurlCheckUser: getCurlCheckUser,  
        getCurlCreatePayout: getCurlCreatePayout,
        createPayout: createPayout,
        getTransactions: getTransactions,
        checkTransactionStatus: checkTransactionStatus,
        getCurlCheckTransactionStatus: getCurlCheckTransactionStatus
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
    function getCurlCheckUser(phoneNumber) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/GetCurlCheckUser",
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
    function getCurlCreatePayout(phoneNumber, amount) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/GetCurlCreatePayout",
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
    function getCurlCheckTransactionStatus(partnerTransactionId) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/GetCurlCheckTransactionStatus",
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

    $scope.curlCheckUserBusy = false;
    $scope.curlCheckUserResponded = false;

    $scope.checkUserServiceBusy = false;
    $scope.checkUserServiceResponse = false;

    $scope.createPayoutServiceBusy = false;
    $scope.createPayoutServiceResponse = false;

    $scope.curlCreatePayoutServiceBusy = false;
    $scope.curlCreatePayoutServiceResponse = false;

    $scope.checkTransactionStatusServiceBusy = false;
    $scope.checkTransactionStatusServiceResponse = false;

    $scope.CurlCheckTransactionStatusServiceBusy = false;
    $scope.CurlCheckTransactionStatusServiceResponse = false;


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
    $scope.getCurlCheckUser = function () {
        $scope.curlCheckUserBusy = true;
        $scope.curlCheckUserResponded = false;
        aircashPayoutService.getCurlCheckUser($scope.checkUserModel.phoneNumber)
            .then(function (response) {
                if (response) {
                    $scope.CurlResponseCheckUser = response;
                }
                $scope.curlCheckUserBusy = false;
                $scope.curlCheckUserResponded = true;
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

    $scope.getCurlCreatePayout = function () {
        $scope.curlCreatePayoutServiceBusy = true;
        $scope.curlCreatePayoutServiceResponse = false;
        aircashPayoutService.getCurlCreatePayout($scope.createPayoutModel.phoneNumber, $scope.createPayoutModel.amount)
            .then(function (response) {

                if (response) {
                    $scope.CurlResponseCreatePayout = response;
                }
                $scope.curlCreatePayoutServiceBusy = false;
                $scope.curlCreatePayoutServiceResponse = true;
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
    $scope.getCurlCheckTransactionStatus = function (transactionId) {
        $scope.CurlCheckTransactionStatusServiceBusy = true;
        $scope.CurlCheckTransactionStatusServiceResponse = false;
        aircashPayoutService.getCurlCheckTransactionStatus(transactionId)
            .then(function (response) {

                if (response) {
                    $scope.CurlResponseTransactionStatus = response;
                }
                $scope.CurlCheckTransactionStatusServiceBusy = false;
                $scope.CurlCheckTransactionStatusServiceResponse = true;
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

    $scope.loadMore = function (pageSize) {
        $scope.pageSize = pageSize;
        $scope.getTransactions(false);
    };

    $scope.setDefaults();

    $scope.getTransactions();

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