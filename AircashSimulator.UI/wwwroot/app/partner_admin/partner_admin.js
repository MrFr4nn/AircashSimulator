var partnerAdminModule = angular.module('partnerAdmin', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.partnerAdmin', {
            data: {
                pageTitle: 'Partner Admin'
            },
            url: "/partnerAdmin",
            controller: 'partnerAdminCtrl',
            templateUrl: 'app/partner_admin/partner_admin.html'
        });
});

partnerAdminModule.service("partnerAdminService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        getPartners: getPartners,
        getPartnerRoles: getPartnerRoles,
        getRoles: getRoles,
        saveRoles: saveRoles
    });

    function getPartners() {
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "Partner/GetPartners"
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function getRoles() {
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "Partner/GetRoles"
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function getPartnerRoles(partnerId) {
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "Partner/GetPartnerRoles",
            params: {
                partnerId: partnerId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function saveRoles(partnerId, roles) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "Partner/SaveRoles",
            data: {
                PartnerId: partnerId,
                Roles: roles
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

partnerAdminModule.controller("partnerAdminCtrl", ['$scope', '$state', '$filter', 'partnerAdminService', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', '$location', function ($scope, $state, $filter, partnerAdminService, $http, JwtParser, $uibModal, $rootScope, $localStorage, $location) {


    $scope.setDefaults = function () {
        $scope.roleTags = [];
        $scope.activePartner = null;
        $scope.selectedPartner = null;
    };

    $scope.getPartners = function () {
        partnerAdminService.getPartners()
            .then(function (response) {
                if (response) {
                    $scope.partners = response;
                }
            }, () => {
                console.log("Error, could not fetch partners.");
            });
    };

    $scope.getRoles = function () {
        partnerAdminService.getRoles()
            .then(function (response) {
                if (response) {
                    $scope.allRoles = response;
                }
            }, () => {
                console.log("Error, could not fetch roles.");
            });
    };

    $scope.getPartnerRoles = function () {
        partnerAdminService.getPartnerRoles($scope.selectedPartner)
            .then(function (response) {
                if (response) {
                    $scope.activePartner = response.partnerId;
                    $scope.roleTags = response.roles;
                }
            }, () => {
                console.log("Error, could not fetch partner roles.");
            });
    };

    $scope.insertRoleTag = function () {
        if (!($scope.check($scope.selectedRole)))
            $scope.roleTags.push($scope.selectedRole);
    }

    $scope.removeRoleTag = function (tag) {
        if ($scope.roleTags.includes(tag))
            $scope.roleTags.splice($scope.roleTags.indexOf(tag), 1);
        else
            alerts.addError("Tag not selected");
    }

    $scope.addAllRoleTags = function () {
        for (var i = 0; i < ($scope.allRoles).length; i++) {
            if (!($scope.check($scope.allRoles[i])))
                $scope.roleTags.push($scope.allRoles[i]);
        }
    }

    $scope.removeAllRoleTags = function () {
        var l = ($scope.roleTags).length;
        for (var i = 0; i < l; i++) {
            $scope.roleTags.pop();
        }
    }

    $scope.check = function (input) {
        var contains = false;
        var l = $scope.roleTags.length;
        for (var i = 0; i < l; i++) {
            if ($scope.roleTags[i].roleId === input.roleId) {
                contains = true;
            }
        }
        return contains;
    }

    $scope.saveRoles = function () {
        partnerAdminService.saveRoles($scope.activePartner, $scope.roleTags)
            .then(function (response) {
                $scope.setDefaults();
            }, () => {
                console.log("Error, could not fetch roles.");
            });
    }

    $scope.setDefaults();
    $scope.getPartners();
    $scope.getRoles();
}]);