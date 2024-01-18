var acFrameV2PayModule = angular.module('acFrameV2Pay', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.acFrameV2Pay', {
            data: {
                pageTitle: 'Aircash business site'
            },
            url: "/ac_frame_Pay",
            controller: 'acFrameV2Ctrl',
            templateUrl: 'app/aircashFrameV2/aircashPay/aircashFrameV2Pay.html?v=' + Global.appVersion
        });
});
//acFrameV2PayModule.service("acFrameV2PayService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
//    function ($http, $q, handleResponseService, config, $rootScope) {
       
//    }
//]);
//acFrameV2PayModule.controller("acFrameV2PayCtrl",
//    ['$scope', '$location', '$state', '$filter', 'HelperService', 'acFrameV2PayService', '$http', 'JwtParser', '$uibModal', '$rootScope', '$window', '$localStorage', 'config',
//        function ($scope, $location, $state, $filter, HelperService, acFrameV2PayService, $http, JwtParser, $uibModal, $rootScope, $window, $localStorage, config) {
//            $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
//            $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
//            $scope.partnerIds = JSON.parse($scope.decodedToken.partnerIdsDTO);
//            if ($scope.partnerRoles.indexOf("AircashFrameV2AcPay") == -1) {
//                $location.path('/forbidden');
//            }

           
//        }
//    ]);