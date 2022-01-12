var aircashPayoutModule = angular.module('aircashPayout', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.aircashPayout', {
            data: {
                pageTitle: 'Payout'
            },
            url: "/Payout",
            controller: 'aircashPayoutCtrl',
            templateUrl: 'app/aircash_payout/aircash_payout.html'
        });
});

aircashPayoutModule.service("aircashPayoutService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        checkUser: checkUser,
        createPayout: createPayout,
        getTransactions: getTransactions,
        checkTransactionStatus: checkTransactionStatus
    });
    function checkUser(phoneNumber) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/CheckUser",
            data: {
                PhoneNumber: phoneNumber
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function createPayout(phoneNumber, amount) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/CreatePayout",
            data: {
                PhoneNumber: phoneNumber,
                Amount: amount
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function checkTransactionStatus(partnerTransactionId) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPayout/CheckTransactionStatus",
            data: {
                PartnerTransactionId: partnerTransactionId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function getTransactions(pageSize, pageNumber, services) {
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "Transaction/GetTransactions",
            params: {
                PageSize: pageSize,
                PageNumber: pageNumber,
                Services: services
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

aircashPayoutModule.controller("aircashPayoutCtrl", ['$scope', '$state', 'aircashPayoutService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', function ($scope, $state, aircashPayoutService, $filter, $http, JwtParser, $uibModal, $rootScope, $localStorage) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    if ($scope.partnerRoles.indexOf("AircashPayout") == -1) {
        $location.path('/forbidden');
    }

    $scope.checkUserModel = {
        phoneNumber: '38512345678'
    };

    $scope.createPayoutModel = {
        phoneNumber: '38512345678',
        amount: 100
    };

    $scope.setDefaults = function () {
        $scope.transactions = [];
        $scope.pageSize = 5;
        $scope.pageNumber = 1;
        $scope.totalLoaded = 0;
        $scope.busy = false;
    };

    $scope.checkTransactionStatusModel = {
        partnerTransactionId: null
    };

    $scope.checkUserServiceBusy = false;
    $scope.checkUserServiceResponse = false;

    $scope.createPayoutServiceBusy = false;
    $scope.createPayoutServiceResponse = false;

    $scope.checkTransactionStatusServiceBusy = false;
    $scope.checkTransactionStatusServiceResponse = false;

    $scope.checkUser = function () {
        $scope.checkUserServiceBusy = true;
        aircashPayoutService.checkUser($scope.checkUserModel.phoneNumber)
            .then(function (response) {

                if (response) {
                    $scope.checkUserRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.checkUserResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.checkUserSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.checkUserResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.checkUserRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.checkUserServiceBusy = false;
                $scope.checkUserServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.createPayout = function () {
        $scope.createPayoutServiceBusy = true;
        aircashPayoutService.createPayout($scope.createPayoutModel.phoneNumber, $scope.createPayoutModel.amount)
            .then(function (response) {

                if (response) {
                    $scope.createPayoutRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.createPayoutResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.createPayoutSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.createPayoutResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.createPayoutRequest = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.getTransactions(true);
                }
                $scope.createPayoutServiceBusy = false;
                $scope.createPayoutServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.checkTransactionStatus = function (transactionId) {
        $scope.checkTransactionStatusServiceBusy = true;
        aircashPayoutService.checkTransactionStatus(transactionId)
            .then(function (response) {

                if (response) {
                    $scope.checkTransactionStatusRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.checkTransactionStatusResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.checkTransactionStatusSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.checkTransactionStatusResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.checkTransactionStatusRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.checkTransactionStatusServiceBusy = false;
                $scope.checkTransactionStatusServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.getTransactions = function (reset) {
        if (reset) $scope.setDefaults();
        aircashPayoutService.getTransactions($scope.pageSize, $scope.pageNumber, [1, 2])
            .then(function (response) {
                $scope.checkPageNumber += 1;
                if (response) {
                    $scope.totalLoaded = response.length;
                    $scope.transactions = $scope.transactions.concat(response);
                }
            }, () => {
                console.log("error");
            });
    }

    $scope.loadMore = function (pageSize) {
        $scope.pageSize = pageSize;
        $scope.getTransactions(false);
    };

    $scope.setDefaults();

    $scope.getTransactions();
}]);