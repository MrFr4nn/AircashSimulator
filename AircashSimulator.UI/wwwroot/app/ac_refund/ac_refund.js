var acRefundModule = angular.module('acRefund', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.acRefund', {
            data: {
                pageTitle: 'Aircash Refund'
            },
            url: "/aircashRefund",
            controller: 'acRefundModuleCtrl',
            templateUrl: 'app/ac_refund/ac_refund.html?v=' + Global.appVersion
        });
});

acRefundModule.service("acRefundModuleService", ['$http', 'handleResponseService', 'config', function ($http, handleResponseService, config) {
    return ({
        refundTransaction: refundTransaction,
    });

    function refundTransaction(partnerId, partnerTransactionId, refundPartnerTransactionId, amount) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPay/RefundTransaction",
            data: {
                partnerID: partnerId,
                PartnerTransactionID: partnerTransactionId,
                RefundTransactionID: refundPartnerTransactionId,
                amount: amount
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

acRefundModule.service("frameRefundModuleService", ['$http', 'handleResponseService', 'config', function ($http, handleResponseService, config) {
    return ({
        refundTransaction: refundTransaction,
    });

    function refundTransaction(partnerId, partnerTransactionId, refundPartnerTransactionId, amount) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashFrame/RefundAcPayTransaction",
            data: {
                partnerID: partnerId,
                partnerTransactionID: partnerTransactionId,
                refundPartnerTransactionID: refundPartnerTransactionId,
                amount: amount
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

acRefundModule.controller("acRefundModuleCtrl", ['$scope', 'acRefundModuleService', 'frameRefundModuleService', '$localStorage',
    function ($scope, acRefundModuleService, frameRefundModuleService, $localStorage) {

        $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
        $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
        $scope.partnerIds = JSON.parse($scope.decodedToken.partnerIdsDTO);

        $scope.setDefaults = function () {
            $scope.refundModel = {};
            $scope.frameRefundModel = {};

            $scope.refundModel.partnerId = $scope.partnerIds.AcPayPartnerId;
            $scope.refundModel.partnerTransactionId = uuidv4();
            $scope.refundModel.refundPartnerTransactionId = uuidv4();
            $scope.refundModel.amount = 100;

            $scope.frameRefundModel.partnerId = $scope.partnerIds.AircashFramePartnerId;
            $scope.frameRefundModel.partnerTransactionId = uuidv4();
            $scope.frameRefundModel.refundPartnerTransactionId = uuidv4();
            $scope.frameRefundModel.amount = 100;

            $scope.refundResponded = false;
            $scope.refundServiceBusy = false;

            $scope.frameRefundResponded = false;
            $scope.frameRefundServiceBusy = false;
        };

        $scope.refundTransaction = function () {
            $scope.refundServiceBusy = true;
            $scope.refundResponded = false;
            acRefundModuleService.refundTransaction($scope.refundModel.partnerId, $scope.refundModel.partnerTransactionId, $scope.refundModel.refundPartnerTransactionId, $scope.refundModel.amount)
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
        $scope.frameRefundTransaction = function () {
            $scope.frameRefundServiceBusy = true;
            $scope.frameRefundResponded = false;
            frameRefundModuleService.refundTransaction($scope.frameRefundModel.partnerId
                , $scope.frameRefundModel.partnerTransactionId
                , $scope.frameRefundModel.refundPartnerTransactionId
                , $scope.frameRefundModel.amount)
                .then(function (response) {
                    if (response) {
                        $scope.frameRefundRequestDateTimeUTC = response.requestDateTimeUTC;
                        $scope.frameRefundResponseDateTimeUTC = response.responseDateTimeUTC;
                        $scope.frameRefundSequence = response.sequence;

                        response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                        $scope.frameRefundServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                        $scope.frameRefundServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    }
                    $scope.frameRefundServiceBusy = false;
                    $scope.frameRefundResponded = true;
                }, () => {
                    console.log("error");
                });
        }

        $scope.requestExample = {
            PartnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
            PartnerTransactionID: "67cef954-7372-4a12-9250-98a42bcf0317",
            RefundPartnerTransactionID: "9a90fcdc-572d-44b3-904d-1ff0629c7046",
            Amount: "100",
            Signature: "g/iZ .... KgY/6o="
        }

        $scope.setDefaults();

        function uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
                .replace(/[xy]/g, function (c) {
                    const r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
        };

    }]);