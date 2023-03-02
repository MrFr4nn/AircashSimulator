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
                $scope.countryCodes = ["AT (+43)" ,"BE (+32)" , "BG (+359)" , "HR (+385)" ,"CY (+357)" ,"CZ (+420)" , "DK (+45)" ,"EE (+372)" ,"FI (+358)" ,"FR (+33)" ,"DE (+49)" ,
                    "GR (+30)" ,"HU (+36)" , "IS (+354)" ,"IE (+353)", "IT (+39)", "LV (+371)", "LI (+423)", "LT (+370)", "LU (+352)", "MT (+356)","NL (+31)","PL (+48)","PT (+351)",
                    "RO (+40)", "SK (+421)","SI (+386)", "ES (+34)","SE (+46)"
                    
                ];

                $scope.busy = false;
                $scope.selectedCountry = $scope.countryCodes[3];
            };

            $scope.setDefaults();
        }
    ]);