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
        createCoupon: createCoupon
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
}
]);

abonSpModule.controller("abonSpCtrl",['$scope', '$state', 'abonSpService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope', function ($scope, $state, abonSpService, $filter, $http, JwtParser, $uibModal, $rootScope) {

    $scope.showCoupon = function () {
        console.log("test");
        $("#couponModal").modal("show");
    }

    $scope.createCoupon = function () {
        console.log($scope.value);
        console.log($scope.pointOfSaleId);
        abonSpService.createCoupon($scope.value, $scope.pointOfSaleId)
            .then(function (response) {
                if (response) {
                    console.log(response);
                }
            }, () => {
                console.log("error");
            });
    }
}]);