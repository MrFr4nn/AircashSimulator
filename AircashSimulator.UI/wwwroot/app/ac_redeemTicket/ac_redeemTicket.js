var aircashRedeemTicketModule = angular.module('acRedeemTicket', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.acRedeemTicket', {
            data: {
                pageTitle: 'Redeem Ticket'
            },
            url: "/RedeemTicket",
            controller: 'aircashRedeemTicketCtrl',
            templateUrl: 'app/ac_redeemTicket/ac_redeemTicket.html?v=' + Global.appVersion
        });
});

aircashRedeemTicketModule.service("aircashRedeemTicketService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        checkTicket: checkTicket,
        createRedeemTicket: createRedeemTicket,
        getTransactions: getTransactions
    });
    function checkTicket(phoneNumber) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashRedeemTicket/CheckTicket",
            data: {
                PhoneNumber: phoneNumber
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function createRedeemTicket(phoneNumber, amount) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashRedeemTicket/CreateRedeemTicket",
            data: {
                PhoneNumber: phoneNumber,
                Amount: amount
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

aircashRedeemTicketModule.controller("aircashRedeemTicketCtrl", ['$scope', '$state', 'aircashRedeemTicketService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope', function ($scope, $state, aircashRedeemTicketService, $filter, $http, JwtParser, $uibModal, $rootScope) {

    $scope.checkTicketModel = {
        phoneNumber: '38512345678'
    };

    $scope.createRedeemTicketModel = {
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

    $scope.checkTicketServiceBusy = false;
    $scope.checkTicketServiceResponse = false;

    $scope.createRedeemTicketServiceBusy = false;
    $scope.createRedeemTicketServiceResponse = false;

    $scope.checkTransactionStatusServiceBusy = false;
    $scope.checkTransactionStatusServiceResponse = false;

    $scope.checkTicket = function () {
        $scope.checkTicketServiceBusy = true;
        $scope.checkTicketServiceResponse = false;
        aircashRedeemTicketService.checkTicket($scope.checkTicketModel.phoneNumber)
            .then(function (response) {

                if (response) {
                    $scope.checkTicketRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.checkTicketResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.checkTicketSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.checkTicketResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.checkTicketRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.checkTicketServiceBusy = false;
                $scope.checkTicketServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.createRedeemTicket = function () {
        $scope.createRedeemTicketServiceBusy = true;
        $scope.createRedeemTicketServiceResponse = false;
        aircashRedeemTicketService.createRedeemTicket($scope.createRedeemTicketModel.phoneNumber, $scope.createRedeemTicketModel.amount)
            .then(function (response) {

                if (response) {
                    $scope.createRedeemTicketRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.createRedeemTicketResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.createRedeemTicketSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.createRedeemTicketResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.createRedeemTicketRequest = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.getTransactions(true);
                }
                $scope.createRedeemTicketServiceBusy = false;
                $scope.createRedeemTicketServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.getTransactions = function (reset) {
        if (reset) $scope.setDefaults();
        aircashRedeemTicketService.getTransactions($scope.pageSize, $scope.pageNumber, [1, 2])
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

    $scope.aircashRedeemTicket = {
        checkTicket: {
            inputParametersExample: {
                aircashTransactionID: "11112406-f672-4c27-a415-e26eb3ecd111",
                parameters: [{
                    key: "TicketID",
                    value: "123456789"
                },
                {
                    key: "PIN",
                    value: "1234"
                }],
                signature: "i6lNUCLl3...."
            },
            outputParametersExample: {
                first: {
                    status: 1
                },
                second: {
                    status: 5,
                    amount: 123.45,
                    currencyISOCode: "EUR"
                }
            }
        },
        redeemTicket: {
            inputParametersExample: {
                aircashTransactionID: "11112406-f672-4c27-a415-e26eb3ecd111",
                parameters: [{
                    key: "TicketID",
                    value: "123456789"
                },
                {
                    key: "PIN",
                    value: "1234"
                }],
                signature: "i6lNUCLl3...."
            },
            outputParametersExample: {
                first: {
                    status: 1
                },
                second: {
                    status: 5,
                    amount: 123.45,
                    currencyISOCode: "EUR",
                    partnerTransactionID: "ABC…123"
                }
            }
        }
    };

}]);