var partnerSiteModule = angular.module('partnerSite', ["xeditable"]);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.partnerSite', {
            data: {
                pageTitle: 'Partner Site'
            },
            url: "/partnerSite/:partnerId",
            controller: 'partnerSiteCtrl',
            templateUrl: 'app/partner_admin/partner_site.html?v=' + Global.appVersion

        });
});

partnerSiteModule.service("partnerSiteService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            getPartnerDetail: getPartnerDetail,
            getPartnerIntegrationContact: getPartnerIntegrationContact,
            getPartnerErrorCodes: getPartnerErrorCodes,
            getEndpoints: getEndpoints,
            getPartnerEndpoints: getPartnerEndpoints
        });

        function getPartnerDetail(partnerId) {
            var request = $http({
                method: 'GET',
                url: config.baseUrl + "Partner/GetPartnerDetail",
                params: {
                    partnerId:partnerId
                }
            }
            );
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        } 

        function getPartnerIntegrationContact(partnerId) {
            var request = $http({
                method: 'GET',
                url: config.baseUrl + "Partner/GetPartnerIntegrationContact",
                params: {
                    partnerId: partnerId
                }
            }
            );
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        } 

        function getPartnerErrorCodes(partnerId) {
            var request = $http({
                method: 'GET',
                url: config.baseUrl + "Partner/GetPartnerErrorCodes",
                params: {
                    partnerId: partnerId
                }
            }
            );
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        } 

        function getEndpoints() {
            var request = $http({
                method: 'GET',
                url: config.baseUrl + "Partner/GetEndpoints"
            }
            );
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }

        function getPartnerEndpoints(partnerId, endpointType) {
            var request = $http({
                method: 'GET',
                url: config.baseUrl + "Partner/GetPartnerEndpoints",
                params: {
                    partnerId: partnerId,
                    endpointType: endpointType
                }
            }
            );
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
    }
]);

