﻿var cashierAcPayoutModule = angular.module('cashier_acPayout', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('cashier.cashier_acPayout', {
            data: {
                pageTitle: 'Aircash Payout'
            },
            url: "/aircashPayout",
            controller: 'cashierAcPayoutCtrl',
            templateUrl: 'app/cashier_ac_payout/cashier_ac_payout.html?v=' + Global.appVersion
        });
});

cashierAcPayoutModule.service("cashierAcPayoutService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            createCashierPayout: createCashierPayout
        });

        function createCashierPayout(phoneNumber, amount) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashPayout/CreateCashierPayout",
                data: {
                    PhoneNumber: phoneNumber,
                    Amount: amount,
                    Environment: $rootScope.environment
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
    }

    
]);

cashierAcPayoutModule.controller("cashierAcPayoutCtrl",
    ['$scope', '$state', 'cashierAcPayoutService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, cashierAcPayoutService, $filter, $http, JwtParser, $uibModal, $rootScope) {
            
            $scope.createPayoutModel = {
                phoneNumber: "",
                amount: 100,                
            };
            
            $scope.createPayoutServiceBusy = false;
            $scope.createPayoutServiceResponse = false;
            $scope.createCashierPayout = function () {
                $scope.createPayoutServiceBusy = true;
                cashierAcPayoutService.createCashierPayout($scope.createPayoutModel.phoneNumber, $scope.createPayoutModel.amount)
                    .then(function (response) {
                        console.log(response);
                        if (response.ServiceResponse.Message != null) {
                            $rootScope.showGritter("Error", response.ServiceResponse.Message);
                        }
                        else {
                            $rootScope.showGritter("Success");
                        }
                        $scope.createPayoutServiceBusy = false;
                        $scope.validateResponded = true;
                    }, () => {
                        console.log("error");
                        $scope.createPayoutServiceBusy = false;
                    });                    
            }

            $scope.setDefaults = function () {
                $scope.busy = false;
            };

            $scope.setDefaults();
        }
    ]);