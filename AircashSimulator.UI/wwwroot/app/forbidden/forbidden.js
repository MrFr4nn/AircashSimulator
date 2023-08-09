var forbiddenModule = angular.module('forbidden', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('forbidden', {
            data: {
                pageTitle: 'Forbidden'
            },
            url: "/forbidden",
            controller: 'ForbiddenCtrl',
            templateUrl: 'app/forbidden/forbidden.html?v=' + Global.appVersion
        });
});

forbiddenModule.service("forbiddenService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

forbiddenModule.controller("ForbiddenCtrl",
    ['$scope', '$state', 'forbiddenService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, forbiddenService, $filter, $http, JwtParser, $uibModal, $rootScope) {
        }
    ]);