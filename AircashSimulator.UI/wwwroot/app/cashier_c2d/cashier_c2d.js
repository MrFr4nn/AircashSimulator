var cashierC2dModule = angular.module('cashier_c2d', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier.cashier_c2d', {
            data: {
                pageTitle: 'Aircash c2d'
            },
            url: "/cashToDigital",
            controller: 'cashierC2dCtrl',
            templateUrl: 'app/cashier_c2d/cashier_c2d.html'
        });
});

cashierC2dModule.service("cashierC2dService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            checkCashierUser: checkCashierUser,
            createCashierPayout: createCashierPayout
        });

       function checkCashierUser(checkUserRequest) {
            //console.log(config.baseUrl + "aircashPayout / CheckUserV2");
            console.log(checkUserRequest);
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashPosDeposit/CheckCashierUser",
                data: checkUserRequest
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }

        function createCashierPayout(createPayoutRequest) {
            //console.log(config.baseUrl + "aircashPayout / CreatePayoutV2");
            console.log(createPayoutRequest);
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashPosDeposit/CreateCashierPayout",
                data: createPayoutRequest
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
    }
]);

cashierC2dModule.controller("cashierC2dCtrl",
    ['$scope', '$state', 'cashierC2dService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, cashierC2dService, $filter, $http, JwtParser, $uibModal, $rootScope) {
 
            $scope.createPayoutModel = {
                amount: 100,
                phoneNumber: $scope.phoneNumber,
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                birthDate: new Date($scope.birthDate),
                email: $scope.email,                
                locationID: 123,
            };

            $scope.createPayoutServiceBusy = false;

            $scope.checkCashierUser = function () {
                console.log("CheckUser...");
                $scope.checkUserRequest = {
                    phoneNumber: $scope.selectedCountry.countryCode.substring(1) + $scope.createPayoutModel.phoneNumber,
                    parameters: [{ key: "PayerFirstName", value: $scope.createPayoutModel.firstName }, { key: "PayerLastName", value: $scope.createPayoutModel.lastName }, { key: "PayerBirthDate", value: new Date($scope.createPayoutModel.birthDate - ($scope.createPayoutModel.birthDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0] }]
                }
                $scope.createPayoutServiceBusy = true;
                cashierC2dService.checkCashierUser($scope.checkUserRequest)
                    .then(function (response) {
                        console.log(response);
                        switch (response.serviceResponse.status) {
                            case 1:
                                $rootScope.showGritter("Error", "Uknown phone number");                               
                                break;
                            case 2:
                                $rootScope.showGritter("Error", "Personal data is not matched");
                                break;
                            case 3:
                                console.log("Success");
                                $scope.createCashierPayout();
                                break;
                            case 4:
                                $rootScope.showGritter("Error", "User exists but has no verified data");
                                break;
                            case 5:
                                $rootScope.showGritter("Error", "User exists but verification is pending");
                                break;
                            default:
                                console.log("Unknown error");
                                break;
                        }
                        $scope.createPayoutServiceBusy = false;
                    }, () => {
                        console.log("ERROR");
                        $scope.createPayoutServiceBusy = false;
                    });
            }

            $scope.createCashierPayout = function () {
                $scope.createPayoutRequest = {
                    phoneNumber: $scope.selectedCountry.countryCode.substring(1) + $scope.createPayoutModel.phoneNumber,
                    amount: $scope.createPayoutModel.amount,
                    locationID: $scope.createPayoutModel.locationID,
                    parameters: [{ key: "email", value: $scope.createPayoutModel.email }, { key: "PayerFirstName", value: $scope.createPayoutModel.firstName }, { key: "PayerLastName", value: $scope.createPayoutModel.lastName }, { key: "PayerBirthDate", value: new Date($scope.createPayoutModel.birthDate - ($scope.createPayoutModel.birthDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0] }, { key: "LocationID", value: $scope.createPayoutModel.locationID.toString() }]
                }
                $scope.createPayoutServiceBusy = true;
                cashierC2dService.createCashierPayout($scope.createPayoutRequest)
                    .then(function (response) {
                        console.log(response);
                        if (response.serviceResponse.code) {
                            $rootScope.showGritter("Error", response.serviceResponse.message);
                        }
                        else if (response.serviceResponse.code == 0) {
                            $rootScope.showGritter("Error", response.serviceResponse.message);
                        }
                        else {
                            $rootScope.showGritter("Success");
                        }
                        $scope.createPayoutServiceBusy = false;
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

            $scope.setBirthDatePayout = function (date) {
                $scope.createPayoutModel.birthDate = date;
            }

        }


    ]);