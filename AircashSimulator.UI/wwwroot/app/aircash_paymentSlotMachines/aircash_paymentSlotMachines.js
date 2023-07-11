var aircashPaymentSlotMachinesModule = angular.module('acPaymentSlotMachines', []);


app.config(function ($stateProvider) {
    $stateProvider
        .state('app.acPaymentSlotMachines', {
            data: {
                pageTitle: 'Aircash test application'
            },
            url: "/aircashPaymentSlotMachines",
            controller: 'aircashPaymentSlotMachinesCtrl',
            templateUrl: 'app/aircash_paymentSlotMachines/aircash_paymentSlotMachines.html'
        });
});

aircashPaymentSlotMachinesModule.service("aircashPaymentSlotMachinesService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

aircashPaymentSlotMachinesModule.controller("aircashPaymentSlotMachinesCtrl",
    ['$scope', '$state', 'aircashPaymentSlotMachinesService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, aircashPaymentSlotMachinesService, $filter, $http, JwtParser, $uibModal, $rootScope) {

            $scope.slotMachine = {
                ReadCode: {
                    requestExample: {
                        Code: "33352406-f672-4c27-a415-e26eb3ecd691",
                        PhoneNumber: "385981234567",
                        Signature: "12345....abc"
                    }
                },
                ConfirmTransaction: {
                    requestExample: {
                        PartnerTransactionID: "ab3652e2-28f5-43d2-b2b4-b857a9b1233f",
                        AircashTransactionID: "9253459f-ee31-42d9-a3f2-a060629d019f",
                        Amount: 100.00,
                        Signature: "12345....abc"
                    },
                    responseExample: {
                        PartnerTransactionID: "ab3652e2-28f5-43d2-b2b4-b857a9b1233f",
                        AircashTransactionID: "9253459f-ee31-42d9-a3f2-a060629d019f"
                    }
                },
                CreatePayout: {
                    requestExample: {
                        PartnerID: "33352406-f672-4c27-a415-e26eb3ecd691",
                        PhoneNumber: "385981234567",
                        PartnerUserID: "12345",
                        Amount: 123.00,
                        CurrencyID: 978,
                        PartnerTransactionID: "123..abc..123",
                        Signature: "12345....abc"
                    },
                    responseExample: {
                        AircashTransactionID: "760aed25-b409-450b-937d-ba4f0ffa33cc"
                    }
                }
            }
        }
    ]);