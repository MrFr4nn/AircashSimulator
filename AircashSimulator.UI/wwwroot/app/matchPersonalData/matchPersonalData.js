var matchPersonalDataModule = angular.module('matchPersonalData', []);

app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.matchPersonalData', {
            data: {
                pageTitle: 'Match'
            },
            url: "/match",
            controller: 'matchPersonalDataCtrl',
            templateUrl: 'app/matchPersonalData/matchPersonalData.html?v=' + Global.appVersion
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
    ['$scope', '$state', 'matchPersonalDataService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage',
        function ($scope, $state, matchPersonalDataService, $filter, $http, JwtParser, $uibModal, $rootScope, $localStorage) {
            $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
            $scope.partnerIds = JSON.parse($scope.decodedToken.partnerIdsDTO);

            $scope.matchPersonalDataModel = {
                partnerId: $scope.partnerIds.MatchPersonalDataDefault,
                firstNameAircashUser: "",
                lastNameAircashUser: "",
                birthDateAircashUser: new Date(""),
                firstNamePartnerUser: "",
                lastNamePartnerUser: "",
                birthDatePartnerUser: new Date(""),
            };

            $scope.matchPersonalDataServiceBusy = false;
            $scope.matchPersonalDataServiceResponse = false;

            $scope.select = {};
            $scope.select.MatchDataOption = 1;

            $scope.changePartnerId = function () {
                if ($scope.select.MatchDataOption == 2) {
                    $scope.matchPersonalDataModel.partnerId = $scope.partnerIds.MatchPersonalDataDateOnly;
                } else if ($scope.select.MatchDataOption == 1) {
                    $scope.matchPersonalDataModel.partnerId = $scope.partnerIds.MatchPersonalDataDefault;
                }
                $rootScope.showGritter("", "PartnerId changed");
            }

            $scope.changeInputPartnerId = function () {
                if ($scope.matchPersonalDataModel.partnerId == $scope.partnerIds.MatchPersonalDataDateOnly) {
                    $scope.select.MatchDataOption = 2;
                } else if ($scope.matchPersonalDataModel.partnerId == $scope.partnerIds.MatchPersonalDataDefault) {
                    $scope.select.MatchDataOption = 1;
                } else {
                    $scope.select.MatchDataOption = 3;
                }
            }

            $scope.matchPersonalData = function () {
                $scope.matchPersonalDataRequest = {
                    partnerId: $scope.matchPersonalDataModel.partnerId,
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
                            $scope.matchPersonalDataRequestDateTimeUTC = response.RequestDateTimeUTC;
                            $scope.matchPersonalDataResponseDateTimeUTC = response.ResponseDateTimeUTC;
                            $scope.matchPersonalDataSequence = response.Sequence;
                            $scope.matchPersonalDataResponse = JSON.stringify(response.ServiceResponse, null, 4);
                            $scope.matchPersonalDataRequest = JSON.stringify(response.ServiceRequest, null, 4);
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
                checkPlayerErrorResponse:
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