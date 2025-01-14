﻿var aircashPayoutModule = angular.module('aircashPayout', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.aircashPayout', {
            data: {
                pageTitle: 'Payout'
            },
            url: "/Payout",
            controller: 'aircashPayoutCtrl', 
            templateUrl: 'app/aircash_payout/aircash_payout.html?v=' + Global.appVersion
        });
});

aircashPayoutModule.service("aircashPayoutService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        checkUser: checkUser,
        checkUserV4: checkUserV4,    
        getCurlCheckUserV4: getCurlCheckUserV4,    
        getCurlCheckUser: getCurlCheckUser,  
        getCurlCreatePayout: getCurlCreatePayout,
        createPayout: createPayout,
        createPayoutV4: createPayoutV4,
        getCurlCreatePayoutV4: getCurlCreatePayoutV4,
        getTransactions: getTransactions,
        checkTransactionStatus: checkTransactionStatus,
        getCurlCheckTransactionStatus: getCurlCheckTransactionStatus,
        simulatePayoutError: simulatePayoutError,
        generateCheckUserSignature: generateCheckUserSignature,
        generateCreatePayoutSignature: generateCreatePayoutSignature,
    }
    );
    function checkUser(checkUserRequest) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/CheckUser",
            data: checkUserRequest
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
    function checkUserV4(checkUserRequest) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/checkUserV4",
            data: checkUserRequest
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function getCurlCheckUserV4(checkUserRequest) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/GetCurlCheckUserV4",
            data: checkUserRequest
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function createPayout(createPayoutRequest) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/CreatePayout",
            data: createPayoutRequest
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function createPayoutV4(createPayoutRequest) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/CreatePayoutV4",
            data: createPayoutRequest
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function getCurlCreatePayoutV4(createPayoutRequest) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/GetCurlCreatePayoutV4",
            data: createPayoutRequest
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function getCurlCreatePayout(createPayoutRequest) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/GetCurlCreatePayout",
            data: createPayoutRequest
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function checkTransactionStatus(TransactionModel) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/CheckTransactionStatus",
            data: {
                PartnerID: TransactionModel.partnerId,
                PartnerTransactionId: TransactionModel.partenrTransactionId || undefined,
                AircashTransactionId: TransactionModel.aircashTransactionId || undefined
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function getCurlCheckTransactionStatus(TransactionModel) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/GetCurlCheckTransactionStatus",
            data: {
                PartnerID: TransactionModel.partnerId,
                PartnerTransactionId: TransactionModel.partenrTransactionId || undefined,
                AircashTransactionId: TransactionModel.aircashTransactionId || undefined
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
    function generateCheckUserSignature(checkUserModel) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/GenerateCheckUserSignature",
            data: checkUserModel

        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function generateCreatePayoutSignature(createPayoutModel) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/GenerateCreatePayoutSignature",
            data: createPayoutModel

        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

aircashPayoutModule.controller("aircashPayoutCtrl", ['$scope', '$state', 'aircashPayoutService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', function ($scope, $state, aircashPayoutService, $filter, $http, JwtParser, $uibModal, $rootScope, $localStorage) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    $scope.partnerIds = JSON.parse($scope.decodedToken.partnerIdsDTO);
    if ($scope.partnerRoles.indexOf("AircashPayout") == -1) {
        $location.path('/forbidden');
    }

    $scope.copyToClipboard = function (data) {
        navigator.clipboard.writeText(data);
    }

    $scope.checkUserModel = {
        partnerId: $scope.partnerIds.AircashPayoutPartnerId,
        partnerUserId: uuidv4(),
        phoneNumber: $scope.decodedToken.userPhoneNumber,
    };

    $scope.checkUserV4Model = {
        partnerId: $scope.partnerIds.AircashPayoutPartnerId,
        partnerUserId: uuidv4(),
        phoneNumber: $scope.decodedToken.userPhoneNumber,
        personalIdentificationCode: "RSSMRAURTMLARSNL",
        firstName: $scope.decodedToken.userFirstName,
        lastName: $scope.decodedToken.userLastName,
        birthDate: new Date($scope.decodedToken.userBirthDate),
    };

    $scope.createPayoutModel = {
        partnerId: $scope.partnerIds.AircashPayoutPartnerId,
        userId: uuidv4(),
        partnerTransactionId: uuidv4(),
        currencyId: 978,
        phoneNumber: $scope.decodedToken.userPhoneNumber,
        amount: 100
    };

    $scope.createPayoutV4Model = {
        partnerId: $scope.partnerIds.AircashPayoutPartnerId,
        userId: uuidv4(),
        partnerTransactionId: uuidv4(),
        currencyId: 978,
        phoneNumber: $scope.decodedToken.userPhoneNumber,
        firstName: $scope.decodedToken.userFirstName,
        lastName: $scope.decodedToken.userLastName,
        personalIdentificationCode: "RSSMRAURTMLARSNL",
        birthDate: new Date($scope.decodedToken.userBirthDate),
        amount: 100,
    }

    $scope.checkboxCreatePayout = {
        match: false,
        personalIdentificationCode: false
    }
    $scope.checkboxCheckUser = {
        match: false,
        personalIdentificationCode: false
    }
    $scope.changePartnerId = function () {
        if ($scope.partnerIds.AircashPayoutPartnerId != $scope.partnerIds.AircashPayoutV4PartnerId) {
            if ($scope.checkboxCreatePayout.match && $scope.createPayoutV4Model.partnerId == $scope.partnerIds.AircashPayoutPartnerId) {
                $scope.createPayoutV4Model.partnerId = $scope.partnerIds.AircashPayoutV4PartnerId;
                $rootScope.showGritter("CreatePayout PartnerID changed");
            } else if (!$scope.checkboxCreatePayout.match && $scope.createPayoutV4Model.partnerId == $scope.partnerIds.AircashPayoutV4PartnerId) {
                $scope.createPayoutV4Model.partnerId = $scope.partnerIds.AircashPayoutPartnerId;
                $rootScope.showGritter("CreatePayout PartnerID changed");
            }
            if ($scope.checkboxCheckUser.match && $scope.checkUserV4Model.partnerId == $scope.partnerIds.AircashPayoutPartnerId) {
                $scope.checkUserV4Model.partnerId = $scope.partnerIds.AircashPayoutV4PartnerId;
                $rootScope.showGritter("CheckUser PartnerID changed");
            } else if (!$scope.checkboxCheckUser.match && $scope.checkUserV4Model.partnerId == $scope.partnerIds.AircashPayoutV4PartnerId) {
                $scope.checkUserV4Model.partnerId = $scope.partnerIds.AircashPayoutPartnerId;
                $rootScope.showGritter("CheckUser PartnerID changed");
            }
        }

    }
    $scope.setDefaults = function () {
        $scope.changePartnerId();
        
        $scope.createPayoutV4Model.userId = uuidv4();
        $scope.createPayoutV4Model.partnerTransactionId = uuidv4();
        $scope.createPayoutV4Model.currencyId = 978;

        $scope.checkUserV4Model.partnerUserId = uuidv4();

        $scope.checkUserModel.partnerUserId = uuidv4();
        $scope.checkUserModel.partnerId = $scope.partnerIds.AircashPayoutPartnerId;

        $scope.createPayoutModel.partnerId = $scope.partnerIds.AircashPayoutPartnerId;
        $scope.createPayoutModel.userId = uuidv4();
        $scope.createPayoutModel.partnerTransactionId = uuidv4();
        $scope.createPayoutModel.currencyId = 978;
        
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


    $scope.checkUserV4ServiceBusy = false;
    $scope.checkUserV4ServiceResponse = false;

    $scope.curlCheckUserV4ServiceBusy = false;
    $scope.curlCheckUserV4Responded = false;

    $scope.createPayoutV4ServiceBusy = false;
    $scope.createPayoutV4ServiceResponse = false;

    $scope.curlCreatePayoutV4ServiceBusy = false;
    $scope.curlCreatePayoutV4ServiceResponse = false;

    $scope.checkUser = function () {
        $scope.checkUserServiceBusy = true;
        $scope.checkUserServiceResponse = false;
        $scope.checkUserRequest = {
            partnerUserID: $scope.checkUserModel.partnerUserId,
            partnerID: $scope.checkUserModel.partnerId,
            phoneNumber: $scope.checkUserModel.phoneNumber
        }
        aircashPayoutService.checkUser($scope.checkUserRequest)
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
                $scope.checkUserServiceBusy = false;
                $scope.checkUserServiceResponse = false;
            });
    }

    $scope.checkUserV4 = function () {
        $scope.checkUserV4ServiceBusy = true;
        $scope.checkUserV4ServiceResponse = false;
        $scope.checkUserV4Request = {
            partnerUserID: $scope.checkUserV4Model.partnerUserId,
            partnerID: $scope.checkUserV4Model.partnerId,
            phoneNumber: $scope.checkUserV4Model.phoneNumber,
            parameters: []
        }
        if ($scope.checkboxCheckUser.personalIdentificationCode) $scope.checkUserV4Request.parameters.push({ key: "PersonalIdentificationCode", value: $scope.checkUserV4Model.personalIdentificationCode })
        if ($scope.checkboxCheckUser.match) $scope.checkUserV4Request.parameters.push({ key: "PayerFirstName", value: $scope.checkUserV4Model.firstName }, { key: "PayerLastName", value: $scope.checkUserV4Model.lastName }, { key: "PayerBirthDate", value: $scope.checkUserV4Model.birthDate.toLocaleDateString('en-CA') });
        aircashPayoutService.checkUserV4($scope.checkUserV4Request)
            .then(function (response) {

                if (response) {
                    $scope.checkUserV4RequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.checkUserV4ResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.checkUserV4Sequence = response.Sequence;
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.checkUserV4Response = JSON.stringify(response.ServiceResponse, null, 4);
                    $scope.checkUserV4Request = JSON.stringify(response.ServiceRequest, null, 4);
                }
                $scope.checkUserV4ServiceBusy = false;
                $scope.checkUserV4ServiceResponse = true;
            }, () => {
                console.log("error");
                $scope.checkUserV4ServiceBusy = false;
                $scope.checkUserV4ServiceResponse = false;
            });
    }
    $scope.getCurlCheckUserV4 = function () {
        $scope.curlCheckUserV4ServiceBusy = true;
        $scope.curlCheckUserV4Responded = false;
        $scope.checkUserV4Request = {
            partnerUserID: $scope.checkUserV4Model.partnerUserId,
            partnerID: $scope.checkUserV4Model.partnerId,
            phoneNumber: $scope.checkUserV4Model.phoneNumber,
            parameters: []
        }
        if ($scope.checkboxCheckUser.personalIdentificationCode) $scope.checkUserV4Request.parameters.push({ key: "PersonalIdentificationCode", value: $scope.checkUserV4Model.personalIdentificationCode })
        if ($scope.checkboxCheckUser.match) $scope.checkUserV4Request.parameters.push({ key: "PayerFirstName", value: $scope.checkUserV4Model.firstName }, { key: "PayerLastName", value: $scope.checkUserV4Model.lastName }, { key: "PayerBirthDate", value: $scope.checkUserV4Model.birthDate.toLocaleDateString('en-CA') });
        aircashPayoutService.getCurlCheckUserV4($scope.checkUserV4Request)
            .then(function (response) {

                if (response) {
                    $scope.CurlResponseCheckUserV4 = response;
                }
                $scope.curlCheckUserV4ServiceBusy = false;
                $scope.curlCheckUserV4Responded = true;
            }, () => {
                console.log("error");
                $scope.curlCheckUserV4ServiceBusy = false;
                $scope.curlCheckUserV4Responded = false;
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
        $scope.createPayoutRequest = {
            partnerID: $scope.createPayoutModel.partnerId,
            PartnerTransactionID: $scope.createPayoutModel.partnerTransactionId,
            PartnerUserID: $scope.createPayoutModel.userId,
            CurrencyID: $scope.createPayoutModel.currencyId,
            phoneNumber: $scope.createPayoutModel.phoneNumber,
            amount: $scope.createPayoutModel.amount,
        }
        aircashPayoutService.createPayout($scope.createPayoutRequest)
            .then(function (response) {

                if (response) {
                    $scope.createPayoutRequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.createPayoutResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.createPayoutSequence = response.Sequence;
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.createPayoutResponse = JSON.stringify(response.ServiceResponse, null, 4);
                    $scope.createPayoutRequest = JSON.stringify(response.ServiceRequest, null, 4);
                    $scope.getTransactions(false);
                }
                $scope.createPayoutServiceBusy = false;
                $scope.createPayoutServiceResponse = true;
            }, () => {
                console.log("error");
                $scope.createPayoutServiceBusy = false;
                $scope.createPayoutServiceResponse = false;
            });
    }
    $scope.createPayoutV4 = function () {
        $scope.createPayoutV4ServiceBusy = true;
        $scope.createPayoutV4ServiceResponse = false;
        $scope.createPayoutV4Request = {
            partnerID: $scope.createPayoutV4Model.partnerId,
            PartnerTransactionID: $scope.createPayoutV4Model.partnerTransactionId,
            PartnerUserID: $scope.createPayoutV4Model. userId,
            CurrencyID: $scope.createPayoutV4Model.currencyId,
            phoneNumber: $scope.createPayoutV4Model.phoneNumber,
            amount: $scope.createPayoutV4Model.amount,
            parameters: []                        
        }
        if ($scope.checkboxCreatePayout.personalIdentificationCode) $scope.createPayoutV4Request.parameters.push({ key: "PersonalIdentificationCode", value: $scope.createPayoutV4Model.personalIdentificationCode })
        if ($scope.checkboxCreatePayout.match) $scope.createPayoutV4Request.parameters.push({ key: "PayerFirstName", value: $scope.createPayoutV4Model.firstName }, { key: "PayerLastName", value: $scope.createPayoutV4Model.lastName }, { key: "PayerBirthDate", value: $scope.createPayoutV4Model.birthDate.toLocaleDateString('en-CA') });
        aircashPayoutService.createPayoutV4($scope.createPayoutV4Request)
            .then(function (response) {

                if (response) {
                    $scope.createPayoutV4RequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.createPayoutV4ResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.createPayoutV4Sequence = response.Sequence;
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.createPayoutV4Response = JSON.stringify(response.ServiceResponse, null, 4);
                    $scope.createPayoutV4Request = JSON.stringify(response.ServiceRequest, null, 4);
                    $scope.getTransactions(false);
                }
                $scope.createPayoutV4ServiceBusy = false;
                $scope.createPayoutV4ServiceResponse = true;
            }, () => {
                console.log("error");
                $scope.createPayoutV4ServiceBusy = false;
                $scope.createPayoutV4ServiceResponse = false;
            });
    }
    $scope.getCurlCreatePayoutV4 = function () {
        $scope.curlCreatePayoutV4ServiceBusy = true;
        $scope.createPayoutV4ServiceResponse = false;
        $scope.createPayoutV4Request = {
            partnerID: $scope.createPayoutV4Model.partnerId,
            PartnerTransactionID: $scope.createPayoutV4Model.partnerTransactionId,
            PartnerUserID: $scope.createPayoutV4Model.userId,
            CurrencyID: $scope.createPayoutV4Model.currencyId,
            phoneNumber: $scope.createPayoutV4Model.phoneNumber,
            amount: $scope.createPayoutV4Model.amount,
            parameters: []
        }
        if ($scope.checkboxCreatePayout.personalIdentificationCode) $scope.createPayoutV4Request.parameters.push({ key: "PersonalIdentificationCode", value: $scope.createPayoutV4Model.personalIdentificationCode })
        if ($scope.checkboxCreatePayout.match) $scope.createPayoutV4Request.parameters.push({ key: "PayerFirstName", value: $scope.createPayoutV4Model.firstName }, { key: "PayerLastName", value: $scope.createPayoutV4Model.lastName }, { key: "PayerBirthDate", value: $scope.createPayoutV4Model.birthDate.toLocaleDateString('en-CA') });
        aircashPayoutService.getCurlCreatePayoutV4($scope.createPayoutV4Request)
            .then(function (response) {

                if (response) {
                    $scope.CurlResponseCreatePayoutV4 = response;
                }
                $scope.curlCreatePayoutV4ServiceBusy = false;
                $scope.curlCreatePayoutV4ServiceResponse = true;
            }, () => {
                console.log("error");
                $scope.curlCreatePayoutV4ServiceBusy = false;
                $scope.curlCreatePayoutV4ServiceResponse = false;
            });
    }


    $scope.getCurlCreatePayout = function () {
        $scope.curlCreatePayoutServiceBusy = true;
        $scope.curlCreatePayoutServiceResponse = false;
        $scope.createPayoutRequest = {
            partnerID: $scope.createPayoutModel.partnerId,
            PartnerTransactionID: $scope.createPayoutModel.partnerTransactionId,
            PartnerUserID: $scope.createPayoutModel.userId,
            CurrencyID: $scope.createPayoutModel.currencyId,
            phoneNumber: $scope.createPayoutModel.phoneNumber,
            amount: $scope.createPayoutModel.amount,
        }
        aircashPayoutService.getCurlCreatePayout($scope.createPayoutRequest)
            .then(function (response) {

                if (response) {
                    $scope.CurlResponseCreatePayout = response;
                }
                $scope.curlCreatePayoutServiceBusy = false;
                $scope.curlCreatePayoutServiceResponse = true;
            }, () => {
                console.log("error");
                $scope.curlCreatePayoutServiceBusy = false;
                $scope.curlCreatePayoutServiceResponse = false;
            });
    }

    $scope.transactionModel = {};
    $scope.transactionModel.partnerId = $scope.partnerIds.AircashPayoutPartnerId;
    $scope.checkTransactionStatus = function () {
        $scope.checkTransactionStatusServiceBusy = true;
        $scope.checkTransactionStatusServiceResponse = false;
        aircashPayoutService.checkTransactionStatus($scope.transactionModel)
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

    $scope.transactionCurlModel = {};
    $scope.transactionCurlModel.partnerId = "0a13af2f-9d8e-4afd-b3e0-8f4c24095cd6";
    $scope.getCurlCheckTransactionStatus = function () {
        $scope.CurlCheckTransactionStatusServiceBusy = true;
        $scope.CurlCheckTransactionStatusServiceResponse = false;
        aircashPayoutService.getCurlCheckTransactionStatus($scope.transactionCurlModel)
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

    $scope.currentPayoutErrorCode = 0;
    $scope.errorPayoutResponded = false;
    $scope.errorPayoutServiceBusy = false;
    $scope.simulatePayoutError = (errCode) => {
        $scope.errorPayoutResponded = false;
        $scope.errorPayoutServiceBusy = true;
        aircashPayoutService.simulatePayoutError(errCode)
            .then(function (response) {
                if (response) {
                    $scope.errorPayoutRequestDateTimeUTC = response.RequestDateTimeUTC;
                    $scope.errorPayoutResponseDateTimeUTC = response.ResponseDateTimeUTC;
                    $scope.errorPayoutSequence = response.Sequence;
                    $scope.errorPayoutRequestCopy = JSON.stringify(response.ServiceRequest, null, 4);
                    response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                    $scope.errorPayoutResponse = JSON.stringify(response.ServiceResponse, null, 4);
                    $scope.errorPayoutRequest = JSON.stringify(response.ServiceRequest, null, 4);
                }
                $scope.currentPayoutErrorCode = errCode;
                $scope.errorPayoutResponded = true;
                $scope.errorPayoutServiceBusy = false;
            }, () => {
                console.log("error");
            });
    }

    function setRequestExamples(generateSignatureModel) {
        $scope.requestExample = {
            personalIdentificationCode: {
                key: "PersonalIdentificationCode",
                value: generateSignatureModel.personalIdentificationCode
            },
            firstName: {
                key: "PayerFirstName",
                value: generateSignatureModel.firstname
            },
            lastName: {
                key: "PayerLastName",
                value: generateSignatureModel.lastname
            },
            birthDate: {
                key: "PayerBirthDate",
                value: generateSignatureModel.birthDate.toLocaleDateString('en-CA')
            }
        }
    }


    /*
     * START: CheckUser Response Example
     */
 
    $scope.checkUserGenerateSignatureModel = {
        firstname: "John",
        lastname: "Doe",
        birthDate: new Date('1990-01-01'),
        personalIdentificationCode: "RSSMRAURTMLARSNL",
        phoneNumber: "385981234567",
        partnerUserID: "12345",
        partnerID: "290a2fe9-b1e0-4627-8a43-3f7ba472a4a0"
    }
    $scope.checkboxCheckUserModel = {
        personalIdentificationCode: false,
        match: false
    }
    var typingTimerCheckUser;
    $scope.requestCheckUserChanged = function () {
        $scope.checkUserParameters = [];

        setRequestExamples($scope.checkUserGenerateSignatureModel);

        if ($scope.checkboxCheckUserModel.match)
            $scope.checkUserParameters.push(
                $scope.requestExample.firstName,
                $scope.requestExample.lastName,
                $scope.requestExample.birthDate,
            );
        if ($scope.checkboxCheckUserModel.personalIdentificationCode) $scope.checkUserParameters.push($scope.requestExample.personalIdentificationCode);
        
        clearTimeout(typingTimerCheckUser);
        typingTimerCheckUser = setTimeout(() => {
            $scope.generateCheckUserSignature();
        }, 1000);
    }

    $scope.generateCheckUserSignatureBusy = false;
    $scope.generateCheckUserSignatureResponded = false;
    $scope.generateCheckUserSignature  = function () {
        $scope.generateCheckUserSignatureBusy = true;
        $scope.generateCheckUserSignatureResponded = false;
        $scope.checkUserRequestExample = {
            partnerUserID: $scope.checkUserGenerateSignatureModel.partnerUserID,
            partnerID: $scope.checkUserGenerateSignatureModel.partnerID,
            phoneNumber: $scope.checkUserGenerateSignatureModel.phoneNumber,
            parameters: $scope.checkUserParameters
        }
        aircashPayoutService.generateCheckUserSignature($scope.checkUserRequestExample)
            .then(function (response) {
                if (response) {
                    $scope.generateCheckUserSignatureResponse = JSON.stringify(response.AircashPayoutCheckUser, null, 4);
                    $scope.checkUserRequestExampleSequence = response.Sequence;
                }
                $scope.generateCheckUserSignatureBusy = false;
                $scope.generateCheckUserSignatureResponded = true;
            }, () => {
                $rootScope.showGritter("Error");
                $scope.generateCheckUserSignatureBusy = false;
            });
    }

    $scope.requestCheckUserChanged();

    /*
     * END: CheckUser Response Example
     */

    /*
    * START: CreatePayout Response Example
    */

    $scope.createPayoutGenerateSignatureModel = {
        firstname: "John",
        lastname: "Doe",
        birthDate: new Date('1990-01-01'),
        personalIdentificationCode: "RSSMRAURTMLARSNL",
        phoneNumber: "385981234567",
        partnerUserID: "12345",
        partnerID: "290a2fe9-b1e0-4627-8a43-3f7ba472a4a0",
        partnerTransactionID: "e631a091-f239-40ce-9f5d-bd9a443b2f55",
        amount: 123.45,
        currencyID: 978
    }
    $scope.checkboxCreatePayoutModel = {
        personalIdentificationCode: false,
        match: false
    }
    var typingTimerCreatePayout;
    $scope.requestCreatePayoutChanged = function () {
        $scope.createPayoutParameters = [];

        setRequestExamples($scope.createPayoutGenerateSignatureModel);

        if ($scope.checkboxCreatePayoutModel.match)
            $scope.createPayoutParameters.push(
                $scope.requestExample.firstName,
                $scope.requestExample.lastName,
                $scope.requestExample.birthDate,
            );
        if ($scope.checkboxCreatePayoutModel.personalIdentificationCode) $scope.createPayoutParameters.push($scope.requestExample.personalIdentificationCode);

        clearTimeout(typingTimerCreatePayout);
        typingTimerCreatePayout = setTimeout(() => {
            $scope.generateCreatePayoutSignature();
        }, 1000);
    }

    $scope.generateCreatePayoutSignatureBusy = false;
    $scope.generateCreatePayoutSignatureResponded = false;
    $scope.generateCreatePayoutSignature = function () {
        $scope.generateCreatePayoutSignatureBusy = true;
        $scope.generateCreatePayoutSignatureResponded = false;
        $scope.createPayoutRequestExample = {
            partnerUserID: $scope.createPayoutGenerateSignatureModel.partnerUserID,
            partnerID: $scope.createPayoutGenerateSignatureModel.partnerID,
            phoneNumber: $scope.createPayoutGenerateSignatureModel.phoneNumber,
            partnerTransactionID: $scope.createPayoutGenerateSignatureModel.partnerTransactionID,
            amount: $scope.createPayoutGenerateSignatureModel.amount,
            currencyID: $scope.createPayoutGenerateSignatureModel.currencyID,
            parameters: $scope.createPayoutParameters
        }
        aircashPayoutService.generateCreatePayoutSignature($scope.createPayoutRequestExample)
            .then(function (response) {
                if (response) {
                    $scope.generateCreatePayoutSignatureResponse = JSON.stringify(response.AircashPayoutCreatePayout, null, 4);
                    $scope.createPayoutRequestExampleSequence = response.Sequence;
                }
                $scope.generateCreatePayoutSignatureBusy = false;
                $scope.generateCreatePayoutSignatureResponded = true;
            }, () => {
                $rootScope.showGritter("Error");
                $scope.generateCreatePayoutSignatureBusy = false;
            });
    }

    $scope.requestCreatePayoutChanged();

    /*
     * END: CreatePayout Response Example
     */

    $scope.loadMore = function (pageSize) {
        $scope.pageSize = pageSize;
        $scope.getTransactions(false);
    };

    $scope.checkUserModelSetDate = function (date) {
        $scope.checkUserGenerateSignatureModel.birthDate = date;
        $scope.requestCheckUserChanged();
    }
    $scope.createPayoutModelSetDate = function (date) {
        $scope.createPayoutGenerateSignatureModel.birthDate = date;
        $scope.requestCreatePayoutChanged();
    }
    $scope.setCheckUserDate = function (date) {
        $scope.checkUserV4Model.birthDate = date;
    }
    $scope.setCreatePayoutDate = function (date) {
        $scope.createPayoutV4Model.birthDate = date;
    }

    $scope.setDefaults();

    $scope.getTransactions();

    $scope.showVideoAcPayout = function () {
        $("#videoModalAcPayout").modal("show");
    }

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
                    "currencyID": 978,
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
                phoneNumber: "385995712738",
                signature: "VA514erV6V..."
            },
            responseExample: {
                status: 3
            },
            errorResponseExample: {
                message: "An error has occurred."
            }
        },
        checkUserV4: {
            requestExample: {
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
                    },
                    {
                        "Key": "PersonalIdentificationCode",
                        "Value": "RSSMRAURTMLARSNL"
                    }
                ],
                Signature: "IW8kFZrS4W...."
            },
            responseExample: {
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
                    Parameters: [{
                        Key: "AircashUserID",
                        Value: "ccc1b67f-c871-45ff-9226-81b9e84d07a0"
                    }]
                }
            },
        },
        createPayout: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionID: "45c38393-274b-4761-902e-23db30736563",
                amount: 100,
                phoneNumber: "385995712738",
                partnerUserID: "574f32a7-4ecb-48b2-9723-ac660b9c835d",
                currencyID: 978,
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
        createPayoutV4: {
            requestExample: {
                "PartnerID": "0a13af2f-9d8e-4afd-b3e0-8f4c24095cd6",
                "PartnerTransactionID": "e631a091-f239-40ce-9f5d-bd9a443b2f55",
                "Amount": 123.45,
                "PhoneNumber": "385981234567",
                "PartnerUserID": "db0c97e7-2029-44c0-97b6-6d3faee3ab34",
                "Parameters": [
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
                "CurrencyID": 978,
                "Signature": "KGXKKl/pjN..."
            },
            responseExample: {
                AircashTransactionID: "760aed25-b409-450b-937d-ba4f0ffa33cc",
                Parameters: [{
                    Key: "AircashUserID",
                    Value: "ccc1b67f-c871-45ff-9226-81b9e84d07a0"
                }]
            },
            errorResponseExample: {
                "code": 4000,
                "message": "Unknown phone number"
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


    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }


}]);