var mastercardModule = angular.module('mastercard', []);


app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.mastercard', {
            data: {
                pageTitle: 'Mastercard'
            },
            url: "/mastercard",
            controller: 'MastercardCtrl',
            templateUrl: 'app/aircash_Mastercard/aircash_Mastercard.html?v=' + Global.appVersion
        });
});

mastercardModule.service("mastercardService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

mastercardModule.controller("MastercardCtrl",
    ['$scope', '$state', 'mastercardService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, mastercardService, $filter, $http, JwtParser, $uibModal, $rootScope) {
        }
    ]);