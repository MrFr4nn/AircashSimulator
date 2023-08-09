var distributorMenuModule = angular.module('distributorMenu', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('cashier.distributorMenu', {
            data: {
                pageTitle: 'DistributorMenu'
            },
            url: "/distributormenu",
            controller: 'distributorMenuCtrl',
            templateUrl: 'app/cashier/cashier_distributorMenu.html?v=' + Global.appVersion
        });
});

distributorMenuModule.service("distributorMenuService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

distributorMenuModule.controller("distributorMenuCtrl",
    ['$scope', '$state', 'distributorMenuService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage',
        function ($scope, $state, onlineMenuService, $filter, $http, JwtParser, $uibModal, $rootScope, $localStorage) {
            angular.element(document).ready(function () {
                $scope.username = JwtParser.getProperty("unique_name");

            });
            $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
            $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
        }]);
