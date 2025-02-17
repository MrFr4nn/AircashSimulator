﻿var cashierAcPaymentModule = angular.module('cashier_acPayment', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('cashier.cashier_acPayment', {
            data: {
                pageTitle: 'Aircash Payment'
            },
            url: "/aircashPayment",
            controller: 'cashierAcPaymentCtrl',
            templateUrl: 'app/cashier_ac_payment/cashier_ac_payment.html?v=' + Global.appVersion
        });
});

cashierAcPaymentModule.service("cashierAcPaymentService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

cashierAcPaymentModule.controller("cashierAcPaymentCtrl",
    ['$scope', '$state', 'cashierAcPaymentService', '$filter', '$http', 'JwtParser', '$uibModal', 'config', '$rootScope',
        function ($scope, $state, cashierAcPaymentService, $filter, $http, JwtParser, $uibModal, config, $rootScope) {

            const PARTNER_ID = "af489004-3f13-4105-b36d-7a213bbb70ac";
            var connect = true;

            $scope.paymentModel = {
                username: "",
                phoneNumber: "",
                amount: 0,
            };
            $scope.amountPaidModel = {
                AmountPaid: "0",
            };

            $scope.setDefaults = function () {
                $scope.paymentModel.amount = 0;
                $scope.paymentModel.username = "";
                $scope.paymentModel.phoneNumber = "";
                $scope.deepLinkServiceBusy = false;
            };


            $scope.Deposit = function ($event) {
                var link = "";
                if ($rootScope.environment == 2) {
                    link = "https://aircashtest.page.link/?link=https://staging-m3.aircash.eu/api/DeepLink/PartnerPayment?partnerID%3D" + PARTNER_ID + "%26username%3D" + $scope.paymentModel.username + "%26amount%3D" + $scope.paymentModel.amount + "%26phoneNumber%3D" + $scope.paymentModel.phoneNumber + "&apn=com.aircash.aircash.test&afl=https://staging-m3.aircash.eu/api/DeepLink/PartnerPayment?partnerID%3D" + PARTNER_ID + "%26username%3D" + $scope.paymentModel.username + "%26amount%3D" + $scope.paymentModel.amount + "%26phoneNumber%3D" + $scope.paymentModel.phoneNumber + "&isi=1178612530&ibi=com.aircash.aircash.test&ifl=https://staging-m3.aircash.eu/api/DeepLink/PartnerPayment?partnerID%3D" + PARTNER_ID + "%26username%3D" + $scope.paymentModel.username + "%26amount%3D" + $scope.paymentModel.amount + "%26phoneNumber%3D" + $scope.paymentModel.phoneNumber + "&utm_campaign=everymatrix_topup&utm_medium=deeplink&utm_source=everymatrix"
                } else if ($rootScope.environment == 1){
                    link = "https://aircashtest.page.link/?link=https://dev-m3.aircash.eu/api/DeepLink/PartnerPayment?partnerID%3D" + PARTNER_ID + "%26username%3D" + $scope.paymentModel.username + "%26amount%3D" + $scope.paymentModel.amount + "%26phoneNumber%3D" + $scope.paymentModel.phoneNumber + "&apn=com.aircash.aircash.test&afl=https://dev-m3.aircash.eu/api/DeepLink/PartnerPayment?partnerID%3D" + PARTNER_ID + "%26username%3D" + $scope.paymentModel.username + "%26amount%3D" + $scope.paymentModel.amount + "%26phoneNumber%3D" + $scope.paymentModel.phoneNumber + "&isi=1178612530&ibi=com.aircash.aircash.test&ifl=https://dev-m3.aircash.eu/api/DeepLink/PartnerPayment?partnerID%3D" + PARTNER_ID + "%26username%3D" + $scope.paymentModel.username + "%26amount%3D" + $scope.paymentModel.amount + "%26phoneNumber%3D" + $scope.paymentModel.phoneNumber + "&utm_campaign=everymatrix_topup&utm_medium=deeplink&utm_source=everymatrix"
                }
                window.open(link, "_blank");
                console.log(link);
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
            connection.on("TransactionConfirmedMessagePayment", (message) => {
                $rootScope.showGritter("Payment received ", message);
                let stringToSplit = message;
                let stringarray = stringToSplit.split(" ");
                stringarray[1] = stringarray[1].replace("€", "").replace(",", "");
                let number = Number(stringarray[1]) + Number($scope.amountPaidModel.AmountPaid);
                $scope.amountPaidModel.AmountPaid =String(number) ;
                $scope.$apply();
            });
            start();
            $scope.setDefaults();

            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                connect = false; 
                connection.stop();
            });
        }
    ]);