var partnerAdminModule = angular.module('partnerAdminV2', ['angularUtils.directives.dirPagination']);

app.config(function ($stateProvider, paginationTemplateProvider) {
    $stateProvider
        .state('app.partnerAdminV2', {
            data: {
                pageTitle: 'Partner Admin'
            },
            url: "/partnerAdminV2",
            controller: 'partnerAdminV2Ctrl',
            templateUrl: 'app/partner_adminV2/partner_adminV2.html'
        });
    paginationTemplateProvider.setPath('app/partner_adminV2/customPaginationTemplate.html');
});

partnerAdminModule.service("partnerAdminV2Service", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        getPartnersPage: getPartnersPage,
        getRoles: getRoles,
        getEnvironment: getEnvironment,
        savePartner: savePartner,
        deletePartner:deletePartner
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

    function getPartnersPage(pageSize,pageNum,search) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "Partner/GetPartnersPage",
            data: {
                PageSize: pageSize,
                PageNum: pageNum,
                Search: search
            }
        }
        );
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

    function savePartner(partner, roles) {
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
                Roles: roles
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

partnerAdminModule.controller("partnerAdminV2Ctrl", ['$scope', '$state', '$filter', 'partnerAdminV2Service', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', '$location','$q' ,function ($scope, $state, $filter, partnerAdminV2Service, $http, JwtParser, $uibModal, $rootScope, $localStorage, $location,$q) {
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

    $scope.getPartnersPage = function () {
        partnerAdminV2Service.getPartnersPage($scope.pageSize, $scope.pageNumber, $scope.searchedPartner)
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
        $scope.getPartnersPage();
    };

    $scope.SearchTable = function () {

        $scope.partners = [];
        $scope.pageNumber = 1;
        $scope.getPartnersPage();
    }

    $scope.partner = {};
    $scope.showPartnerModal = function (partner) {
        angular.copy(partner, $scope.partner);
        $scope.toggePartnerModal(true);
        $scope.checkPartnerRole();
    }

    $scope.toggePartnerModal = function (flag)
    {
        $("#PartnerModal").modal(flag ? 'show' : 'hide');
    }

    $scope.savePartner = function ()
    {
        $scope.sendRoles = [];
        $scope.filteredRoles = $filter('filter')($scope.roles, { selected: true });

        for (var i = 0; i < $scope.filteredRoles.length; i++)
        {
            $scope.sendRoles.push({
                RoleId: $scope.filteredRoles[i].roleId,
                RoleName : $scope.filteredRoles[i].roleName
            });  
        }

        partnerAdminV2Service.savePartner($scope.partner, $scope.sendRoles)
            .then(function (resposne) {

                $scope.SearchTable();
            }, () =>
            {
                console.log("Error, could not save partner!");
            });
        $scope.toggePartnerModal();
    }

    $scope.getRoles = function ()
    {
        partnerAdminV2Service.getRoles()
            .then(function (response)
            {
                $scope.roles = response;
                $scope.setCheckBoxSelected;
            },
            () => { console.log("Error, could not get roles!"); })
    }

    $scope.setCheckBoxSelected = function ()
    {
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
        partnerAdminV2Service.deletePartner($scope.partner.partnerId)
            .then(function (resposne) {
                $scope.SearchTable();
            }, () => {
                console.log("Error, could not delete partner!");
            });
        $scope.toggleDeleteModal();
    }

    $scope.ShowPartnerRolesModal = function (Partner)
    {
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

    $scope.togglePartnerRolesModal = function (flag)
    {
        $("#PartnerRolesModal").modal(flag ? "show" : "hide");
       
    }

    $scope.checkPartnerRole = function ()
    {
        $scope.setCheckBoxSelected();
        if ($scope.partner.roles != null)
        {
            for (var i = 0; i < $scope.roles.length;i++)
            {
                for (var j = 0; j < $scope.partner.roles.length; j++)
                {
                    if ($scope.roles[i].roleId == $scope.partner.roles[j].roleId)
                    {
                        $scope.roles[i].selected = true;
                        
                    }
                }
            }
        }
    }

    $scope.getPartnersPage();
    $scope.getRoles();
   
}]);