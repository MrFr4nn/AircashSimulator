(function () {
    'use strict';

    angular.module('app').factory('HelperService', Service);

    function Service($http, $localStorage, config, $rootScope) {

        var service = {};
        service.NewGuid = NewGuid;

        return service;

        function NewGuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
                .replace(/[xy]/g, function (c) {
                    const r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
        }

    }
})();