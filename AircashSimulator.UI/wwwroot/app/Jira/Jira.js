var jiraModule = angular.module('jira', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.jira', {
            data: {
                pageTitle: 'Jira'
            },
            url: "/jira",
            controller: 'jiraCtrl',
            templateUrl: 'app/Jira/Jira.html'
        });
});

jiraModule.service("jiraService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);

jiraModule.controller("jiraCtrl",
    ['$scope', '$state', 'jiraService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, jiraService, $filter, $http, JwtParser, $uibModal, $rootScope) {
        }
    ]);