partnerSiteModule.controller("partnerSiteCtrl",
    ['$scope', '$state', 'partnerSiteService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', '$location',
        function ($scope, $state, partnerSiteService, $filter, $http, JwtParser, $uibModal, $rootScope, $localStorage, $location) {

            $scope.roles = [];$scope.partnerId = $state.params.partnerId;
            $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
            $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
            if ($scope.partnerRoles.indexOf("Admin") == -1) {
                $location.path('/forbidden');
            }

            $scope.displayPanels = function () {
                if ($scope.roles.find((r) => r.RoleId == 5 || r.RoleId == 17)) {
                    $("#panelAbon").attr("style", "display:block");
                }
                if ($scope.roles.find((r) => r.RoleId == 3 || r.RoleId == 8 || r.RoleId == 12)) {
                    $("#panelWithdrawal").attr("style", "display:block");
                }
                if ($scope.roles.find((r) => r.RoleId == 2 || r.RoleId == 9 || r.RoleId == 16)) {
                    $("#panelAcPay").attr("style", "display:block");
                }
                if ($scope.roles.find((r) => r.RoleId == 6)) {
                    $("#panelMarketplace").attr("style", "display:block");
                }
            }

            $scope.getPartnerDetail = function () {
                partnerSiteService.getPartnerDetail($scope.partnerId)
                    .then(function (response) {
                        if (response) {
                            $scope.partner = response[0];
                            $scope.partnerName = $scope.partner.PartnerName;
                            $scope.brand = $scope.partner.Brand;
                            $scope.platform = $scope.partner.Platform;
                            $scope.internalTicket = $scope.partner.InternalTicket;
                            $scope.marketplacePosition = $scope.partner.MarketplacePosition;
                            $scope.countryCode = $scope.partner.CountryCode;
                            $scope.integrationTypeEnums = $scope.partner.IntegrationTypeEnums;
                            $scope.abonAuthorizationEnums = $scope.partner.AbonAuthorizationEnums;
                            $scope.abonAmoutRuleEnums = $scope.partner.AbonAmoutRuleEnums;
                            $scope.withdrawalInstantEnums = $scope.partner.WithdrawalInstantEnums;
                            $scope.abonTypeExist = $scope.integrationTypeEnums.find(function (o) { return o.Value == $scope.partner.AbonType });
                            if ($scope.abonTypeExist != undefined) {
                                $scope.abonType = $scope.abonTypeExist.Key;
                            }
                            else {
                                $scope.abonType = 0;
                            }
                            $scope.acPayTypeExist = $scope.integrationTypeEnums.find(function (o) { return o.Value == $scope.partner.AcPayType });
                            if ($scope.acPayTypeExist != undefined) {
                                $scope.acPayType = $scope.acPayTypeExist.Key;
                            }
                            else {
                                $scope.acPayType = 0;
                            }
                            $scope.withdrawalTypeExist = $scope.integrationTypeEnums.find(function (o) { return o.Value == $scope.partner.WithdrawalType });
                            if ($scope.withdrawalTypeExist != undefined) {
                                $scope.withdrawalType = $scope.withdrawalTypeExist.Key;
                            }
                            else {
                                $scope.withdrawalType = 0;
                            }
                            $scope.withdrawalInstantExist = $scope.withdrawalInstantEnums.find(function (o) { return o.Value == $scope.partner.WithdrawalInstant });
                            if ($scope.withdrawalInstantExist != undefined) {
                                $scope.withdrawalInstant = $scope.withdrawalInstantExist.Key;
                            }
                            else {
                                $scope.withdrawalInstant = 0;
                            }
                            $scope.abonAuthorizationExist = $scope.abonAuthorizationEnums.find(function (o) { return o.Value == $scope.partner.AbonAuthorization });
                            if ($scope.abonAuthorizationExist != undefined) {
                                $scope.abonAuthorization = $scope.abonAuthorizationExist.Key;
                            }
                            else {
                                $scope.abonAuthorization = 0;
                            }
                            $scope.abonAmountRuleExist = $scope.abonAuthorizationEnums.find(function (o) { return o.Value == $scope.partner.AbonAmountRule });
                            if ($scope.abonAmountRuleExist != undefined) {
                                $scope.abonAmountRule = $scope.abonAmountRuleExist.Key;
                            }
                            else {
                                $scope.abonAmountRule = 0;
                            }                            
                            $scope.roles = $scope.partner.Roles;
                            $scope.displayPanels();

                        }
                    }, () => {
                        console.log("Error, could not fetch partner!");
                    });
            };

            $scope.getPartnerIntegrationContact = function () {
                partnerSiteService.getPartnerIntegrationContact($scope.partnerId)
                    .then(function (response) {
                        if (response) {
                            $scope.partnerIntegrationContact = response[0];
                            if ($scope.partnerIntegrationContact != null) {
                                $scope.partnerContact = $scope.partnerIntegrationContact.Contact;
                            }
                            else {
                                $scope.partnerContact = null;
                            }
                            
                        }
                    }, () => {
                        console.log("Error, could not fetch partner integration contact!");
                    });
            };

            $scope.getPartnerErrorCodes = function () {
                partnerSiteService.getPartnerErrorCodes($scope.partnerId)
                    .then(function (response) {
                        if (response) {
                            $scope.partnerErrorCodes = response;
                            
                        }
                    }, () => {
                        console.log("Error, could not fetch partner error codes!");
                    });
            };

            $scope.getEndpoints = function () {
                partnerSiteService.getEndpoints()
                    .then(function (response) {
                        if (response) {
                            $scope.endpoints = response;

                        }
                    }, () => {
                        console.log("Error, could not fetch endpoints!");
                    });
            }

            $scope.getPartnerEndpoints = function () {
                partnerSiteService.getPartnerEndpoints($scope.partnerId,'AbonDeposit')
                    .then(function (response) {
                        if (response) {
                            $scope.partnerEndpointsAbon = response;
                        }
                    }, () => {
                        console.log("Error, could not fetch partner endpoints!");
                    });
                partnerSiteService.getPartnerEndpoints($scope.partnerId, 'Withdrawal')
                    .then(function (response) {
                        if (response) {
                            $scope.partnerEndpointsWithdrawal = response;
                        }
                    }, () => {
                        console.log("Error, could not fetch partner endpoints!");
                    });
                partnerSiteService.getPartnerEndpoints($scope.partnerId, 'AircashPay')
                    .then(function (response) {
                        if (response) {
                            $scope.partnerEndpointsAcPay = response;
                        }
                    }, () => {
                        console.log("Error, could not fetch partner endpoints!");
                    });
            }
            
            $scope.getPartnerDetail();
            $scope.getPartnerIntegrationContact();
            $scope.getPartnerErrorCodes();
            $scope.getEndpoints();
            $scope.getPartnerEndpoints();

            $scope.showAddErrorCodeModal = function () {
                $('#AddErrorCodeModal').modal('show');
            }

            $scope.saveErrorCode = function () {
                $scope.newErrorCode="";
                $scope.newDescription = "";
                $scope.newLocoKey = "";
            }

            $scope.closeAddErrorCodeModal = function () {
                $('#AddErrorCodeModal').modal('hide');
                $scope.newErrorCode = "";
                $scope.newDescription = "";
                $scope.newLocoKey = "";
            }

            $scope.showAddApiDetailsModal = function (endpointType) {
                $('#selectUrl').empty();
                for (var i = 0; i < $scope.endpoints.length; i++) {
                    if ($scope.endpoints[i].EndpointType == endpointType) {
                        $('#selectUrl').append('<option value="' + $scope.endpoints[i].Id + '">' + $scope.endpoints[i].Url +'</option>');
                    }
                }               
                $('#AddApiDetailsModal').modal('show');
            }

            $scope.saveApiDetails = function () {
                console.log($('#selectUrl').find(':selected').val());
                $('#AddApiDetailsModal').modal('hide');
                $scope.newRequest = "";
                $scope.newResponse = "";
            }

            $scope.closeAddApiDetailsModal = function () {
                $('#AddApiDetailsModal').modal('hide');
                $scope.newRequest = "";
                $scope.newResponse = "";
            }
        }

    ]);

app.run(['editableOptions', function (editableOptions) {
    editableOptions.theme = 'bs3';
}]);