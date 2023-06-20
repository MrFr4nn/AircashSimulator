var partnerPrivateKeyModule = angular.module('partnerPrivateKey', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.partnerPrivateKey', {
            data: {
                pageTitle: 'partnerPrivateKey'
            },
            url: "/partnerPrivateKey",
            controller: 'partnerPrivateKeyCtrl',
            templateUrl: 'app/partner_private_key/partner_private_key.html'
        });
});

partnerPrivateKeyModule.service("partnerPrivateKeyService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            validateAndSave: validateAndSave,
            getPartnerKeys: getPartnerKeys
        });
        function validateAndSave(inputs) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "Signature/ValidateAndSavePartnerKey",
                data: {
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
    }
]);

partnerPrivateKeyModule.controller("partnerPrivateKeyCtrl",
    ['$scope', '$state', 'partnerPrivateKeyService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, partnerPrivateKeyService, $filter, $http, JwtParser, $uibModal, $rootScope) {


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
                    });
            }

            $scope.getPartnerKeys = function () {
                partnerPrivateKeyService.getPartnerKeys()
                    .then(function (response) {
                        $scope.inputs.publicKey = response.publicKey
                        $scope.inputs.privateKey = response.privateKey
                        $scope.inputs.password = response.privateKeyPass
                    })
                    .catch(function (error) {
                        
                    });
            }

            $scope.getPartnerKeys();
        }
    ]);