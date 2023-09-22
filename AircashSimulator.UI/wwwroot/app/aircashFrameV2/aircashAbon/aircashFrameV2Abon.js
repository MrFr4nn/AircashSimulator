var acFrameV2AbonModule = angular.module('acFrameV2Abon', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.acFrameV2Abon', {
            data: {
                pageTitle: 'Aircash business site'
            },
            url: "/ac_frame_Abon",
            controller: 'acFrameV2Ctrl',
            templateUrl: 'app/aircashFrameV2/aircashAbon/aircashFrameV2Abon.html?v=' + Global.appVersion
        });
});
//acFrameV2AbonModule.service("acFrameV2AbonService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
//    function ($http, $q, handleResponseService, config, $rootScope) {
       
//    }
//]);
//acFrameV2AbonModule.controller("acFrameV2AbonCtrl",
//    ['$scope', '$location', '$state', '$filter', 'HelperService', 'acFrameV2AbonService', '$http', 'JwtParser', '$uibModal', '$rootScope', '$window', '$localStorage', 'config',
//        function ($scope, $location, $state, $filter, HelperService, acFrameV2AbonService, $http, JwtParser, $uibModal, $rootScope, $window, $localStorage, config) {
//            $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
//            $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
//            $scope.partnerIds = JSON.parse($scope.decodedToken.partnerIdsDTO);
//            if ($scope.partnerRoles.indexOf("AircashFrameV2Abon") == -1) {
//                $location.path('/forbidden');
//            }

           
//        }
        
//    ]);