var generalGuidlinesModule = angular.module('generalGuidlines', []);


app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.generalGuidlines', {
            data: {
                pageTitle: 'Aircash general guidlines'
            },
            url: "/generalGuidlines",
            controller: 'generalGuidlinesCtrl',
            templateUrl: 'app/generalGuidlines/generalGuidlines.html?v=' + Global.appVersion
        });
});

generalGuidlinesModule.service("generalGuidlinesService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

generalGuidlinesModule.controller("generalGuidlinesCtrl",
    ['$scope', '$state', 'ac_test_applicationService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, dashboardService, $filter, $http, JwtParser, $uibModal, $rootScope) {
            
        }
    ]);