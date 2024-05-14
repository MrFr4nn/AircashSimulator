﻿var cashierAcFrameModule = angular.module('cashier_acFrameAcPay', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('cashier.cashier_acFrameAcPay', {
            data: {
                pageTitle: 'Aircash Frame - AcPay'
            },
            url: "/aircashFrameAcPay",
            controller: 'cashierAcFrameAcPayCtrl',
            templateUrl: 'app/cashier_ac_frame_ac_pay/cashier_ac_frame_ac_pay.html?v=' + Global.appVersion
        });    
});

cashierAcFrameModule.service("cashierAcFrameAcPayService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            initiateAcFrame: initiateAcFrame
        });

        function initiateAcFrame(amount, matchParameters, payType, payMethod, acFrameOption) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashFrame/InitiateCashierFrameV2",
                data: {                    
                    amount: amount,
                    matchParameters: matchParameters,
                    payType: payType,
                    payMethod: payMethod,
                    acFrameOption: acFrameOption,
                    environment: $rootScope.environment                                      
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));            
        }        
    }
]);

cashierAcFrameModule.controller("cashierAcFrameAcPayCtrl",
    ['$scope', '$state', 'cashierAcFrameAcPayService', '$filter', '$http', 'JwtParser', '$uibModal', 'config', '$rootScope',
        function ($scope, $state, cashierAcFrameAcPayService, $filter, $http, JwtParser, $uibModal, config, $rootScope) {    
            $scope.createCashierAcFrameAcPayModel = {                
                amount: 100,
                firstName:"",
                lastName: "",
                birthDate: new Date("")
            };

            $scope.createCashierAcFrameAcPayServiceBusy = false;  
            $scope.frameWindow = null;
            $scope.frameTab = null;

            $scope.matchParameters = [];
            $scope.initiateAcFrame = function () {                
                $scope.createCashierAcFrameAcPayServiceBusy = true;
                if ($scope.useMatchPersonalData) {
                    $scope.matchParameters = [
                        {
                            key: "PayerFirstName",
                            value: $scope.createCashierAcFrameAcPayModel.firstName
                        },
                        {
                            key: "PayerLastName",
                            value: $scope.createCashierAcFrameAcPayModel.lastName
                        },
                        {
                            key: "PayerBirthDate",
                            value: $scope.createCashierAcFrameAcPayModel.birthDate.toLocaleDateString('en-CA')
                        }
                    ];
                } else {
                    $scope.matchParameters = [];    
                }
                cashierAcFrameAcPayService.initiateAcFrame($scope.createCashierAcFrameAcPayModel.amount, $scope.matchParameters, 0, 2, $scope.selectedAcFrameOption.value)
                    .then(function (response) {    
                        console.log(response);                        
                        
                        if ($scope.selectedAcFrameOption.value == 1) {
                            /*---- METHOD 1 - CUSTOM WINDOW CHECKOUT ----- */
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
                        else if ($scope.selectedAcFrameOption.value == 2) {
                            /*---- METHOD 2 - CUSTOM REDIRECT CHECKOUT ----- */
                            if (response.ServiceResponse.Url != "" && response.ServiceResponse.Url != null) {
                                $scope.createCashierAcFrameAcPayServiceBusy = false;
                                setTimeout(function () {
                                    var windowOptions = 'directories=no,menubar=no,status=no,titlebar=no,toolbar=no,width=600,height=700';
                                    $scope.frameTab = window.location.assign(response.ServiceResponse.Url, 'openFrameInNewWindow', windowOptions); 
                                }, 1);
                            }
                        }
                        else {
                            console.log(response);
                        }
                    }, () => {
                        console.log("error");
                        $scope.createCashierAcFrameAcPayServiceBusy = false;
                    });
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

            $scope.showVideoDeposit = function () {
                $("#videoModalDeposit").modal("show");
            }

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
                    { value: 1, desc: 'Custom Window Checkout' },
                    { value: 2, desc: 'Custom Redirect Checkout' },
                ];

                $scope.selectedAcFrameOption = $scope.acFrameOptions[0];
            };

            $scope.setDate = function (date) {
                $scope.createCashierAcFrameAcPayModel.birthDate = date;
            }

            $scope.setDefaults();

        }
    ]);