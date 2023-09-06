var cobrandedCardModule = angular.module('cobranded_card', []);
app.config(function ($stateProvider, Global) {
    $stateProvider
        .state('app.cobranded_card', {
            data: {
                pageTitle: 'Cobranded card'
            },
            url: "/cobrandedCard",
            controller: 'CobrandedCardCtrl',
            templateUrl: 'app/cobranded_card/cobranded_card.html?v=' + Global.appVersion
        });
});
cobrandedCardModule.service("cobrandedCardService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope',
    function ($http, $q, handleResponseService, config, $rootScope) {
        return ({
            orderCard: orderCard,
        });
        function orderCard(phoneNumber, partnerId, partnerCardId, partnerUserId, cardTypeId, personalId, firstName, lastName, nameOnCard, deliveryTypeId, street, city, postalCode, country) {
            var request = $http({
                method: 'POST',
                url: config.baseUrl + "CobrandedCard/OrderCard",
                data: {
                    phoneNumber: phoneNumber,
                    partnerId: partnerId,
                    partnerCardId: partnerCardId,
                    partnerUserId: partnerUserId,
                    cardTypeId: cardTypeId,
                    personalId: personalId,
                    firstName: firstName,
                    lastName: lastName,
                    nameOnCard: nameOnCard,
                    deliveryTypeId: deliveryTypeId,
                    street: street,
                    city: city,
                    postalCode: postalCode,
                    country: country
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

            $scope.setDefaults = function () {
                $scope.cobrandedCardModel = {};

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
            };

            $scope.orderCard = function () {
                $scope.orderCardResponded = false;
                $scope.orderCardServiceBusy = true;
                cobrandedCardService.orderCard($scope.cobrandedCardModel.phoneNumber,
                    $scope.cobrandedCardModel.partnerId,
                    $scope.cobrandedCardModel.partnerCardId,
                    $scope.cobrandedCardModel.partnerUserId,
                    $scope.cobrandedCardModel.cardTypeId,
                    $scope.cobrandedCardModel.personalId,
                    $scope.cobrandedCardModel.firstName,
                    $scope.cobrandedCardModel.lastName,
                    $scope.cobrandedCardModel.nameOnCard,
                    $scope.cobrandedCardModel.deliveryTypeId,
                    $scope.cobrandedCardModel.street,
                    $scope.cobrandedCardModel.city,
                    $scope.cobrandedCardModel.postalCode,
                    $scope.cobrandedCardModel.country)
                    .then(function (response) {
                        if (response) {
                            $scope.orderCardRequestDateTimeUTC = response.requestDateTimeUTC;
                            $scope.orderCardResponseDateTimeUTC = response.responseDateTimeUTC;
                            $scope.orderCardSequence = response.sequence;
                            console.log($scope.orderCardServiceRequest);
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

            $scope.setDefaults();
        }
    ]);