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
            createCoupon: createCoupon
        });
        function createCoupon(value, pointOfSaleId, partnerId) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AbonSalePartner/CreateCashierCoupon",
                data: {
                    Value: value,
                    PointOfSaleId: pointOfSaleId,
                    PartnerId: partnerId
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
    }
]);

cashierAbonSpModule.controller("cashierAbonSpCtrl",
    ['$scope', '$state', 'cashierAbonSpService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, cashierAbonSpService, $filter, $http, JwtParser, $uibModal, $rootScope) {
            $scope.abons = [{ value: 5, currency: 'EUR' },
                { value: 10, currency: 'EUR' },
                { value: 20, currency: 'EUR' },
                { value: 25, currency: 'EUR' },
                { value: 50, currency: 'EUR' }
            ];

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
                cashierAbonSpService.createCoupon($scope.createCouponModel.value, $scope.createCouponModel.pointOfSaleId, $scope.selectedAbonLanguage.partnerId)
                    .then(function (response) {
                        console.log(response);
                        if (response.serviceResponse.code) {
                            $rootScope.showGritter("Error", response.serviceResponse.message);                            
                        }
                        else {
                            //$scope.requestDateTimeUTC = response.requestDateTimeUTC;
                            $scope.responseDateTimeUTC = response.responseDateTimeUTC;
                            //$scope.sequence = response.sequence;
                            //response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                            //$scope.serviceResponse = JSON.stringify(response.serviceResponse, null, 4);
                            $scope.contentSubstring = response.serviceResponse.content.substring(0, 30) + "...";
                            $scope.couponCode = response.serviceResponse.couponCode;
                            $scope.serialNumber = response.serviceResponse.serialNumber;
                            $scope.isoCurrencySymbol = response.serviceResponse.isoCurrencySymbol;
                            $scope.couponValue = response.serviceResponse.value;
                            $scope.content = response.serviceResponse.content;
                            $scope.decodedContent = decodeURIComponent(escape(window.atob($scope.content)));
                            document.querySelector('#content1').innerHTML = $scope.decodedContent;
                            //$scope.decodedContent = decodeURIComponent(escape(window.atob($scope.content)));
                            //document.querySelector('#content1').innerHTML = $scope.decodedContent;
                            //$scope.serviceRequest = JSON.stringify(response.serviceRequest, null, 4);
                            $scope.createServiceResponse = true;
                        }
                        $scope.createServiceBusy = false;                        
                    }, () => {
                        console.log("error");
                        $scope.createServiceBusy = false;
                    });
            }


            $scope.setDefaults = function () {
                $scope.abon_languages = [
                    { language: "hr", partnerId: "261d648d-6bd8-4f5c-baf6-d3fcd336f985" },
                    { language: "cz", partnerId: "0d934368-bedc-409a-a150-752cda01f6a7" },
                    { language: "en", partnerId: "12d6dd08-ae11-4dc3-80bd-14b2ac71bbc9" },
                    { language: "fr", partnerId: "9ed97bd7-dbc8-4839-ae9b-5c13cf5afb0f" },
                    { language: "de", partnerId: "c3678f7c-dda3-4044-90c6-71f9dbdbbd7b" },
                    { language: "gr", partnerId: "5daed4c7-0667-451d-b870-3fddd4217935" },
                    { language: "it", partnerId: "842fe19a-426b-4507-95e4-933a6a367164" },
                    { language: "pl", partnerId: "9d5234d5-9347-4769-9b4e-89e9c89d3eb3" },
                    { language: "ro", partnerId: "9be565cb-762a-403b-bb77-420ffdf46c61" },
                    { language: "sk", partnerId: "78d6d87b-ff1d-41a7-af2b-f46a5df0e0d3" },
                    { language: "si", partnerId: "a0686939-f4e9-4fe7-8e1e-7896b67f08a6" },
                    { language: "es", partnerId: "e982453d-9280-4a3a-8244-fb44027a9007" },
                ];

                $scope.selectedAbonLanguage = $scope.abon_languages[8];
            }

            $scope.setDefaults();
        }


    ]);