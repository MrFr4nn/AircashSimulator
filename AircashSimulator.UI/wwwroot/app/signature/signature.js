var signatureModule = angular.module('signature', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.signature', {
            data: {
                pageTitle: 'Signature'
            },
            url: "/signature",
            controller: 'SignatureCtrl',
            templateUrl: 'app/signature/signature.html?v=' + Global.appVersion
        });
});

signatureModule.service("signatureService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            validatePublicKey: validatePublicKey,
            validateSignature: validateSignature,
            getSignature: getSignature
        });
        function validatePublicKey(publicKey) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "Signature/ValidatePublicKey",
                data: {
                    publicKey: publicKey
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
        function getSignature(dataSign) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "Signature/GetSignature",
                data: {
                    dataSign:dataSign
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
        function validateSignature(dataToSign,signatureToValidate) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "Signature/ValidateSignature",
                data: {
                    dataToSign: dataToSign,
                    signatureToValidate: signatureToValidate
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
    }
]);

signatureModule.controller("SignatureCtrl",
    ['$scope', '$state', 'signatureService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, signatureService, $filter, $http, JwtParser, $uibModal, $rootScope) {

            $scope.copyToClipboard = function (data) {
                navigator.clipboard.writeText(data);
            }

            $scope.getSignatureModel = {
                dataSign: $scope.dataSign
            };
            $scope.validateSignatureModel = {
                dataToValidate: $scope.dataToValidate,
                signatureToValidate: $scope.signatureToValidate
            };


            $scope.ValidatePublicKeyServiceBusy = false;
            $scope.validatePublicKey = function () {
                $scope.ValidatePublicKeyServiceBusy = true;
                signatureService.validatePublicKey($scope.publicKey)
                    .then(function (response) {
                        $rootScope.showGritter(response);
                        $scope.ValidatePublicKeyServiceBusy = false;
                    })
                    .catch(function (error) {
                        $scope.ValidatePublicKeyServiceBusy = false;
                    });
            }
            $scope.GenerateSignatureServiceBusy = false;
            $scope.GenerateSignatureResponded = false;
            $scope.getSignature = function () {
                $scope.GenerateSignatureServiceBusy = true;
                $scope.GenerateSignatureResponded = false;
                console.log($scope.dataSign)
                signatureService.getSignature($scope.getSignatureModel.dataSign)
                    .then(function (response) {
                        $scope.GenerateSignatureResponse=response;
                        $scope.GenerateSignatureResponded = true;
                        $scope.GenerateSignatureServiceBusy = false;
                    })
                    .catch(function (error) {
                        $scope.GenerateSignatureServiceBusy = false;
                        $scope.generateSignatureResponded = false;
                    });
            }
            $scope.ValidateSignatureResponded= false;
            $scope.ValidateSignatureServiceBusy = false;
            $scope.validateSignature = function () {
                $scope.ValidateSignatureServiceBusy = true;
                $scope.ValidateSignatureResponded = false;
                signatureService.validateSignature($scope.validateSignatureModel.dataToValidate, $scope.validateSignatureModel.signatureToValidate)
                    .then(function (response) {
                        $scope.ValidateSignatureResponse = response;
                        $scope.ValidateSignatureServiceBusy = false;
                        $scope.ValidateSignatureResponded = true;
                    })
                    .catch(function (error) {
                        $scope.ValidateSignatureServiceBusy = false;
                        $scope.ValidateSignatureResponded = false;
                    });
            }

            $scope.examplePartner = JSON.stringify({
                "partnerID": "3de97a57-e9c7-42a8-aed0-ee864bf6d042",
                "phoneNumber": "385981234567",
                "personalID": null,
                "amount": 123.00,
                "partnerTransactionID": "2fe93582-8628-486c-b1a8-4f033c7ac009",
                "signature": "abc... 123"
            }, null, 4);
            $scope.sequencePartner = "Amount=123.45&Parameters=Key=userName&Value=Aircash,Key=phoneNumber&Value=385981234567&TransactionID=c1cf13b4-52ce-4b2f-9f9b-9d31cc1f800a";

            $scope.exampleAircash = JSON.stringify({
                "TransactionID": "c1cf13b4-52ce-4b2f-9f9b-9d31cc1f800a",
                "Amount": 123.45,
                "Parameters": [{
                    "Value": "Aircash",
                    "Key": "userName"
                },
                {
                    "Value": "385981234567",
                    "Key": "phoneNumber"
                }]
            }, null, 4);
            $scope.sequenceAircash = "Amount=123.45&Parameters=Key=userName&Value=Aircash,Key=phoneNumber&Value=385981234567&TransactionID=c1cf13b4-52ce-4b2f-9f9b-9d31cc1f800a"

            $scope.signature = {
                generatingPartnersSignatureExample: {
                    partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                    amount: 123.45,
                    currencyID: 978,
                    partnerTransactionID: "7f087237-b81a-48af-8dce-bc048fede397",
                    description: "test",
                    locationID: "test",
                    signature: "bURAs89l0O..."
                }
            };

        }
    ]);