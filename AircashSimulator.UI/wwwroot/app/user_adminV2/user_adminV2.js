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

userAdminModule.service("userAdminService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        getUsers: getUsers,
        saveUser: saveUser,
        getPartners: getPartners
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
            url: config.baseUrl + "Partner/GetPartners",
           
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);


userAdminModule.controller("userAdminV2Ctrl", ['$scope', '$state', '$filter', 'userAdminService', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', '$location', function ($scope, $state, $filter, userAdminService, $http, JwtParser, $uibModal, $rootScope, $localStorage, $location) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    if ($scope.partnerRoles.indexOf("Admin") == -1) {
        $location.path('/forbidden');
    }

    $scope.users = [];
    $scope.pageSize = 10;
    $scope.pageNumber = 1;
    $scope.totalLoaded = 0;
    $scope.busy = false;


    $scope.setDefaults = function () {
        $scope.searchUser = null;
        $scope.SearchTable();
    };

    $scope.getUsers = function()
    {
        userAdminService.getUsers($scope.pageNumber, $scope.pageSize, $scope.searchUser)
            .then(function (response) {
                $scope.totalLoaded = response.length;
                $scope.users = $scope.users.concat(response);
                console.log($scope.users);
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

        $scope.users = [];
        $scope.pageNumber = 1;
        $scope.getUsers();
    }

    $scope.getUsers();




}]);