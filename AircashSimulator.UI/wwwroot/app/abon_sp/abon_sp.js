var abonSpModule = angular.module('abonSp', []);

app.config(function ($stateProvider) {
    $stateProvider
        .state('app.abonSp', {
            data: {
                pageTitle: 'A-bon generate'
            },
            url: "/abonGenerator",
            controller: 'abonSpCtrl',
            templateUrl: 'app/abon_sp/abon_sp.html'
        });
});

abonSpModule.service("abonSpService", ['$http', '$q', 'handleResponseService', 'config', '$rootScope', function ($http, $q, handleResponseService, config, $rootScope) {
    return ({
        createCoupon: createCoupon,
        cancelCoupon: cancelCoupon,
        getDenominations: getDenominations,
        createSimulateError: createSimulateError,
        cancelSimulateError: cancelSimulateError,
    });
    function createCoupon(value, pointOfSaleId) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonSalePartner/CreateCoupon",
            data: {
                Value: value,
                PointOfSaleId: pointOfSaleId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function cancelCoupon(serialNumber, cancelPointOfSaleId) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonSalePartner/CancelCoupon",
            data: {
                SerialNumber: serialNumber,
                PointOfSaleId: cancelPointOfSaleId
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function getDenominations() {
        var request = $http({
            method: 'GET',
            url: config.baseUrl + "Denominations/GetDenominations",
            params: {
            }
        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function createSimulateError(errorCode) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonSalePartner/CreateCouponSimulateError",
            data: errorCode

        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
    function cancelSimulateError(errorCode) {
        var request = $http({
            method: 'POST',
            url: config.baseUrl + "AbonSalePartner/CancelCouponSimulateError",
            data: errorCode

        });
        return (request.then(handleResponseService.handleSuccess, handleResponseService.handleError));
    }
}
]);

abonSpModule.controller("abonSpCtrl", ['$scope', '$state', 'abonSpService', '$filter', '$http', 'JwtParser', '$uibModal', '$rootScope', '$localStorage', function ($scope, $state, abonSpService, $filter, $http, JwtParser, $uibModal, $rootScope, $localStorage) {
    $scope.decodedToken = jwt_decode($localStorage.currentUser.token);
    $scope.partnerRoles = JSON.parse($scope.decodedToken.partnerRoles);
    if ($scope.partnerRoles.indexOf("AbonGenerate") == -1) {
        $location.path('/forbidden');
    }

    $scope.createCouponModel = {
        value : 100,
        pointOfSaleId : 'test'
    };

    $scope.cancelCouponModel = {
        cancelSerialNumber: null,
        cancelPointOfSaleId: 'test'
    };

    $scope.createServiceBusy = false;
    $scope.createServiceResponse = false;

    $scope.cancelServiceBusy = false;
    $scope.cancelServiceResponse = false;

    $scope.setDefaults = function () {
        $scope.denominations = [];
        $scope.busy = false;
    };

    $scope.showCoupon = function () {
        $("#couponModal").modal("show");
    }

    $scope.showContent = function () {
        $("#contentModal").modal("show");
    }

    $scope.createCoupon = function () {
        $scope.createServiceBusy = true;
        $scope.createServiceResponse = false;
        $scope.showPerview = false;
        abonSpService.createCoupon($scope.createCouponModel.value, $scope.createCouponModel.pointOfSaleId)
            .then(function (response) {
                
                if (response) {
                    $scope.requestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.responseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.sequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.serviceResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.serviceRequest = JSON.stringify(response.serviceRequest, null, 4);
                    if (response.serviceResponse.content) {
                        $scope.showPerview = true;
                        $scope.content = response.serviceResponse.content;
                        $scope.decodedContent = decodeURIComponent(escape(window.atob($scope.content)));
                        console.log($scope.decodedContent);
                        document.querySelector('#content1').innerHTML = $scope.decodedContent;
                    }
                }
                $scope.createServiceBusy = false;
                $scope.createServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.cancelCoupon = function () {
        $scope.cancelServiceBusy = true;
        $scope.cancelServiceResponse = false;
        abonSpService.cancelCoupon($scope.cancelCouponModel.cancelSerialNumber, $scope.cancelCouponModel.cancelPointOfSaleId)
            .then(function (response) {
                if (response) {
                    $scope.cancelRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.cancelResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.cancelSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.cancelResponse = response.serviceResponse;
                    $scope.cancelServiceRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.cancelServiceBusy = false;
                $scope.cancelServiceResponse = true;
            }, () => {
                console.log("error");
            });
    }

    $scope.getDenominations = function () {;
        abonSpService.getDenominations()
            .then(function (response) {                
                if (response) {
                    $scope.denominations = $scope.denominations.concat(response);
                }
            }, () => {
                console.log("error");
            });
    }

    $scope.currentCreateErrorCode = 0;
    $scope.errorCreateResponded = false;
    $scope.errorCreateServiceBusy = false;
    $scope.createSimulateError = (errCode) => {
        $scope.errorCreateResponded = false;
        $scope.errorCreateServiceBusy = true;
        abonSpService.createSimulateError(errCode)
            .then(function (response) {
                if (response) {
                    $scope.errorCreateRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.errorCreateResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.errorCreateSequence = response.sequence;
                    $scope.errorCreateRequestCopy = JSON.stringify(response.serviceRequest, null, 4);
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.errorCreateResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.errorCreateRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.currentCreateErrorCode = errCode;
                $scope.errorCreateResponded = true;
                $scope.errorCreateServiceBusy = false;
            }, () => {
                console.log("error");
            });
    }

    $scope.currentErrorCode = 0;
    $scope.errorCancelResponded = false;
    $scope.errorCancelServiceBusy = false;
    $scope.cancelSimulateError = (errCode) => {
        $scope.errorCancelResponded = false;
        $scope.errorCancelServiceBusy = true;
        abonSpService.cancelSimulateError(errCode)
            .then(function (response) {
                if (response) {
                    $scope.errorCancelRequestDateTimeUTC = response.requestDateTimeUTC;
                    $scope.errorCancelResponseDateTimeUTC = response.responseDateTimeUTC;
                    $scope.errorCancelSequence = response.sequence;
                    response.serviceRequest.signature = response.serviceRequest.signature.substring(0, 10) + "...";
                    $scope.errorCancelResponse = JSON.stringify(response.serviceResponse, null, 4);
                    $scope.errorCancelRequest = JSON.stringify(response.serviceRequest, null, 4);
                }
                $scope.currentErrorCode = errCode;
                $scope.errorCancelResponded = true;
                $scope.errorCancelServiceBusy = false;
            }, () => {
                console.log("error");
            });
    }

    $scope.setDefaults();

    $scope.getDenominations();

    $scope.errorExamples = {
        CreateTransaction: {
            error1: {
                request: {
                    "partnerId": "8db69a48-7d61-48e7-9be8-3160549c7f17",
                    "value": 25,
                    "pointOfSaleId": "test",
                    "isoCurrencySymbol": "EUR",
                    "partnerTransactionId": "e3bd6e90-cbb8-4118-a784-af3a93424a94",
                    "contentType": null,
                    "contentWidth": null,
                    "signature": "FNP0WFwbAX..."
                },
                response: {
                    "code": 1,
                    "message": "Invalid PartnerId",
                    "additionalData": null
                }
            },
            error2: {
                request: {
                    "partnerId": "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                    "value": 25,
                    "pointOfSaleId": "test",
                    "isoCurrencySymbol": "EUR",
                    "partnerTransactionId": "c0bda895-4407-4410-a2d5-22fbc340724d",
                    "contentType": null,
                    "contentWidth": null,
                    "signature": "d9cGnF7qap..."
                },
                response: {
                    "code": 2,
                    "message": "Invalid Signature",
                    "additionalData": null
                }
            },
            error3: {
                request: {
                    "partnerId": "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                    "value": 11,
                    "pointOfSaleId": "test",
                    "isoCurrencySymbol": "EUR",
                    "partnerTransactionId": "62a6fdf7-967c-4152-9c79-8f144350b15b",
                    "contentType": null,
                    "contentWidth": null,
                    "signature": "q6j6quhN9m..."
                },
                response: {
                    "code": 3,
                    "message": "Invalid CouponValue",
                    "additionalData": null
                }
            },
            error5: {
                request: {
                    "partnerId": "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                    "value": 25,
                    "pointOfSaleId": "test",
                    "isoCurrencySymbol": "EUr",
                    "partnerTransactionId": "7770968f-22ab-42f0-8346-91e7ce6b12c5",
                    "contentType": null,
                    "contentWidth": null,
                    "signature": "HU+L+0XKVc..."
                },
                response: {
                    "code": 5,
                    "message": "Invalid CurrencySymbol",
                    "additionalData": null
                }
            },
            error6: {
                request: {
                    "partnerId": "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                    "value": 25,
                    "pointOfSaleId": "test",
                    "isoCurrencySymbol": "EUR",
                    "partnerTransactionId": "84ba908f-cef9-4713-9396-edad8f8c2c12",
                    "contentType": null,
                    "contentWidth": null,
                    "signature": "RCrcUGLLK6..."
                },
                response: {
                    "code": 6,
                    "message": "Coupon exists for the given PartnerTransactionId",
                    "additionalData": {
                        "serialNumber": "2453730818247605",
                        "value": 25,
                        "isoCurrencySymbol": "EUR",
                        "partnerTransactionId": "84ba908f-cef9-4713-9396-edad8f8c2c12"
                    }
                }
            },
            error8: {
                request: {},
                response: {}
            }
        },
        CancelTransaction: {
            error1: {
                request: {
                    "partnerId": "8db69a48-7d61-48e7-9be8-3160549c7f17",
                    "serialNumber": "5349550488532699",
                    "partnerTransactionId": "3b591880-bf40-43d9-88ea-7818240f3863",
                    "pointOfSaleId": "test",
                    "signature": "Iu+5eBeBL4..."
                },
                response: {
                    "code": 1,
                    "message": "Invalid PartnerId",
                    "additionalData": null
                }
            },
            error2: {
                request: {
                    "partnerId": "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                    "serialNumber": "0207037936248882",
                    "partnerTransactionId": "84a74609-5b35-4ed7-9543-971b90bf06fd",
                    "pointOfSaleId": "test",
                    "signature": "HoGojxnhyA..."
                },
                response: {
                    "code": 2,
                    "message": "Invalid Signature",
                    "additionalData": null
                }
            },
            error3: {
                request: {},
                response: {}
            },
            error4: {
                request: {
                    "partnerId": "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                    "serialNumber": "0000000000000000",
                    "partnerTransactionId": "e2c643cf-e7c4-47ed-b989-39f76d54c218",
                    "pointOfSaleId": "test",
                    "signature": "FKVDmReIqu..."
                },
                response: {
                    "code": 4,
                    "message": "Invalid coupon serial number or partner transaction id",
                    "additionalData": null
                }
            },
            error5: {
                request: {},
                response: {}
            },
            error6: {
                request: {
                    "partnerId": "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                    "serialNumber": "0565130009558536",
                    "partnerTransactionId": "8bea4288-12c0-4fef-9149-f0a3cd5f807d",
                    "pointOfSaleId": "error",
                    "signature": "S7SjZWukip..."
                },
                response: {
                    "code": 6,
                    "message": "PointOfSaleIds do not match",
                    "additionalData": null
                }
            },
            error7: {
                request: {
                    "partnerId": "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                    "serialNumber": "0207037936248882",
                    "partnerTransactionId": "319b700b-1700-458a-8c2d-cc2be039537a",
                    "pointOfSaleId": "test",
                    "signature": "Sx+4XQOCSw..."
                },
                response: {
                    "code": 7,
                    "message": "Coupon has been already cancelled",
                    "additionalData": null
                }
            },
            error8: {
                request: {
                    "partnerId": "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                    "serialNumber": "8111271745690701",
                    "partnerTransactionId": "641795f3-1f0f-4e92-a988-3a5720f3c199",
                    "pointOfSaleId": "test",
                    "signature": "q3JdF2qmKl..."
                },
                response: {
                    "code": 8,
                    "message": "Coupon has been already used",
                    "additionalData": null
                }
            },
            error9: {
                request: {},
                response: {}
            },
            error10: {
                request: {},
                response: {}
            },
            error11: {
                request: {},
                response: {}
            }

        },

    }


    $scope.aBonGenerate = {
        couponCreation: {
            requestExample: {
                partnerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                value: 100,
                pointOfSaleId: "test",
                isoCurrencySymbol: "HRK",
                partnerTransactionId: "76b266ae-4d61-414b-baa9-44f9da1182e1",
                contentType: null,
                contentWidth: null,
                email: null,
                signature: "eqWplW0MZ/..."
            },
            responseExample: {
                serialNumber: "9889251688979846",
                couponCode: "5460446045144493",
                value: 100,
                isoCurrencySymbol: "HRK",
                content: "PCFET0NUWVBFIGh0bWw+DQo8aHRtbCBsYW5nPSJlbiI+DQo8aGVhZD4NCiAgICA8bWV0YSBjaGFyc2V0PSJVVEYtOCI+DQogICAgPG1ldGEgaHR0cC1lcXVpdj0iWC1VQS1Db21wYXRpYmxlIiBjb250ZW50PSJJRT1lZGdlIj4NCiAgICA8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMCI+DQoJDQoJPHN0eWxlPg0KCQkuY291cG9uIHsNCgkJCW1hcmdpbjogMDsNCgkJCWZvbnQtZmFtaWx5OiBDb3VyaWVyIE5ldzsNCgkJCXBhZGRpbmc6IDBweDsNCgkJCWZvbnQtc2l6ZToxMXB4Ow0KCQl9DQoJCQ0KCQlpbWcgew0KCQkJbWFyZ2luOiBhdXRvOw0KCQkJZGlzcGxheTogYmxvY2s7DQoJCX0NCgkJLmNlbnRlcnsNCgkJCXRleHQtYWxpZ246IGNlbnRlcjsNCgkJfQ0KCQlociwgaDEsIGgyLCBoMywgaDQgew0KCQkJbWFyZ2luOiAwOw0KCQl9DQoJCQ0KCQlociwgaDEsIGgyLCBoMyB7DQoJCQl0ZXh0LWFsaWduOiBjZW50ZXI7DQoJCX0NCgkJCQkNCgkJcCB7DQoJCQltYXJnaW46IDBweDsNCgkJCW1hcmdpbi1ib3R0b206IDNweDsNCgkJfQ0KCQkNCgkJb2wgew0KCQkJcGFkZGluZy1pbmxpbmUtc3RhcnQ6MTVweDsNCgkJCW1hcmdpbi1ibG9jay1zdGFydDowcHg7DQoJCQltYXJnaW4tYmxvY2stZW5kOjBweDsNCgkJfQ0KCQkNCgkJI3FyY29kZSBpbWcgew0KCQkJd2lkdGg6MTAwcHg7DQoJCX0NCgk8L3N0eWxlPg0KDQo8L2hlYWQ+DQo8Ym9keT4NCjxkaXYgY2xhc3M9ImNvdXBvbiI+DQogICAgPGltZyB3aWR0aD0iMTUwIiBzcmM9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBaThBQUFFcUNBWUFBQURkOGJCcUFBQUgvM3BVV0hSU1lYY2djSEp2Wm1sc1pTQjBlWEJsSUdWNGFXWUFBSGphM1pkYmxpUXBEa1QvV2NVc2diZkVjZ1NJYzJZSHMveTVlRVJtVlZiMXUvdXJ3ek1DVDhCQnlFd21lZkQvL2ZlRS8vREpMZWRRbTJnZnZVYytkZFNSalJ1TnI4OTRmbE9zeisvenlTZm1kKytYL3NDRHI5dE1XMmpMYTBEczFhWTczcjQ5OExGSG1sLzdnNzVIc3I0WGVnKzg5NDNsN256djkvZEcwcDlmL2FtK0Z4cit1dWxENVh0VDUzdWg5Wjc0bVBMKzFrK3pYczM5UDN6cEVMeTBHeHVWbkwya0VwL2YrcktnM0c4cVJsdWUzODY4OVBTMGtnTk5LaDlId2lGZmp2ZlJ4dmk5Zzc0NCtlTXUvT2o5RDUvOTZQeFBVTW9QdnV4dkgzSHppd09wL2RCZlB2ZlAzMjljUGkzS1h3YzR2UDUwblBmM25LM24rT3QwVmpzZTdXOUdQYzVPSDhzd2NlTHk4anpXdVlSdjQxNmVhM0JwdExpQWZNY1ZKOWRLSTJWUU9TSFZ0Sk9say94cFYxcVlXTE5ub2MxNUFkVHQweUo1NUZVdVR2VmU2V1Fwbyt5aVlMbXlCNkNzSlgvYWtwNTl4N1BmU3NyT096RTFKeFpMUFBLclYvaXR3VDl6aFhQV2RWRzZ6bFI5ZklWZCtmSWFNeTV5OTVkWkFKTE9HN2YyT1BqamVzTWZ2eU1XVkFYQjlyaFpPYURGK1ZwaXR2U05XK1hCdVRDdjBiNUNLQVhaN3dWd0VYczNqSUgyTmNXZVNrczlSY2xaVXNLUENrQ0c1Ym5VUEVFZ3RaWTNSdVphaUpZZ1dmUGRtMmNrUFhPUnFaNXZOOW9FRUszMEltQXppZ0ZXclEzK1NGVTRaSzIwMmxyclRacUdOcHIxMG10dnZYZnBWK1JNaWxScDBrVkVaWWhwMGFwTnU0cXFEcldSUjBFRDIraERobzR4ekhJd05qTFdNdVliUFRQUE11dHNzMCtaT3NlMEJYMVdYVzMxSlV2WFdMYnpMaHVaMkgzTDFqMjJlUXFPVW5qMTV0M0YxWWZiZ1d1bm5IcmE2VWVPbm5Ic0U3VTNxajlkZndLMTlFWXRQMGpkZWZLSkdyMUI1R09KZE9Xa1hjeEFMTmNFNG5JUmdORDVZaFkxMVpvdmNoZXpPREpCMGNnRnFWMXN3azRYTVNDc25uSTc2Uk83YjhqOUlkeEMweitFVy80OTVNS0Y3cDlBTGdEZHo3ajlBbXI3NXJuMUlQYUt3dXZUV0lnK3hsMHRaTFdiMU96dnR2K21oZWFlMDFNOTZLaWV0c0tFSU0zaGp4V2RRQXFaZ0NzV1BlWEMzdnM1dlI2Zk5TWXZveWRySFpCdDZVNCtOb1NsbXZGNUpJeStQWFhTd3pFbE5xYTFlclNKRjRXNjZNT0ozclpIdmFDM0tDZm5QbjNWRFQ5c2c2M09VaWYvaGc0bEhGTHM0cjZJblk2SWRUSDB5allGaUt5MHNVdW5tWTh5NWNDdnV1YWFaZThqNGh2QnJBSkJRbmNlVVVqbHd5QVIwV1Z6ajdtaFo4SFF2ZHRjV3NnbHk1VGdZWWN6OTlGYXlVSGpwSHhxWTBxZG9hR1RuR0p2NGsydG5xR0xNcVdRRkhlVHNpbWJpc3ZFdHc1QmZhMUpHcVZLT25uaXZYbnFQSGhjTnhZUlA1elZ0ZlY5V3hra09ieDFEeVVWejRxT1Z2TlJtNFRsVTZMSnZBb3YvWXkxZTl1MzJHcUpHdkoxODNmYkx3dEozeWZhSVdtWDFVRmJJRUlidTZEdGV5Yjh6UFpsSnl3OEtKNE9Rcy8zc0RQSjlpSDFnc0N3akpsZGkxMGp6SUE1aXlsVXBEUHVmc2c3ODF6QVIrdzRqa3krcjZkbXdmbnlNSFNTK3h2T2p6Nm9JaHdIenRvTndEZlFMZlJoTGVkWjEySURTNjN2eHFwYWF0OTNqVmJtS0lxVE93bHlqSFZtaG02R1EyWEJ4YXdiY0JzQ3M0Nk5mWll0MWtWT1drSm9tZzZaVHhWYzNMb1doMGVybkRESDJKbVFRYllOVXprMk1WSk44Y0drQkVaeHlMZ2IyV3VPR3RxRUsxSlF6dlJRckhnYTBHWm9DWFpGTUVPVGlFa1ZxNHBjTDQ4VG9kMUUvaXBNQmVwTElSK3gxbjBmUlVXblJGdmc0L0pZRjN3MmlyZ3pUWHpBZm9YNDlieDRtRHJXWEtjU29jUFd2ZHVDY2w1VnRFU1BHUzY3VTVnUW5obXZjU2E4eC8rQ3NJUS9PUEZZazlQaDJSazR0RkdUR3JIQmI5NmR3TFFaRnFiMXZrZ0lCZXFnQklOaU5WSlFacjlpVC8wSUZXNllYYmduUzNvcG5oZTVCZUdmc3oxOEFxMlFzbXpTQUh2dDBrbHVqMDl3b1MrWkRnYThMUkR1cE93WlVVQzI2MDV5OGdaQmt0ektsSGUxNFc2QlFoV2xJbEFUZ0dlNU9iajZsRXphOUlxbEhlS2N6ZFJDYllFaG1KZE92NWIxUGx0WnBWczdxd0YvUlk3V1RERHVxaW1Sb0xhbWNaaWpDVkxrT2E0a1VmQWVWVEplRkt5eXRVWW5SV3VQZFdZWVVuYW8wZVdreDUzQys0M0NhcGFqWHJBM0VjakpMT2lJNEtNdGVWT0NYNWZQRzF2WDVlUEJPOVFiYkszWmZNYVJyUGNNcVBETVlZZlhGTXFYOXNqRUw3Y2gvYzZFMzJqVEhsaUlkM3M4TVpEY1FkTTVXT2VGd2ZyWmxBcEVjZUhBNHZjZHhNZVZIQXBZNUZCM3I3eklrRktJUXkyM3RMMEZra3dKck1sYWVKdUNCYkh2bWp6WDY1VkZyS2VNQkdoMldjYjJEWEhqM1dTamQzaHJrNjBvanlLRVc2WDFNQnNvN3Zwa0pVZDduSExzSkVWcVFNM1FSaWViTkxQN3QxSHR2U2k2eUo5b3k0aFQrNTJIbmhkUVM2UXB5a3kyVFVSN3lXc24wVTcydXJYN3NuRXB5QW0zak5SNHc2R29oNUhFWThaUnlwMmlQY21EY2djQlBSTVVDTlRFY1VRQzFJZHFNekptdmhkU2cydnJwUUI3NkpVcVFkSHdDYVV4ZWZvcUpFeEVyTWlNcVB6VkVPUGRPYTFTQk8rWFY3aW1iMHpLZUVadTJxcDNSQzlUSHhabFVuYWZqK1kwWXUyMlR0MHdFY3NtNjZVOHVieW12Q2E4aDNtVnNrY1lQdHZ3WThkZmJUOFh5dDZ4ZmQ2YXBhSWNtWU5UbnV3MnJxWVN1NXMzVGVxYlRVcEtaRHY4V1ZGSGNrYXZ1R1o3eUhYWHVheFJncmN1MmU1eGRKSXk5RGdWREdTOHV5eWsvMnhuR3lHVDdBTUxiakpLaVRJcUN6eVlvWk5VWkRqVkFLcHQxRTNRQmNSazkrZHRGODdNVHExYnFZeEpzQTRKN1VMZzYxWVBIZWtoNW5GY0poMDlHdWZ0Y2JVT0s4OEUrWmp3MDdoVHZiRFN1Qy9pQTRwNWIvTVc3TGRvWXJZQU5xOHZxenBzV2JENXp4YVZ3ZjZoc3ZaZnU5QTVZUS8wOXYvMXd2d24vU0RiU1FBQUFZUnBRME5RU1VORElIQnliMlpwYkdVQUFIaWNmWkU5U01OQUhNVmZVN1ZTS2c1MkVISEkwRHBaRUJWeGxDb1d3VUpwSzdUcVlITHBGelJwU0ZKY0hBWFhnb01maTFVSEYyZGRIVndGUWZBRHhNM05TZEZGU3Z4ZlVtZ1I0OEZ4UDk3ZGU5eTlBNFJtbGFsbXp3U2dhcGFSVHNURlhINVZETHpDano0RUlTSXFNVk5QWmhhejhCeGY5L0R4OVM3R3M3elAvVGtHbElMSkFKOUlQTWQwd3lMZUlKN1p0SFRPKzhSaFZwWVU0blBpY1lNdVNQeklkZG5sTjg0bGh3V2VHVGF5NlhuaU1MRlk2bUs1aTFuWlVJbW5pU09LcWxHK2tITlo0YnpGV2EzV1dmdWUvSVdoZ3JhUzRUck5VU1N3aENSUzFKR01PaXFvd2tLTVZvMFVFMm5hajN2NFJ4eC9pbHd5dVNwZzVGaEFEU29reHcvK0I3KzdOWXRUazI1U0tBNzB2dGoyUnhRSTdBS3RobTEvSDl0MjZ3VHdQd05YV3NkZmF3S3puNlEzT2xya0NCamNCaTZ1TzVxOEIxenVBTU5QdW1SSWp1U25LUlNMd1BzWmZWTWVHTG9GZ210dWIrMTluRDRBV2VwcStRWTRPQVRHU3BTOTd2SHUvdTdlL2ozVDd1OEhhRk55b3hlU3h5TUFBQUFHWWt0SFJBQUFBQUFBQVBsRHUzOEFBQUFKY0VoWmN3QUFDeE1BQUFzVEFRQ2FuQmdBQUFBSGRFbE5SUWZsQXdZS05CUGFsVEppQUFBTDhFbEVRVlI0MnUzZFMzTGNSaElHWUlCa2VNZm1BV1I1N3dqZi93Z3pNVjZMSWE3NU9BQ2JtN0hJWnMzQ1E0WkNJNDM2Z1VkbTF2ZEZjR2VaNkFTcTZrY1dHaHdHQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBZ2dGRUo5dEtVQUdNTXdNUXFxR0RjQVdBU0ZWZ3dCZ0ZNbkFJTEdJOEFKa3VoQll4SkFCT2w0SUt4Q1dDQ0ZGckFHQVV3TVFvdVlKd0NtQlFGRjR4VkFCT2k0QUxHSzRESlVIQUJZeGJBUkNpNFlOd0NtQVFGRnpCMkFVeUFnZ3NZdndBbVA4RUZZeGlnSDJkS0FBQzRhMXVXcmd2R01ZQkpUM0FCWXhrZ0p0dEdBSUM3dFlYb3VrQ2Q4UXl3TjUwWEFNQ2QyZ0owWGFEV21BYlltODRMQUNDOEFBRE1KV09MMlpZUjFCdlhBSHZUZVFFQWhCY0FBT0VGQUdESXR6ZnVlUmVvT2JZQjlxYnpBZ0FJTHdBQXdnc0FnUEFDQUFndkFBRENDd0NBOEFJQUNDOEFBTUlMQU1DN0N5WG9UMnZIdjZoNEhMMjRGWUIxNmJ3VUR5bmYrNW42Ly9seWU2L1lBQ3pHM3pZcVpQZTRIYzQybDZzZXcrdjJhVGkvMmpnWnhqYUFDVTU0aVJ0WWZuaHgyV0l5dGdGTWNNTExleUZhbmxKTUhXS2lmdlpnWVUxNEFjcnl6RXNpTDdmM2t6eTNza2JReW5iTUFNVGwyMFpKUXN2NXh3L3BQOGRiZ0xHZEJJRHdVbGpGamtWclRZQUI0R2kyallMYVBXNUxiN1cwMW9iZDQ5YUpUblRLRnZnQjJJc0hkb011N0YxZGhBZDJZVHl3dThyWWJnbVBHU2hLNXlXUTZ0MFdZUTJBS1hqbXhRSWU1dk43RGdhQWZlaThDQzdxQUlEd2dnVmJQUUFRWGl6VTZnSUF3b3NGV24wQUVGNndNS3NUQU1LTEJibFhYbVFId0xlOHBFNXdpWCtSZnZNVmFpK3BXMlZzZTBrZEVJYk95MEowRUlRK0FQcTgwMG03aWxtQUo3aFkvOXZaMEhsWlpXenJ2QUJoNkx3SUxtbm9YZ0dROFU0blhRb1FYRG9hVERvdnZjMUh3RXAwWG1iMDVkTm5SUUNBenU5MFVyVXhkRjA2RzB3Nkw3M05SOEJLZEY1bTR2a01BSENuczlUZDN6UUhxdXZTMzJEU2VlbHRQZ0pXb3ZNaXVBQ0E4QUlBSUx3a29lc0NBTUlMQUlEd01nZGRGd0FRWGdBQWhKYzV2TnplbC81OHU3dUhZUnpIazM1ZXQwOHVGQUJPNWowdlV4MVl3UzJqNSt1YjRaYy9mcDh0N0oxLy9GQnJNSG5QUzIvekVTQzhDQys5THNKVmFpZThDQy9BTWk2VTRIUlZ0b3pXV256ZmZxOEhuZ0hZaDJkZUpwQjkrK04xK3hTaWErQzVHQUNFRjM3cStmcG1PTC9heEFtQ1Y1dmgrZnJHaVFIZ2gyd2JuZWpMcDg5cGp6M1lNeHJ2M2g0U3RvMEV3SGZYcjJUSEcyNDF5N3JBUmcwdW1ldnJnZDN1NWlOZ0pUb3ZIY3EwTFRPT293NE1Vd1dxVVkzVUtsak4xYm1UQzFUbjVVUzd1NGZoNHJkZmN4M3o0M1k0MjF5bUNGcUZ4M2FVemtzTFhLUHFjNk9GMWpVcHZBZ3ZGdGhxZFJaZVpqM21scXhlMWVmRHNlaG5IcE1lUzNkODIwaHdjZXhFWDZCYm9kOVQ1Vmhic3BwbHZTWVJYdnEydTN0UUJESXVFajM4enV3QnE2Y1EwOVEyeUEydEMrZUVnL0ZOR0RXUFcrUHMyMGF0WUExN3VBTWZrOWRpREh3T3RKKy9vdlBTQVYwWDNLU2tQSTZNZDkwVk93V3V4dzVUY3VtVGw2WHpVdTE1a2FoMTEzbVo1SmdqbnR3MVRteUZoV3BNV0pjeHdYblFnUmwwWGdBM0o5R09xeFU2bjgzMTZQb1FYdHo5Wis4R1RNSTJHSVVYaktaMmpsbUEyV050YzBFSkw4Smp5VnFQVmNkZTRUbXpxWjNyc1BENlBTbWRGd0EzWmo2amVnb3Z4SkRwYnhoQnh3dUdSUjBPWk52bzJBUHh1bnJuSUhhOWJSdmxxRzlUTy9YcWJCMmZoTTRMUU9jM1l6NDN3Z3VBQlJqMVUwdmhCY0NDQXdndkFHc0VFTUZGSFJCZStCNHZjZ09nS3Q4Mk92WkFnbi9icVBvM2pTS2VBOTgyTW9lcTQrdzFWTDg2Ni9sSkxweHZJUG5rdk9hQzFwSXRHaEZyV0NVZ3FLSHdBckQzM2VTWVpBRnBDV3JZVnFyTFdPZzZGR0tFRjBCb09mamZXVHlPcjZNRitQVHJVQTBYNElGZG9FcHdtZXJmSDZvRnJlR29obDFkaDhJTFFOSUZJK3JDMFRvK0Z4ay90K0FodkFBZ2REZ1hBckx3d2srODNONHJBcjFQOUtNYVdueHhvVWZnUFMrSG5GeC9WYnJuZW1kOHo4c2NCV3dCYXQ0U24vZG94Kzg2Rk5pSFlkQjVBZHlnb1lZSUx6QS8yMklnWk9CaXo4SzIwU0VudC9DMlVjVDYyellLT3grdDNiS3ZzR1VRWmV2SXRwRUFPd3lEemdzQUZrV0VGNkw0OHVteklzQzYzSEdEQzk2MjBjRW51T0RXMGN2dC9YRCs4WU5hTHp1Mk0yOGJyUmtpS29XWENKL0Z0cEVRSzd3SUwwbHZaWVBXWG5nUlhvUVg0VVY0V1ladG8rTCsvWTkvS1FJQXBlaThGT3dBQk84SW5HVDN1QjNPTnBmcXZQelkxbms1N2pOVXUrTmUrenJRZWFtMXBnc3Z3a3NmNFNWeXpZVVg0VVY0RVY2RWwyWFlOdXBBbHBEMU0xNU1CMERHbEtielVxTXJVTExlT2kraDV5T2RseHJYZ2M1THJUWDlhRG92bmNqZWZkRjFnWDZtS3lWQWVPRmQ1cGZXUlh5dkN3RHJzRzEwNmdFbDYyaGszRDd5WUhTSXNXM2I2TGpQWU50bzJzOWoyNmpXbW40MG5aZk9aQXRidG9zQXlKN1NkRjVxZGdsSzFGZm5KZlI4cFBOUzR6clFlYW0xcGg5TjU2VlR1OGV0NEFLQThOS2pyRjlCUHR0Y2hnNHdnZ3NBUDF4N2t4MXZ5QlV0KzBJYkxZRFppZ3M1dG0wYkhmY1piQnROKzFsc0c5VmEwNCsvQVpmZmlCSVdYbTd2ZFZ6QXpTUDgxSVVTbk81MSt4VDJqd1VlRW1CZXQwL0QrZFdtNndBRlFIdzZMeE5ZYThHZi9HTFlYQTZ0dFVXL250eGFFMXdBT0loblhpWmNoRXRlSURNOHg3RjczS2J2VkMxVnEwQmoyek12eDMyR1NzODZSUGdzbm5tcHRhWWZmN010djAzamRmdFU4bk85ZFVaYWEwZC9PK25yLzBkcnJXUnd3VTNQRHhhT2FtKytoWkozWjEwUFVOc2ZuUThtblplbzgxRVByN1NmZXo1dlFhNWRuWmRhYS9yUmRGNEFjRU9OOE9MT0cyQnhXcjhJTHdBVzlHbnVhOVFRaEpmUWRuY1BpZ0FJR3VDT0lOZkE5T0J1cDRQSkE3c1I1Nk1vRDBxMnBPYysybkc3RG11dDZVZlRlWm1CN2d1RW1PQ2JPcW9mUlc4V081L2M1anRRM1pmK0JwUE9TNlJqYndIcjNSSmRBeTNvTmF2elVtdE5QNXJPU3g4TEdXUzdTV2tuL251T3IwUFU0QUx2L0dGR0lQcmlPeDc0MzBkZGVNY1ZqdkdRR2dwOUNDLzgzWDJ4ZlFTVExjRFVyS0d1Q3dlemJUU3pxbi96YU0xQUNKa3ZZU1dBL2daU3lqc3czWmRwZzB2VWVucGcxeHlxbHJQWHp3Tzd3dkV3RERvdnVnVnFDRzRhUVhqQjRqc3RXMjhJSWVvSHdvdEZPRlhOenE4MkNvR0YyK2VIdEJkUStyMWl6NzhjZUlGK3AyUGxtWmRWeHJZTGQ1NzZOdlVMVnkvUHZDU2c4OUwzQXFkVzRBYlNaMFo0d2FLc1JsaDhVVHVFRjR1ejJrRGR4WGRVT3hCZUxOSnFBdGtXMzFIdFFIaXhXS3NGRmpaMThMa1FYckJveitOMSt5UzRNRHEra2d1OWdZM3dVajNBOVBnZW1IRWN2Y2VGNkF2ZHVNTHZHNTFQRUY1U09ML2FETS9YTjEwRkZ3aSs0STFxMFczNHdrUXhtVzVlNkZUNVpYYW52alhYUytwV0dkdHQ0V050eGVyWHk5dzNGcWlEbDlRbG9QTVNkUVlZeDJGMzkxRHljOWttWW8vSlZzZmpmNDlwREg0ZWRWc1FYaGlHaTk5K0xmTXN6Tzd1d1RZUjBSZkVEQXR3cEdNY2hSYmNZZXluNjcrdmtuRXJhWTQvckdqYmFKV3gzUUljWjB0UXB4N214Ykg0WjdWdEpMd0lMM1BZUFc2SHM4MWxkNkZGZURHSlRUUVhxSTE2a1p4dG80VE9yemJET0k0aHQySCsrdWVmbm10aHFYQjI3SS9hcUJmSlhTaEI4bG5xcXdDelZrZmkrZnBtK09XUDM1ME1BQmFoODFJc3lMejl6UG0rbUxlSGI5OStCQmNBRmwzdmtoMnZaMTZtTE9iLzZkUkUvbWFRWjE1S2ptMEE0UVdNYllDYWJCc0JBTUlMQUlEd0FnQWd2QUFBd2dzQWdQQUNBQ0M4QUFEQ0N3Q0E4QUljeGd2cUFPSEZwQXdBQ0M4QUFNSUxBQ0M4QUpuWVdnV0VGNU16QUNDOEFBQUlMOUE5WFVsQWVERkpBd0RDQ3lEUUEzUWFYa3pXQUNDOEFJSThnUEJpMGdZQUxQN2ZhRTRseGpCQUgyd2JnZUFDSUx5WXhBRUFpLzUrYkI5aDdBS1lBQVVZTUc0QlRJSUNEQml6QUNaQ0FRYmpGY0JrS01DQXNRcGdRaFJnd0RnRk1Da0tNUmlmQUNaSEFRYU1UUUFUcEJBRHhpU0FpVktJd1ZnRU1HRUtNbUQ4QVpnOEJSbU1PU1VBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQlkxbjhBWVd1bnJjUmxPZTBBQUFBQVNVVk9SSzVDWUlJPSI+DQogICAgPHAgY2xhc3M9ImNlbnRlciI+DQogICAgICAgIERhdHVtL1ZyaWplbWU6IDIwLjA3LjIwMjIuIC8gMTM6NDY8YnIgLz4NCiAgICAgICAgVHJnb3ZhYzogVmlydHVhbCBQYXJ0bmVyIC1IUjxiciAvPg0KICAgICAgICBQcm9kYWpubyBtamVzdG86IHRlc3QgDQogICAgPC9wPg0KICAgIDxociAvPg0KICAgIDxociAvPg0KICAgIDxwIGNsYXNzPSJjZW50ZXIiPg0KICAgICAgICBJem5vcyBBLWJvbmE8L2JyPg0KICAgICAgICA8aDE+MTAwLDAwIGtuPC9oMT4NCiAgICA8L3A+DQogICAgPGhyIC8+DQogICAgPGhyIC8+DQogICAgPHAgY2xhc3M9ImNlbnRlciI+DQogICAgICAgIDE2LXpuYW1lbmthc3RpIGtvZDwvYnI+DQogICAgICAgIDxoMj41NDYwNDQ2MDQ1MTQ0NDkzPC9oMj4NCiAgICAgICAgPGRpdiBpZD0icXJjb2RlIj4NCgkJCTxpbWcgc3JjPSJkYXRhOmltYWdlL3BuZztiYXNlNjQsIGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFNc0FBQURMQ0FZQUFBREErMmN6QUFBQUFYTlNSMElBcnM0YzZRQUFBQVJuUVUxQkFBQ3hqd3Y4WVFVQUFBQUpjRWhaY3dBQURzTUFBQTdEQWNkdnFHUUFBQXp6U1VSQlZIaGU3ZE5Cam1NNURBVFJ2ditsWjFheGkwNFFsTVdXRFQ0Z2RnVDE1U3I5K1crdFZiS1BaYTJpZlN4ckZlMWpXYXRvSDh0YVJmdFkxaXJheDdKVzBUNld0WXIyc2F4VnRJOWxyYUo5TEdzVjdXTlpxMmdmeTFwRisxaldLdHJIc2xiUlBwYTFpdmF4ckZXMGoyV3RvbjBzYXhYdFkxbXJhQi9MV2tYN1dOWXEyc2V5VnRFK2xyV0s5ckdzVmJTUFphMmlmU3hyRmUxaldhdG8vTEg4K2ZQbjYrdXlYYWQxMmE1dmE5bytsa1pkdHV1MEx0djFiVTNieDlLb3kzYWQxbVc3dnExcCsxZ2FkZG11MDdwczE3YzFiUjlMb3k3YmRWcVg3ZnEycHUxamFkUmx1MDdyc2wzZjFyUjlMSTI2Yk5kcFhiYnIyNXIyMUdONWlYMGZKVFpQWGJhclVtTHo5Qkw3UHBvMmZxSmRtbDVpMzBlSnpWT1g3YXFVMkR5OXhMNlBwbzJmYUplbWw5ajNVV0x6MUdXN0tpVTJUeSt4NzZOcDR5ZmFwZWtsOW4yVTJEeDEyYTVLaWMzVFMrejdhTnI0aVhacGVvbDlIeVUyVDEyMnExSmk4L1FTK3o2YU5uNmlYWnBlWXQ5SGljMVRsKzJxbE5nOHZjUytqNmFObjJpWHBwZlk5MUZpODlSbHV5b2xOazh2c2UramFlTW4ycVVwc2ZuVEVwdW5MdHRGWGJhTEVwdW54T1pQUzJ5ZXBvMmZhSmVteE9aUFMyeWV1bXdYZGRrdVNteWVFcHMvTGJGNW1qWitvbDJhRXBzL0xiRjU2ckpkMUdXN0tMRjVTbXordE1UbWFkcjRpWFpwU216K3RNVG1xY3QyVVpmdG9zVG1LYkg1MHhLYnAybmpKOXFsS2JINTB4S2JweTdiUlYyMml4S2JwOFRtVDB0c25xYU5uMmlYcHNUbVQwdHNucnBzRjNYWkxrcHNuaEtiUHkyeGVabzJmcUpkbWhLYlB5MnhlZXF5WGRSbHV5aXhlVXBzL3JURTVtbmErSWwyYVVwcy9yVEU1dWtHTzRjU202ZkU1aW14K2RNU202ZHA0eWZhcFNteCtkTVNtNmNiN0J4S2JKNFNtNmZFNWs5TGJKNm1qWjlvbDZiRTVrOUxiSjV1c0hNb3NYbEtiSjRTbXo4dHNYbWFObjZpWFpvU216OHRzWG02d2M2aHhPWXBzWGxLYlA2MHhPWnAydmlKZG1sS2JQNjB4T2JwQmp1SEVwdW54T1lwc2ZuVEVwdW5hZU1uMnFVcHNmblRFcHVuRyt3Y1NteWVFcHVueE9aUFMyeWVwbzJmYUplbXhPWlBTMnllYnJCektMRjVTbXllRXBzL0xiRjVtalorb2wyYUVwcy9MYkY1dXNIT29SdnNIRXBzL3JURTVtbmErSWwyYVVwcy9yVEU1dWtHTzRkdXNITW9zZm5URXB1bmFlTW4ycVVwc2ZuVEVwdW5HK3djdXNIT29jVG1UMHRzbnFhTm4yaVhwc1RtVDB0c25tNndjK2dHTzRjU216OHRzWG1hTm42aVhab1Ntejh0c1htNndjNmhHK3djU216K3RNVG1hZHI0aVhacFNteit0TVRtNlFZN2gyNndjeWl4K2RNU202ZHA0eWZhcFNteCtkTVNtNmNiN0J5NndjNmh4T1pQUzJ5ZXBvMmZhSmVtbDlqM1VXTHpsTmc4M1dEbjBFdnMrMmphK0lsMmFYcUpmUjhsTmsrSnpkTU5kZzY5eEw2UHBvMmZhSmVtbDlqM1VXTHpsTmc4M1dEbjBFdnMrMmphK0lsMmFYcUpmUjhsTmsrSnpkTU5kZzY5eEw2UHBvMmZhSmVtbDlqM1VXTHpsTmc4M1dEbjBFdnMrMmphK0lsMmFYcUpmUjhsTmsrSnpkTU5kZzY5eEw2UHBvMmZhSmVtbDlqM1VXTHpsTmc4M1dEbjBFdnMrMmphK0lsMjZXOHJzWGxLYko0U202ZkU1cit0YWVNbjJxVy9yY1RtS2JGNVNteWVFcHYvdHFhTm4yaVgvcllTbTZmRTVpbXhlVXBzL3R1YU5uNmlYZnJiU215ZUVwdW54T1lwc2ZsdmE5cjRpWGJwYnl1eGVVcHNuaEticDhUbXY2MXA0eWZhcGIrdHhPWXBzWGxLYko0U20vKzJwbzJmYUpmK3RoS2JwOFRtS2JGNVNteisyNW8yZitLUHN6OXFwZlcrL1N0OW1EMkVTdXQ5KzFmNk1Ic0lsZGI3OXEvMFlmWVFLcTMzN1YvcHcrd2hWRnJ2MjcvU2g5bERxTFRldDMrbEQ3T0hVR205NytmL1N2YVBlYk1iN0J6cXNsMlZickJ6NkNYN1dEN2NEWFlPZGRtdVNqZllPZlNTZlN3ZjdnWTdoN3BzVjZVYjdCeDZ5VDZXRDNlRG5VTmR0cXZTRFhZT3ZXUWZ5NGU3d2M2aEx0dFY2UVk3aDE2eWorWEQzV0RuVUpmdHFuU0RuVU12MmNmeTRXNndjNmpMZGxXNndjNmhsNHgvamYwZzFHVzdUdXV5WFpVU216OXRtbjFEcFplTWY0MzlJTlJsdTA3cnNsMlZFcHMvYlpwOVE2V1hqSCtOL1NEVVpidE82N0pkbFJLYlAyMmFmVU9sbDR4L2pmMGcxR1c3VHV1eVhaVVNtejl0bW4xRHBaZU1mNDM5SU5SbHUwN3JzbDJWRXBzL2JacDlRNldYakgrTi9TRFVaYnRPNjdKZGxSS2JQMjJhZlVPbGw0eC9qZjBnMUdXN1R1dXlYWlVTbXo5dG1uMURwWmVNZjQzOUlKVFlQSFhacnB0MTJTNUtiUDVmOVF2R2IyRS9KQ1UyVDEyMjYyWmR0b3NTbS85WC9ZTHhXOWdQU1luTlU1ZnR1bG1YN2FMRTV2OVZ2MkQ4RnZaRFVtTHoxR1c3YnRabHV5aXgrWC9WTHhpL2hmMlFsTmc4ZGRtdW0zWFpMa3BzL2wvMUM4WnZZVDhrSlRaUFhiYnJabDIyaXhLYi8xZjlndkZiMkE5SmljMVRsKzI2V1pmdG9zVG0vMVcvWVB3VzlrT2UxbVc3cU10MlZVcHN2dEkwKzRaS2ljM1R0UEVUN2RLbmRka3U2ckpkbFJLYnJ6VE52cUZTWXZNMGJmeEV1L1JwWGJhTHVteFhwY1RtSzAyemI2aVUyRHhOR3ovUkxuMWFsKzJpTHR0VktiSDVTdFBzR3lvbE5rL1R4ayswUzUvV1pidW95M1pWU215KzBqVDdoa3FKemRPMDhSUHQwcWQxMlM3cXNsMlZFcHV2Tk0yK29WSmk4elJ0L0VTNzlHbGR0b3U2YkZlbHhPWXJUYk52cUpUWVBFMmJQekd3SCtTMEx0dEZYYmFMdW14WHBSdnNIRXBzdnRLMCtSTUQrMEZPNjdKZDFHVzdxTXQyVmJyQnpxSEU1aXRObXo4eHNCL2t0QzdiUlYyMmk3cHNWNlViN0J4S2JMN1N0UGtUQS90QlR1dXlYZFJsdTZqTGRsVzZ3YzZoeE9ZclRacy9NYkFmNUxRdTIwVmR0b3U2YkZlbEcrd2NTbXkrMHJUNUV3UDdRVTdyc2wzVVpidW95M1pWdXNIT29jVG1LMDJiUHpHd0grUzBMdHRGWGJhTHVteFhwUnZzSEVwc3Z0SzArUk4vblAxUlQrdXlYWlRZUEhYWnJrb3YyY2Z5WWZZSFA2M0xkbEZpODlSbHV5cTlaQi9MaDlrZi9MUXUyMFdKelZPWDdhcjBrbjBzSDJaLzhOTzZiQmNsTms5ZHRxdlNTL2F4ZkpqOXdVL3JzbDJVMkR4MTJhNUtMOW5IOG1IMkJ6K3R5M1pSWXZQVVpic3F2V1FmeTRmWkgveTBMdHRGaWMxVGwrMnE5Skx4cjdFZjVOdEtiSjRTbTc5Wll2TTMreGI3V0JvbE5rK0p6ZDhzc2ZtYmZZdDlMSTBTbTZmRTVtK1cyUHpOdnNVK2xrYUp6Vk5pOHpkTGJQNW0zMklmUzZQRTVpbXgrWnNsTm4remI3R1BwVkZpODVUWS9NMFNtNy9adDlqSDBpaXhlVXBzL21hSnpkL3NXenoxV0Y1aTMwZUp6Vk9YN2FyVVpic3EvYnJ4RzlxUFRDK3g3NlBFNXFuTGRsWHFzbDJWZnQzNERlMUhwcGZZOTFGaTg5Umx1eXAxMmE1S3YyNzhodllqMDB2cyt5aXhlZXF5WFpXNmJGZWxYemQrUS91UjZTWDJmWlRZUEhYWnJrcGR0cXZTcnh1L29mM0k5Qkw3UGtwc25ycHNWNlV1MjFYcDE0M2YwSDVrZW9sOUh5VTJUMTIycTFLWDdhcjA2OFp2YUQ4eUpUWi9XbUx6bE5nOFRiTnZlTEhFNW1uYStJbDJhVXBzL3JURTVpbXhlWnBtMy9CaWljM1R0UEVUN2RLVTJQeHBpYzFUWXZNMHpiN2h4UkticDJuako5cWxLYkg1MHhLYnA4VG1hWnA5dzRzbE5rL1R4ayswUzFOaTg2Y2xOaytKemRNMCs0WVhTMnllcG8yZmFKZW14T1pQUzJ5ZUVwdW5hZllOTDViWVBFMGJQOUV1VFluTm41YllQQ1UyVDlQc0cxNHNzWG1hTm42aVhab1Ntejh0c1hucXNsM1VaYnNxSlRaUGljMVRZdk9WcG8yZmFKZW14T1pQUzJ5ZXVtd1hkZG11U29uTlUyTHpsTmg4cFduako5cWxLYkg1MHhLYnB5N2JSVjIycTFKaTg1VFlQQ1UyWDJuYStJbDJhVXBzL3JURTVxbkxkbEdYN2FxVTJEd2xOaytKelZlYU5uNmlYWm9TbXo4dHNYbnFzbDNVWmJzcUpUWlBpYzFUWXZPVnBvMmZhSmVteE9aUFMyeWV1bXdYZGRtdVNvbk5VMkx6bE5oOHBXbmpKOXFsS2JINTB4S2JweTdiUlYyMnExSmk4NVRZUENVMlgybmErSWwyYVVwcy9yVEU1cW5MZGxWS2JQNW1pYzNUTHhpL2hmMlFsTmo4YVluTlU1ZnRxcFRZL00wU202ZGZNSDRMK3lFcHNmblRFcHVuTHR0VktiSDVteVUyVDc5Zy9CYjJRMUppODZjbE5rOWR0cXRTWXZNM1MyeWVmc0g0TGV5SHBNVG1UMHRzbnJwc1Y2WEU1bStXMkR6OWd2RmIyQTlKaWMyZmx0ZzhkZG11U29uTjN5eXhlZm9GNDdld0g1SVNtejh0c1hucXNsMlZFcHUvV1dMejlBdkdiMkUvSkwzRXZvOXVzSE1xSlRiL2JiMWtIOHRmMlBmUkRYWk9wY1RtdjYyWDdHUDVDL3MrdXNIT3FaVFkvTGYxa24wc2YySGZSemZZT1pVU20vKzJYcktQNVMvcysrZ0dPNmRTWXZQZjFrdjJzZnlGZlIvZFlPZFVTbXorMjNySlBwYS9zTytqRyt5Y1Nvbk5mMXN2ZWVxeGZFdlQ3QnVveTNiUkRYYk9hZFAyc1RTYVp0OUFYYmFMYnJCelRwdTJqNlhSTlBzRzZySmRkSU9kYzlxMGZTeU5wdGszVUpmdG9odnNuTk9tN1dOcE5NMitnYnBzRjkxZzU1dzJiUjlMbzJuMkRkUmx1K2dHTytlMGFmdFlHazJ6YjZBdTIwVTMyRG1uVFpzL2NhMHZ0WTlscmFKOUxHc1Y3V05acTJnZnkxcEYrMWpXS3RySHNsYlJQcGExaXZheHJGVzBqMld0b24wc2F4WHRZMW1yYUIvTFdrWDdXTllxMnNleVZ0RStscldLOXJHc1ZiU1BaYTJpZlN4ckZlMWpXYXRvSDh0YVJmdFkxaXJheDdKVzBUNld0WXIyc2F4VnRJOWxyYUo5TEdzVjdXTlpxK1MvLy80SFhsWTU0eHpsZmFFQUFBQUFTVVZPUks1Q1lJST0iPg0KCQk8L2Rpdj4NCiAgICA8L3A+DQogICAgPGhyIC8+DQoJPHA+DQoJCTxoND5VcHV0ZSB6YSBrb3JpxaF0ZW5qZTo8L2g0PgkNCgkJPG9sPg0KCQkJPGxpPlVwacWhaXRlIDE2LXpuYW1lbmthc3RpIGtvZCBib25hIG5hIHN0cmFuaWNpIHdlYiB0cmdvdmluZSBpbGkgb25saW5lIHBydcW+YXRlbGphIHVzbHVnZS48L2xpPg0KCQkJPGxpPlBvdHZyZGl0ZSB1cGxhdHUuPC9saT4NCgkJPC9vbD4NCiAgICA8L3A+DQoJPHA+DQoJCTxoND5TZXJpanNraSBicm9qIGJvbmE6ICA8L2g0Pg0KICAgICAgICA5ODg5MjUxNjg4OTc5ODQ2DQoJPC9wPg0KCTxwPg0KCQk8aDQ+RG9kYXRuZSBpbmZvcm1hY2lqZTo8L2g0Pg0KICAgICAgICBPcMSHZSB1dmpldGUgcHJvxI1pdGFqdGUgbmEgd3d3LmFib24uY2FzaC9vcGNpLXV2amV0aS48YnIvPg0KICAgICAgICBBLWJvbiBpemRhamUgQWlyY2FzaCBkLm8uby4sIFVsaWNhIGdyYWRhIFZ1a292YXJhIDI3MSwgWmFncmViLCBPSUI6IDk5ODMzNzEzMTAxLCBJRU4xMTYNCiAgICA8L3A+DQogICAgPHA+DQogICAgICAgPGg0Pk5hcG9tZW5lOjwvaDQvPg0KICAgICAgIEEtYm9uIGplIGVsZWt0cm9uacSNa2kgbm92YWMgaXpkYW4gb2Qgc3RyYW5lIEFpcmNhc2ggZC5vLm8uIGtvamkgcHJlZHN0YXZsamEgcGxhdG5pIGluc3RydW1lbnQgdSBzbWlzbHUgemFrb25hIGtvamltIHNlIHVyZcSRdWplIGVsZWt0b3JuacSNa2kgbm92YWMgaSBzbHXFvmkga2FvIGJlemdvdG92aW5za28gcGxhxIdhbmplIHJvYmUgaS9pbGkgdXNsdWdhLg0KICAgIDwvcD4NCiAgICA8cD4NCiAgICAgICAgPGg0PktvbnRha3Q6PC9oND4NCiAgICAgICAgRS1tYWlsOiBpbmZvQGFib24uY2FzaCA8YnIgLz4NCiAgICAgICAgVGVsOiAwMS80NTctMzUzNzxiciAvPg0KICAgIDwvcD4NCjwvZGl2Pg0KPC9ib2R5Pg0KPC9odG1sPg==",
                partnerTransactionId: "76b266ae-4d61-414b-baa9-44f9da1182e1"
            },
            errorResponseExample: {
                code: 6,
                message: "Coupon exists for the given PartnerTransactionId",
                additionalData: {
                    serialNumber: "8023200631484066",
                    value: 100.00,
                    isoCurrencySymbol: "EUR",
                    partnerTransactionId: "9059ca5c-675a-48b5-b41a-e04ab5b981ae"
                }
            }
        },
        couponCancellation: {
            requestExample: {
                partnerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                serialNumber: "9889251688979846",
                partnerTransactionId: "76b266ae-4d61-414b-baa9-44f9da1182e1",
                pointOfSaleId: "test",
                signature: "XwTgMtFG/K..."
            },
            errorResponseExample: {
                code: 7,
                message: "Coupon has been already cancelled",
                additionalData: null
            }
        }
    };
}]);