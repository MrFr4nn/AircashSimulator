var cashierAcPaymentModule = angular.module('cashier_acPayment', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier.cashier_acPayment', {
            data: {
                pageTitle: 'Aircash Payment'
            },
            url: "/aircashPayment",
            controller: 'cashierAcPaymentCtrl',
            templateUrl: 'app/cashier_ac_payment/cashier_ac_payment.html'
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

            $scope.paymentModel = {
                username: "",
                phoneNumber: "",
                amount: 0,
            };

            $scope.setDefaults = function () {
                $scope.paymentModel.amount = 0;
                $scope.paymentModel.username = "";
                $scope.paymentModel.phoneNumber = "";
                $scope.deepLinkServiceBusy = false;
            };

            $scope.Deposit = function ($event) {
                var link = "https://aircashtest.page.link/?link=https://staging-m3.aircash.eu/api/DeepLink/PartnerPayment?partnerID%3D" + PARTNER_ID + "%26username%3D" + $scope.paymentModel.username + "%26amount%3D" + $scope.paymentModel.amount + "%26phoneNumber%3D" + $scope.paymentModel.phoneNumber + "&apn=com.aircash.aircash.test&afl=https://staging-m3.aircash.eu/api/DeepLink/PartnerPayment?partnerID%3D" + PARTNER_ID + "%26username%3D" + $scope.paymentModel.username + "%26amount%3D" + $scope.paymentModel.amount + "%26phoneNumber%3D" + $scope.paymentModel.phoneNumber + "&isi=1178612530&ibi=com.aircash.aircash.test&ifl=https://staging-m3.aircash.eu/api/DeepLink/PartnerPayment?partnerID%3D" + PARTNER_ID + "%26username%3D" + $scope.paymentModel.username + "%26amount%3D" + $scope.paymentModel.amount + "%26phoneNumber%3D" + $scope.paymentModel.phoneNumber + "&utm_campaign=everymatrix_topup&utm_medium=deeplink&utm_source=everymatrix"
                window.open(link, "_blank");
                console.log(link);
            };

            $scope.CustomNotification = function (msg) {
                $rootScope.showGritter("Payment received ", msg);
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
                    setTimeout(start, 10000);
                }
            };
            connection.onclose(async () => {
                await start();
            });
            connection.on("TransactionConfirmedMessagePayment", (message) => {
                $scope.CustomNotification(message);
            });

            start();

            $scope.setDefaults();
        }
    ]);