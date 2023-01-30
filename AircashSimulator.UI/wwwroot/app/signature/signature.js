var signatureModule = angular.module('signature', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.signature', {
            data: {
                pageTitle: 'Signature'
            },
            url: "/signature",
            controller: 'SignatureCtrl',
            templateUrl: 'app/signature/signature.html'
        });
});

signatureModule.service("signatureService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

signatureModule.controller("SignatureCtrl",
    ['$scope', '$state', 'signatureService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, signatureService, $filter, $http, JwtParser, $uibModal, $rootScope) {
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
        }
    ]);