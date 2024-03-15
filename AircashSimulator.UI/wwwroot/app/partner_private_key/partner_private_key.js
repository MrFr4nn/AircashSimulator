var partnerPrivateKeyModule = angular.module('partnerPrivateKey', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.partnerPrivateKey', {
            data: {
                pageTitle: 'partnerPrivateKey'
            },
            url: "/partnerPrivateKey",
            controller: 'partnerPrivateKeyCtrl',
            templateUrl: 'app/partner_private_key/partner_private_key.html?v=' + Global.appVersion
        });
});

partnerPrivateKeyModule.service("partnerPrivateKeyService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            validateAndSave: validateAndSave,
            removePartnerKeys: removePartnerKeys,
            getPartnerKeys: getPartnerKeys
        });
        function validateAndSave(inputs) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "Signature/ValidateAndSavePartnerKey",
                data: {
                    PartnerId: inputs.partnerId,
                    PublicKey: inputs.publicKey,
                    PrivateKey: inputs.privateKey,
                    Password: inputs.password
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
        function getPartnerKeys() {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "Signature/GetPartnerKeys",
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
        function removePartnerKeys() {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "Signature/RemovePartnerKeys",
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
    }
]);

partnerPrivateKeyModule.controller("partnerPrivateKeyCtrl",
    ['$scope', '$state', 'partnerPrivateKeyService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage',
        function ($scope, $state, partnerPrivateKeyService, $filter, $http, JwtParser, $uibModal, $rootScope, $localStorage) {
            $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
            $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
            $scope.partnerIds = JSON.parse($scope.decodedToken.partnerIdsDTO);

            $scope.inputs = {};
            $scope.validateAndSaveServiceBusy = false;
            $scope.validateAndSave = function () {
                $scope.validateAndSaveServiceBusy = true;
                partnerPrivateKeyService.validateAndSave($scope.inputs)
                    .then(function (response) {
                        $rootScope.showGritter(response);
                        $scope.validateAndSaveServiceBusy = false;
                    })
                    .catch(function (error) {
                        $scope.validateAndSaveServiceBusy = false;
                        $rootScope.showGritter("error");
                    });
            }

            $scope.getPartnerKeys = function () {
                partnerPrivateKeyService.getPartnerKeys()
                    .then(function (response) {
                        $scope.inputs.partnerId = $scope.decodedToken.partnerId
                        $scope.inputs.publicKey = response.PublicKey
                        $scope.inputs.privateKey = response.PrivateKey
                        $scope.inputs.password = response.PrivateKeyPass
                    })
                    .catch(function (error) {
                        $rootScope.showGritter("error");
                    });
            }
            $scope.removePartnerKeys = function () {
                partnerPrivateKeyService.removePartnerKeys()
                    .then(function (response) {
                        $rootScope.showGritter(response);
                        $scope.getPartnerKeys();
                    })
                    .catch(function (error) {
                        $rootScope.showGritter("error");
                    });
            }

            $scope.getPartnerKeys();
        }
    ]);