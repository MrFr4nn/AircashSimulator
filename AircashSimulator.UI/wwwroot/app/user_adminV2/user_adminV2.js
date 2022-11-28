var userAdminModule = angular.module('userAdminV2', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.userAdminV2', {
            data: {
                pageTitle: 'User Admin'
            },
            url: "/userAdminV2",
            controller: 'userAdminV2Ctrl',
            templateUrl: 'app/user_adminV2/user_adminV2.html'
        });
});