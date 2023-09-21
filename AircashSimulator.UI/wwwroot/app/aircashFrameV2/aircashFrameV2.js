var acFrameV2Module = angular.module('acFrameV2', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.aircashFrameV2', {
            data: {
                pageTitle: 'Aircash Frame V2'
            },
            url: "/aircashFrameV2",
            controller: 'acFrameV2Ctrl',
            templateUrl: 'app/aircashFrameV2/aircashFrameV2.html?v=' + Global.appVersion
        });
});

acFrameV2Module.service("acFrameV2Service", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    
}
]);

acFrameV2Module.controller("acFrameV2Ctrl", ['$scope', '$location', '$state', '$filter', 'HelperService', 'acFrameV2Service', '$http', 'JwtParser', '$uibModal', '$rootScope', '$window', '$localStorage', 'config', function ($scope, $location, $state, $filter, HelperService, acFrameV2Service, $http, JwtParser, $uibModal, $rootScope, $window, $localStorage, config) {
    
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    $scope.partnerIds = JSON.parse($scope.decodedToken.partnerIdsDTO);
    if ($scope.partnerRoles.indexOf("AircashFrameV2Withdrawal") == -1 && $scope.partnerRoles.indexOf("AircashFrameV2Abon") == -1 && $scope.partnerRoles.indexOf("AircashFrameV2AcPay") == -1) {
        $location.path('/forbidden');
    }
    

}]);

acFrameV2Module.controller('AircashFrameV2RedirectModalCtrl', function ($scope, transactionId) {
    console.log(transactionId);
    /*
    new AircashFrame.RedirectCheckout({
        transactionId: transactionId,
        debug: true
    });

        */
});