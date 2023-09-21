var acFrameV2WithdrawalModule = angular.module('acFrameV2Withdrawal', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.acFrameV2Withdrawal', {
            data: {
                pageTitle: 'Aircash business site'
            },
            url: "/ac_frame_withdrawal",
            controller: 'acFrameV2Ctrl',
            templateUrl: 'app/aircashFrameV2/aircashWithdrawal/aircashFrameV2Withdrawal.html?v=' + Global.appVersion
        });
});

//acFrameV2WithdrawalModule.service("acFrameV2WithdrawalService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
//    function ($http, $q, handleResponseService, config, $rootScope) {
        
//    }
//]);
//acFrameV2WithdrawalModule.controller("acFrameV2WithdrawalCtrl",
//    ['$scope', '$location', '$state', '$filter', 'HelperService', 'acFrameV2WithdrawalService', '$http', 'JwtParser', '$uibModal', '$rootScope', '$window', '$localStorage', 'config',
//        function ($scope, $location, $state, $filter, HelperService, acFrameV2WithdrawalService, $http, JwtParser, $uibModal, $rootScope, $window, $localStorage, config)
//        {
//            $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
//            $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
//            $scope.partnerIds = JSON.parse($scope.decodedToken.partnerIdsDTO);
//            if ($scope.partnerRoles.indexOf("AircashFrameV2Withdrawal") == -1) {
//                $location.path('/forbidden');
//            }
            
//        }
//    ]);