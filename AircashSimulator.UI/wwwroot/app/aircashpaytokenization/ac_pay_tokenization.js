var acPayTokenizationModule = angular.module('acPayTokenization', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.acPayTokenization', {
            data: {
                pageTitle: 'Aircash Pay Tokenization'
            },
            url: "/aircashPayTokenization",
            controller: 'ac_pay_tokenizationCtrl',
            templateUrl: 'app/aircashpaytokenization/aircashpaytokenization.html?v=' + Global.appVersion
        });
});

acPayTokenizationModule.service("acPayTokenizationService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
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

acPayTokenizationModule.controller("ac_pay_tokenizationCtrl", ['$scope', '$state', '$filter', 'acPayTokenizationService', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', 'config', '$location',
    function ($scope, $state, $filter, acPayTokenizationService, $http, JwtParser, $uibModal, $rootScope, $localStorage, config, $location) {
        $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
        $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
        if ($scope.partnerRoles.indexOf("AircashPayStaticCode") == -1) {
            $location.path('/forbidden');
        }

        
    }]);