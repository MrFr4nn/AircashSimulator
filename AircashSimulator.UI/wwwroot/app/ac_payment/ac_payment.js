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
            generateSignature: generateSignature
        });
        function generateSignature(parameters) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashPayment/GenerateSignature",
                data: {
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
    function setRequestExamples() {
        var username = $scope.checkPlayerGenerateSignatureModel.identificator == undefined ? "aircash" : $scope.checkPlayerGenerateSignatureModel.identificator;
        var email = $scope.checkPlayerGenerateSignatureModel.identificator == undefined ? "user@example.net" : $scope.checkPlayerGenerateSignatureModel.identificator;
        var currencyId = $scope.checkPlayerGenerateSignatureModel.currency == undefined ? "978" : $scope.checkPlayerGenerateSignatureModel.currency;
        var countryCode = $scope.checkPlayerGenerateSignatureModel.countryCode == undefined ? "HR" : $scope.checkPlayerGenerateSignatureModel.countryCode.toUpperCase();
        var firstname = $scope.checkPlayerGenerateSignatureModel.firstname == undefined ? "John" : $scope.checkPlayerGenerateSignatureModel.firstname;
        var lastname = $scope.checkPlayerGenerateSignatureModel.lastname == undefined ? "Doe" : $scope.checkPlayerGenerateSignatureModel.lastname;
        var birthday = $scope.checkPlayerGenerateSignatureModel.birthDate == undefined ? "1990-01-01" : $scope.checkPlayerGenerateSignatureModel.birthDate.toLocaleDateString('en-CA');
        var merchantId = $scope.checkPlayerGenerateSignatureModel.merchantId == undefined ? "100" : $scope.checkPlayerGenerateSignatureModel.merchantId;
        $scope.checkPlayerRequestexample = {
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

    setRequestExamples();

    $scope.checkboxCheckPlayerModel = {
        currency: false,
        countryCode: false,
        match: false,
        merchant: false
    }

    $scope.checkPlayerUsernameEmailSelected = "username";
    $scope.checkPlayerParameters = [];
    if ($scope.checkPlayerUsernameEmailSelected == "email") {
        $scope.checkPlayerParameters.push($scope.checkPlayerRequestexample.email);
    } else {
        $scope.checkPlayerParameters.push($scope.checkPlayerRequestexample.username);
    }

    $scope.checkPlayerGenerateSignatureModel.merchantId = 0;
    $scope.checkPlayerChanged = true;
    $scope.requestCheckPlayerChanged = function () {
        $scope.checkPlayerUsernameEmailSelected = $('#select').val();
        $scope.generateSignatureResponded = false;
        $scope.checkPlayerChanged = false;

        setRequestExamples();

        console.log($scope.checkPlayerGenerateSignatureModel.merchantId);

        $scope.checkPlayerParameters = [];
        if ($scope.checkPlayerUsernameEmailSelected == "email") {
            $scope.checkPlayerParameters.push($scope.checkPlayerRequestexample.email);
        } else {
            $scope.checkPlayerParameters.push($scope.checkPlayerRequestexample.username);
        }

        if ($scope.checkboxCheckPlayerModel.currency) $scope.checkPlayerParameters.push($scope.checkPlayerRequestexample.currency);
        if ($scope.checkboxCheckPlayerModel.countryCode) $scope.checkPlayerParameters.push($scope.checkPlayerRequestexample.countryCode);
        if ($scope.checkboxCheckPlayerModel.merchant) $scope.checkPlayerParameters.push($scope.checkPlayerRequestexample.merchantId);
        if ($scope.checkboxCheckPlayerModel.match)
            $scope.checkPlayerParameters.push(
                $scope.checkPlayerRequestexample.firstName,
                $scope.checkPlayerRequestexample.lastName,
                $scope.checkPlayerRequestexample.birthDate,
            );

        $scope.aircashPayment.checkPlayer.requestExample = {
            parameters: $scope.checkPlayerParameters,
            signature: "HrlYnqqr...Cgs = "
        }

        $scope.aircashPayment.createAndConfirmPayment.requestExample = {
            transactionID: "c1cf13b4-52ce-4b2f-9f9b-9d31cc1f800a",
            amount: 123.45,
            parameters: $scope.checkPlayerParameters,
            signature: "Gng+D6+3...P/4="
        }
        $timeout(function () {
            $scope.checkPlayerChanged = true;
        }, 500);
    }
    $scope.generateSignatureBusy = false;
    $scope.generateSignatureResponded = false;
    $scope.generateSignature = function () {
        $scope.generateSignatureBusy = true;
        $scope.generateSignatureResponded = false;
        acPaymentService.generateSignature($scope.checkPlayerParameters)
            .then(function (response) {
                if (response) {
                    $scope.generateSignatureResponse = JSON.stringify(response, null, 4);
                }
                $scope.generateSignatureBusy = false;
                $scope.generateSignatureResponded = true;
            }, () => {
                $rootScope.showGritter("Error");
                $scope.generateSignatureBusy = false;
            });
    }

    $scope.setDate = function (date) {
        $scope.checkPlayerGenerateSignatureModel.birthDate = date;
        $scope.requestCheckPlayerChanged();
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
                parameters: $scope.checkPlayerParameters,
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