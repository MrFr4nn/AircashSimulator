var cancelModule = angular.module('cancel', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('cancel', {
            data: {
                pageTitle: 'cancel'
            },
            url: "/cancel",
            controller: 'cancelCtrl',
            templateUrl: 'app/result/cancel.html?v=' + Global.appVersion
        });
});

cancelModule.service("cancelService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

cancelModule.controller("cancelCtrl",
    ['$scope', '$state', 'cancelService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, cancelService, $filter, $http, JwtParser, $uibModal, $rootScope) {
        }
    ]);