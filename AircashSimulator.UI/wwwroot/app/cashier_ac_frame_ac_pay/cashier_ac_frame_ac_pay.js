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
            initiateAcFrame: initiateAcFrame,
            onSuccess: onSuccess,
            onDecline: onDecline,
            onCancel: onCancel
        });

        function initiateAcFrame(amount, payType, payMethod, acFrameOption) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashFrame/InitiateCashierFrameV2",
                data: {                    
                    amount: amount,
                    payType: payType,
                    payMethod: payMethod,
                    acFrameOption: acFrameOption                                      
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }

        function onSuccess() {

        }       

        function onDecline() {

        }

        function onCancel() {

        }
    }
]);

cashierAcFrameModule.controller("cashierAcFrameAcPayCtrl",
    ['$scope', '$state', 'cashierAcFrameAcPayService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, cashierAcFrameAcPayService, $filter, $http, JwtParser, $uibModal, $rootScope) {    
            $scope.createCashierAcFrameAcPayModel = {                
                amount: 100,
            };

            $scope.createCashierAcFrameAcPayServiceBusy = false;            
            $scope.initiateAcFrame = function () {
                $scope.createCashierAcFrameAcPayServiceBusy = true;
                cashierAcFrameAcPayService.initiateAcFrame($scope.createCashierAcFrameAcPayModel.amount, 0, 2, $scope.selectedAcFrameOption.value)
                    .then(function (response) {    
                        console.log(response);
                        $rootScope.showGritter("Success");
                        
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
                        }
                        else if ($scope.selectedAcFrameOption.value == 2) {
                            /*---- METHOD 2 - SDK REDIRECT CHECKOUT ----- */
                            new AircashFrame.RedirectCheckout({
                                transactionId: response.serviceResponse.transactionId,  //this is a "TransactionId" parameter from the Aircash Frame system response
                                debug: true,                                            //optional parameter, send 'true' if you want a debugging logs in the browser console
                                environment: "staging"                                  //default parameter if not sent, possible values are: localhost, development, staging and production
                            });
                        }
                        else if ($scope.selectedAcFrameOption.value == 3) {
                            /*---- METHOD 3 - CUSTOM WINDOW CHECKOUT ----- */
                            if (response.serviceResponse.url != "" && response.serviceResponse.url != null) {                                
                                var windowOptions = 'directories=no,menubar=no,status=no,titlebar=no,toolbar=no,width=600,height=700';
                                window.open(response.serviceResponse.url, 'openFrameInNewWindow', windowOptions);
                            }
                        }
                        else {
                            console.log(response)
                        }
                    }, () => {
                        console.log("error");
                        $scope.createCashierAcFrameAcPayServiceBusy = false;
                    });
            }           

            $scope.onSuccess = function (windowCheckoutResponse) {
                console.log(windowCheckoutResponse);
            }

            $scope.onDecline = function (windowCheckoutResponse) {
                console.log(windowCheckoutResponse);
            }

            $scope.onCancel = function (windowCheckoutResponse) {
                console.log(windowCheckoutResponse);
            }

            $scope.setDefaults = function () {                
                $scope.busy = false;      
                
                $scope.acFrameOptions = [
                    { value: 1, desc: 'SDK Window Checkout -  recommended' },
                    { value: 2, desc: 'SDK Redirect Checkout' },
                    { value: 3, desc: 'Custom WindowCheckout' }
                ];

                $scope.selectedAcFrameOption = $scope.acFrameOptions[0];
            };

            $scope.setDefaults();

        }
    ]);