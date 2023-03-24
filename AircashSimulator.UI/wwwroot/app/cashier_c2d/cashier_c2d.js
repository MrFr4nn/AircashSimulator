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
            confirmC2dPayment: confirmC2dPayment
        });

        function confirmC2dPayment(c2dPaymentRequest) {
            console.log(c2dPaymentRequest);
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashPosDeposit/ConfirmC2dPayment",
                data: c2dPaymentRequest
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
    }
]);

cashierC2dModule.controller("cashierC2dCtrl",
    ['$scope', '$state', 'cashierC2dService', '$filter', '$http', 'config', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, cashierC2dService, $filter, $http, config, JwtParser, $uibModal, $rootScope) {

            var connect = true;

           
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

            $scope.confirmC2dPayment = function () {
                $scope.c2dPaymentRequest = {
                    phoneNumber: $scope.createPayoutModel.phoneNumber,
                    amount: $scope.createPayoutModel.amount,
                    locationID: $scope.createPayoutModel.locationID,
                    parametersCreatePayout: [{ key: "email", value: $scope.createPayoutModel.email }, { key: "PayerFirstName", value: $scope.createPayoutModel.firstName }, { key: "PayerLastName", value: $scope.createPayoutModel.lastName }, { key: "PayerBirthDate", value: new Date($scope.createPayoutModel.birthDate - ($scope.createPayoutModel.birthDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0] },
                        { key: "LocationID", value: $scope.createPayoutModel.locationID.toString() }],
                    parametersCheckUser: [ { key: "PayerFirstName", value: $scope.createPayoutModel.firstName }, { key: "PayerLastName", value: $scope.createPayoutModel.lastName }, { key: "PayerBirthDate", value: new Date($scope.createPayoutModel.birthDate - ($scope.createPayoutModel.birthDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0] }]

                }

                $scope.createPayoutServiceBusy = true;
                cashierC2dService.confirmC2dPayment($scope.c2dPaymentRequest)
                    .then(function (response) {
                        console.log(response);
                        switch (response.serviceResponse.status) {
                            case 1:
                                $rootScope.showGritter("Error", "Uknown phone number");
                                break;
                            case 2:
                                $rootScope.showGritter("Error", "Personal data is not matched");
                                break;
                            case 4:
                                $rootScope.showGritter("Error", "User exists but has no verified data");
                                break;
                            case 5:
                                $rootScope.showGritter("Error", "User exists but verification is pending");
                                break;
                            default:
                                break;
                        }
                        $scope.createPayoutServiceBusy = false;
                    }, () => {
                        console.log("ERROR");
                        $scope.createPayoutServiceBusy = false;
                    });
            }

            $scope.setDefaults = function () {
                $scope.busy = false;
            };

            const connection = new signalR.HubConnectionBuilder()
                .withUrl(config.baseUrl.replace("/api/", "") + "/Hubs/NotificationHub")
                .configureLogging(signalR.LogLevel.Information)
                .build();

            async function start() {
                try {
                    await connection.start();
                    console.log("SignalR Connected.");
                } catch (err) {
                    console.log(err);
                    setTimeout(start, 1000);
                }
            };
            connection.onclose(async () => {
                if (connect) {
                    await start();
                }
            });
            connection.on("TransactionConfirmedMessage", (message) => {
                $rootScope.showGritter("Payment confirmed ", message);
            });

            start();

            $scope.setDefaults();

            $scope.setBirthDatePayout = function (date) {
                $scope.createPayoutModel.birthDate = date;
            }
        }
    ]);