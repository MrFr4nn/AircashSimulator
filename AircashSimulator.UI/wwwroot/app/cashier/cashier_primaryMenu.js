var primaryMenuModule = angular.module('primaryMenu', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('cashier.primaryMenu', {
            data: {
                pageTitle: 'Menu'
            },
            url: "/menu",
            controller: 'primaryMenuCtrl',
            templateUrl: 'app/cashier/cashier_primaryMenu.html'
        });
});

primaryMenuModule.service("primaryMenuService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

primaryMenuModule.controller("primaryMenuCtrl",
    ['$scope', '$state', 'primaryMenuService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, primaryMenuService, $filter, $http, JwtParser, $uibModal, $rootScope) {
        }
    ]);