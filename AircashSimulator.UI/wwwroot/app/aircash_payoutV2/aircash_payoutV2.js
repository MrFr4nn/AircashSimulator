﻿var aircashPayoutV2Module = angular.module('aircashPayoutV2', []);



app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.aircashPayoutV2', {
            data: {
                pageTitle: 'Payout V2'
            },
            url: "/PayoutV2",
            controller: 'aircashPayoutV2Ctrl', 
            templateUrl: 'app/aircash_payoutV2/aircash_payoutV2.html?v=' + Global.appVersion
        });
});

aircashPayoutV2Module.service("aircashPayoutV2Service", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        checkUser: checkUser,
        getCurlCheckUser: getCurlCheckUser,
        getCurlCreatePayout: getCurlCreatePayout,
        createPayout: createPayout,
        getTransactions: getTransactions,
        checkTransactionStatus: checkTransactionStatus
    });
    function checkUser(checkUserRequest) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "aircashC2DPayout/CheckUser",
            data: checkUserRequest
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function getCurlCheckUser(checkUserRequest) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "aircashC2DPayout/GetCurlCheckUser",
            data: checkUserRequest
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function createPayout(createPayoutRequest) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "aircashC2DPayout/CreatePayout",
            data: createPayoutRequest
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function getCurlCreatePayout(createPayoutRequest) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "aircashC2DPayout/GetCurlCreatePayout",
            data: createPayoutRequest
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function checkTransactionStatus(partnerTransactionId) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "aircashC2DPayout/CheckTransactionStatus",
            data: {
                PartnerTransactionId: partnerTransactionId,
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



aircashPayoutV2Module.controller("aircashPayoutV2Ctrl", ['$scope', '$state', 'aircashPayoutV2Service', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', function ($scope, $state, aircashPayoutV2Service, $filter, $http, JwtParser, $uibModal, $rootScope, $localStorage) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    $scope.partnerIds = JSON.parse($scope.decodedToken.partnerIdsDTO);
    if ($scope.partnerRoles.indexOf("AircashPayoutV2") == -1) {
        $location.path('/forbidden');
    }
    $scope.copyToClipboard = function (data) {
        navigator.clipboard.writeText(data);
    }
    $scope.checkUserModel = {
        phoneNumber: $scope.decodedToken.userPhoneNumber,
        firstName: $scope.decodedToken.userFirstName,
        lastName: $scope.decodedToken.userLastName,
        birthDate: new Date($scope.decodedToken.userBirthDate),
    };

    $scope.checkUserServiceBusy = false;
    $scope.checkUserServiceResponse = false;

    $scope.checkUser = function () {
        $scope.checkUserRequest = {
            partnerId: $scope.partnerIds.C2DPayoutPartnerId,
            phoneNumber: $scope.checkUserModel.phoneNumber,
            parameters: [{ key: "PayerFirstName", value: $scope.checkUserModel.firstName }, { key: "PayerLastName", value: $scope.checkUserModel.lastName }, { key: "PayerBirthDate", value: $scope.checkUserModel.birthDate.toLocaleDateString('en-CA') }]
        }
        $scope.checkUserServiceBusy = true;
        aircashPayoutV2Service.checkUser($scope.checkUserRequest)
            .then(function (response) {

                if (response) {
                    $scope.checkUserRequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.checkUserResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.checkUserSequence = response.Sequence;
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.checkUserResponse = JSON.stringify(response.ServiceResponse, null, 4);
                    $scope.checkUserRequest = JSON.stringify(response.ServiceRequest, null, 4);
                }
                $scope.checkUserServiceBusy = false;
                $scope.checkUserServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.curlCheckUserServiceBusy = false;
    $scope.curlCheckUserServiceResponse = false;
    $scope.getCurlCheckUser = function () {
        $scope.checkUserRequest = {
            partnerId: $scope.partnerIds.C2DPayoutPartnerId,
            phoneNumber: $scope.checkUserModel.phoneNumber,
            parameters: [{ key: "PayerFirstName", value: $scope.checkUserModel.firstName }, { key: "PayerLastName", value: $scope.checkUserModel.lastName }, { key: "PayerBirthDate", value: $scope.checkUserModel.birthDate.toLocaleDateString('en-CA') }]
        }
        $scope.curlCheckUserServiceBusy = true;
        aircashPayoutV2Service.getCurlCheckUser($scope.checkUserRequest)
            .then(function (response) {
                if (response) {
                  $scope.CurlResponseCheckUser = response;
                }
                $scope.curlCheckUserServiceBusy = false;
                $scope.curlCheckUserServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }
    $scope.createPayoutModel = {
        phoneNumber: $scope.decodedToken.userPhoneNumber,
        firstName: $scope.decodedToken.userFirstName,
        lastName: $scope.decodedToken.userLastName,
        birthDate: new Date($scope.decodedToken.userBirthDate),
        email: $scope.decodedToken.email,
        amount: 100,
        locationID: 123,
    };


    $scope.createPayoutServiceBusy = false;
    $scope.createPayoutServiceResponse = false;

    $scope.createPayout = function () {
        $scope.createPayoutRequest = {
            partnerId: $scope.partnerIds.C2DPayoutPartnerId,
            phoneNumber: $scope.createPayoutModel.phoneNumber,
            amount: $scope.createPayoutModel.amount,
            locationID: $scope.checkUserModel.locationID,
            parameters: [{ key: "email", value: $scope.createPayoutModel.email }, { key: "PayerFirstName", value: $scope.createPayoutModel.firstName }, { key: "PayerLastName", value: $scope.createPayoutModel.lastName }, { key: "PayerBirthDate", value: $scope.createPayoutModel.birthDate.toLocaleDateString('en-CA') }, { key: "LocationID", value: $scope.createPayoutModel.locationID.toString() }]
        }
        $scope.createPayoutServiceBusy = true;
        aircashPayoutV2Service.createPayout($scope.createPayoutRequest)
            .then(function (response) {

                if (response) {
                    $scope.createPayoutRequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.createPayoutResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.createPayoutSequence = response.Sequence;
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.createPayoutResponse = JSON.stringify(response.ServiceResponse, null, 4);
                    $scope.createPayoutRequest = JSON.stringify(response.ServiceRequest, null, 4);
                    $scope.getTransactions(true);
                }
                $scope.createPayoutServiceBusy = false;
                $scope.createPayoutServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }
    $scope.curlCreatePayoutServiceBusy = false;
    $scope.curlCreatePayoutServiceResponse = false;
    $scope.getCurlCreatePayout = function () {
        $scope.createPayoutRequest = {
            partnerId: $scope.partnerIds.C2DPayoutPartnerId,
            phoneNumber: $scope.createPayoutModel.phoneNumber,
            amount: $scope.createPayoutModel.amount,
            locationID: $scope.checkUserModel.locationID,
            parameters: [{ key: "email", value: $scope.createPayoutModel.email }, { key: "PayerFirstName", value: $scope.createPayoutModel.firstName }, { key: "PayerLastName", value: $scope.createPayoutModel.lastName }, { key: "PayerBirthDate", value: $scope.createPayoutModel.birthDate.toLocaleDateString('en-CA') }, { key: "LocationID", value: $scope.createPayoutModel.locationID.toString() }]
        }
        $scope.createPayoutServiceBusy = true;
        $scope.curlCreatePayoutServiceBusy = true;
        aircashPayoutV2Service.getCurlCreatePayout($scope.createPayoutRequest)
            .then(function (response) {

                if (response) {
                    $scope.CurlResponseCreatePayout = response;
                }
                $scope.createPayoutServiceBusy = false;
                $scope.curlCreatePayoutServiceBusy = false;
                $scope.curlCreatePayoutServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

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

    $scope.checkTransactionStatusServiceBusy = false;
    $scope.checkTransactionStatusServiceResponse = false;

    $scope.checkTransactionStatus = function (transactionId) {
        $scope.checkTransactionStatusServiceBusy = true;
        aircashPayoutV2Service.checkTransactionStatus(transactionId)
            .then(function (response) {

                if (response) {
                    $scope.checkTransactionStatusRequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.checkTransactionStatusResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.checkTransactionStatusSequence = response.Sequence;
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.checkTransactionStatusResponse = JSON.stringify(response.ServiceResponse, null, 4);
                    $scope.checkTransactionStatusRequest = JSON.stringify(response.ServiceRequest, null, 4);
                }
                $scope.checkTransactionStatusServiceBusy = false;
                $scope.checkTransactionStatusServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.getTransactions = function (reset) {
        if (reset) $scope.setDefaults();
        aircashPayoutV2Service.getTransactions($scope.pageSize, $scope.pageNumber, [1, 2])
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

    $scope.setDate = function (date) {
        $scope.checkUserModel.birthDate = date;
    }
    $scope.setBirthDatePayout = function (date) {
        $scope.createPayoutModel.birthDate = date;
    }

    $scope.aircashC2DPayout = {
        checkUser: {
            inputParametersExample: {
                PartnerID: "496fbe8e-ca5a-42df-8999-cdde0c14ae3a",
                PhoneNumber: "385981234567",
                PartnerUserID: "12345",
                Parameters: [
                    {
                        Key: "PayerFirstName",
                        Value: "John"
                    },
                    {
                        Key: "PayerLastName",
                        Value: "Doe"
                    },
                    {
                        Key: "PayerBirthDate",
                        Value: "1990-01-01"
                    }
                ],
                Signature: "ldzZxe....I8="
            },
            outputParametersExample: {
                first: {
                    Status: 1,
                    Parameters: null
                },
                second: {
                    Status: 2,
                    Parameters: null
                },
                third: {
                    Status: 3,
                    Parameters: null
                },
                forth: {
                    Status: 4,
                    Parameters: null
                },
                fifth: {
                    Status: 5,
                    Parameters: null
                }
            }
        },
        createPayout: {
            requestExample: {
                PartnerID: "1b8a6445-d23c-4a3a-acc0-f05abcebb081",
                PhoneNumber: "385981234567",
                PartnerUserID: "12345",
                Parameters: [
                    {
                        Key: "email",
                        Value: "user@example.net"
                    },
                    {
                        Key: "PayerFirstName",
                        Value: "John"
                    },
                    {
                        Key: "PayerLastName",
                        Value: "Doe"
                    },
                    {
                        Key: "PayerBirthDate",
                        Value: "1990-01-01"
                    },
                    {
                        Key: "LocationID",
                        Value: "123"
                    }],
                Amount: 123.45,
                CurrencyID: 978,
                PartnerTransactionID: "123..abc..123",
                Signature: "CX9v6V....Bw="
            },
            responseExample: {
                AircashTransactionID: "760aed25-b409-450b-937d-ba4f0ffa33cc",
                Parameters: null
            },
        },
        checkCode: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                barCode: "05cd4905-982b-4a36-8634-0719290e4341",
                locationID: "123",
                signature: "QDyIrReELi..."
            },
            responseExample: {
                BarCode: "05cd4905-982b-4a36-8634-0719290e4341",
                Amount: 2000.00,
                CurrencyId: 978,
                FirstName: "John",
                LastName: "Doe",
                DateOfBirth: "1990-01-01"
            }
        },
        confirmTransaction: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                barCode: "05cd4905-982b-4a36-8634-0719290e4341",
                partnerTransactionID: "11888f0c-7923-42db-8513-5c1f32cc83e0",
                locationID: "123",
                signature: "Iz+gMcrdNA..."
            },
            responseExample: {
                BarCode: "05cd4905-982b-4a36-8634-0719290e4341",
                Amount: 2000.00,
                AircashTransactionID: "da7109b8-1e9b-4521-b669-2438be129ade"
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
                aircashTransactionID: "760aed25-b409-450b-937d-ba4f0ffa33cc"
            },
            errorResponseExample: {
                message: "An error has occurred."
            }
        },
        checkTransactionStatusSales: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionID: "05cd4905-982b-4a36-8634-0719290e4341",
                signature: "ueIZMgee7G..."
            },
            responseExample: {
                LocationID: "123",
                Amount: 123.45,
                AircashTransactionID: "da7109b8-1e9b-4521-b669-2438be129ade"
            },
        }
    };

}]);