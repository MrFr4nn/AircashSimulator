(function () {
    'use strict';

    angular
        .module('app')
        .controller('Login.IndexController', Controller);
    function Controller($location, AuthenticationService, $stateParams, $rootScope) {
        var vm = this;
        vm.username = $stateParams.username;
        vm.login = login;
        vm.usernameDisabled = false;

        initController();

        function initController() {
            AuthenticationService.Logout();
            if ($stateParams.username.length > 0)
                vm.usernameDisabled = true;
        };
        function login() {
            vm.busy = true;
            vm.loading = true;
            AuthenticationService.Login(vm.username, vm.password, function (result) {
                if (result === true) {
                    vm.busy = false;
                    $location.path('/dashboard');
                } else {
                    vm.loading = false;
                    vm.busy = false;
                }
            });
        };
    }

})();