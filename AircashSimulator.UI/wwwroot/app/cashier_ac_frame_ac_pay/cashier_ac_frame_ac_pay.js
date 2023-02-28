var cashierAcFrameModule = angular.module('cashier_acFrameAcPay', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier.cashier_acFrameAcPay', {
            data: {
                pageTitle: 'Aircash Frame - AcPay'
            },
            url: "/aircashFrameAcPay",
            controller: 'cashierAcFrameAcPayCtrl',
            templateUrl: 'app/cashier_ac_frame_ac_pay/cashier_ac_frame_ac_pay.html'
        });
});

cashierAcFrameModule.service("cashierAcFrameAcPayService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            initiateAcFrame: initiateAcFrame
        });

        function initiateAcFrame(amount) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashPayout/Initiate",
                data: {                    
                    Amount: amount
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
    }
]);

cashierAcFrameModule.controller("cashierAcFrameAcPayCtrl",
    ['$scope', '$state', 'cashierAcFrameAcPayService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, cashierAcFrameAcPayService, $filter, $http, JwtParser, $uibModal, $rootScope) {
            $scope.createPayoutModel = {                
                amount: 100,
            };

            $scope.createPayoutServiceBusy = false;
            $scope.createPayoutServiceResponse = false;
            $scope.initiateAcFrame = function () {
                $scope.createPayoutServiceBusy = true;
                cashierAcPayoutService.initiateAcFrame($scope.createPayoutModel.amount)
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
                $scope.busy = false;                
            };

            $scope.setDefaults();

        }
    ]);