var cashierAcPayoutModule = angular.module('cashier_acPayout', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier.cashier_acPayout', {
            data: {
                pageTitle: 'Aircash Payout'
            },
            url: "/aircashPayout",
            controller: 'cashierAcPayoutCtrl',
            templateUrl: 'app/cashier_ac_payout/cashier_ac_payout.html'
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
                    Amount: amount
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
                cashierAcPayoutService.createCashierPayout($scope.selectedCountry.countryCode.substring(1) + $scope.createPayoutModel.phoneNumber, $scope.createPayoutModel.amount)
                    .then(function (response) {
                        console.log(response);
                        if (response.serviceResponse.message == "Unknown phone number") {
                            $rootScope.showGritter("Error", response.serviceResponse.message);
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
                $scope.countryCodes = [
                    { countryCode: "+43", countryName: "Austria" },
                    { countryCode: "+32", countryName: "Belgium" },
                    { countryCode: "+359", countryName: "Bulgaria" },
                    { countryCode: "+385", countryName: "Croatia" },
                    { countryCode: "+357", countryName: "Cyprus" },
                    { countryCode: "+420", countryName: "Czech Republic" },
                    { countryCode: "+45", countryName: "Denmark" },
                    { countryCode: "+372", countryName: "Estonia" },
                    { countryCode: "+358", countryName: "Finland" },
                    { countryCode: "+33", countryName: "France" },
                    { countryCode: "+49", countryName: "Germany" },
                    { countryCode: "+30", countryName: "Greece" },
                    { countryCode: "+36", countryName: "Hungary" },
                    { countryCode: "+354", countryName: "Iceland" },
                    { countryCode: "+353", countryName: "Ireland" },
                    { countryCode: "+39", countryName: "Italy" },
                    { countryCode: "+371", countryName: "Latvia" },
                    { countryCode: "+423", countryName: "Liechtenstein" },
                    { countryCode: "+370", countryName: "Lithuania" },
                    { countryCode: "+352", countryName: "Luxembourg" },
                    { countryCode: "+356", countryName: "Malta" },
                    { countryCode: "+31", countryName: "Netherlands" },
                    { countryCode: "+47", countryName: "Norway" },
                    { countryCode: "+48", countryName: "Poland" },
                    { countryCode: "+351", countryName: "Portugal" },
                    { countryCode: "+40", countryName: "Romania" },
                    { countryCode: "+421", countryName: "Slovakia" },
                    { countryCode: "+386", countryName: "Slovenia" },
                    { countryCode: "+34", countryName: "Spain" },
                    { countryCode: "+46", countryName: "Sweden" },
                    
                ];

                $scope.busy = false;
                $scope.selectedCountry = $scope.countryCodes[3];
            };

            $scope.setDefaults();
        }
    ]);