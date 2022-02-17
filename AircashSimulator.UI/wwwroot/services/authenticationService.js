(function () {
    'use strict';

    angular.module('app').factory('AuthenticationService', Service);
    
    function Service($http, $localStorage, config, $rootScope) {

        var service = {};
        service.Login = Login;
        service.Logout = Logout;

        return service;

        function Login(username, password, callback) {

            $http({
                method: 'POST',
                url: config.baseUrl + "auth/Login/",
                data: { username: username, password: password }
            }).then(function (response) {
                if (response.data) {
                    $localStorage.currentUser = { token: response.data };
                    $http.defaults.headers.common.Authorization = 'Bearer ' + response.data;
                    callback(true);
                } else {
                    callback(false);
                }
            }, () => callback(false));
        }

        function Logout() {
            delete $localStorage.currentUser;
            $http.defaults.headers.common.Authorization = '';
        }
    }
})();