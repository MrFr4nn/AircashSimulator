var partnerAdminModule = angular.module('partnerAdmin', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.partnerAdmin', {
            data: {
                pageTitle: 'Partner Admin'
            },
            url: "/partnerAdmin",
            controller: 'partnerAdminCtrl',
            templateUrl: 'app/partner_admin/partner_admin.html?v=' + Global.appVersion
        });
});

partnerAdminModule.service("partnerAdminService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        getPartnersDetail: getPartnersDetail,
        getRoles: getRoles,
        getEnvironment: getEnvironment,
        savePartner: savePartner,
        savePartnerV2: savePartnerV2,
        savePartnerSetting: savePartnerSetting,
        deletePartner: deletePartner,    
        getPartnerSettingRoles: getPartnerSettingRoles,
        getPartnerSetting: getPartnerSetting
    });
    function getPartnerSettingRoles() {
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "Partner/GetPartnerSettingRoles"
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
    function getPartnerSetting(partnerId) {
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "Partner/GetPartnerSetting",
            params: {
                partnerId: partnerId
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
                NewPartnerId: partner.NewPartnerId,
                PartnerId: partner.PartnerId,
                PartnerName: partner.PartnerName,
                PrivateKey: partner.PrivateKey,
                PrivateKeyPass: partner.PrivateKeyPass,
                CurrencyId: partner.CurrencyId,
                CountryCode: partner.CountryCode,
                Environment: parseInt(partner.Environment),
                Roles: roles,
                UseDefaultPartner: (partner.UseDefaultPartner === 'true'),
                Username: username
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function savePartnerSetting(partnerId,SettingsRoles) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "Partner/SavePartnerSetting",
            data: {
                partnerId: partnerId,
                NewPartnerSetting: SettingsRoles,

            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function savePartnerV2(partner, roleIds) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "Partner/savePartnerV2",
            data: {
                PartnerName: partner.PartnerName,
                CurrencyId: partner.CurrencyId,
                CountryCode: partner.CountryCode,
                Username: partner.Username,
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
    $scope.partnersetting = [];
    $scope.searchedPartner = null;

    $scope.setDefaults = function () {
        $scope.searchedPartner = null;
        $scope.SearchTable();
    }

    $scope.getPartnersDetail = function () {
        partnerAdminService.getPartnersDetail($scope.pageSize, $scope.pageNumber, $scope.searchedPartner)
            .then(function (response) {
                if (response) {
                    console.log(response);
                    $scope.totalLoaded = response.length;
                    $scope.partners = $scope.partners.concat(response);
                }
            }, () => {
                console.log("Error, could not fetch partners!");
            });
    };
    $scope.getPartnerSetting = function () {
        partnerAdminService.getPartnerSetting($scope.partnerId)
            .then(function (response) {
                if (response) {
                   
                    $scope.partnersetting = $scope.partnersetting.concat(response);
                    $scope.SettingsRoles.forEach(s =>{
                        s.input = "";
                        if ($scope.partnersetting.filter(x => x.Key == s.SettingId).length > 0) {
                            s.input = $scope.partnersetting.find(y => y.Key == s.SettingId).value;

                        }
                        s.PartnerId = $scope.partnerId;
                    })
                }
            }, () => {
                console.log("Error, could not fetch partner setting!");
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
        $scope.username = null;
        $scope.pageNumber = 1;
        $scope.getPartnersDetail();
        $scope.defaultCountry = "HR";
        $scope.setCurrency = 978; 
    }
    $scope.partner = {};
    $scope.partnersett = {};
    $scope.showPartnerSettingsModal = function (partner) {
        if (partner) {
            $scope.partnerId = partner.PartnerId;
            $scope.getPartnerSetting();
            partner.UseDefaultPartner = String(partner.UseDefaultPartner);
            angular.copy(partner, $scope.partner);
        }
        $scope.togglePartnerSettingsModal(true);

    }

    $scope.showPartnerModal = function (partner, newPartner) {
        $scope.newPartner = newPartner;
        if (partner) {
            partner.UseDefaultPartner = String(partner.UseDefaultPartner);
            partner.Environment = String(partner.Environment);
            $scope.defaultCountry = partner.CountryCode;
            $scope.setCurrency = partner.CurrencyId;
            angular.copy(partner, $scope.partner);
        } else {
            $scope.defaultCountry = "HR";
            $scope.setCurrency = 978;
            $scope.partner = {
                CurrencyId: $scope.currencyNew.code,
                CountryCode: $scope.countryPickerCode.countryCode,
                UseDefaultPartner: "true",
                Environment: "2"
            };
        }
        $scope.toggePartnerModal(true);
        $scope.checkPartnerRole();
    }

    $scope.toggePartnerModal = function (flag) {
        $("#PartnerModal").modal(flag ? 'show' : 'hide');
    }
    $scope.togglePartnerSettingsModal = function (flag) {
        $("#PartnerSettingsModal").modal(flag ? 'show' : 'hide');
    }
    $scope.toggePartnerNewModal = function (flag, newRoleId) {
        $scope.defaultCountry = "HR";
        $scope.setCurrency = 978;

        $scope.sendRolesV2 = newRoleId;      
        $("#partnerV2Modal").modal(flag ? 'show' : 'hide');
    }
    $scope.savePartner = function () {
        $scope.sendRoles = [];
        $scope.filteredRoles = $filter('filter')($scope.roles, { selected: true });

        for (var i = 0; i < $scope.filteredRoles.length; i++) {
            $scope.sendRoles.push($scope.filteredRoles[i].RoleId);
        }
        $scope.partner.PrivateKey = "";
        $scope.partner.PrivateKeyPass = "";
        $scope.useDefaultPartner = 1;
        $scope.environment = 2;
        $scope.partner.CountryCode = $scope.countryPickerCode.countryCode;
        $scope.partner.CurrencyId = $scope.currencyNew.code;
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
    $scope.savePartnerSetting = function () {
        partnerAdminService.savePartnerSetting($scope.partnerId,$scope.SettingsRoles)
            .then(function (resposne) {         
            }, () => {
                console.log("Error, could not save partner!");
            });
        $scope.toggePartnerModal();
    }

    $scope.partnerV2 = {};
    $scope.savePartnerV2 = function () {
        $scope.partnerV2.CountryCode = $scope.countryCodePayPicker.countryCode;
        $scope.partnerV2.CurrencyId = $scope.currencyPay.code;
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
                $scope.roles = $scope.roles.sort(function (a, b) {
                    var textA = a.RoleName.toUpperCase();
                    var textB = b.RoleName.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
                console.log($scope.roles);
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
        $scope.partner.PartnerName = Partner.PartnerName;
        $scope.partner.PartnerId = Partner.PartnerId;
        $scope.toggleDeleteModal(true);
    };

    $scope.toggleDeleteModal = function (flag) {
        $("#confirmDeleteModal").modal(flag ? 'show' : 'hide');
    };

    $scope.deletePartner = function () {
        partnerAdminService.deletePartner($scope.partner.PartnerId)
            .then(function (resposne) {
                $scope.SearchTable();
            }, () => {
                console.log("Error, could not delete partner!");
            });
        $scope.toggleDeleteModal();
    }

    $scope.ShowPartnerRolesModal = function (Partner) {
        if (Partner.Roles != null) {
            $scope.partner.PartnerName = Partner.PartnerName;
            $scope.partner.Roles = Partner.Roles;
            $('#EmptyRoles').empty();
            $scope.togglePartnerRolesModal(true);
        }
        else {
            $scope.partner.PartnerName = Partner.PartnerName;
            $scope.partner.Roles = null;
            $('#EmptyRoles').empty().append("<h6 style='color:#000000;' class=' alert alert-info'>Partner has no roles!</h6>");
            $scope.togglePartnerRolesModal(true);
        }
    }

    $scope.togglePartnerRolesModal = function (flag) {
        $("#PartnerRolesModal").modal(flag ? "show" : "hide");
    }

    $scope.checkPartnerRole = function () {
        $scope.setCheckBoxSelected();
        if ($scope.partner.Roles != null) {
            for (var i = 0; i < $scope.roles.length; i++) {
                for (var j = 0; j < $scope.partner.Roles.length; j++) {
                    if ($scope.roles[i].RoleId == $scope.partner.Roles[j].RoleId) {
                        $scope.roles[i].selected = true;
                    }
                }
            }
        }
    }
    $scope.getPartnerSettingRoles = function () {
        partnerAdminService.getPartnerSettingRoles()
            .then(function (response) {
                $scope.SettingsRoles = response;
            },
                () => { console.log("Error, could not get roles!"); })
    }


    $("#PartnerSettingsModal").on("hidden.bs.modal", function () {
        $scope.partnersetting = [];
    });
    $scope.getDescription = function (roleName) {
        switch (roleName) {
            case "SalePartner":
                return "TopUp and Payout via barcode on physical location";
            case "AircashFrame":
                return "Frame version 1, obsolete. Use AircashFrameV2 instead";
            case "AircashPay":
                return "Direct Aircash Pay integration";
            case "AircashPayout":
                return "Withdrawals from Online partners";
            case "AbonGenerate":
                return "Abon distribution documentation";
            case "AbonDeposit":
                return "Documentation for online/merchant";
            case "AircashPayment":
                return "Aircash marketplace deposit";
            case "AMDDeepLink":
                return "Aircash marketplace Deep link";
            case "AircashRedeemTicket":
                return "Payouts of winning tickets to Aircash app";
            case "AircashFrameV2AcPay":
                return "Aircash Frame Aircash Pay";
            case "AircashFrameV2Abon":
                return "Aircash Frame Abon";
            case "AircashFrameV2Withdrawal":
                return "Aircash Frame Withdrawal";
            case "AircashPayStaticCode":
                return "Aircash Pay for static QR codes";
            case "AircashPosDeposit":
                return "Cash to Digital documentation for deposits";
            case "AircashInAppPay":
                return "AircashPay payments via AircashMarketplace";
            case "AircashPayoutV2":
                return "C2D witdhrawals";
            case "SlotMachines":
                return "Slot machines integration";
            case "AircashATM":
                return "Aircash ATM";
            default:
                break;

        }
    };

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
    $scope.getPartnerSettingRoles();
    $scope.getPartnersDetail();
    $scope.getRoles();
}]);