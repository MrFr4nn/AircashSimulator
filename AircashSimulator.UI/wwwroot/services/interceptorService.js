'use strict';
app.factory('interceptorService', ['$q', '$injector', '$location', '$rootScope',
    function ($q, $injector, $location, $rootScope) {
    return {
        'responseError': function (rejection) {

            if (rejection.status == 401) {
                $location.path('/login');
                return false;
            }

            $rootScope.showGritter(
                $rootScope.translations.gritter_error_title,
                rejection.data.Message);
            return $q.reject(rejection);
        }
    };
}]);

function getErrorMsg(code, translations) {
    switch (code) {
        case "3":
            return translations.coupon_cancelation_time_error
        case "2":
            return translations.coupon_already_canceled_error
        case "1":
            return translations.wrong_username_password_error
        default:
            return translations.generic_error_text
    }
}