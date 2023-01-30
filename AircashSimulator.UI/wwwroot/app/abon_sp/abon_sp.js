var abonSpModule = angular.module('abonSp', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.abonSp', {
            data: {
                pageTitle: 'A-bon generate'
            },
            url: "/abonGenerator",
            controller: 'abonSpCtrl',
            templateUrl: 'app/abon_sp/abon_sp.html'
        });
});

abonSpModule.service("abonSpService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        createCoupon: createCoupon,
        cancelCoupon: cancelCoupon,
        getDenominations: getDenominations
    });
    function createCoupon(value, pointOfSaleId) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonSalePartner/CreateCoupon",
            data: {
                Value: value,
                PointOfSaleId: pointOfSaleId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function cancelCoupon(serialNumber, cancelPointOfSaleId) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl +"AbonSalePartner/CancelCoupon",
            data: {
                SerialNumber: serialNumber,
                PointOfSaleId: cancelPointOfSaleId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function getDenominations() {
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "Denominations/GetDenominations",
            params: {
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

abonSpModule.controller("abonSpCtrl", ['$scope', '$state', 'abonSpService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', function ($scope, $state, abonSpService, $filter, $http, JwtParser, $uibModal, $rootScope, $localStorage) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    if ($scope.partnerRoles.indexOf("AbonGenerate") == -1) {
        $location.path('/forbidden');
    }

    $scope.couponCreationRequestExample = $rootScope.JSONexamples.aBonGenerate.couponCreation.requestExample;
    $scope.couponCreationResponseExample = $rootScope.JSONexamples.aBonGenerate.couponCreation.responseExample;
    $scope.couponCreationErrorResponseExample = $rootScope.JSONexamples.aBonGenerate.couponCreation.errorResponseExample;

    $scope.couponCancellationRequestExample = $rootScope.JSONexamples.aBonGenerate.couponCancellation.requestExample;
    $scope.couponCancellationErrorResponseExample = $rootScope.JSONexamples.aBonGenerate.couponCancellation.errorResponseExample;

    $scope.createCouponModel = {
        value : 100,
        pointOfSaleId : 'test'
    };

    $scope.cancelCouponModel = {
        cancelSerialNumber: null,
        cancelPointOfSaleId: 'test'
    };

    $scope.createServiceBusy = false;
    $scope.createServiceResponse = false;

    $scope.cancelServiceBusy = false;
    $scope.cancelServiceResponse = false;

    $scope.setDefaults = function () {
        $scope.denominations = [];
        $scope.busy = false;
    };

    $scope.showCoupon = function () {
        $("#couponModal").modal("show");
    }

    $scope.showContent = function () {
        $("#contentModal").modal("show");
    }

    $scope.createCoupon = function () {
        $scope.createServiceBusy = true;
        abonSpService.createCoupon($scope.createCouponModel.value, $scope.createCouponModel.pointOfSaleId)
            .then(function (response) {
                
                if (response) {
                    $scope.copyServiceRequest = JSON.stringify(response.serviceRequest, null, 4);

                    $scope.requestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.responseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.sequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.serviceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.content = response.serviceResponse.content;
                    $scope.decodedContent = decodeURIComponent(escape(window.atob($scope.content)));
                    document.querySelector('#content1').innerHTML = $scope.decodedContent;
                    $scope.serviceRequest = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.serviceResponseObject = response.serviceResponse;
                    $scope.serviceRequestObject = response.serviceRequest;
                }
                $scope.createServiceBusy = false;
                $scope.createServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.cancelCoupon = function () {
        $scope.cancelServiceBusy = true;
        abonSpService.cancelCoupon($scope.cancelCouponModel.cancelSerialNumber, $scope.cancelCouponModel.cancelPointOfSaleId)
            .then(function (response) {
                if (response) {
                    $scope.copyCancelServiceRequest = JSON.stringify(response.serviceRequest, null, 4);

                    $scope.cancelRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.cancelResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.cancelSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.cancelResponse = response.serviceResponse;
                    $scope.cancelServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.cancelServiceRequestObject = response.serviceRequest;
                }
                $scope.cancelServiceBusy = false;
                $scope.cancelServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.getDenominations = function () {;
        abonSpService.getDenominations()
            .then(function (response) {                
                if (response) {
                    $scope.denominations = $scope.denominations.concat(response);
                }
            }, () => {
                console.log("error");
            });
    }

    $scope.setDefaults();

    $scope.getDenominations();

}]);