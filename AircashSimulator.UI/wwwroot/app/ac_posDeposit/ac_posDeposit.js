var acPosDeposit = angular.module('acPosDeposit', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.acPosDeposit', {
            data: {
                pageTitle: 'Aircash PoS Deposit'
            },
            url: "/aircashPosDeposit",
            controller: 'acPosDepositCtrl',
            templateUrl: 'app/ac_posDeposit/ac_posDeposit.html'
        });
});

acPosDeposit.service("acPosDepositService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        checkUser: checkUser,
        createPayout: createPayout,
        matchPersonalData: matchPersonalData,
    });
    function checkUser(checkUserRequest) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPosDeposit/CheckUser",
            data: checkUserRequest
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function createPayout(createPayoutRequest) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AircashPosDeposit/CreatePayout",
            data: createPayoutRequest
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
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

acPosDeposit.controller("acPosDepositCtrl", ['$scope', '$state', 'acPosDepositService', '$uibModal', '$rootScope', '$localStorage', function ($scope, $state, acPosDepositService, $uibModal, $rootScope, $localStorage) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    if ($scope.partnerRoles.indexOf("AircashPosDeposit") == -1) {
        $location.path('/forbidden');
    }

    $scope.checkUserInputParametersExample = $rootScope.JSONexamples.aircashPoSDeposit.checkUser.inputParametersExample;
    $scope.checkUserOutputParametersExample = $rootScope.JSONexamples.aircashPoSDeposit.checkUser.outputParametersExample;

    $scope.createPayoutRequestExample = $rootScope.JSONexamples.aircashPoSDeposit.createPayout.requestExample;
    $scope.createPayoutResponseExample = $rootScope.JSONexamples.aircashPoSDeposit.createPayout.responseExample;

    $scope.checkPlayerInputParametersExample = $rootScope.JSONexamples.aircashPoSDeposit.checkPlayer.inputParametersExample;
    $scope.checkPlayerOutputParametersExample = $rootScope.JSONexamples.aircashPoSDeposit.checkPlayer.outputParametersExample;

    $scope.createAndConfirmPaymentInputParametersExample = $rootScope.JSONexamples.aircashPoSDeposit.createAndConfirmPayment.inputParametersExample;
    $scope.createAndConfirmPaymentOutputParametersExample = $rootScope.JSONexamples.aircashPoSDeposit.createAndConfirmPayment.outputParametersExample;

    $scope.checkUserModel = {
        phoneNumber: $scope.decodedToken.userPhoneNumber,
        firstName: $scope.decodedToken.userFirstName,
        lastName: $scope.decodedToken.userLastName,
        birthDate: new Date($scope.decodedToken.userBirthDate),
    };

    $scope.checkUserServiceBusy = false;
    $scope.checkUserServiceResponse = false;

    $scope.checkUser = function () {
        $scope.checkUserRequest = {
            phoneNumber: $scope.checkUserModel.phoneNumber,
            parameters: [{ key: "PayerFirstName", value: $scope.checkUserModel.firstName }, { key: "PayerLastName", value: $scope.checkUserModel.lastName }, { key: "PayerBirthDate", value: $scope.checkUserModel.birthDate.toISOString().split('T')[0] }]
        }
        $scope.checkUserServiceBusy = true;
        acPosDepositService.checkUser($scope.checkUserRequest)
            .then(function (response) {
                if (response) {
                    $scope.copyCheckUserRequest = JSON.stringify(response.serviceRequest, null, 4);

                    $scope.checkUserRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.checkUserResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.checkUserSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.checkUserResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.checkUserRequest = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.checkUserResponseObject = response.serviceResponse;
                    $scope.checkUserRequestObject = response.serviceRequest;
                }
                $scope.checkUserServiceBusy = false;
                $scope.checkUserServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.createPayoutModel = {
        phoneNumber: $scope.decodedToken.userPhoneNumber,
        firstName: $scope.decodedToken.userFirstName,
        lastName: $scope.decodedToken.userLastName,
        birthDate: new Date($scope.decodedToken.userBirthDate),
        email: $scope.decodedToken.email,
        amount: 100,
    };

    $scope.createPayoutServiceBusy = false;
    $scope.createPayoutServiceResponse = false;

    $scope.createPayout = function () {
        $scope.createPayoutRequest = {
            phoneNumber: $scope.createPayoutModel.phoneNumber,
            amount: $scope.createPayoutModel.amount,
            parameters: [{ key: "email", value: $scope.createPayoutModel.email }, { key: "PayerFirstName", value: $scope.createPayoutModel.firstName }, { key: "PayerLastName", value: $scope.createPayoutModel.lastName }, { key: "PayerBirthDate", value: $scope.createPayoutModel.birthDate.toISOString().split('T')[0] }]
        }
        $scope.createPayoutServiceBusy = true;
        acPosDepositService.createPayout($scope.createPayoutRequest)
            .then(function (response) {
                if (response) {
                    $scope.copyCreatePayoutRequest = JSON.stringify(response.serviceRequest, null, 4);

                    $scope.createPayoutRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.createPayoutResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.createPayoutSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.createPayoutResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.createPayoutRequest = JSON.stringify(response.serviceRequest, null, 4);
                    $scope.createPayoutResponseObject = response.serviceResponse;
                    $scope.createPayoutRequestObject = response.serviceRequest;
                }
                $scope.createPayoutServiceBusy = false;
                $scope.createPayoutServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

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
                birthDate: $scope.matchPersonalDataModel.birthDateAircashUser.toISOString().split('T')[0],
            },
            partnerUser: {
                firstName: $scope.matchPersonalDataModel.firstNamePartnerUser,
                lastName: $scope.matchPersonalDataModel.lastNamePartnerUser,
                birthDate: $scope.matchPersonalDataModel.birthDatePartnerUser.toISOString().split('T')[0],
            },
        }
        $scope.matchPersonalDataServiceBusy = true;
        acPosDepositService.matchPersonalData($scope.matchPersonalDataRequest)
            .then(function (response) {
                if (response) {
                    $scope.matchPersonalDataRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.matchPersonalDataResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.matchPersonalDataSequence = response.sequence;
                    $scope.matchPersonalDataResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.matchPersonalDataRequest = JSON.stringify(response.serviceRequest, null, 4);

                    $scope.matchPersonalDataResponseObject = response.serviceResponse;
                }
                $scope.matchPersonalDataServiceBusy = false;
                $scope.matchPersonalDataServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.setDate = function (date) {
        $scope.checkUserModel.birthDate = date;
    }

    $scope.setBirthDatePayout = function (date) {
        $scope.createPayoutModel.birthDate = date;
    }

    $scope.setPersonalDataDateAircashUser = function (date) {
        $scope.matchPersonalDataModel.birthDateAircashUser = date;
    }

    $scope.setPersonalDataDatePartnerUser = function (date) {
        $scope.matchPersonalDataModel.birthDatePartnerUser = date;
    }
}]);