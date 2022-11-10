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
    paginationTemplateProvider.setPath('app/partner_adminV2/customTemplate.html');
});

partnerAdminModule.service("partnerAdminV2Service", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        getPartnerDetails: getPartnerDetails,
        getRoles: getRoles,
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

    function getPartnerDetails() {
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "Partner/GetPartnerDetails",
        });
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
                PartnerId: partnerId,
                
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }

}
]);

partnerAdminModule.controller("partnerAdminV2Ctrl", ['$scope', '$state', '$filter', 'partnerAdminV2Service', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', '$location' ,function ($scope, $state, $filter, partnerAdminV2Service, $http, JwtParser, $uibModal, $rootScope, $localStorage, $location) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    if ($scope.partnerRoles.indexOf("Admin") == -1) {
        $location.path('/forbidden');
    }
    $scope.setDefaults = function ()
    {
        $scope.searchedPartner = "";
        $scope.filter = $scope.partners;
    }

    $scope.getPartnerDetails = function () {
        partnerAdminV2Service.getPartnerDetails()
            .then(function (response) {
                if (response) {
                    $scope.partners = response;
                    $scope.filter = response;         
                }
            }, () => {
                console.log("Error, could not fetch partners!");
                $("#EmptyPartnersMessage").append("<p>Ne postoji niti jedan partner!</p>")
            });
    };

    $scope.SearchTable = function () {
        $scope.filter = $scope.searchedPartner ? $filter('filter')($scope.partners, $scope.searchedPartner) : $scope.partners;
    }


    $scope.partner = {};
    $scope.showPartnerModal = function (partner) {
        angular.copy(partner, $scope.partner);
        $scope.toggePartnerModal(true);
    }

    $scope.toggePartnerModal = function (flag)
    {
        $("#PartnerModal").modal(flag ? 'show' : 'hide');
    }

    $scope.savePartner = function ()
    {
        partnerAdminV2Service.savePartner($scope.partner,null)
            .then(function (resposne) {
                $scope.getPartnerDetails();
            }, () =>
            {
                console.log("Error, could not save partner!");
            });
        $scope.toggePartnerModal();
    }


    $scope.confirmDeleteModal = function (Partner) {
        $scope.partner.partnerName = Partner.partnerName;
        $scope.partner.partnerId = Partner.partnerId;
        $scope.toggleDeleteModal(true);
    };


    $scope.toggleDeleteModal = function (flag) {
        $("#confirmDeleteModal  .modal").modal(flag ? 'show' : 'hide');
    };


    $scope.deletePartner = function () {
        partnerAdminV2Service.deletePartner($scope.partner.partnerId)
            .then(function (resposne) {
                $scope.getPartnerDetails();
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
            $scope.togglePartnerRolesModal(true);
        }
        else { alert("Partner has no roles!"); }
       


    }

    $scope.togglePartnerRolesModal = function (flag)
    {
        $("#PartnerRolesModal").modal(flag ? "show" : "hide");
    }


    $scope.getPartnerDetails();
}]);