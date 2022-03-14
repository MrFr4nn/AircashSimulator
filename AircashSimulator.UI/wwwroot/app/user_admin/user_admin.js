var userAdminModule = angular.module('userAdmin', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.userAdmin', {
            data: {
                pageTitle: 'User Admin'
            },
            url: "/userAdmin",
            controller: 'userAdminCtrl',
            templateUrl: 'app/user_admin/user_admin.html'
        });
});

userAdminModule.service("userAdminService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        getUsers: getUsers,
        getUserDetails: getUserDetails,
        saveUser: saveUser,
        getPartners: getPartners
    });

    function getUsers() {
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "User/GetUsers"
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function getUserDetails(userId) {
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "User/GetUserDetails",
            params: {
                userId: userId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function saveUser(user) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "User/SaveUser",
            data: {
                UserId: user.userId,
                UserName: user.userName,
                Email: user.email,
                PartnerId: user.partnerId,
                Password: user.password
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function getPartners() {
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "Partner/GetPartners"
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

userAdminModule.controller("userAdminCtrl", ['$scope', '$state', '$filter', 'userAdminService', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', '$location', function ($scope, $state, $filter, userAdminService, $http, JwtParser, $uibModal, $rootScope, $localStorage, $location) {


    $scope.setDefaults = function () {
        $scope.user = null;
        $scope.selectedUser = null;
    };

    $scope.getUsers = function () {
        userAdminService.getUsers()
            .then(function (response) {
                if (response) {
                    $scope.users = response;
                }
            }, () => {
                console.log("Error, could not fetch users.");
            });
    };

    $scope.getUserDetails = function () {
        userAdminService.getUserDetails($scope.selectedUser)
            .then(function (response) {
                if (response) {
                    $scope.user = response;
                }
            }, () => {
                console.log("Error, could not fetch user details.");
            });
    };

    $scope.saveUser = function () {
        userAdminService.saveUser($scope.user)
            .then(function (response) {
                $scope.setDefaults();
                $scope.getUsers;
            }, () => {
                console.log("Error, could not fetch roles.");
            });
    }

    $scope.getPartners = function () {
        userAdminService.getPartners()
            .then(function (response) {
                if (response) {
                    $scope.partners = response;
                }
            }, () => {
                console.log("Error, could not fetch partners.");
            });
    };

    $scope.setDefaults();
    $scope.getUsers();
    $scope.getPartners();
}]);