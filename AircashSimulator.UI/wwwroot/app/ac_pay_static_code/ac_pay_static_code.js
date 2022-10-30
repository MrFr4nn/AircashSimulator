var acPayStaticCodeModule = angular.module('acPayStaticCode', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.acPayStaticCode', {
            data: {
                pageTitle: 'Aircash Pay Static Code'
            },
            url: "/aircashPayStaticCode",
            controller: 'ac_pay_static_codeCtrl',
            templateUrl: 'app/ac_pay_static_code/ac_pay_static_code.html'
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

acPayModule.controller("ac_pay_static_codeCtrl", ['$scope', '$state', '$filter', 'acPayStaticCodeService', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', '$location', function ($scope, $state, $filter, acPayStaticCodeService, $http, JwtParser, $uibModal, $rootScope, $localStorage, $location) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    if ($scope.partnerRoles.indexOf("AircashPayStaticCode") == -1) {
        $location.path('/forbidden');
    }

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

        if (status == 1) {
            toastr.clear();
            toastr.success(msg);
        }
        else if (status == 2) {
            toastr.clear();
            toastr.error(msg);
        }
        else if (status == 3) {
            toastr.clear();
            toastr.error(msg);
        }
    };

    const connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:44374/Hubs/NotificationHub")
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
    connection.on("TransactionConfirmedMessage", (message, status) => {
        $scope.CustomNotification(message, status);
    });

    connection.on("TransactionFailedMessage", (message, status) => {
        $scope.CustomNotification(message, status);
    });

    connection.on("InvalidSignatureMessage", (message, status) => {
        $scope.CustomNotification(message, status);
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
}]);

