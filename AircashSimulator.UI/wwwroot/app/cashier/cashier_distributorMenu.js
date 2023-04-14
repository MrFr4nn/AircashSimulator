var distributorMenuModule = angular.module('distributorMenu', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier.distributorMenu', {
            data: {
                pageTitle: 'DistributorMenu'
            },
            url: "/distributormenu",
            controller: 'distributorMenuCtrl',
            templateUrl: 'app/cashier/cashier_distributorMenu.html'
        });
});

distributorMenuModule.service("distributorMenuService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

distributorMenuModule.controller("distributorMenuCtrl",
    ['$scope', '$state', 'distributorMenuService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, distributorMenuService, $filter, $http, JwtParser, $uibModal, $rootScope) {
        }
    ]);