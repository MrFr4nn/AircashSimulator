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
        getPartnersDetail: getPartnersDetail,
        getRoles: getRoles,
        getEnvironment: getEnvironment,
        savePartner: savePartner,
        savePartnerV2: savePartnerV2,
        deletePartner: deletePartner
    });

    function getRoles() {
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "Partner/GetRoles"
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function getEnvironment() {
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "Partner/GetEnviromentEnum"
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function getPartnersDetail(pageSize, pageNumber, search) {
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "Partner/GetPartnersDetail",
            params: {
                pageSize: pageSize,
                pageNumber: pageNumber,
                search: search
            }
        }
        );
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function savePartner(partner, roles, username) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "Partner/SavePartner",
            data: {
                PartnerId: partner.partnerId,
                PartnerName: partner.partnerName,
                PrivateKey: partner.privateKey,
                PrivateKeyPass: partner.privateKeyPass,
                CurrencyId: partner.currencyId,
                CountryCode: partner.countryCode,
                Environment: parseInt(partner.environment),
                Roles: roles,
                UseDefaultPartner: (partner.useDefaultPartner === 'true'),
                Username: username
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function savePartnerV2(partner, roleIds) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "Partner/savePartnerV2",
            data: {
                PartnerName: partner.partnerName,
                CurrencyId: partner.currencyId,
                CountryCode: partner.countryCode,
                Username: partner.username,
                Roles: roleIds
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function deletePartner(partnerId) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "Partner/DeletePartner",
            data: {
                PartnerId: partnerId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

partnerAdminModule.controller("partnerAdminCtrl", ['$scope', '$state', '$filter', 'partnerAdminService', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', '$location', '$q', function ($scope, $state, $filter, partnerAdminService, $http, JwtParser, $uibModal, $rootScope, $localStorage, $location, $q) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    if ($scope.partnerRoles.indexOf("Admin") == -1) {
        $location.path('/forbidden');
    }

    $scope.partners = [];
    $scope.pageSize = 10;
    $scope.pageNumber = 1;
    $scope.totalLoaded = 0;
    $scope.busy = false;

    $scope.searchedPartner = null;

    $scope.setDefaults = function () {
        $scope.searchedPartner = null;
        $scope.SearchTable();
    }

    $scope.getPartnersDetail = function () {
        partnerAdminService.getPartnersDetail($scope.pageSize, $scope.pageNumber, $scope.searchedPartner)
            .then(function (response) {
                if (response) {
                    $scope.totalLoaded = response.length;
                    $scope.partners = $scope.partners.concat(response);
                }
            }, () => {
                console.log("Error, could not fetch partners!");
            });
    };

    $scope.loadMore = function (pageSize) {
        $scope.pageNumber += 1;
        $scope.pageSize = pageSize;
        $scope.getPartnersDetail();
    };

    $scope.SearchTable = function () {
        $scope.partnerV2 = {};
        $scope.partners = [];
        $scope.pageNumber = 1;
        $scope.getPartnersDetail();
        $scope.defaultCountry = "HR";
        $scope.setCurrency = 978;
    }
    $scope.partner = {};
    $scope.showPartnerModal = function (partner, newPartner) {
        $scope.newPartner = newPartner;
        if (partner) {
            partner.useDefaultPartner = String(partner.useDefaultPartner);
            partner.environment = String(partner.environment);
            $scope.defaultCountry = partner.countryCode;
            $scope.setCurrency = partner.currencyId;
            angular.copy(partner, $scope.partner);
        } else {
            $scope.defaultCountry = "HR";
            $scope.setCurrency = 978;
            $scope.partner = {
                currencyId: $scope.currencyNew.code,
                countryCode: $scope.countryPickerCode.countryCode,
                useDefaultPartner: "true",
                environment: "2"
            };
        }
        $scope.toggePartnerModal(true);
        $scope.checkPartnerRole();
    }

    $scope.toggePartnerModal = function (flag) {
        $("#PartnerModal").modal(flag ? 'show' : 'hide');
    }

    $scope.toggePartnerNewModal = function (flag, sNewRoleId) {
        $scope.defaultCountry = "HR";
        $scope.setCurrency = 978;
        if (flag) {
            $scope.sendRolesV2 = [];
            $scope.roles.forEach(function (role) {
                if (sNewRoleId.find(x => x == role.roleId)) {
                    $scope.sendRolesV2.push({
                        RoleId: role.roleId,
                        RoleName: role.roleName
                    });
                }

            });
        }
        
        $("#partnerV2Modal").modal(flag ? 'show' : 'hide');
    }

    $scope.savePartner = function () {
        $scope.sendRoles = [];
        $scope.filteredRoles = $filter('filter')($scope.roles, { selected: true });

        for (var i = 0; i < $scope.filteredRoles.length; i++) {
            $scope.sendRoles.push({
                RoleId: $scope.filteredRoles[i].roleId,
                RoleName: $scope.filteredRoles[i].roleName
            });
        }
        $scope.partner.countryCode = $scope.countryPickerCode.countryCode;
        $scope.partner.currencyId = $scope.currencyNew.code;
        partnerAdminService.savePartner($scope.partner, $scope.sendRoles, $scope.username)
            .then(function (resposne) {
                $scope.SearchTable();
                $scope.defaultCountry = "";
                $scope.setCurrency = 0;
            }, () => {
                console.log("Error, could not save partner!");
            });
        $scope.toggePartnerModal();
    }

    $scope.partnerV2 = {};
    $scope.savePartnerV2 = function () {
        $scope.partnerV2.countryCode = $scope.countryCodePayPicker.countryCode;
        $scope.partnerV2.currencyId = $scope.currencyPay.code;
        partnerAdminService.savePartnerV2($scope.partnerV2, $scope.sendRolesV2)
            .then(function (resposne) {
                $scope.SearchTable();
                $scope.defaultCountry = "";
                $scope.setCurrency = 0;
            }, () => {
                console.log("Error, could not save partner!");
            });
        $scope.toggePartnerNewModal();
        $scope.setDefaults();
    }

    $scope.getRoles = function () {
        partnerAdminService.getRoles()
            .then(function (response) {
                $scope.roles = response;
                $scope.setCheckBoxSelected;
            },
                () => { console.log("Error, could not get roles!"); })
    }

    $scope.setCheckBoxSelected = function () {
        for (var i = 0; i < $scope.roles.length; i++) {
            $scope.roles[i].selected = false;
        }
    }

    $scope.confirmDeleteModal = function (Partner) {
        $scope.partner.partnerName = Partner.partnerName;
        $scope.partner.partnerId = Partner.partnerId;
        $scope.toggleDeleteModal(true);
    };

    $scope.toggleDeleteModal = function (flag) {
        $("#confirmDeleteModal").modal(flag ? 'show' : 'hide');
    };

    $scope.deletePartner = function () {
        partnerAdminService.deletePartner($scope.partner.partnerId)
            .then(function (resposne) {
                $scope.SearchTable();
            }, () => {
                console.log("Error, could not delete partner!");
            });
        $scope.toggleDeleteModal();
    }

    $scope.ShowPartnerRolesModal = function (Partner) {
        if (Partner.roles != null) {
            $scope.partner.partnerName = Partner.partnerName;
            $scope.partner.roles = Partner.roles;
            $('#EmptyRoles').empty();
            $scope.togglePartnerRolesModal(true);
        }
        else {
            $scope.partner.partnerName = Partner.partnerName;
            $scope.partner.roles = null;
            $('#EmptyRoles').empty().append("<h6 style='color:#000000;' class=' alert alert-info'>Partner has no roles!</h6>");
            $scope.togglePartnerRolesModal(true);
        }
    }

    $scope.togglePartnerRolesModal = function (flag) {
        $("#PartnerRolesModal").modal(flag ? "show" : "hide");
    }

    $scope.checkPartnerRole = function () {
        $scope.setCheckBoxSelected();
        if ($scope.partner.roles != null) {
            for (var i = 0; i < $scope.roles.length; i++) {
                for (var j = 0; j < $scope.partner.roles.length; j++) {
                    if ($scope.roles[i].roleId == $scope.partner.roles[j].roleId) {
                        $scope.roles[i].selected = true;
                    }
                }
            }
        }
    }

    $("#partnerV2Modal").on("hidden.bs.modal", function () {
        $scope.SearchTable();
        $scope.defaultCountry = "";
        $scope.setCurrency = 0;
    });
    $("#PartnerModal").on("hidden.bs.modal", function () {
        $scope.SearchTable();
        $scope.defaultCountry = "";
        $scope.setCurrency = 0;
    });

    $scope.getPartnersDetail();
    $scope.getRoles();
}]);