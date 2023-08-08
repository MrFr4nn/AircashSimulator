var cashierAcFrameModule = angular.module('cashier_acFrameAbon', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier.cashier_acFrameAbon', {
            data: {
                pageTitle: 'Aircash Frame - Abon'
            },
            url: "/aircashFrameAbon",
            controller: 'cashierAcFrameAbonCtrl',
            templateUrl: 'app/cashier_ac_frame_abon/cashier_ac_frame_abon.html'
        });    
});

cashierAcFrameModule.service("cashierAcFrameAbonService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            initiateAcFrameAbon: initiateAcFrameAbon
        });

        function initiateAcFrameAbon(amount, payType, payMethod, acFrameOption, amountRule) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashFrame/InitiateCashierFrameV2",
                data: {                    
                    amount: amount,
                    payType: payType,
                    payMethod: payMethod,
                    acFrameOption: acFrameOption,
                    amountRule: amountRule,
                    environment: $rootScope.environment
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
                {
                    key: "LessThanCouponValue",
                    description: "Accept value less than sent Amount",
                    value: 4
                }
            ];
            $scope.setting = {};
            $scope.setting.useAmountRule = $scope.amountRules[0].value;

            $scope.initiateAcFrameAbon = function () {                       
                $scope.createCashierAcFrameAbonServiceBusy = true;
                if ($scope.abon.amount == undefined) {
                    $scope.abon.amount = 0;
                }
                console.log(config.baseUrl + "AircashFrame/InitiateCashierFrameV2");
                cashierAcFrameAbonService.initiateAcFrameAbon($scope.abon.amount, 0, 0, $scope.selectedAcFrameOption.value, $scope.setting.useAmountRule)
                    .then(function (response) {    
                        console.log(response);                        
                        
                        if ($scope.selectedAcFrameOption.value == 1) {                            
                            /*---- METHOD 1 - RECOMMENDED SDK WINDOW CHECKOUT ----- */
                            new AircashFrame.WindowCheckout({
                                transactionId: response.serviceResponse.transactionId,  //this is a "TransactionId" parameter from the Aircash Frame system response
                                onSuccess: $scope.onSuccess,                                   //a function that's needed to be defined in the partner's system, it's called after successful transaction
                                onDecline: $scope.onDecline,                                   //a function that's needed to be defined in the partner's system, it's called after declined transaction
                                onCancel: $scope.onCancel,                                     //a function that's needed to be defined in the partner's system, it's called after transaction cancel by user through an 'x' button in the AC Frame
                                originUrl: location.origin,                                    //partner's system web application domain, this is where is SDK loaded from                                
                                debug: true,                                            //optional parameter, send 'true' if you want a debugging logs in the browser console
                                environment: "staging"                                  //default parameter if not sent, possible values are: localhost, development, staging and production
                            });
                            $scope.createCashierAcFrameAbonServiceBusy = false;
                        }
                        else if ($scope.selectedAcFrameOption.value == 2) {
                            /*---- METHOD 2 - SDK REDIRECT CHECKOUT ----- */
                            new AircashFrame.RedirectCheckout({
                                transactionId: response.serviceResponse.transactionId,  //this is a "TransactionId" parameter from the Aircash Frame system response
                                debug: true,                                            //optional parameter, send 'true' if you want a debugging logs in the browser console
                                environment: "staging"                                  //default parameter if not sent, possible values are: localhost, development, staging and production
                            });
                            $scope.createCashierAcFrameAbonServiceBusy = false;
                        }
                        else if ($scope.selectedAcFrameOption.value == 3) {
                            /*---- METHOD 3 - CUSTOM WINDOW CHECKOUT ----- */
                            if (response.serviceResponse.url != "" && response.serviceResponse.url != null) {    
                                $scope.createCashierAcFrameAbonServiceBusy = false;                                
                                setTimeout(function () {
                                    var windowOptions = 'directories=no,menubar=no,status=no,titlebar=no,toolbar=no,width=600,height=700';
                                    $scope.frameWindow = window.open(response.serviceResponse.url, 'openFrameInNewWindow', windowOptions);
                                }, 1);  

                                //SIGNAL R START
                                start();
                            }
                        }
                        else if ($scope.selectedAcFrameOption.value == 4) {
                            /*---- METHOD 4 - CUSTOM REDIRECT CHECKOUT ----- */
                            if (response.serviceResponse.url != "" && response.serviceResponse.url != null) {
                                $scope.createCashierAcFrameAbonServiceBusy = false;
                                setTimeout(function () {
                                    var windowOptions = 'directories=no,menubar=no,status=no,titlebar=no,toolbar=no,width=600,height=700';
                                    $scope.frameTab = window.location.assign(response.serviceResponse.url, 'openFrameInNewWindow', windowOptions); 
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
                    { value: 1, desc: 'SDK Window Checkout -  recommended' },
                    { value: 2, desc: 'SDK Redirect Checkout' },
                    { value: 3, desc: 'Custom Window Checkout' },
                    { value: 4, desc: 'Custom Redirect Checkout' },
                ];

                $scope.selectedAcFrameOption = $scope.acFrameOptions[0];
            };

            $scope.setDefaults();

        }
    ]);
