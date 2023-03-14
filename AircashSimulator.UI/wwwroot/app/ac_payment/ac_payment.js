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
    }
]);

acPaymentModule.controller("acPaymentCtrl",
    ['$scope', '$state', 'acPaymentService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, acPaymentService, $filter, $http, JwtParser, $uibModal, $rootScope) {

            $scope.aircashPayment = {
                checkPlayer: {
                    requestExample: {
                        parameters: [{
                            key: "username",
                            value: "aircash"
                        }],
                        signature: "HrlYnqqr...Cgs = "
                    },
                    responseExample: {
                        isPlayer: true,
                        error: null,
                        parameters: [{
                            key: "partnerUserID",
                            value: "40ecee36-da23-48be-bf89-2d641d92b3ca",
                            type: "String"
                        }]
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