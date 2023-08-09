var acPayStaticCodeModule = angular.module('acPayStaticCode', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.acPayStaticCode', {
            data: {
                pageTitle: 'Aircash Pay Static Code'
            },
            url: "/aircashPayStaticCode",
            controller: 'ac_pay_static_codeCtrl',
            templateUrl: 'app/ac_pay_static_code/ac_pay_static_code.html?v=' + Global.appVersion
        });
});

acPayStaticCodeModule.service("acPayStaticCodeService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        generateQRLink: generateQRLink
    
    });
    function generateQRLink(amount, currency, locationID) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayStaticCode/GenerateQRLink",
            data: {
                Amount: amount,
                Currency: currency,
                Location: locationID
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

acPayModule.controller("ac_pay_static_codeCtrl", ['$scope', '$state', '$filter', 'acPayStaticCodeService', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', 'config', '$location', function ($scope, $state, $filter, acPayStaticCodeService, $http, JwtParser, $uibModal, $rootScope, $localStorage, config, $location) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    if ($scope.partnerRoles.indexOf("AircashPayStaticCode") == -1) {
        $location.path('/forbidden');
    }

    var connect = true;

    $scope.generatePartnerCodeModel = {
        amount: null,
        description: null,
        locationID: null,
        currency: null
    };

    $scope.generateBusy = false;
    $scope.GenerateQRCode = function () {
        $("#qrcodeDiv").empty();
        $scope.generateBusy = true;
        acPayStaticCodeService.generateQRLink($scope.generatePartnerCodeModel.amount, $scope.generatePartnerCodeModel.currency, $scope.generatePartnerCodeModel.locationID)
            .then(function (response) {
                if (response) {
                    new QRCode(document.getElementById("qrcodeDiv"), response);
                    $scope.generateBusy = false;
                    $scope.generateResponded = true;
                }
            }, () => {
                console.log("error");
            });
    }

    const connection = new signalR.HubConnectionBuilder()
        .withUrl(config.baseUrl.replace("/api/", "")+ "/Hubs/NotificationHub")
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
    connection.on("TransactionConfirmedMessage", (message, status) => {
        $rootScope.showGritter("QR Code Payment received", message);
    });

    start();

    $scope.ClearQRForm = function () {
        $scope.generatePartnerCodeModel.currency = null;
        $scope.generatePartnerCodeModel.locationID = null;
        $scope.generatePartnerCodeModel.amount = null;
        $("#qrcodeDiv").empty();
        $scope.generateResponded = false;
    }

    $scope.GenerateQRFilledForm = function () {
        $scope.generatePartnerCodeModel.currency = "EUR";
        $scope.generatePartnerCodeModel.locationID = "Test";
        $scope.generatePartnerCodeModel.amount = 10;
        $scope.GenerateQRCode();
    }
    $scope.GenerateQRFilledForm();

    $scope.aircashPayStaticCode = {
        confirmTransaction: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionID: "ef52ca13-33b4-4564-8bca-0cbfc7c5a37d",
                amount: 100,
                currencyID: 978,
                aircashTransactionID: "122e5e33-b5fb-4398-b138-c60582b9fa2b",
                signature: "Ff3oSWm20n...",
            }
        }
    };

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        connect = false;
        connection.stop();
    });
}]);