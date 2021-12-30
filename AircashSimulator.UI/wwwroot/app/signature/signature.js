var signatureModule = angular.module('signature', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.signature', {
            data: {
                pageTitle: 'Signature'
            },
            url: "/signature",
            controller: 'SignatureCtrl',
            templateUrl: 'app/signature/signature.html'
        });
});

signatureModule.service("signatureService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

signatureModule.controller("SignatureCtrl",
    ['$scope', '$state', 'signatureService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, signatureService, $filter, $http, JwtParser, $uibModal, $rootScope) {
            console.log($rootScope);
        }
    ]);