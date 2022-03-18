var forbiddenModule = angular.module('forbidden', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('forbidden', {
            data: {
                pageTitle: 'Forbidden'
            },
            url: "/forbidden",
            controller: 'ForbiddenCtrl',
            templateUrl: 'app/forbidden/forbidden.html'
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