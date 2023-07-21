var acRefundModule = angular.module('acRefund', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.acRefund', {
            data: {
                pageTitle: 'Aircash Refund'
            },
            url: "/aircashRefund",
            controller: 'acRefundModuleCtrl',
            templateUrl: 'app/ac_refund/ac_refund.html'
        });
});

acRefundModule.service("acRefundModuleService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        refundTransaction: refundTransaction,
    });

    function refundTransaction(partnerTransactionID, amount) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPay/RefundTransaction",
            data: {
                partnerTransactionID: partnerTransactionID,
                amount: amount,
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

acRefundModule.controller("acRefundModuleCtrl", ['$scope', '$state', '$filter', 'acRefundModuleService', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', 'config', '$location',
    function ($scope, $state, $filter, acRefundModuleService, $http, JwtParser, $uibModal, $rootScope, $localStorage, config, $location) {

        $scope.refundModel = {};  


        $scope.refundResponded = false;
        $scope.refundServiceBusy = false;
        $scope.refundTransaction = function () {
            $scope.refundServiceBusy = true;
            $scope.refundResponded = false;
            acRefundModuleService.refundTransaction($scope.refundModel.PartnerTransactionID, $scope.refundModel.amount)
                .then(function (response) {
                    if (response) {
                        $scope.refundRequestDateTimeUTC = response.requestDateTimeUTC;
                        $scope.refundResponseDateTimeUTC = response.responseDateTimeUTC;
                        $scope.refundSequence = response.sequence;

                        response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                        $scope.refundServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                        $scope.refundServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    }
                    $scope.refundServiceBusy = false;
                    $scope.refundResponded = true;
                }, () => {
                    console.log("error");
                });
        }

        $scope.requestExample= {
                PartnerID: "8f62c8f0- 7155 - 4c0e- 8ebe - cd9357cfd1bf",
                PartnerTransactionID: "67cef954-7372-4a12-9250-98a42bcf0317",
                RefundPartnerTransactionID: "9a90fcdc-572d-44b3-904d-1ff0629c7046",
                Amount: "100",
                Signature: "g/iZ .... KgY/6o="
            }

    }]);