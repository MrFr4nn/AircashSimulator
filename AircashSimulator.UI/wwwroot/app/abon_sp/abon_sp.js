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

abonSpModule.service("abonSpService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

abonSpModule.controller("abonSpCtrl",
    ['$scope', '$state', 'abonSpService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, abonSpService, $filter, $http, JwtParser, $uibModal, $rootScope) {
            console.log($rootScope);
            //$scope.Currency = JwtParser.getProperty('currency');

        }
    ]);