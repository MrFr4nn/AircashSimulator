var acATMModule = angular.module('aircash_ATM', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.aircash_ATM', {
            data: {
                pageTitle: 'Aircash ATM'
            },
            url: "/aircashATM",
            controller: 'acATMCtrl',
            templateUrl: 'app/aircash_ATM/aircash_ATM.html?v=' + Global.appVersion
        });
});

acATMModule.service("acATMService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            useOneTimePayoutCode: useOneTimePayoutCode,
            cancelTranscation: cancelTranscation
        });

        function useOneTimePayoutCode(useOneTimePayoutCodeRequest) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashATM/UseOneTimePayoutCode",
                data: useOneTimePayoutCodeRequest
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
        function cancelTranscation(cancelTranscationRequest) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashATM/CancelTransaction",
                data: cancelTranscationRequest
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
    }
]);

acATMModule.controller("acATMCtrl",
    ['$scope', '$state', 'acATMService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, acATMService, $filter, $http, JwtParser, $uibModal, $rootScope) {

            $scope.useOneTimePayoutCodeModel = {
                acCode: "",
            }

            $scope.useOneTimePayoutCodeServiceBusy = false;
            $scope.useOneTimePayoutCodeServiceResponse = false;
            $scope.useOneTimePayoutCode = function () {
                $scope.useOneTimePayoutCodeServiceBusy = true;
                $scope.useOneTimePayoutCodeServiceResponse = false;
                acATMService.useOneTimePayoutCode($scope.useOneTimePayoutCodeModel).then(function (response) {
                    if (response) {
                        console.log(response);
                        $scope.useOneTimePayoutCodeRequestDateTimeUTC = response.RequestDateTimeUTC;
                        $scope.useOneTimePayoutCodeResponseDateTimeUTC = response.ResponseDateTimeUTC;
                        $scope.useOneTimePayoutCodeSequence = response.Sequence;
                        response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                        $scope.useOneTimePayoutCodeResponse = JSON.stringify(response.ServiceResponse, null, 4);
                        $scope.useOneTimePayoutCodeRequest = JSON.stringify(response.ServiceRequest, null, 4);
                    }
                    $scope.useOneTimePayoutCodeServiceBusy = false;
                    $scope.useOneTimePayoutCodeServiceResponse = true;
                }, () => {
                    console.log("error");
                });
            }

            $scope.cancelTranscationModel = {
                partnerTransactionID: ""
            };

            $scope.cancelTranscationServiceBusy = false;
            $scope.cancelTranscationServiceResponse = false;
            $scope.cancelTranscation = function () {
                $scope.cancelTranscationServiceBusy = true;
                $scope.cancelTranscationServiceResponse = false;
                acATMService.cancelTranscation($scope.cancelTranscationModel).then(function (response) {
                    if (response) {
                        console.log(response);
                        $scope.cancelTranscationRequestDateTimeUTC = response.RequestDateTimeUTC;
                        $scope.cancelTranscationResponseDateTimeUTC = response.ResponseDateTimeUTC;
                        $scope.cancelTranscationSequence = response.Sequence;
                        response.ServiceRequest.Signature = response.ServiceRequest.Signature.substring(0, 10) + "...";
                        $scope.cancelTranscationResponse = JSON.stringify(response.ServiceResponse, null, 4);
                        $scope.cancelTranscationRequest = JSON.stringify(response.ServiceRequest, null, 4);
                    }
                    $scope.cancelTranscationServiceBusy = false;
                    $scope.cancelTranscationServiceResponse = true;
                }, () => {
                    console.log("error");
                });
            }

        }]);