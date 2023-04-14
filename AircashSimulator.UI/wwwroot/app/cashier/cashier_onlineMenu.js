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
    ['$scope', '$state', 'onlineMenuService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, onlineMenuService, $filter, $http, JwtParser, $uibModal, $rootScope) {
        }
    ]);