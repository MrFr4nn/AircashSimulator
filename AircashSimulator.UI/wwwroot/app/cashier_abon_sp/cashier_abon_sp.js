var cashierAbonSpModule = angular.module('cashier_abon_sp', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier.cashier_abon_sp', {
            data: {
                pageTitle: 'A bon'
            },
            url: "/abon_sp",
            controller: 'cashierAbonSpCtrl',
            templateUrl: 'app/cashier_abon_sp/cashier_abon_sp.html'
        });
});

cashierAbonSpModule.service("cashierAbonSpService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            createCoupon: createCoupon,
            createAndSaveCoupons: createAndSaveCoupons,
            getDenominations: getDenominations
        });
        function createCoupon(value, partnerId) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AbonSalePartner/CreateCashierCoupon",
                data: {
                    Value: value,
                    PartnerId: partnerId,
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
        function createAndSaveCoupons(partnerId) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AbonSalePartner/CreateMultipleCashierCoupon",
                data: {
                    PartnerId: partnerId,
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
        function getDenominations(partnerId) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "Denominations/GetCashierDenominations",
                data: { partnerId: partnerId }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
    }
]);

cashierAbonSpModule.controller("cashierAbonSpCtrl",
    ['$scope', '$state', 'cashierAbonSpService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, cashierAbonSpService, $filter, $http, JwtParser, $uibModal, $rootScope) {
            $scope.abons = [];

            $scope.createCouponModel = {
                value: 100,
                pointOfSaleId: 'test',
                partnerId: ''
            };
            
            $scope.createServiceBusy = false;
            $scope.createServiceResponse = false;

            $scope.showContent = function () {
                $("#contentModal").modal("show");
            }

            $scope.createCoupon = function (abon_val) {
                $scope.createServiceBusy = true;
                $scope.createServiceResponse = false;                
                $scope.createCouponModel.value = abon_val;
                cashierAbonSpService.createCoupon($scope.createCouponModel.value, $scope.selectedAbonCountry.partnerId)
                    .then(function (response) {
                        if (response.serviceResponse.code) {
                            $rootScope.showGritter("Error", response.serviceResponse.message);                            
                        }
                        else {
                            $scope.responseDateTimeUTC = response.responseDateTimeUTC;
                            $scope.contentSubstring = response.serviceResponse.content.substring(0, 30) + "...";
                            $scope.couponCode = response.serviceResponse.couponCode;
                            $scope.serialNumber = response.serviceResponse.serialNumber;
                            $scope.isoCurrencySymbol = response.serviceResponse.isoCurrencySymbol;
                            $scope.couponValue = response.serviceResponse.value;
                            $scope.content = response.serviceResponse.content;
                            $scope.decodedContent = decodeURIComponent(escape(window.atob($scope.content)));
                            document.querySelector('#content1').innerHTML = $scope.decodedContent;
                            $scope.createServiceResponse = true;
                        }
                        $scope.createServiceBusy = false;                        
                    }, () => {
                        console.log("error");
                        $scope.createServiceBusy = false;
                    });
            }

            $scope.createMultipleServiceBusy = false;

            $scope.createAndSaveCoupons = function () {
                $scope.createMultipleServiceBusy = true;
                cashierAbonSpService.createAndSaveCoupons($scope.selectedAbonCountry.partnerId)
                    .then(function (response) {
                        var denominations = "";
                        response.forEach(x => denominations += x + "\n");
                        $scope.saveDonominations(denominations);
                    }, () => {
                        console.log("error");
                        $scope.createMultipleServiceBusy = false;
                    });
            }

            $scope.getDenominations = function () {
                cashierAbonSpService.getDenominations($scope.selectedAbonCountry.partnerId)
                    .then(function (response) {
                        if (response) {
                            $scope.abons = response;
                        }
                    }, () => {
                        console.log("error");
                    });
            }

            $scope.saveDonominations = function (textToWrite) {
                let denominationsAsBlob = new Blob([textToWrite], { type: 'text/plain' });
                let downloadLink = document.createElement('a');
                downloadLink.download = "Denominations.txt";
                downloadLink.innerHTML = 'Download File';

                if (window.webkitURL != null) {
                    downloadLink.href = window.webkitURL.createObjectURL(
                        denominationsAsBlob
                    );
                } else {
                    downloadLink.href = window.URL.createObjectURL(denominationsAsBlob);
                    downloadLink.style.display = 'none';
                    document.body.appendChild(downloadLink);
                }

                downloadLink.click();
                $scope.createMultipleServiceBusy = false;
            }

            $scope.setDefaults = function () {
                $scope.abon_countries = [
                    { country: "HR", partnerId: "261d648d-6bd8-4f5c-baf6-d3fcd336f985", isoCurrencySymbol: "EUR" },
                    { country: "CZ", partnerId: "0d934368-bedc-409a-a150-752cda01f6a7", isoCurrencySymbol: "CZK" },
                    { country: "GB", partnerId: "12d6dd08-ae11-4dc3-80bd-14b2ac71bbc9", isoCurrencySymbol: "GBP" },
                    { country: "FR", partnerId: "9ed97bd7-dbc8-4839-ae9b-5c13cf5afb0f", isoCurrencySymbol: "EUR" },
                    { country: "DE", partnerId: "c3678f7c-dda3-4044-90c6-71f9dbdbbd7b", isoCurrencySymbol: "EUR" },
                    { country: "GR", partnerId: "5daed4c7-0667-451d-b870-3fddd4217935", isoCurrencySymbol: "EUR" },
                    { country: "IT", partnerId: "842fe19a-426b-4507-95e4-933a6a367164", isoCurrencySymbol: "EUR" },
                    { country: "PL", partnerId: "9d5234d5-9347-4769-9b4e-89e9c89d3eb3", isoCurrencySymbol: "PLN" },
                    { country: "RO", partnerId: "9be565cb-762a-403b-bb77-420ffdf46c61", isoCurrencySymbol: "EUR" },
                    { country: "SK", partnerId: "78d6d87b-ff1d-41a7-af2b-f46a5df0e0d3", isoCurrencySymbol: "EUR" },
                    { country: "SI", partnerId: "a0686939-f4e9-4fe7-8e1e-7896b67f08a6", isoCurrencySymbol: "EUR" },
                    { country: "ES", partnerId: "e982453d-9280-4a3a-8244-fb44027a9007", isoCurrencySymbol: "EUR" },
                ];

                $scope.selectedAbonCountry = $scope.abon_countries[0];
            }

            $scope.setDefaults();
            $scope.getDenominations();
        }


    ]);