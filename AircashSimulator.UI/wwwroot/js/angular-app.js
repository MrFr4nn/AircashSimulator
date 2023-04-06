var app = angular.module('app', [
    'ui.router',
    'ui.router.state.events',
    'ui.bootstrap',
    'ngStorage',
    'ngSanitize',
    'dashboard',
    'abonSp',
    'abonOp',
    'acPay',
    'aircashPaymentAndPayout',
    'aircashPayout',
    'acFrame',
    'signature',
    'acPayment',
    'partnerAdmin',
    'userAdmin',
    'acRedeemTicket',
    'acFrameV2',
    'acPosDeposit',
    'acInAppPay',
    'cashier',
    'logo',
    'acPayStaticCode',
    'aircashPayoutV2',
    'ac_business_site',
    'ac_test_application',
    'forbidden',
    'success',
    'decline',
    'inAppPay'
]);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider)
{
    $urlRouterProvider.otherwise('/app/dashboard');
    
    $stateProvider
        .state('app', {
            url: '/app',
            templateUrl: 'template/app.html',
          
            abstract: true
        })
        .state('login', {
            url: '/login?username',
            templateUrl: 'app/login/login.html',
            controller: 'Login.IndexController',
            controllerAs: 'vm',
            params: {
                username: ""
            }
        })

}]);

app.service("handleResponseService", ['$q', function ($q) {
    return {
        handleSuccess: function handleSuccess(response) {
            return (response.data);
        },
    };
}]);

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('interceptorService');
});

app.run(['$rootScope', '$state', 'setting', '$http', 'config', '$location', '$localStorage', function ($rootScope, $state, setting, $http, config, $location, $localStorage) {
    $rootScope.$state = $state;
    $rootScope.setting = setting;

    var locale = localStorage.getItem('selectedLanguage');
    if (!locale) {
        locale = "en";
    }
    $http({
        method: 'GET',
        url: config.baseUrl + "Translations/GetTranslations",
        params: { locale: locale }
    }).then(function (response) {
        //console.log(response);
        var responseObj = JSON.parse(response.data.responseContent);
        $rootScope.translationsCashier = responseObj;
    },() => {
       console.log("error");
    });  

    if ($localStorage.currentUser) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var publicPages = ['/login', '/success', '/decline', '/forbidden', '/inAppPay', '/cashier/menu', '/cashier/abon', '/cashier/aircashPay',
            '/cashier/aircashPayment', '/cashier/aircashPayout', '/cashier/aircashRedeemTicket', '/cashier/cashToDigital', '/cashier/aircashFrameMenu',
            '/cashier/aircashFrameAcPay', '/cashier/aircashFrameAbon', '/cashier/aircashFrameWithdrawal', '/cashier/PayoutC2D', '/cashier/SalesPartner'];
        var restrictedPage = publicPages.indexOf($location.path()) === -1;
        if ($location.path().indexOf('cashier') > -1 && restrictedPage) {
            $location.path('/cashier/menu');
        }else if (restrictedPage && !$localStorage.currentUser) {
            $location.path('/login');
        }
    }); 
}]); 

app.filter('trusted', ['$sce', function ($sce) {
    return function (url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);