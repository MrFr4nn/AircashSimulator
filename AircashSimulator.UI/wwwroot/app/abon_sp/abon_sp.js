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
        cancelCoupon: cancelCoupon
    });
    function createCoupon(value, pointOfSaleId) {
        console.log(config);
        var request = $http({
            method: 'POST',
            url:"https://localhost:44374/api/AbonSalePartner/CreateCoupon",
            data: {
                Value: value,
                PointOfSaleId: pointOfSaleId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function cancelCoupon(serialNumber, cancelPointOfSaleId) {
        console.log(config);
        var request = $http({
            method: 'POST',
            url: "https://localhost:44374/api/AbonSalePartner/CancelCoupon",
            data: {
                SerialNumber: serialNumber,
                PointOfSaleId: cancelPointOfSaleId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

abonSpModule.controller("abonSpCtrl",['$scope', '$state', 'abonSpService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope', function ($scope, $state, abonSpService, $filter, $http, JwtParser, $uibModal, $rootScope) {

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


    $scope.showCoupon = function () {
        console.log("test");
        $("#couponModal").modal("show");
    }

    $scope.createCoupon = function () {
        console.log($scope.createCouponModel.value);
        console.log($scope.createCouponModel.pointOfSaleId);
        $scope.createServiceBusy = true;
        abonSpService.createCoupon($scope.createCouponModel.value, $scope.createCouponModel.pointOfSaleId)
            .then(function (response) {
                
                if (response) {
                    console.log(response);
                    $scope.requestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.responseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.sequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.serviceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.serviceRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.createServiceBusy = false;
                $scope.createServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.cancelCoupon = function () {
        console.log($scope.cancelCouponModel.cancelSerialNumber);
        console.log($scope.cancelCouponModel.cancelPointOfSaleId);
        $scope.cancelServiceBusy = true;
        console.log($scope.cancelCouponModel.cancelPointOfSaleId);
        abonSpService.cancelCoupon($scope.cancelCouponModel.cancelSerialNumber, $scope.cancelCouponModel.cancelPointOfSaleId)
            .then(function (response) {
                if (response) {
                    console.log(response);
                    $scope.cancelRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.cancelResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.cancelSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.cancelResponse = response.serviceResponse;
                    $scope.cancelServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.cancelServiceBusy = false;
                $scope.cancelServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }
}]);