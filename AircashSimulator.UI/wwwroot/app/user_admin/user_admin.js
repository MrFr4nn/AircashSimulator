﻿var userAdminModule = angular.module('userAdmin', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.userAdmin', {
            data: {
                pageTitle: 'User Admin'
            },
            url: "/userAdmin",
            controller: 'userAdminCtrl',
            templateUrl: 'app/user_admin/user_admin.html?v=' + Global.appVersion
        });
});

userAdminModule.service("userAdminService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        getUsers: getUsers,
        saveUser: saveUser,
        getPartners: getPartners,
        deleteUser: deleteUser,
    });

    function getUsers(pageNumber, pageSize, search) {
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "User/GetUsers",
            params: {
                PageNumber: pageNumber,
                PageSize: pageSize,
                Search: search
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function saveUser(user) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "User/SaveUser",
            data: {
                UserId: user.UserId,
                UserName: user.UserName,
                Email: user.Email,
                Partner: user.Partner,
                Password: user.Password,
                FirstName: user.FirstName,
                LastName: user.LastName,
                BirthDate: user.BirthDate,
                PhoneNumber: user.PhoneNumber,
                Environment: parseInt(user.Environment)
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function getPartners() {
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "Partner/GetPartners",

        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function deleteUser(userId) {
        console.log(userId);
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "User/DeleteUser",
            data: {
                UserId : userId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

userAdminModule.controller("userAdminCtrl", ['$scope', '$state', '$filter', 'userAdminService', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', '$location', function ($scope, $state, $filter, userAdminService, $http, JwtParser, $uibModal, $rootScope, $localStorage, $location) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    if ($scope.partnerRoles.indexOf("Admin") == -1) {
        $location.path('/forbidden');
    }

    $scope.isNewUser = false;
    $scope.users = [];
    $scope.partners = [];
    $scope.pageSize = 10;
    $scope.pageNumber = 1;
    $scope.totalLoaded = 0;
   
    $scope.setDefaults = function () {
        $scope.searchUser = null;
        $scope.SearchTable();
    };

    $scope.getUsers = function () {
        userAdminService.getUsers($scope.pageNumber, $scope.pageSize, $scope.searchUser)
            .then(function (response) {
                $scope.totalLoaded = response.length;
                $scope.users = $scope.users.concat(response);
            }, () => {
                console.log("Error, could not fetch users.");
            });
    }
    
    $scope.loadMore = function (pageSize) {
        $scope.pageNumber += 1;
        $scope.pageSize = pageSize;
        $scope.getUsers();
    };

    $scope.SearchTable = function () {
        $scope.user = {};
        $scope.users = [];
        $scope.pageNumber = 1;
        $scope.getUsers();
    }

    $scope.getPartners = function () {
        userAdminService.getPartners()
            .then(function (response) {
                $scope.partners = response;
            }, () => {
                console.log("Error, could not find partners.");
            });
    }

    $scope.user = {};
    $scope.addEditUserModal = function (user) {
        angular.copy(user, $scope.user);
        if (user !=null) $scope.user.BirthDate = new Date(user.BirthDate)
        $scope.ConfirmPassword = null;
        if ($scope.user.Partner != undefined) {
            $("#selPartner").val($scope.user.Partner.Id).change();
            $scope.isNewUser = false;
        }
        else
        {
            $("#selPartner").val(null).change();
            $scope.isNewUser = true;
        }
        if ($scope.user.Environment == undefined) {
            $scope.user.Environment = 2;
        }
        $scope.toggleAddEditUserModal(true);
    }

    $scope.toggleAddEditUserModal = function (flag) {
        $("#addUserModal").modal(flag ? 'show' : 'hide');
    };

    $scope.checkPassword = function () {
        if ($scope.user.Password == $scope.ConfirmPassword) {
            $scope.saveUser();
        }
        else {
            alert("Passwords do not match!");
        }
    }

    $scope.saveUser = function () {
        var partnerId = $('#selPartner').val();
        var filter = $filter('filter')($scope.partners, { 'Id': partnerId }, true)[0];

        if (filter == null) {
            alert("Select partner!");
            return;
        }
        $scope.user.Partner = filter;
        userAdminService.saveUser($scope.user)
            .then(function (response) {
                $scope.SearchTable();
        }, () => {
            console.log("Error, could not save user.");
            });
        $scope.toggleAddEditUserModal(); 
    }

    $scope.deleteUserModal = function (user) {
        angular.copy(user, $scope.user);
        $scope.toggleDeleteUserModal(true);
    }

    $scope.toggleDeleteUserModal = function (flag) {
        $("#confirmDeleteModal").modal(flag ? 'show' : 'hide');
    };

    $scope.deleteUser = function () {
        userAdminService.deleteUser($scope.user.UserId)
            .then(function (response) {
                $scope.SearchTable();
            }, () => {
                console.log("Error, could not delete user.");
            });
        $scope.toggleDeleteUserModal();
    }

    $scope.setUserDate = function (date) {
        $scope.user.BirthDate = date;
    }

    $scope.getUsers();
    $scope.getPartners();
    $("#selPartner").select2({placeholder: "Select partner"});
}]);