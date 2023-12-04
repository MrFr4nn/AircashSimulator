var acReconciliationAPIModule = angular.module('acReconciliationAPI', []);
app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.acReconciliationAPI', {
            data: {
                pageTitle: 'Aircash Reconciliation API'
            },
            url: "/acReconciliationAPI",
            controller: 'acReconciliationAPICtrl',
            templateUrl: 'app/reconciliationAPI/reconciliationAPI.html?v=' + Global.appVersion
        });
});
acReconciliationAPIModule.service("acReconciliationAPIService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);
acReconciliationAPIModule.controller("acReconciliationAPICtrl",
    ['$scope', '$state', 'acReconciliationAPIService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, acReconciliationAPIService, $filter, $http, JwtParser, $uibModal, $rootScope) {




            $scope.reconciliationApi = {
                requestExample: {
                    partnerId: "5680e089-9e86-4105-b1a2-acd0cd77653c",
                    startDate: "2023-11-01",
                    endDate: "2023-11-30"
                },
                responseExample: [
                    {
                        aircashTransactionId: "6864778052200992",
                        partnerTransactionId: "c9c21f6e-53da-4a07-81c5-97df336b7cb5",
                        dateTimeUTC: "2023-10-26T13:00:17",
                        amount: 25.00,
                        currencyId: 978
                    },
                    {
                        aircashTransactionId: "3591234988175194",
                        partnerTransactionId: "e14326f0-c8f2-4417-9758-a9ce47af3b78",
                        dateTimeUTC: "2023-10-26T13:00:16",
                        amount: 50.00,
                        currencyId: 978
                    }
                ],
                errorResponseExample: {
                    code: 2,
                    message: "Selected period too long"
                }
            }
        }
    ]);