var cashierModule = angular.module('cashier', [
    'distributorMenu',
    'onlineMenu',
    'cashier_abon',
    'cashier_acPay',    
    'cashier_acFrameMenu',
    'cashier_acPayment',
    'cashier_acPayout',
    'cashier_acRedeemTicket',
    'cashier_acC2DPayout',
    'cashier_acPaymentAndPayout',
    'cashier_abon_sp',
    'cashier_c2d'
]);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('cashier', {
            data: {
                pageTitle: 'Cashier'
            },
            url: "/cashier",
            controller: 'CashierCtrl',
            templateUrl: 'app/cashier/cashier.html?v=' + Global.appVersion
        });
});

cashierModule.service("cashierService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
    }
]);


cashierModule.controller("CashierCtrl", ['$scope', '$rootScope', '$location', '$localStorage',
    function ($scope, $rootScope, $location, $localStorage) {

        $scope.languages = [
            { language: "en" },
            { language: "hr" },
            { language: "es" },
            { language: "it" },
            { language: "el" },
            { language: "de-DE" },
            { language: "de-AT" },
            { language: "ro" }
        ];

        $rootScope.environment = 2;
        $scope.setEnvironment = function(env){
            $rootScope.environment = env;
        }
        
        if (window.localStorage.getItem('selectedLanguage') != null) {
            angular.forEach($scope.languages, function (item, index) {
                if (item.language == window.localStorage.getItem('selectedLanguage')) {
                    $scope.selectedlanguage = $scope.languages[index];
                }
            });           
        }        
        else {
            $scope.selectedlanguage = $scope.languages[0];
        }

        $scope.ChangeLanguage = function (lang) {
            window.localStorage.setItem('selectedLanguage', lang.language);
            location.reload();
        }
    }

]);