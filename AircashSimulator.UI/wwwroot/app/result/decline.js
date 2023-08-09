var declineModule = angular.module('decline', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('decline', {
            data: {
                pageTitle: 'decline'
            },
            url: "/decline",
            controller: 'declineCtrl',
            templateUrl: 'app/result/decline.html?v=' + Global.appVersion
        });
});

declineModule.service("declineService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

declineModule.controller("declineCtrl",
    ['$scope', '$state', 'declineService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, declineService, $filter, $http, JwtParser, $uibModal, $rootScope) {
        }
    ]);