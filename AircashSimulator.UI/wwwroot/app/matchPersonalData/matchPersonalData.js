var matchPersonalDataModule = angular.module('matchPersonalData', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.matchPersonalData', {
            data: {
                pageTitle: 'Match'
            },
            url: "/match",
            controller: 'matchPersonalDataCtrl',
            templateUrl: 'app/matchPersonalData/matchPersonalData.html'
        });
});

matchPersonalDataModule.service("matchPersonalDataService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            matchPersonalData: matchPersonalData
        });
        function matchPersonalData(matchPersonalDataRequest) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "AircashPosDeposit/MatchPersonalData",
                data: matchPersonalDataRequest
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
    }
]);

matchPersonalDataModule.controller("matchPersonalDataCtrl",
    ['$scope', '$state', 'matchPersonalDataService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope',
        function ($scope, $state, matchPersonalDataService, $filter, $http, JwtParser, $uibModal, $rootScope) {


            $scope.matchPersonalDataModel = {
                firstNameAircashUser: "",
                lastNameAircashUser: "",
                birthDateAircashUser: new Date(""),
                firstNamePartnerUser: "",
                lastNamePartnerUser: "",
                birthDatePartnerUser: new Date(""),
            };

            $scope.matchPersonalDataServiceBusy = false;
            $scope.matchPersonalDataServiceResponse = false;

            $scope.matchPersonalData = function () {
                $scope.matchPersonalDataRequest = {
                    aircashUser: {
                        firstName: $scope.matchPersonalDataModel.firstNameAircashUser,
                        lastName: $scope.matchPersonalDataModel.lastNameAircashUser,
                        birthDate: $scope.matchPersonalDataModel.birthDateAircashUser.toLocaleDateString('en-CA'),
                    },
                    partnerUser: {
                        firstName: $scope.matchPersonalDataModel.firstNamePartnerUser,
                        lastName: $scope.matchPersonalDataModel.lastNamePartnerUser,
                        birthDate: $scope.matchPersonalDataModel.birthDatePartnerUser.toLocaleDateString('en-CA'),
                    },
                }
                $scope.matchPersonalDataServiceBusy = true;
                matchPersonalDataService.matchPersonalData($scope.matchPersonalDataRequest)
                    .then(function (response) {
                        if (response) {
                            $scope.matchPersonalDataRequestDateTimeUTC = response.requestDateTimeUTC;
                            $scope.matchPersonalDataResponseDateTimeUTC = response.responseDateTimeUTC;
                            $scope.matchPersonalDataSequence = response.sequence;
                            $scope.matchPersonalDataResponse = JSON.stringify(response.serviceResponse, null, 4);
                            $scope.matchPersonalDataRequest = JSON.stringify(response.serviceRequest, null, 4);
                        }
                        $scope.matchPersonalDataServiceBusy = false;
                        $scope.matchPersonalDataServiceResponse = true;
                    }, () => {
                        console.log("error");
                    });
            }

            $scope.setPersonalDataDateAircashUser = function (date) {
                $scope.matchPersonalDataModel.birthDateAircashUser = date;
            }

            $scope.setPersonalDataDatePartnerUser = function (date) {
                $scope.matchPersonalDataModel.birthDatePartnerUser = date;
            }
        }
    ]);