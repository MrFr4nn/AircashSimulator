var cobrandedCardModule = angular.module('cobranded_card', []);
app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.cobranded_card', {
            data: {
                pageTitle: 'Cobranded card'
            },
            url: "/CobrandedCard",
            controller: 'CobrandedCardCtrl',
            templateUrl: 'app/cobranded_card/cobranded_card.html?v=' + Global.appVersion
        });
});
cobrandedCardModule.service("cobrandedCardService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            orderCard: orderCard,
            updateCardStatus: updateCardStatus,
            updateCardOrderStatus: updateCardOrderStatus,
        });
        function orderCard(cobrandedCardModel) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "CobrandedCard/OrderCard",
                data: {

                    phoneNumber: cobrandedCardModel.phoneNumber,
                    partnerId: cobrandedCardModel.partnerId,
                    partnerCardId: cobrandedCardModel.partnerCardId,
                    partnerUserId: cobrandedCardModel.partnerUserId,
                    cardTypeId: cobrandedCardModel.cardTypeId,
                    personalId: cobrandedCardModel.personalId,
                    firstName: cobrandedCardModel.firstName,
                    lastName: cobrandedCardModel.lastName,
                    nameOnCard: cobrandedCardModel.nameOnCard,
                    deliveryTypeId: cobrandedCardModel.deliveryTypeId,
                    street: cobrandedCardModel.street,
                    city: cobrandedCardModel.city,
                    postalCode: cobrandedCardModel.postalCode,
                    country: cobrandedCardModel.country
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
        function updateCardStatus(updateStatusCardModel) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "CobrandedCard/UpdateCardStatus",
                data: {
                    partnerID: updateStatusCardModel.partnerID,
                    partnerCardID: updateStatusCardModel.partnerCardID,
                    oldStatus: updateStatusCardModel.oldStatus,
                    newStatus: updateStatusCardModel.newStatus,
                    denialStatusDetails: updateStatusCardModel.denialStatusDetails
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
        function updateCardOrderStatus(updateCardOrderStatusModel) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "CobrandedCard/UpdateCardOrderStatus",
                data: {
                    cardID: updateCardOrderStatusModel.cardId,
                    newUser: updateCardOrderStatusModel.newUser
                }
            });
            return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
        }
    }
]);
cobrandedCardModule.controller("CobrandedCardCtrl",
    ['$scope', 'cobrandedCardService', '$localStorage', 'HelperService',
        function ($scope, cobrandedCardService, $localStorage, HelperService) {
            $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
            $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
            if ($scope.partnerRoles.indexOf("CobrandedCard") == -1) {
                $location.path('/forbidden');
            }
            $scope.cobrandedCardModel = {};
            $scope.updateStatusCardModel = {}
            $scope.updateCardOrderStatusModel = {}

            $scope.setDefaultsOrderCard = function () {

                $scope.cobrandedCardModel.partnerId = "0a13af2f-9d8e-4afd-b3e0-8f4c24095cd6";
                $scope.cobrandedCardModel.partnerCardId = HelperService.NewGuid();
                $scope.cobrandedCardModel.partnerUserId = HelperService.NewGuid();
                $scope.cobrandedCardModel.cardTypeId = "ed6375c1-8f8c-458a-a1c5-a92642ec708b";
                $scope.cobrandedCardModel.firstName = "John";
                $scope.cobrandedCardModel.lastName = "Doe";
                $scope.cobrandedCardModel.nameOnCard = "John Doe";
                $scope.cobrandedCardModel.street = "Address";
                $scope.cobrandedCardModel.city = "City";
                $scope.cobrandedCardModel.postalCode = "10000";
                $scope.cobrandedCardModel.country = "Croatia";
                $scope.cobrandedCardModel.deliveryTypeId = "2";

                $scope.orderCardResponded = false;
                $scope.orderCardServiceBusy = false;

                $scope.updateStatusCardResponded = false;
                $scope.updateStatusCardServiceBusy = false;

                $scope.updateCardOrderStatusResponded = false;
                $scope.updateCardOrderStatusServiceBusy = false;
            };
            $scope.newUserOptions = [
                {
                    name: "Yes",
                    value: true,
                },
                {
                    name: "No",
                    value: false,
                }
            ];

            $scope.setDefaultUpdateStatusCard=function (){
                $scope.updateStatusCardModel = {}

                $scope.updateStatusCardModel.partnerID = "0a13af2f-9d8e-4afd-b3e0-8f4c24095cd6";
                $scope.updateStatusCardModel.partnerCardID = HelperService.NewGuid();
                $scope.updateStatusCardModel.oldStatus = 0;
                $scope.updateStatusCardModel.newStatus = 1;

                $scope.updateStatusCardResponded = false;
                $scope.updateStatusCardServiceBusy = false;

            }
            $scope.updateCardStatus = function () {
                $scope.updateStatusCardResponded = false;
                $scope.updateStatusCardServiceBusy = true;
                cobrandedCardService.updateCardStatus($scope.updateStatusCardModel)
                    .then(function (response) {
                        if (response) {
                            $scope.updateStatusCardRequestDateTimeUTC = response.requestDateTimeUTC;
                            $scope.updateStatusCardResponseDateTimeUTC = response.responseDateTimeUTC;
                            $scope.updateStatusCardSequence = response.sequence;
                            response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                            $scope.updateStatusCardServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                            $scope.updateStatusCardServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                        }
                        $scope.updateStatusCardResponded = true;
                        $scope.updateStatusCardServiceBusy = false;
                    }, () => {
                        console.log("error");

                    });
            }
            $scope.setDefaultUpdateCardOrderStatus = function () {
                $scope.updateCardOrderStatusModel = {}

                $scope.updateCardOrderStatusModel.cardId = "a184a771-e517-4dd2-a7a5-139d88f35409";
                $scope.updateCardOrderStatusModel.newUser = true;

                $scope.updateCardOrderStatusResponded = false;
                $scope.updateCardOrderStatusServiceBusy = false;
            }
            $scope.updateCardOrderStatus = function () {
                $scope.updateCardOrderStatusResponded = false;
                $scope.updateCardOrderStatusServiceBusy = true;
                cobrandedCardService.updateCardOrderStatus($scope.updateCardOrderStatusModel)
                    .then(function (response) {
                        if (response) {
                            $scope.updateCardOrderStatusRequestDateTimeUTC = response.requestDateTimeUTC;
                            $scope.updateCardOrderStatusResponseDateTimeUTC = response.responseDateTimeUTC;
                            $scope.updateCardOrderStatusSequence = response.sequence;
                            response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                            $scope.updateCardOrderStatusServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                            $scope.updateCardOrderStatusServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                        }
                        $scope.updateCardOrderStatusResponded = true;
                        $scope.updateCardOrderStatusServiceBusy = false;
                    }, () => {
                        console.log("error");

                    });
            }

            $scope.orderCard = function () {
                $scope.orderCardResponded = false;
                $scope.orderCardServiceBusy = true;
                cobrandedCardService.orderCard($scope.cobrandedCardModel)
                    .then(function (response) {
                        if (response) {
                            $scope.orderCardRequestDateTimeUTC = response.requestDateTimeUTC;
                            $scope.orderCardResponseDateTimeUTC = response.responseDateTimeUTC;
                            $scope.orderCardSequence = response.sequence;
                            response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                            $scope.orderCardServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                            $scope.orderCardServiceResponse = JSON.stringify(response.serviceResponse, null, 4);
                        }
                        $scope.orderCardResponded = true;
                        $scope.orderCardServiceBusy = false;
                    }, () => {
                        console.log("error");
                    });
            }
            
            $scope.setDefaultsOrderCard();
            $scope.setDefaultUpdateStatusCard();
            $scope.setDefaultUpdateCardOrderStatus();
        }
    ]);