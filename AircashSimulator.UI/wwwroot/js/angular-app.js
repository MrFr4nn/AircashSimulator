var app = angular.module('app', [
    'ui.router',
    'ui.router.state.events',
    'ui.bootstrap',
    'ngStorage',
    'ngSanitize',
    'dashboard',
    'abonSp',
    'abonOp',
    'acPay'
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
        });
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

app.run(['$rootScope', '$state', 'setting', '$http', '$location', '$localStorage', function ($rootScope, $state, setting, $http, $location, $localStorage) {
    $rootScope.$state = $state;
    $rootScope.setting = setting;

    if ($localStorage.currentUser) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var publicPages = ['/login'];
        var restrictedPage = publicPages.indexOf($location.path()) === -1;
        if (restrictedPage && !$localStorage.currentUser) {
            $location.path('/login');
        }
    });
}]);
