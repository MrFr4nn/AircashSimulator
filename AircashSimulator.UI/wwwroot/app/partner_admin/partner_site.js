﻿var partnerSiteModule = angular.module('partnerSite', ["xeditable"]);

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
            getOptions: getOptions,
            savePartnerSite: savePartnerSite
        });

        function getPartnerDetail(partnerId) {
            var request = $http({
                method: 'GET',
                url: config.baseUrl + "Partner/GetPartnerDetail",
                params: {
                    partnerId: partnerId
                }
            }
            );
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        } 

        function getOptions() {
            var request = $http({
                method: 'GET',
                url: config.baseUrl + "Partner/GetOptions"
            }
            );
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }

        function savePartnerSite(partnerId, productionPartnerId, partnerName, brand, platform, internalTicket, confluence, partnerIntegrationContacts, abonType, abonAmountRule,
            abonAuthorization, partnerEndpoints, withdrawalType, withdrawalInstant, acPayType, countryCode, marketplacePosition, partnerErrorCodes, partnerLoginAccounts) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "Partner/SavePartnerSite",
                data: {
                    PartnerId: partnerId,
                    ProductionPartnerId: productionPartnerId,
                    PartnerName: partnerName,
                    Brand: brand,
                    Platform: platform,
                    InternalTicket: internalTicket,
                    Confluence: confluence,
                    MarketplacePosition: marketplacePosition,
                    CountryCode: countryCode,
                    AbonAmountRule: abonAmountRule,
                    AbonAuthorization: abonAuthorization,
                    AbonType: abonType,
                    AcPayType: acPayType,
                    WithdrawalType: withdrawalType,
                    WithdrawalInstant: withdrawalInstant,
                    PartnerEndpoints: partnerEndpoints,
                    PartnerIntegrationContact: partnerIntegrationContacts,
                    PartnerErrorCodes: partnerErrorCodes,
                    PartnerLoginAccounts: partnerLoginAccounts
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

            $scope.integrationContactId = null; $scope.checkPlayerUrl = "empty (API)"; $scope.confirmPaymentUrl = "empty (API)";
            $scope.checkPlayerRequest = "-"; $scope.checkPlayerResponse = "-"; $scope.confirmPaymentRequest = "-"; $scope.confirmPaymentResponse = "-";
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
                            $scope.productionPartnerId = $scope.partner.ProductionPartnerId;
                            if ($scope.productionPartnerId == '00000000-0000-0000-0000-000000000000') {
                                $scope.productionPartnerId = null;
                            }
                            $scope.partnerName = $scope.partner.PartnerName;
                            $scope.brand = $scope.partner.Brand;
                            $scope.platform = $scope.partner.Platform;
                            $scope.internalTicket = $scope.partner.InternalTicket;
                            $scope.confluence =  $scope.partner.Confluence;
                            $scope.marketplacePosition = $scope.partner.MarketplacePosition;
                            $scope.countryCode = $scope.partner.CountryCode;
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
                            $scope.abonAmountRuleExist = $scope.abonAmoutRuleEnums.find(function (o) { return o.Value == $scope.partner.AbonAmountRule });
                            if ($scope.abonAmountRuleExist != undefined) {
                                $scope.abonAmountRule = $scope.abonAmountRuleExist.Key;
                            }
                            else {
                                $scope.abonAmountRule = 0;
                            }                            
                            $scope.roles = $scope.partner.Roles;
                            $scope.partnerEndpointsAbon = $scope.partner.PartnerEndpoints.filter(x => x.EndpointTypeName === "AbonDeposit");
                            $scope.partnerEndpointsWithdrawal = $scope.partner.PartnerEndpoints.filter(x => x.EndpointTypeName === "Withdrawal");
                            $scope.partnerEndpointsAcPay = $scope.partner.PartnerEndpoints.filter(x => x.EndpointTypeName === "AircashPay");
                            $scope.partnerEndpointsMarketplace = $scope.partner.PartnerEndpoints.filter(x => x.EndpointTypeName === "Marketplace");
                            $scope.partnerIntegrationContacts = $scope.partner.PartnerIntegrationContact;
                            $scope.partnerErrorCodes = $scope.partner.PartnerErrorCodes;
                            $scope.partnerLoginAccounts = $scope.partner.PartnerLoginAccounts;
                            $scope.checkPlayerExist = $scope.partnerEndpointsMarketplace.find(function (o) { return o.Url == 'CheckPlayer' });
                            if ($scope.checkPlayerExist != undefined) {
                                $scope.checkPlayerRequest = $scope.checkPlayerExist.Request;
                                $scope.checkPlayerResponse = $scope.checkPlayerExist.Response;
                            }
                            $scope.confirmPaymentExist = $scope.partnerEndpointsMarketplace.find(function (o) { return o.Url == 'CreateAndConfirmPayment' });
                            if ($scope.confirmPaymentExist != undefined) {
                                $scope.confirmPaymentRequest = $scope.confirmPaymentExist.Request;
                                $scope.confirmPaymentResponse = $scope.confirmPaymentExist.Response;
                            }
                            $scope.displayPanels();
                        }
                    }, () => {
                        console.log("Error, could not fetch partner!");
                    });
            };

            $scope.getOptions = function () {
                partnerSiteService.getOptions()
                    .then(function (response) {
                        if (response) {
                            $scope.options = response;
                            $scope.endpoints = $scope.options.Endpoints;
                            $scope.integrationTypeEnums = $scope.options.IntegrationTypeEnums;
                            $scope.abonAuthorizationEnums = $scope.options.AbonAuthorizationEnums;
                            $scope.abonAmoutRuleEnums = $scope.options.AbonAmoutRuleEnums;
                            $scope.withdrawalInstantEnums = $scope.options.WithdrawalInstantEnums;
                            $scope.getPartnerDetail();
                        }
                    }, () => {
                        console.log("Error, could not fetch options!");
                    });
            }
            
            $scope.getOptions();

            $scope.showAddErrorCodeModal = function () {
                $('#AddErrorCodeModal').modal('show');
            }

            $scope.addErrorCode = function () {
                var newErrorCode = {
                    Id: 0,
                    Code: $scope.newCode,
                    LocoKey: $scope.newLocoKey,
                    Description: $scope.newDescription

                }
                $scope.partnerErrorCodes.push(newErrorCode);
                $scope.newCode = "";
                $scope.newDescription = "";
                $scope.newLocoKey = "";
                $('#AddErrorCodeModal').modal('hide');
                
            }

            $scope.closeAddErrorCodeModal = function () {
                $('#AddErrorCodeModal').modal('hide');
                $scope.newCode = "";
                $scope.newDescription = "";
                $scope.newLocoKey = "";
            }

            $scope.deleteErrorCode = function (index) {
                $scope.partnerErrorCodes.splice(index, 1);
            } 

            $scope.showAddApiDetailsModal = function (endpointType) {
                $('#endpointTitle').text(endpointType);
                $('#selectUrl').empty();
                for (var i = 0; i < $scope.endpoints.length; i++) {
                    if ($scope.endpoints[i].EndpointType == endpointType) {
                        $('#selectUrl').append('<option value="' + $scope.endpoints[i].Id + '">' + $scope.endpoints[i].Url +'</option>');
                    }
                }               
                $('#AddApiDetailsModal').modal('show');
            }

            $scope.addApiDetails = function () {
                var endpointType = $('#endpointTitle').text();
                var newApiDetails = {
                    Id: 0,
                    Url: $('#selectUrl').find(':selected').text(),
                    Request: JSON.stringify(JSON.parse($scope.newRequest)),
                    Response: JSON.stringify(JSON.parse($scope.newResponse)),
                    EndpointType: 0,
                    EndpointTypeName: endpointType,
                    EndpointId: $('#selectUrl').find(':selected').val(),
                }
                if (endpointType == 'AbonDeposit') {
                    $scope.partnerEndpointsAbon.push(newApiDetails);
                }
                else if (endpointType == 'Withdrawal') {
                    $scope.partnerEndpointsWithdrawal.push(newApiDetails);
                }
                else if (endpointType == 'AircashPay') {
                    $scope.partnerEndpointsAcPay.push(newApiDetails);
                }
                $('#AddApiDetailsModal').modal('hide');
                $scope.newRequest = "";
                $scope.newResponse = "";
            }

            $scope.closeAddApiDetailsModal = function () {
                $('#AddApiDetailsModal').modal('hide');
                $scope.newRequest = "";
                $scope.newResponse = "";
            }

            $scope.deleteApiDetails = function (index, endpointType) {
                if (endpointType == 'AbonDeposit') {
                    $scope.partnerEndpointsAbon.splice(index, 1);
                }
                else if (endpointType == 'Withdrawal') {
                    $scope.partnerEndpointsWithdrawal.splice(index, 1);
                }
                else if (endpointType == 'AircashPay') {
                    $scope.partnerEndpointsAcPay.splice(index, 1);
                }
            } 

            $scope.showAddIntegrationContactModal = function () {
                $('#AddIntegrationContactModal').modal('show');
            }

            $scope.addIntegrationContact = function () {
                var newIntegrationContact = {
                    Id: 0,
                    ContactName: $scope.newContactName,
                    ContactEmail: $scope.newContactEmail,
                    ContactPhoneNumber: $scope.newContactPhoneNumber

                }
                $scope.partnerIntegrationContacts.push(newIntegrationContact);
                $scope.newContactName = "";
                $scope.newContactEmail = "";
                $scope.newContactPhoneNumber = "";
                $('#AddIntegrationContactModal').modal('hide');
            }

            $scope.closeAddIntegrationContactModal = function () {
                $('#AddIntegrationContactModal').modal('hide');
                $scope.newContactName = "";
                $scope.newContactEmail = "";
                $scope.newContactPhoneNumber = "";
            }

            $scope.deleteIntegrationContact = function (index) {
                $scope.partnerIntegrationContacts.splice(index, 1);
            }  

            $scope.showAddLoginAccountModal = function () {
                $('#AddLoginAccountModal').modal('show');
            }

            $scope.addLoginAccount = function () {
                var newLoginAccount = {
                    Id: 0,
                    Username: $scope.newUsername,
                    Password: $scope.newPassword,
                    Url: $scope.newUrl
                }
                $scope.partnerLoginAccounts.push(newLoginAccount);
                $scope.newUsername = "";
                $scope.newPassword = "";
                $scope.newUrl = "";
                $('#AddLoginAccountModal').modal('hide');
            }

            $scope.closeAddLoginAccountModal = function () {
                $('#AddLoginAccountModal').modal('hide');
                $scope.newUsername = "";
                $scope.newPassword = "";
                $scope.newUrl = "";
            }

            $scope.deleteLoginAccount = function (index) {
                $scope.partnerLoginAccounts.splice(index, 1);
            }  

            $scope.reaload = function () {
                location.reload();
            }

            $scope.saveChanges = function () {
                $scope.partnerEndpointsMarketplace.splice(0, 2);
                if (($scope.checkPlayerRequest != "" && $scope.checkPlayerRequest != "-") && ($scope.checkPlayerResponse == "" || $scope.checkPlayerResponse == "-")) {
                    var newCheckPlayer = {
                        Id: 0,
                        Url: "",
                        Request: JSON.stringify(JSON.parse($scope.checkPlayerRequest)),
                        Response: "-",
                        EndpointType: 0,
                        EndpointTypeName: 'Marketplace',
                        EndpointId: 25
                    }
                    $scope.partnerEndpointsMarketplace.push(newCheckPlayer);
                }
                else if (($scope.checkPlayerRequest == "" || $scope.checkPlayerRequest == "-") && ($scope.checkPlayerResponse != "" && $scope.checkPlayerResponse != "-")) {
                    var newCheckPlayer = {
                        Id: 0,
                        Url: "",
                        Request: "-",
                        Response: JSON.stringify(JSON.parse($scope.checkPlayerResponse)),
                        EndpointType: 0,
                        EndpointTypeName: 'Marketplace',
                        EndpointId: 25
                    }
                    $scope.partnerEndpointsMarketplace.push(newCheckPlayer);
                }
                else if (($scope.checkPlayerRequest != "" && $scope.checkPlayerRequest != "-") && ($scope.checkPlayerResponse != "" && $scope.checkPlayerResponse != "-")) {
                    var newCheckPlayer = {
                        Id: 0,
                        Url: "",
                        Request: JSON.stringify(JSON.parse($scope.checkPlayerRequest)),
                        Response: JSON.stringify(JSON.parse($scope.checkPlayerResponse)),
                        EndpointType: 0,
                        EndpointTypeName: 'Marketplace',
                        EndpointId: 25
                    }
                    $scope.partnerEndpointsMarketplace.push(newCheckPlayer);
                }
                if (($scope.confirmPaymentRequest == "" || $scope.confirmPaymentRequest == "-") && ($scope.confirmPaymentResponse != "" && $scope.confirmPaymentResponse != "-")) {
                    var newConfirmPayment = {
                        Id: 0,
                        Url: "",
                        Request: "-",
                        Response: JSON.stringify(JSON.parse($scope.confirmPaymentResponse)),
                        EndpointType: 0,
                        EndpointTypeName: 'Marketplace',
                        EndpointId: 26
                    }
                    $scope.partnerEndpointsMarketplace.push(newConfirmPayment);
                }
                else if (($scope.confirmPaymentRequest != "" && $scope.confirmPaymentRequest != "-") && ($scope.confirmPaymentResponse == "" || $scope.confirmPaymentResponse == "-")) {
                    var newConfirmPayment = {
                        Id: 0,
                        Url: "",
                        Request: JSON.stringify(JSON.parse($scope.confirmPaymentRequest)),
                        Response: "-",
                        EndpointType: 0,
                        EndpointTypeName: 'Marketplace',
                        EndpointId: 26
                    }
                    $scope.partnerEndpointsMarketplace.push(newConfirmPayment);
                }
                else if (($scope.confirmPaymentRequest != "" && $scope.confirmPaymentRequest != "-") && ($scope.confirmPaymentResponse != "" && $scope.confirmPaymentResponse != "-")) {
                    var newConfirmPayment = {
                        Id: 0,
                        Url: "",
                        Request: JSON.stringify(JSON.parse($scope.confirmPaymentRequest)),
                        Response: JSON.stringify(JSON.parse($scope.confirmPaymentResponse)),
                        EndpointType: 0,
                        EndpointTypeName: 'Marketplace',
                        EndpointId: 26
                    }
                    $scope.partnerEndpointsMarketplace.push(newConfirmPayment);
                }
                if ($scope.productionPartnerId == "" || $scope.productionPartnerId == null) {
                    $scope.productionPartnerId = '00000000-0000-0000-0000-000000000000';
                }
                
                $scope.partnerEndpoints = [].concat($scope.partnerEndpointsAbon, $scope.partnerEndpointsWithdrawal, $scope.partnerEndpointsAcPay, $scope.partnerEndpointsMarketplace);
                partnerSiteService.savePartnerSite($scope.partnerId, $scope.productionPartnerId, $scope.partnerName, $scope.brand, $scope.platform, $scope.internalTicket, $scope.confluence, $scope.partnerIntegrationContacts, $scope.abonType,
                    $scope.abonAmountRule, $scope.abonAuthorization, $scope.partnerEndpoints, $scope.withdrawalType, $scope.withdrawalInstant,
                    $scope.acPayType, $scope.countryCode, $scope.marketplacePosition, $scope.partnerErrorCodes, $scope.partnerLoginAccounts)
                    .then(function (response) {
                        $scope.reaload();
                    }, () => {
                        console.log("Error, could not save changes!");
                    });
            }
        }

    ]);

app.run(['editableOptions', function (editableOptions) {
    editableOptions.theme = 'bs3';
}]);