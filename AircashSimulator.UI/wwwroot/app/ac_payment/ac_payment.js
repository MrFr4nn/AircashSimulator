﻿var acPaymentModule = angular.module('acPayment', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.acPayment', {
            data: {
                pageTitle: 'Aircash Payment'
            },
            url: "/aircashPayment",
            controller: 'acPaymentCtrl',
            templateUrl: 'app/ac_payment/ac_payment.html?v=' + Global.appVersion
        });
});

acPaymentModule.service("acPaymentService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            generateCheckPlayerSignature: generateCheckPlayerSignature,
            generateCreateAndConfirmSignature: generateCreateAndConfirmSignature,
            checkPlayer: checkPlayer,
            createAndConfirm: createAndConfirm,
        });
        function generateCheckPlayerSignature(parameters) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashPayment/GenerateCheckPlayerSignature",
                data: {
                    Parameters: parameters
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
        function generateCreateAndConfirmSignature(parameters, amount) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashPayment/GenerateCreateAndConfirmSignature",
                data: {
                    Amount: amount,
                    Parameters: parameters
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
        function checkPlayer(endpint, parameters) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashPayment/CheckPlayerPartner",
                data: {
                    Endpoint: endpint,
                    Parameters: parameters
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
        function createAndConfirm(endpint, parameters, amount, transactionId) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashPayment/CreateAndConfirmPartner",
                data: {
                    Endpoint: endpint,
                    Amount: amount,
                    TransactionId: transactionId,
                    Parameters: parameters
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
    }
]);

acPaymentModule.controller("acPaymentCtrl", ['$scope', '$localStorage', '$state', 'acPaymentService', '$filter', '$timeout', '$http', 'JwtParser', '$uibModal', 'config', 'HelperService', '$rootScope', function ($scope, $localStorage,  $state, acPaymentService, $filter, $timeout, $http, JwtParser, $uibModal, config, HelperService, $rootScope) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);

    $scope.showDeepLink = $scope.partnerRoles.indexOf("AMDDeepLink") == -1 ? false : true;

    $scope.copyToClipboard = function (isProduction) {
        if (isProduction) {
            navigator.clipboard.writeText($('#prodLink').text());
            return;
        }
        navigator.clipboard.writeText($('#testLink').text());
    }

    $scope.copy = function (data) {
        navigator.clipboard.writeText(data);
    }

    $scope.checkPlayerGenerateSignatureModel = {
        identificator: "aircash",
        currency: "EUR",
        countryCode: "HR",
        merchantId: "100",
        firstname: "John",
        lastname: "Doe",
        birthDate: new Date('1990-01-01'),
        partnerUserId: "25d54174-b146-4a2f-8504-dd580ce54bf9",
    }
    $scope.createAndConfirmGenerateSignatureModel = {
        identificator: "aircash",
        currency: "EUR",
        countryCode: "HR",
        merchantId: "100",
        firstname: "John",
        lastname: "Doe",
        birthDate: new Date('1990-01-01'),
        amount: 123.45,
        partnerUserId: "25d54174-b146-4a2f-8504-dd580ce54bf9",

    }
    function setRequestExamples(generateSignatureModel) {
        $scope.requestExample = {
            username: {
                key: "username",
                value: generateSignatureModel.identificator
            },
            email: {
                key: "email",
                value: generateSignatureModel.identificator
            },
            currency: {
                key: "currencyIsoCode",
                value: generateSignatureModel.currency
            },
            countryCode: {
                key: "countryIsoCode",
                value: generateSignatureModel.countryCode
            },
            aircashUserID: {
                key: "AircashUserID",
                value: generateSignatureModel.aircashUserID
            },
            //firstName: {
            //    key: "PayerFirstName",
            //    value: generateSignatureModel.firstname
            //},
            //lastName: {
            //    key: "PayerLastName",
            //    value: generateSignatureModel.lastname
            //},
            //birthDate: {
            //    key: "PayerBirthDate",
            //    value: generateSignatureModel.birthDate.toLocaleDateString('en-CA')
            //},
            merchantId: {
                key: "merchantId",
                Value: generateSignatureModel.merchantId
            },
            partnerUserId:
            {
                key: "PartnerUserId",
                value: generateSignatureModel.partnerUserId
            },
            //phoneNumber:
            //{
            //    key: "AircashUserPhoneNumber",
            //    value: generateSignatureModel.phoneNumber
            //}
        }
    }

    setRequestExamples($scope.checkPlayerGenerateSignatureModel);

    $scope.checkboxCheckPlayerModel = {
        currency: false,
        countryCode: false,
        match: false,
        merchant: false,
        partnerUser : false
    }

    $scope.checkboxCreateAndConfirmModel = {
        currency: false,
        countryCode: false,
        match: false,
        merchant: false,
        partnerUser: false,
    }

    $scope.showVideoMarketplaceDeposit = function () {
        $("#videoModalMarketplaceDeposit").modal("show");
    }
    $scope.config = {};
    $scope.checkPlayerUsernameEmailSelected = "email";
    $scope.checkPlayerParameters = [];
    $scope.checkPlayerParameters.push($scope.requestExample.username);

    $scope.createAndConfirmUsernameEmailSelected = "username";
    $scope.createAndConfirmParameters = [];
    $scope.createAndConfirmParameters.push($scope.requestExample.username);

    var typingTimerCheckPlayer;

    $scope.requestCheckPlayerChanged = function () {
        $scope.checkPlayerUsernameEmailSelected = $('#select').val();

        setRequestExamples($scope.checkPlayerGenerateSignatureModel);

        $scope.checkPlayerParameters = [];
        if ($scope.config.checkPlayerUsernameEmailSelected == "email") {
            if ($scope.checkPlayerGenerateSignatureModel.identificator == "aircash") {
                $scope.checkPlayerGenerateSignatureModel.identificator = "user@example.net";
                setRequestExamples($scope.checkPlayerGenerateSignatureModel);
            }
            $scope.checkPlayerParameters.push($scope.requestExample.email);
        } else {

            if ($scope.checkPlayerGenerateSignatureModel.identificator == "user@example.net") {
                $scope.checkPlayerGenerateSignatureModel.identificator = "aircash";
                setRequestExamples($scope.checkPlayerGenerateSignatureModel);
            }
            $scope.checkPlayerParameters.push($scope.requestExample.username);
        }


        if ($scope.checkboxCheckPlayerModel.currency) $scope.checkPlayerParameters.push($scope.requestExample.currency);
        if ($scope.checkboxCheckPlayerModel.countryCode) $scope.checkPlayerParameters.push($scope.requestExample.countryCode);
        if ($scope.checkboxCheckPlayerModel.merchant) $scope.checkPlayerParameters.push($scope.requestExample.merchantId);
        if ($scope.checkboxCheckPlayerModel.aircashUserID) $scope.checkPlayerParameters.push($scope.requestExample.aircashUserID);
        //if ($scope.checkboxCheckPlayerModel.phoneNumber) $scope.checkPlayerParameters.push($scope.requestExample.phoneNumber);
        if ($scope.checkboxCheckPlayerModel.match)
            $scope.checkPlayerParameters.push(
                $scope.requestExample.firstName,
                $scope.requestExample.lastName,
                $scope.requestExample.birthDate,
            );

        $scope.aircashPayment.checkPlayer.requestExample = {
            parameters: $scope.checkPlayerParameters,
            signature: "HrlYnqqr...Cgs = "
        }

        clearTimeout(typingTimerCheckPlayer);
        typingTimerCheckPlayer = setTimeout(() => {
            $scope.generateCheckPlayerSignature();
        }, 1000);
    }

    var typingTimerCreateAndConfirm;
    $scope.requestCreateAndConfirmChanged = function () {
        $scope.createAndConfirmUsernameEmailSelected = $('#select2').val();

        setRequestExamples($scope.createAndConfirmGenerateSignatureModel);

        $scope.createAndConfirmParameters = [];
        if ($scope.config.createAndConfirmUsernameEmailSelected == "email") {
            if ($scope.createAndConfirmGenerateSignatureModel.identificator == "aircash") {
                $scope.createAndConfirmGenerateSignatureModel.identificator = "user@example.net";
                setRequestExamples($scope.createAndConfirmGenerateSignatureModel);
            }
            $scope.createAndConfirmParameters.push($scope.requestExample.email);
        } else {
            if ($scope.createAndConfirmGenerateSignatureModel.identificator == "user@example.net") {
                $scope.createAndConfirmGenerateSignatureModel.identificator = "aircash";
                setRequestExamples($scope.createAndConfirmGenerateSignatureModel);
            }
            $scope.createAndConfirmParameters.push($scope.requestExample.username);
        }

        if ($scope.checkboxCreateAndConfirmModel.currency) $scope.createAndConfirmParameters.push($scope.requestExample.currency);
        if ($scope.checkboxCreateAndConfirmModel.countryCode) $scope.createAndConfirmParameters.push($scope.requestExample.countryCode);
        if ($scope.checkboxCreateAndConfirmModel.merchant) $scope.createAndConfirmParameters.push($scope.requestExample.merchantId);
        if ($scope.checkboxCreateAndConfirmModel.aircashUserID) $scope.createAndConfirmParameters.push($scope.requestExample.aircashUserID);
        if ($scope.checkboxCreateAndConfirmModel.partnerUser) $scope.createAndConfirmParameters.push($scope.requestExample.partnerUserId);
        if ($scope.checkboxCreateAndConfirmModel.match)
            $scope.createAndConfirmParameters.push(
                $scope.requestExample.firstName,
                $scope.requestExample.lastName,
                $scope.requestExample.birthDate,
            );

        $scope.aircashPayment.createAndConfirmPayment.requestExample = {
            transactionID: "c1cf13b4-52ce-4b2f-9f9b-9d31cc1f800a",
            amount: $scope.createAndConfirmGenerateSignatureModel.amount || 123.45,
            parameters: $scope.createAndConfirmParameters,
            signature: "Gng+D6+3...P/4="
        }

        clearTimeout(typingTimerCreateAndConfirm);
        typingTimerCreateAndConfirm = setTimeout(() => {
            $scope.generateCreateAndConfirmSignature();
        }, 1000);

    }

    $scope.generateCheckPlayerSignatureBusy = false;
    $scope.generateCheckPlayerSignatureResponded = false;
    $scope.generateCheckPlayerSignature = function () {
        $scope.generateCheckPlayerSignatureBusy = true;
        $scope.generateCheckPlayerSignatureResponded = false;
        acPaymentService.generateCheckPlayerSignature($scope.checkPlayerParameters)
            .then(function (response) {
                if (response) {
                    $scope.generateCheckPlayerSignatureResponse = JSON.stringify(response.aircashPaymentCheckPlayer, null, 4);
                    $scope.CheckPlayerRequestExampleSequence = response.sequence;
                }
                $scope.generateCheckPlayerSignatureBusy = false;
                $scope.generateCheckPlayerSignatureResponded = true;
            }, () => {
                $rootScope.showGritter("Error");
                $scope.generateCheckPlayerSignatureBusy = false;
            });
    }

    $scope.generateCreateAndConfirmSignatureBusy = false;
    $scope.generateCreateAndConfirmSignatureResponded = false;
    $scope.generateCreateAndConfirmSignature = function () {
        $scope.generateCreateAndConfirmSignatureBusy = true;
        $scope.generateCreateAndConfirmSignatureResponded = false;
        acPaymentService.generateCreateAndConfirmSignature($scope.createAndConfirmParameters, $scope.createAndConfirmGenerateSignatureModel.amount)
            .then(function (response) {
                if (response) {
                    $scope.generateCreateAndConfirmSignatureResponse = JSON.stringify(response.aircashPaymentCreateAndConfirmPayment, null, 4);
                    $scope.CreateAndConfirmRequestExampleSequence = response.sequence;
                }
                $scope.generateCreateAndConfirmSignatureBusy = false;
                $scope.generateCreateAndConfirmSignatureResponded = true;
            }, () => {
                $rootScope.showGritter("Error");
                $scope.generateCreateAndConfirmSignatureBusy = false;
            });
    }

    $scope.checkPlayerSetDate = function (date) {
        $scope.checkPlayerGenerateSignatureModel.birthDate = date;
        $scope.requestCheckPlayerChanged();
    }

    $scope.createAndConfirmSetDate = function (date) {
        $scope.createAndConfirmGenerateSignatureModel.birthDate = date;
        $scope.requestCreateAndConfirmChanged();
    }

    $scope.checkboxCheckPlayer = {};
    $scope.checkPlayerModel = {
        endpoint: config.baseUrl + "AircashPayment/CheckPlayer",
        birthDate: new Date('2000-01-01'),
        identificator: "johndoe"
    };
    $scope.checkPlayerBusy = false;
    $scope.checkPlayerResponded = false;
    $scope.checkPlayer = function () {
        $scope.checkPlayerBusy = true;
        $scope.checkPlayerResponded = false;
        setRequestExamples($scope.checkPlayerModel);
        acPaymentService.checkPlayer($scope.checkPlayerModel.endpoint, CheckPlayerRequstGeneration())
            .then(function (response) {
                if (response) {
                    $scope.checkPlayerRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.checkPlayerResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.checkPlayerSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.checkPlayerResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.checkPlayerRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.checkPlayerBusy = false;
                $scope.checkPlayerResponded = true;
            }, () => {
                $rootScope.showGritter("Error");
                $scope.checkPlayerBusy = false;
                $scope.checkPlayerResponded = true;
            });
    }
    $scope.createAndConfirmCheckbox = {};
    $scope.createAndConfirmModel = {
        transactionId: HelperService.NewGuid(),
        endpoint: config.baseUrl + "AircashPayment/CreateAndConfirmPayment",
        birthDate: new Date('2000-01-01'),
        amount: 10,
        identificator: "johndoe"
    };
    $scope.createAndConfirmBusy = false;
    $scope.createAndConfirmResponded = false;
    $scope.createAndConfirm = function () {
        $scope.createAndConfirmBusy = true;
        $scope.createAndConfirmResponded = false;
        setRequestExamples($scope.createAndConfirmModel);
        acPaymentService.createAndConfirm($scope.createAndConfirmModel.endpoint, CreateAndConfirmRequstGeneration(), $scope.createAndConfirmModel.amount, $scope.createAndConfirmModel.transactionId)
            .then(function (response) {
                if (response) {
                    console.log(response);
                    $scope.createAndConfirmRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.createAndConfirmResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.createAndConfirmSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.createAndConfirmResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.createAndConfirmRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.createAndConfirmBusy = false;
                $scope.createAndConfirmResponded = true;
            }, () => {
                $rootScope.showGritter("Error");
                $scope.createAndConfirmBusy = false;
                $scope.createAndConfirmResponded = true;
            });
    }
    $scope.checkPlayerModelSetDate = function (date) {
        $scope.checkPlayerModel.birthDate = date;
        $scope.requestCreateAndConfirmChanged();
    }
    $scope.createAndConfirmModelSetDate = function (date) {
        $scope.createAndConfirmModel.birthDate = date;
        $scope.requestCreateAndConfirmChanged();
    }
    $scope.select = {};
    $scope.checkboxCreateAndConfirm = {};
    function CreateAndConfirmRequstGeneration() {
        $scope.createAndConfirmParameters = [];
        if ($scope.select.createAndConfirmUsernameEmailSelected == "email") {
            if ($scope.createAndConfirmModel.identificator == "aircash") {
                $scope.createAndConfirmModel.identificator = "user@example.net";
                setRequestExamples($scope.createAndConfirmModel);
            }
            $scope.createAndConfirmParameters.push($scope.requestExample.email);
        } else {
            if ($scope.createAndConfirmModel.identificator == "user@example.net") {
                $scope.createAndConfirmModel.identificator = "aircash";
                setRequestExamples($scope.createAndConfirmModel);
            }
            $scope.createAndConfirmParameters.push($scope.requestExample.username);
        }


        if ($scope.checkboxCreateAndConfirm.currency) $scope.createAndConfirmParameters.push($scope.requestExample.currency);
        if ($scope.checkboxCreateAndConfirm.countryCode) $scope.createAndConfirmParameters.push($scope.requestExample.countryCode);
        if ($scope.checkboxCreateAndConfirm.merchant) $scope.createAndConfirmParameters.push($scope.requestExample.merchantId);
        if ($scope.checkboxCreateAndConfirm.aircashUserID) $scope.createAndConfirmParameters.push($scope.requestExample.aircashUserID);
        if ($scope.checkboxCreateAndConfirm.partnerUser) $scope.createAndConfirmParameters.push($scope.requestExample.partnerUserId);
        if ($scope.checkboxCreateAndConfirm.match)
            $scope.createAndConfirmParameters.push(
                $scope.requestExample.firstName,
                $scope.requestExample.lastName,
                $scope.requestExample.birthDate,
            );

        return $scope.createAndConfirmParameters;
    }
    function CheckPlayerRequstGeneration() {
        $scope.checkPlayerParameters = [];
        if ($scope.select.checkPlayerUsernameEmailSelected == "email") {
            if ($scope.checkPlayerModel.identificator == "aircash") {
                $scope.checkPlayerModel.identificator = "user@example.net";
                setRequestExamples($scope.checkPlayerModel);
            }
            $scope.checkPlayerParameters.push($scope.requestExample.email);
        } else {
            if ($scope.checkPlayerModel.identificator == "user@example.net") {
                $scope.checkPlayerModel.identificator = "aircash";
                setRequestExamples($scope.checkPlayerModel);
            }
            $scope.checkPlayerParameters.push($scope.requestExample.username);
        }


        if ($scope.checkboxCheckPlayer.currency) $scope.checkPlayerParameters.push($scope.requestExample.currency);
        if ($scope.checkboxCheckPlayer.countryCode) $scope.checkPlayerParameters.push($scope.requestExample.countryCode);
        if ($scope.checkboxCheckPlayer.merchant) $scope.checkPlayerParameters.push($scope.requestExample.merchantId);
        if ($scope.checkboxCheckPlayer.aircashUserID) $scope.checkPlayerParameters.push($scope.requestExample.aircashUserID);
        /*if ($scope.checkboxCheckPlayer.phoneNumber) $scope.checkPlayerParameters.push($scope.requestExample.phoneNumber);*/
        if ($scope.checkboxCheckPlayer.match)
            $scope.checkPlayerParameters.push(
                $scope.requestExample.firstName,
                $scope.requestExample.lastName,
                $scope.requestExample.birthDate,
            );
       
        return $scope.checkPlayerParameters;
    }

    $scope.responseParametersExample = {
        payerMaxAllowedAmount: {
            "key": "payerMaxAllowedAmount",
            "type": "Decimal",
            "value": "123.45"
        },
        payerPhoneNumber: {
            "key": "payerPhoneNumber",
            "type": "String",
            "value": "385981234567"
        },
        personalIdentificationCode: {
            "key": "payerPersonalIdentificationCode",
            "type": "String",
            "value": "RSSMRAURTMLARSNL"
        },
        payerFirstName: {
            "key": "payerFirstName",
            "value": "John",
            "type": "String"
        },
        payerLastName: {
            "key": "payerLastName",
            "value": "Doe",
            "type": "String"
        },
        payerBirthDate: {
            "key": "payerBirthDate",
            "value": "1990-01-01",
            "type": "Date"
        },
        partnerUserID: {
            "key": "partnerUserID",
            "value": "40ecee36-da23-48be-bf89-2d641d92b3ca",
            "type": "String"
        }
    }

    $scope.aircashPayment = {
        checkPlayer: {
            requestExample: {
                parameters: $scope.checkPlayerParameters,
                signature: "HrlYnqqr...Cgs = "
            },
            responseExample: {
                isPlayer: true,
                error: null,
                parameters: [
                    {
                        "key": "partnerUserID",
                        "value": "40ecee36-da23-48be-bf89-2d641d92b3ca",
                        "type": "String"
                    }
                ]
            },
            responseExampleAircashMatchingPersonalData: {
                isPlayer: true,
                error: null,
                parameters: [
                    {
                        "key": "partnerUserID",
                        "value": "40ecee36-da23-48be-bf89-2d641d92b3ca",
                        "type": "String"
                    },
                    {
                        "key": "payerFirstName",
                        "value": "John",
                        "type": "String"
                    },
                    {
                        "key": "payerLastName",
                        "value": "Doe",
                        "type": "String"
                    },
                    {
                        "key": "payerBirthDate",
                        "value": "1990-01-01",
                        "type": "Date"
                    }
                ]
            },
            responseExampleAircashMatchingPersonalDataAndMaxAmount: {
                isPlayer: true,
                error: null,
                parameters: [
                    {
                        "key": "partnerUserID",
                        "value": "40ecee36-da23-48be-bf89-2d641d92b3ca",
                        "type": "String"
                    },
                    {
                        "key": "payerFirstName",
                        "value": "John",
                        "type": "String"
                    },
                    {
                        "key": "payerLastName",
                        "value": "Doe",
                        "type": "String"
                    },
                    {
                        "key": "payerBirthDate",
                        "value": "1990-01-01",
                        "type": "Date"
                    },
                    {
                        "key": "payerMaxAllowedAmount",
                        "type": "Decimal",
                        "value": "123.45"
                    },
                ]
            },
            responseExampleMaxAmount: {
                isPlayer: true,
                error: null,
                parameters: [
                    {
                        "key": "partnerUserID",
                        "value": "40ecee36-da23-48be-bf89-2d641d92b3ca",
                        "type": "String"
                    },
                    {
                        "key": "payerMaxAllowedAmount",
                        "type": "Decimal",
                        "value": "123.45"
                    },
                ]
            },

            errorResponseExample: {
                isPlayer: false,
                error: {
                    errorCode: 500,
                    errorMessage: "Unable to find user account"
                },
                parameters: null
            }
        },
        createAndConfirmPayment: {
            requestExample: {
                transactionID: "c1cf13b4-52ce-4b2f-9f9b-9d31cc1f800a",
                amount: 123.45,
                parameters: $scope.createAndConfirmParameters,
                signature: "Gng+D6+3...P/4="
            },
            responseExample: {
                success: true,
                partnerTransactionID: "7efb6b2b-3a5d-4871-8304-29532797e0ab",
                parameters: [{
                    key: "partnerUserID",
                    value: "40ecee36-da23-48be-bf89-2d641d92b3ca",
                    type: "string"
                }]
            },
            errorResponseExample: {
                success: false,
                error: {
                    errorCode: 500,
                    errorMessage: "Unable to find user account"
                },
                parameters: null
            }
        }
    };

    $scope.transactionAlreadyProcessed = {
        successExample: {
            "success": true,
            "partnerTransactionID": "7efb6b2b-3a5d-4871-8304-29532797e0ab",
            "parameters": [
                {
                    "key": "partnerUserID",
                    "value": "40ecee36-da23-48be-bf89-2d641d92b3ca",
                    "type": "string"
                }
            ]
        },
        errorExample: {
            "success": false,
            "partnerTransactionID": "7efb6b2b-3a5d-4871-8304-29532797e0ab",
            "error": {
                "errorCode": 501,
                "errorMessage": "Transaction already processed"
            },
            "parameters": null
        }

    }
    $scope.checkPlayerResponseCheckbox = {};
    $scope.responseGenerated = false;
    $scope.updateCheckPlayerResponse = function () {
        $scope.responseGenerated = false;
        $scope.aircashPayment.checkPlayer.responseParameters = [$scope.responseParametersExample.partnerUserID];
        if ($scope.checkPlayerResponseCheckbox.aircashMatchingPersonalData) {
            $scope.aircashPayment.checkPlayer.responseParameters.push($scope.responseParametersExample.payerFirstName);
            $scope.aircashPayment.checkPlayer.responseParameters.push($scope.responseParametersExample.payerLastName);
            $scope.aircashPayment.checkPlayer.responseParameters.push($scope.responseParametersExample.payerBirthDate);
        }
        if ($scope.checkPlayerResponseCheckbox.maxAmount) $scope.aircashPayment.checkPlayer.responseParameters.push($scope.responseParametersExample.payerMaxAllowedAmount);
        if ($scope.checkPlayerResponseCheckbox.phoneNumber) $scope.aircashPayment.checkPlayer.responseParameters.push($scope.responseParametersExample.payerPhoneNumber);
        if ($scope.checkPlayerResponseCheckbox.personalIdentificationCode) $scope.aircashPayment.checkPlayer.responseParameters.push($scope.responseParametersExample.personalIdentificationCode);
        $scope.aircashPayment.checkPlayer.responseExample = {
            isPlayer: true,
            error: null,
            parameters: $scope.aircashPayment.checkPlayer.responseParameters
        };
        $timeout(function () {
            $scope.text =
                $scope.responseGenerated = true;
        }, 100); 
    }
    $scope.updateCheckPlayerResponse();
    
    
    $scope.requestCheckPlayerChanged();
    $scope.requestCreateAndConfirmChanged();
    

}
]);