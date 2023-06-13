var cashierAcPayModule = angular.module('cashier_acPay', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier.cashier_acPay', {
            data: {
                pageTitle: 'Aircash Pay'
            },
            url: "/aircashPay",
            controller: 'cashierAcPayCtrl',
            templateUrl: 'app/cashier_ac_pay/cashier_ac_pay.html'
        });
});

cashierAcPayModule.service("cashierAcPayService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            generateCashierPartnerCode: generateCashierPartnerCode          
        });
        function generateCashierPartnerCode(amount, description, locationID) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashPay/GenerateCashierPartnerCode",
                data: {
                    Amount: amount,
                    Description: description,
                    LocationID: locationID,
                    Environment: $rootScope.environment
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
    }
]);

cashierAcPayModule.controller("cashierAcPayCtrl",
    ['$scope', '$state', 'cashierAcPayService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, cashierAcPayService, $filter, $http, JwtParser, $uibModal, $rootScope) {
            $scope.generatePartnerCodeModel = {
                amount: 100,
                description: "Aircash payment description",
                locationID: "test"
            };
            
            $scope.generateBusy = false;
            $scope.generateCashierPartnerCode = function () {  
                let details = navigator.userAgent;
                let regexp = /android|iphone|kindle|ipad/i;
                let isMobileDevice = regexp.test(details);
                if (isMobileDevice) {
                    $('#mobileShowPayBtn').show();                   
                    $scope.generateBusy = true;
                    cashierAcPayService.generateCashierPartnerCode($scope.generatePartnerCodeModel.amount, $scope.generatePartnerCodeModel.description, $scope.generatePartnerCodeModel.locationID)
                        .then(function (response) {
                            console.log(response);
                            if (response) {
                                $('#confirmPayBtn').attr('href', response.serviceResponse.codeLink);
                            }
                            $scope.generateBusy = false;
                        }, () => {
                            console.log("error");
                            $scope.generateBusy = false;
                        });
                } else {
                    $('#showQRcode').show();
                    $("#qrcode").empty();
                    $scope.generateBusy = true;
                    cashierAcPayService.generateCashierPartnerCode($scope.generatePartnerCodeModel.amount, $scope.generatePartnerCodeModel.description, $scope.generatePartnerCodeModel.locationID)
                        .then(function (response) {
                            console.log(response);
                            if (response) {
                                new QRCode(document.getElementById("qrcode"), response.serviceResponse.codeLink);
                            }
                            $scope.generateBusy = false;
                        }, () => {
                            console.log("error");
                            $scope.generateBusy = false;
                        });
                }                
            }
        }
    ]);