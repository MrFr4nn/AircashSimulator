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

acPaymentModule.controller("acPaymentCtrl",
    ['$scope', '$state', 'acPaymentService', '$filter', '$timeout', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, acPaymentService, $filter, $timeout, $http, JwtParser, $uibModal, $rootScope) {

            $scope.copyToClipboard = function(isProduction){
                if (isProduction) {
                    navigator.clipboard.writeText($('#prodLink').text());
                    return;
                }
                navigator.clipboard.writeText($('#testLink').text());
            }

            $scope.copy = function(data){
                navigator.clipboard.writeText(data);
            }

            $scope.generateSignatureModel = {}
            function setRequestExamples() {
                var username = $scope.generateSignatureModel.identificator == undefined ? "aircash" : $scope.generateSignatureModel.identificator;
                var email = $scope.generateSignatureModel.identificator == undefined ? "user@example.net" : $scope.generateSignatureModel.identificator;
                var currencyId = $scope.generateSignatureModel.currency == undefined ? "978" : $scope.generateSignatureModel.currency;
                var countryCode = $scope.generateSignatureModel.countryCode == undefined ? "HR" : $scope.generateSignatureModel.countryCode.toUpperCase();
                var firstname = $scope.generateSignatureModel.firstname == undefined ? "John" : $scope.generateSignatureModel.firstname;
                var lastname = $scope.generateSignatureModel.lastname == undefined ? "Doe" : $scope.generateSignatureModel.lastname;
                var birthday = $scope.generateSignatureModel.birthDate == undefined ? "1990-01-01" : $scope.generateSignatureModel.birthDate.toLocaleDateString('en-CA');
                var merchantId = $scope.generateSignatureModel.birthDate == undefined ? "100" : $scope.generateSignatureModel.birthDate.toLocaleDateString('en-CA');
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

            $scope.checkboxModel = {
                currency: false,
                countryCode: false,
                match: false,
                merchant: false
            }

            $scope.usernameEmailSelected = "email";
            $scope.test = [];
            if ($scope.usernameEmailSelected == "email") {
                $scope.test.push($scope.checkPlayerRequestexample.email);
            } else {
                $scope.test.push($scope.checkPlayerRequestexample.username);
            }

            $scope.changed = true;
            $scope.requestChanged = function () {
                $scope.usernameEmailSelected = $('#select').val();
                $scope.generateSignatureResponded = false;
                $scope.changed = false;

                setRequestExamples();

                $scope.test = [];
                if ($scope.usernameEmailSelected == "email") {
                    $scope.test.push($scope.checkPlayerRequestexample.email);
                } else {
                    $scope.test.push($scope.checkPlayerRequestexample.username);
                }

                if ($scope.checkboxModel.currency) $scope.test.push($scope.checkPlayerRequestexample.currency);
                if ($scope.checkboxModel.countryCode) $scope.test.push($scope.checkPlayerRequestexample.countryCode);
                if ($scope.checkboxModel.merchant) $scope.test.push($scope.checkPlayerRequestexample.merchantId);
                if ($scope.checkboxModel.match)
                    $scope.test.push(
                        $scope.checkPlayerRequestexample.firstName,
                        $scope.checkPlayerRequestexample.lastName,
                        $scope.checkPlayerRequestexample.birthDate,
                    );
                
                $scope.aircashPayment.checkPlayer.requestExample = {
                    parameters: $scope.test,
                    signature: "HrlYnqqr...Cgs = "
                }
                $timeout(function () {
                    $scope.changed = true;
                }, 500);
            }
            $scope.generateSignatureBusy = false;
            $scope.generateSignatureResponded = false;
            $scope.generateSignature = function () {
                $scope.generateSignatureBusy = true;
                $scope.generateSignatureResponded = false;
                acPaymentService.generateSignature($scope.test)
                    .then(function (response) {
                        if (response) {
                            $scope.generateSignatureResponse = JSON.stringify(response, null, 4) ;
                        }
                        $scope.generateSignatureBusy = false;
                        $scope.generateSignatureResponded = true;
                    }, () => {
                        $rootScope.showGritter("Error");
                        $scope.generateSignatureBusy = false;
                    });
            }

            $scope.setDate = function (date) {
                $scope.generateSignatureModel.birthDate = date;
                $scope.requestChanged();
            }

            $scope.aircashPayment = {
                checkPlayer: {
                    requestExample: {
                        parameters: $scope.test,
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
                        parameters: [{
                            key: "username",
                            value: "aircash"
                        }],
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