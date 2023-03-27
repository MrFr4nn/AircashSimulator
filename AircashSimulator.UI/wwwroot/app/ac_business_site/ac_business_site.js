var ac_business_siteModule = angular.module('ac_business_site', []);
app.config(function ($stateProvider) {
    $stateProvider
        .state('app.ac_business_site', {
            data: {
                pageTitle: 'Aircash business site'
            },
            url: "/ac_business_site",
            controller: 'ac_business_siteCtrl',
            templateUrl: 'app/ac_business_site/ac_business_site.html'
        });
});
ac_business_siteModule.service("ac_business_siteService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);
ac_business_siteModule.controller("ac_business_siteCtrl",
    ['$scope', '$state', 'ac_business_siteService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, dashboardService, $filter, $http, JwtParser, $uibModal, $rootScope) {
        }
    ]);