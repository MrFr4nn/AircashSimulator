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
            $scope.AircashMatchData = {
                checkPlayerPost: {
                    parameters: [
                        {
                            key: "username",
                            value: "aircash"
                        },
                        {
                            key: "AircashUserID",
                            value: "0e7fa3df-4195-4ecd-896a-70bdb1ceb904"
                        }
                    ],
                    signature: "o0sQXj6QYRd8pawqRfw2hmWhI+XzBtD0Jvwd3av4Twjqi65qsfg9KHx7g0qTB/8KrhEiY4f1t7th7gKVlLhqISKB/NEvRhJrzWCVQ/3sfPDmOhh8s0WAfsn8Q89134B3Dl/4jFKiIgBFdjKA+M8YFnwOt9pSggzH1AFtnNpz7C/vYfXvdiD4yxnlR9L/9O4NMVSD7qGSHVUBIs2YA2BCjzP4GPsGretrYlJIZFjZNtM876nKts9jqpKYtsaoNOoGKtYbvmBN6Zy4d50bavxiwo1qoEdrcwMh7osa3Bh4A84ifKeXOiw11rs1fZ01H7GSCGMhYu8dU1Gq6YjiT0Hxvg=="
                },
                checkPlayerResponse:
                {
                    isPlayer: true,
                    error: null,
                    parameters: [
                        {
                            key: "partnerUserID",
                            value: "40ecee36-da23-48be-bf89-2d641d92b3ca",
                            type: "String"
                        },
                        {
                            key: "PayerFirstName",
                            value: "John",
                            type: "String"
                        },
                        {
                            key: "PayerLastName",
                            value: "Doe",
                            type: "String"
                        },
                        {
                            key: "PayerBirthDate",
                            value: "1990-01-01",
                            type: "Date"
                        }
                    ]
                }
            };
            $scope.PartnerMatchData={
                checkPlayerPost:
                {
                    parameters: [
                        {
                            key: "username",
                            value: "aircash"
                        },
                        {
                            key: "AircashUserID",
                            value: "0e7fa3df-4195-4ecd-896a-70bdb1ceb904"
                        },
                        {
                            key: "PayerFirstName",
                            value: "John"
                        },
                        {
                            key: "PayerLastName",
                            value: "Doe"
                        },
                        {
                            key: "PayerBirthDate",
                            value: "1990-01-01"
                        }
                    ],
                    signature: "o0sQXj6QYRd8pawqRfw2hmWhI+XzBtD0Jvwd3av4Twjqi65qsfg9KHx7g0qTB/8KrhEiY4f1t7th7gKVlLhqISKB/NEvRhJrzWCVQ/3sfPDmOhh8s0WAfsn8Q89134B3Dl/4jFKiIgBFdjKA+M8YFnwOt9pSggzH1AFtnNpz7C/vYfXvdiD4yxnlR9L/9O4NMVSD7qGSHVUBIs2YA2BCjzP4GPsGretrYlJIZFjZNtM876nKts9jqpKYtsaoNOoGKtYbvmBN6Zy4d50bavxiwo1qoEdrcwMh7osa3Bh4A84ifKeXOiw11rs1fZ01H7GSCGMhYu8dU1Gq6YjiT0Hxvg=="

                },
                checkPlayerResponse:
                {
                    isPlayer: true,
                    error: null,
                    parameters: [
                        {
                            key: "partnerUserID",
                            value: "40ecee36-da23-48be-bf89-2d641d92b3ca",
                            type: "String"
                        }
                    ]
                },
                compareIdentityPost:
                {
                    partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                    aircashUser: {
                        firstName: "John",
                        lastName: "Doe",
                        birthDate: "1990-01-01"
                    },
                    partnerUser: {
                        firstName: "John",
                        lastName: "Doe",
                        birthDate: "1990-01-01"
                    }
                },
                compareIdentityResponse:
                {
                    matchResult: true,
                    score: 1,
                    birthDateMatch: true
                },
                dataDoNotMatch:
                {
                    isPlayer: false,
                    error: {
                        errorCode: 100,
                        errorMessage: "Personal data not matched"
                    },
                    parameters: null
                }

            }
        }
    ]);