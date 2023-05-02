var acPaymentModule = angular.module('acPayment', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.acPayment', {
            data: {
                pageTitle: 'Aircash Payment'
            },
            url: "/aircashPayment",
            controller: 'acPaymentCtrl',
            templateUrl: 'app/ac_payment/ac_payment.html'
        });
});

acPaymentModule.service("acPaymentService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            generateCheckPlayerSignature: generateCheckPlayerSignature,
            generateCreateAndConfirmSignature: generateCreateAndConfirmSignature
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
    }
]);

acPaymentModule.controller("acPaymentCtrl", ['$scope', '$state', 'acPaymentService', '$filter', '$timeout', '$http', 'JwtParser', '$uibModal', '$rootScope', function ($scope, $state, acPaymentService, $filter, $timeout, $http, JwtParser, $uibModal, $rootScope) {

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

    $scope.checkPlayerGenerateSignatureModel = {}
    $scope.createAndConfirmGenerateSignatureModel = {}
    function setRequestExamples(generateSignatureModel) {
        var username = generateSignatureModel.identificator || "aircash";
        var email =generateSignatureModel.identificator || "user@example.net";
        var currencyId =generateSignatureModel.currency || "978";
        var countryCode = generateSignatureModel.countryCode || "HR";
        var firstname = generateSignatureModel.firstname || "John";
        var lastname = generateSignatureModel.lastname || "Doe";
        var birthday = generateSignatureModel.birthDate || "1990-01-01";
        var merchantId =generateSignatureModel.merchantId || "100";
        $scope.requestExample = {
            username: {
                key: "username",
                value: username
            },
            email: {
                key: "email",
                value: email
            },
            currency: {
                key: "currencyID",
                value: currencyId
            },
            countryCode: {
                key: "countryCode",
                value: countryCode
            },
            firstName: {
                key: "FirstName",
                value: firstname
            },
            lastName: {
                key: "LastName",
                value: lastname
            },
            birthDate: {
                key: "BirthDate",
                value: birthday
            },
            merchantId: {
                key: "merchantId",
                Value: merchantId
            }
        }
    }

    setRequestExamples($scope.checkPlayerGenerateSignatureModel);

    $scope.checkboxCheckPlayerModel = {
        currency: false,
        countryCode: false,
        match: false,
        merchant: false
    }

    $scope.checkboxCreateAndConfirmModel = {
        currency: false,
        countryCode: false,
        match: false,
        merchant: false
    }

    $scope.checkPlayerUsernameEmailSelected = "username";
    $scope.checkPlayerParameters = [];
    if ($scope.checkPlayerUsernameEmailSelected == "email") {
        $scope.checkPlayerParameters.push($scope.requestExample.email);
    } else {
        $scope.checkPlayerParameters.push($scope.requestExample.username);
    }

    $scope.createAndConfirmUsernameEmailSelected = "username";
    $scope.createAndConfirmParameters = [];
    if ($scope.createAndConfirmUsernameEmailSelected == "email") {
        $scope.createAndConfirmParameters.push($scope.requestExample.email);
    } else {
        $scope.createAndConfirmParameters.push($scope.requestExample.username);
    }

    $scope.checkPlayerChanged = true;
    $scope.requestCheckPlayerChanged = function () {
        $scope.checkPlayerUsernameEmailSelected = $('#select').val();
        $scope.generateCheckPlayerSignatureResponded = false;
        $scope.checkPlayerChanged = false;

        setRequestExamples($scope.checkPlayerGenerateSignatureModel);

        $scope.checkPlayerParameters = [];
        if ($scope.checkPlayerUsernameEmailSelected == "email") {
            $scope.checkPlayerParameters.push($scope.requestExample.email);
        } else {
            $scope.checkPlayerParameters.push($scope.requestExample.username);
        }

        if ($scope.checkboxCheckPlayerModel.currency) $scope.checkPlayerParameters.push($scope.requestExample.currency);
        if ($scope.checkboxCheckPlayerModel.countryCode) $scope.checkPlayerParameters.push($scope.requestExample.countryCode);
        if ($scope.checkboxCheckPlayerModel.merchant) $scope.checkPlayerParameters.push($scope.requestExample.merchantId);
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

        $timeout(function () {
            $scope.checkPlayerChanged = true;
        }, 500);
    }

    $scope.createAndConfirmChanged = true;
    $scope.requestCreateAndConfirmChanged = function () {
        $scope.createAndConfirmUsernameEmailSelected = $('#select2').val();
        $scope.generateCreateAndConfirmSignatureResponded = false;
        $scope.createAndConfirmChanged = false;

        setRequestExamples($scope.createAndConfirmGenerateSignatureModel);

        $scope.createAndConfirmParameters = [];
        if ($scope.createAndConfirmUsernameEmailSelected == "email") {
            $scope.createAndConfirmParameters.push($scope.requestExample.email);
        } else {
            $scope.createAndConfirmParameters.push($scope.requestExample.username);
        }

        if ($scope.checkboxCreateAndConfirmModel.currency) $scope.createAndConfirmParameters.push($scope.requestExample.currency);
        if ($scope.checkboxCreateAndConfirmModel.countryCode) $scope.createAndConfirmParameters.push($scope.requestExample.countryCode);
        if ($scope.checkboxCreateAndConfirmModel.merchant) $scope.createAndConfirmParameters.push($scope.requestExample.merchantId);
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
        $timeout(function () {
            $scope.createAndConfirmChanged = true;
        }, 500);
    }

    $scope.generateCheckPlayerSignatureBusy = false;
    $scope.generateCheckPlayerSignatureResponded = false;
    $scope.generateCheckPlayerSignature = function () {
        $scope.generateCheckPlayerSignatureBusy = true;
        $scope.generateCheckPlayerSignatureResponded = false;
        acPaymentService.generateCheckPlayerSignature($scope.checkPlayerParameters)
            .then(function (response) {
                if (response) {
                    $scope.generateCheckPlayerSignatureResponse = JSON.stringify(response, null, 4);
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
        acPaymentService.generateCreateAndConfirmSignature($scope.createAndConfirmParameters, 123.45)
            .then(function (response) {
                if (response) {
                    $scope.generateCreateAndConfirmSignatureResponse = JSON.stringify(response, null, 4);
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

}
]);