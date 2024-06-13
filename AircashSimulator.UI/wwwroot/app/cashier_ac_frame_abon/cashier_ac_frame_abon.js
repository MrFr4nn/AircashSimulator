var cashierAcFrameModule = angular.module('cashier_acFrameAbon', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('cashier.cashier_acFrameAbon', {
            data: {
                pageTitle: 'Aircash Frame - Abon'
            },
            url: "/aircashFrameAbon",
            controller: 'cashierAcFrameAbonCtrl',
            templateUrl: 'app/cashier_ac_frame_abon/cashier_ac_frame_abon.html?v=' + Global.appVersion
        });    
});

cashierAcFrameModule.service("cashierAcFrameAbonService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            initiateAcFrameAbon: initiateAcFrameAbon
        });

        function initiateAcFrameAbon(amount, payType, payMethod, acFrameOption, amountRule, locale) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashFrame/InitiateCashierFrameV2",
                data: {                    
                    amount: amount,
                    payType: payType,
                    payMethod: payMethod,
                    acFrameOption: acFrameOption,
                    amountRule: amountRule,
                    environment: $rootScope.environment,
                    locale: locale
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }        
    }
]);

cashierAcFrameModule.controller("cashierAcFrameAbonCtrl",
    ['$scope', '$state', 'cashierAcFrameAbonService', '$filter', '$http', 'JwtParser', '$uibModal', 'config', '$rootScope',
        function ($scope, $state, cashierAcFrameAbonService, $filter, $http, JwtParser, $uibModal, config, $rootScope) {    
            $scope.createCashierAcFrameAbonServiceBusy = false;  
            $scope.frameWindow = null;
            $scope.frameTab = null;
            $scope.locale = localStorage.getItem('selectedLanguage');

            $scope.abon = {}

            $scope.amountRules = [
                {
                    key: "Default",
                    description: "Accept value of any Coupon code",
                    value: 1
                },
                {
                    key: "EqualAsCouponValue",
                    description: "Accept value of Coupon code equal as sent Amount",
                    value: 3
                },
                {
                    key: "EqualOrLessThanCouponValue",
                    description: "Accept value of Coupon code equal or less then sent Amount",
                    value: 2
                },
                //{
                //    key: "LessThanCouponValue",
                //    description: "Accept value less than sent Amount",
                //    value: 4
                //}
            ];
            $scope.setting = {};
            $scope.setting.useAmountRule = $scope.amountRules[0].value;

            $scope.initiateAcFrameAbon = function () {                       
                $scope.createCashierAcFrameAbonServiceBusy = true;
                if ($scope.abon.amount == undefined) {
                    $scope.abon.amount = 0;
                }
                console.log(config.baseUrl + "AircashFrame/InitiateCashierFrameV2");
                cashierAcFrameAbonService.initiateAcFrameAbon($scope.abon.amount, 0, 0, $scope.selectedAcFrameOption.value, $scope.setting.useAmountRule,$scope.locale)
                    .then(function (response) {    
                        console.log(response);                        

                        if ($scope.selectedAcFrameOption.value == 1) {
                            /*---- METHOD 1 - TAB REDIRECT ----- */

                            if (response.ServiceResponse.Url != "" && response.ServiceResponse.Url != null) {
                                $scope.createCashierAcFrameAcPayServiceBusy = false;
                                setTimeout(function () {
                                    var windowOptions = 'directories=no,menubar=no,status=no,titlebar=no,toolbar=no,width=600,height=700';
                                    $scope.frameTab = window.location.assign(response.ServiceResponse.Url, 'openFrameInNewWindow', windowOptions);
                                }, 1);
                            }
                        }
                        else if ($scope.selectedAcFrameOption.value == 2) {
                            /*---- METHOD 2 - NEW WINDOW ----- */
                            if (response.ServiceResponse.Url != "" && response.ServiceResponse.Url != null) {
                                $scope.createCashierAcFrameAcPayServiceBusy = false;
                                setTimeout(function () {
                                    var windowOptions = 'directories=no,menubar=no,status=no,titlebar=no,toolbar=no,width=600,height=700';
                                    $scope.frameWindow = window.open(response.ServiceResponse.Url, 'openFrameInNewWindow', windowOptions);
                                }, 1);

                                //SIGNAL R START
                                start();
                            }
                        }
                        else if ($scope.selectedAcFrameOption.value == 3) {
                            /*---- METHOD 3 - NEW TAB ----- */
                            if (response.ServiceResponse.Url != "" && response.ServiceResponse.Url != null) {
                                $scope.createCashierAcFrameAcPayServiceBusy = false;
                                setTimeout(function () {
                                    $scope.frameTab = window.open(response.ServiceResponse.Url, '_blank');

                                }, 1);
                            }
                        }
                        else {
                            console.log(response);
                        }
                    }, (error) => {
                        console.log("error");
                        console.log(error);
                        $scope.createCashierAcFrameAbonServiceBusy = false;
                    });
            }

            $scope.disableClick = function (isDisabled) {
                $scope.isDisabled = !isDisabled;
            }

            $scope.onSuccess = function (windowCheckoutResponse) {                 
                console.log(windowCheckoutResponse); 
                $rootScope.showGritter("Transaction - Success");
                //location.href = config.acFrameOriginUrl + '/#!/success';
            }

            $scope.onDecline = function (windowCheckoutResponse) {
                console.log(windowCheckoutResponse);
                $rootScope.showGritter("Transaction - Decline");
                //location.href = config.acFrameOriginUrl + '/#!/decline';
            }

            $scope.onCancel = function (windowCheckoutResponse) {
                console.log(windowCheckoutResponse);
                $rootScope.showGritter("Tranasction - Cancel");
                //location.href = config.acFrameOriginUrl + '/#!/cancel';
            }

            //SIGNAL R START
            $scope.CustomNotification = function (msg, status) {
                var vm = this;
                vm.name = 'TransactionInfo';

                vm.setOptions = function () {
                    toastr.options.positionClass = "toast-top-center";
                    toastr.options.closeButton = true;
                    toastr.options.showMethod = 'slideDown';
                    toastr.options.hideMethod = 'slideUp';
                    toastr.options.progressBar = true;
                    toastr.options.timeOut = 10000;
                };
                vm.setOptions();

                if (status == 1)
                {                   
                    toastr.clear();
                    toastr.success(msg);
                    if ($scope.frameWindow.closed == false) {
                        $scope.frameWindow.close();
                    }
                }
                else if (status == 2)
                {
                    toastr.clear();
                    toastr.error(msg);
                }
                else if (status == 3)
                {
                    toastr.clear();
                    toastr.error(msg);
                }
            };

            const connection = new signalR.HubConnectionBuilder()
                .withUrl(config.baseUrl.replace("/api/", "") + "/Hubs/NotificationHub")
                .configureLogging(signalR.LogLevel.Information)
                .build();

            async function start()
            {
                try
                {
                    await connection.start();
                    console.log("SignalR Connected.");
                }
                catch (err)
                {
                    console.log(err);
                    setTimeout(start, 10000);
                }
            };

            $scope.showVideoDeposit = function () {
                $("#videoModalDeposit").modal("show");
            }

            connection.onclose(async () => {
                await start();
            });
            
            connection.on("TransactionConfirmedMessage", (message, status) => {
                $scope.CustomNotification(message, status);
            });            
            //SIGNAL R END

            $scope.setDefaults = function () {                
                $scope.busy = false;      
                
                $scope.acFrameOptions = [
                    { value: 1, desc: 'Tab Redirect' },
                    { value: 2, desc: 'New Window' },
                    { value: 3, desc: 'New Tab' },
                ];

                $scope.selectedAcFrameOption = $scope.acFrameOptions[0];
            };

            $scope.setDefaults();

        }
    ]);
