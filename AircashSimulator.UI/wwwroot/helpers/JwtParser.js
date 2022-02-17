(function () {
    'use strict';

    angular
        .module('app')
        .factory('JwtParser', JwtParser);

    JwtParser.$inject = ['$localStorage'];

    function JwtParser($localStorage) {
        var service = {
            getProperty: getProperty
        };
        
        return service;

        function getProperty(property)
        {
            var jwtData = parseJwt($localStorage.currentUser.token);
            return jwtData[property];
        }
    }

    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    };
})();