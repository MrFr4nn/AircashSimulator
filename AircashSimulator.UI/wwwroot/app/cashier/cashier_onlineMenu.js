var onlineMenuModule = angular.module('onlineMenu', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier.onlineMenu', {
            data: {
                pageTitle: 'OnlineMenu'
            },
            url: "/onlinemenu",
            controller: 'onlineMenuCtrl',
            templateUrl: 'app/cashier/cashier_onlineMenu.html'
        });
});

onlineMenuModule.service("onlineMenuService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

onlineMenuModule.controller("onlineMenuCtrl",
    ['$scope', '$state', 'onlineMenuService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage',
        function ($scope, $state, onlineMenuService, $filter, $http, JwtParser, $uibModal, $rootScope, $localStorage) {
            angular.element(document).ready(function () {
                $scope.username = JwtParser.getProperty("unique_name");

            });
            $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
            $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
        }]);
