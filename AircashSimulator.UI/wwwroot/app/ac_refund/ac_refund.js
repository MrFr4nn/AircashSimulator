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
                        $scope.refundRequestDateTimeUTC = response.RequestDateTimeUTC;
                        $scope.refundResponseDateTimeUTC = response.ResponseDateTimeUTC;
                        $scope.refundSequence = response.Sequence;

                        response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                        $scope.refundServiceRequest = JSON.stringify(response.ServiceRequest, null, 4);
                        $scope.refundServiceResponse = JSON.stringify(response.ServiceResponse, null, 4);
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
                        $scope.frameRefundRequestDateTimeUTC = response.RequestDateTimeUTC;
                        $scope.frameRefundResponseDateTimeUTC = response.ResponseDateTimeUTC;
                        $scope.frameRefundSequence = response.Sequence;

                        response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                        $scope.frameRefundServiceRequest = JSON.stringify(response.ServiceRequest, null, 4);
                        $scope.frameRefundServiceResponse = JSON.stringify(response.ServiceResponse, null, 4);
                    }
                    $scope.frameRefundServiceBusy = false;
                    $scope.frameRefundResponded = true;
                }, () => {
                    console.log("error");
                });
        }

        $scope.refundRequestExample = {
            "partnerID": "8db69a48-7d61-48e7-9be8-3160549c7f17",
            "partnerTransactionID": "e4fdbead-9169-4789-ba72-36d0f43ed3e2",
            "refundPartnerTransactionID": "2ce22c99-4b45-4616-9924-9f9510e38cc6",
            "amount": 100,
            "signature": "uCFkuzpqZI..."
        }

        $scope.frameRefundRequestExample = {
            "partnerId": "5680e089-9e86-4105-b1a2-acd0cd77653c",
            "partnerTransactionId": "0eb3ab4b-8d27-4ce2-97ce-b6fe4109e16d",
            "refundPartnerTransactionID": "97084b07-9ef8-4b51-80f8-1f29334d4101",
            "amount": 100,
            "signature": "G5BXxhp9W7..."
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