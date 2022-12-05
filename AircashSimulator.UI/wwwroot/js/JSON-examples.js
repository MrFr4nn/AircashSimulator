

app.constant("JSONexamples", {
    salesPartner: {
        checkCode: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                barCode: "05cd4905-982b-4a36-8634-0719290e4341",
                locationID: "123",
                signature: "QDyIrReELi..."
            },
            responseExample: {
                BarCode: "05cd4905-982b-4a36-8634-0719290e4341",
                Amount: 2000.00
            }
        },
        confirmTransaction: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                barCode: "05cd4905-982b-4a36-8634-0719290e4341",
                partnerTransactionID: "11888f0c-7923-42db-8513-5c1f32cc83e0",
                locationID: "123",
                signature: "Iz+gMcrdNA..."

            },
            responseExample: {
                LocationID: "123",
                Amount: 2000.00,
                AircashTransactionID: "da7109b8-1e9b-4521-b669-2438be129ade"
            }
        },
        checkTransactionStatus: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionID: "05cd4905-982b-4a36-8634-0719290e4341",
                signature: "ueIZMgee7G..."
            },
            responseExample: {
                LocationID: "123",
                Amount: 2000.00,
                AircashTransactionID: "da7109b8-1e9b-4521-b669-2438be129ade"
            }
        },
        cancelTransaction: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionID: "05cd4905-982b-4a36-8634-0719290e4341",
                locationID: "123",
                signature: "AEXHWNFQD9..."
            },
            //responseExample: {}
        }
    },
    aircashFrame: {
        initiate: {
            requestExample: {
                partnerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerUserId: "574f32a7-4ecb-48b2-9723-ac660b9c835d",
                partnerTransactionId: "3d3dbc8d-9547-4f49-b035-5a8aab8cb1ac",
                amount: "10",
                currencyId: 191,
                payType: 0,
                payMethod: 2,
                notificationUrl: "https://aircash.eu",
                successUrl: "https://localhost:44317/#!/success",
                declineUrl: "https://localhost:44317/#!/decline",
                locale: "en-US",
                signature: "CsXX21BpQg..."
            },
            responseExample: {
                url: "https://aircash.eu?Id=3d3dbc8d-9547-4f49-b035-5a8aab8cb1ac"
            },
            errorResponseExample: {
                code: 1,
                message: "Invalid ProviderId",
                additionalData: null
            },
        },
        transactionStatus: {
            requestExample: {
                partnerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionId: "3d3dbc8d-9547-4f49-b035-5a8aab8cb1ac",
                signature: "dUrE4gtau5..."
            },
            errorResponseExample: {
                code: 1003,
                message: "Transaction not processed",
                additionalData: null
            }
        }
    },
    aircashFrameV2: {
        initiate: {
            requestExample: {
                partnerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerUserId: "574f32a7-4ecb-48b2-9723-ac660b9c835d",
                partnerTransactionId: "1a74bb41-36fe-4493-9ccf-30879b994766",
                amount: "100",
                currencyId: 191,
                payType: 0,
                payMethod: 2,
                notificationUrl: "https://aircash.eu",
                successUrl: null,
                declineUrl: null,
                cancelUrl: null,
                originUrl: null,
                locale: "en-US",
                signature: "tc5NZjj7hO..."
            },
            responseExample: {
                transactionId: "e22cd71a-276e-47e1-b7af-3d3a504e0ef9",
                url: "https://stage-frame.aircash.eu/e22cd71a-276e-47e1-b7af-3d3a504e0ef9"
            },
            errorResponseExample: {
                code: 1,
                message: "Invalid ProviderId",
                additionalData: null 
            }
        },
        transactionStatus: {
            requestExample: {
                partnerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionId: "1a74bb41-36fe-4493-9ccf-30879b994766",
                signature: "dUrE4gtau5..."
            },
            errorResponseExample: {
                code: 1003,
                message: "Transaction not processed",
                additionalData: null
            }
        }
    },
    aircashPay: {
        generatePartnerCode: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                amount: 100,
                currencyID: 191,
                partnerTransactionID: "ef52ca13-33b4-4564-8bca-0cbfc7c5a37d",
                description: "test",
                locationID: "test",
                signature: "WUY3NyUagi..."
            },
            responseExample: {
                codeLink: "https://aircashtest.page.link/?link=https%3a%2f%2faircash.eu%2facpay%3ftype%3d3%26code%3da14cfc86-fb75-4e07-a02f-630db813e91e&apn=com.aircash.aircash.test&ibi=com.aircash.aircash.test&afl=https://aircash.eu/acpay&ifl=https://aircash.eu/acpay&efr=1"
            }
        },
        confirmTransaction: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionID: "ef52ca13-33b4-4564-8bca-0cbfc7c5a37d",
                amount: 100,
                currencyID: 191,
                aircashTransactionID: "122e5e33-b5fb-4398-b138-c60582b9fa2b",
                signature: "Ff3oSWm20n...",
            }
        },
        refundTransaction: {
            requestExample: {
                amount: 50,
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionID: "28f0f0db-69cf-4350-8084-a0d431c2c837",
                refundPartnerTransactionID: "abc66734-9d5a-4f7f-891a-185e1bb3144a",
                signature: "CQ83DaMKix..."
            },
            errorResponseExample: {
                ErrorCode: 3,
                ErrorMessage: "Requested amount is higher than remaining amount from the original transaction"
            }
        }
    },
    aircashPayment: {
        checkPlayer: {
            requestExample: {
                parameters: [{
                    key: "username",
                    value: "aircash"
                }],
                signature: "HrlYnqqr...Cgs = "
            },
            responseExample: {
                isPlayer: true,
                error: null,
                parameters: [{
                    key: "partnerUserID",
                    value: "40ecee36-da23-48be-bf89-2d641d92b3ca",
                    type: "String"
                }]
            },
            errorResponseExample: {
                isPlayer: false,
                error: {
                    errorCode: 500,
                    errorMessage: "Unable to find user account"
                },
                parameters: null
            }
        },
        createAndConfirmPayment: {
            requestExample: {
                transactionID: "c1cf13b4-52ce-4b2f-9f9b-9d31cc1f800a",
                amount: 123.45,
                parameters: [{
                    key: "username",
                    value: "aircash"
                }],
                signature: "Gng+D6+3...P/4="
            },
            responseExample: {
                success: true,
                partnerTransactionID: "7efb6b2b-3a5d-4871-8304-29532797e0ab",
                parameters: [{
                    key: "partnerUserID",
                    value: "40ecee36-da23-48be-bf89-2d641d92b3ca",
                    type: "string"
                }]
            },
            errorResponseExample: {
                success : false,
                error: {
                    errorCode: 500,
                    errorMessage: "Unable to find user account"
                },
                parameters: null
            }
        }
    },
    aircashRedeemTicket: {
        checkTicket: {
            inputParametersExample: {
                aircashTransactionID: "11112406-f672-4c27-a415-e26eb3ecd111",
                parameters: [{
                    key: "TicketID",
                    value: "123456789"
                },
                {
                    key: "PIN",
                    value: "1234"
                }],
                signature: "i6lNUCLl3...."
            },
            outputParametersExample: {
                first: {
                    status: 1
                },
                second: {
                    status: 5,
                    amount: 123.45,
                    currencyISOCode: "EUR"
                }
            }
        },
        redeemTicket: {
            inputParametersExample: {
                aircashTransactionID: "11112406-f672-4c27-a415-e26eb3ecd111",
                parameters: [{
                                key: "TicketID",
                                value: "123456789"
                },
                {
                    key: "PIN",
                    value: "1234"
                }],
                signature: "i6lNUCLl3...."
            },
            outputParametersExample: {
                first: {
                    status: 1
                },
                second: {
                    status: 5,
                    amount: 123.45,
                    currencyISOCode: "EUR",
                    partnerTransactionID: "ABC…123"
                }
            }
        }
    },
    aircashPayout: {
        checkUser: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerUserID: "574f32a7-4ecb-48b2-9723-ac660b9c835d",
                phoneNumber: 385995712738,
                signature: "VA514erV6V..."
            },
            responseExample: {
                status: 3
            },
            errorResponseExample: {
                message: "An error has occurred."
            }
        },
        createPayout: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionID: "45c38393-274b-4761-902e-23db30736563",
                amount: 100,
                phoneNumber: "385995712738",
                partnerUserID: "574f32a7-4ecb-48b2-9723-ac660b9c835d",
                currencyID: 191,
                signature: "Hm38lRCyOP..."
            },
            responseExample: {
                aircashTransactionID: "760aed25-b409-450b-937d-ba4f0ffa33cc "
            },
            errorResponseExample: {
                code: 4002,
                message: "PartnerTransactionID already exists"
            }
        },
        checkTransactionStatus: {
            requestExample: {
                partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                partnerTransactionID: "45c38393-274b-4761-902e-23db30736563",
                aircashTransactionID: null,
                signature: "BBjas91N8B..."
            },
            responseExample: {
                status: 2,
                aircashTransactionID: "760aed25-b409-450b-937d-ba4f0ffa33cc "
            },
            errorResponseExample: {
                message: "An error has occurred."
            }
        }
    },
    aircashPoSDeposit: {
        checkUser: {
            inputParametersExample: {
                PartnerID: "496fbe8e-ca5a-42df-8999-cdde0c14ae3a",
                PhoneNumber: "385981234567",
                PartnerUserID: "12345",
                Parameters: [
                    {
                        Key: "PayerFirstName",
                        Value: "John"
                    },
                    {
                        Key: "PayerLastName",
                        Value: "Doe"
                    },
                    {
                        Key: "PayerBirthDate",
                        Value: "1990-01-01"
                    }
                ],
                Signature: "ldzZxe....I8="
            },
            outputParametersExample: {
                first: {
                    status: 1
                },
                second: {
                    status: 2
                },
                third: {
                    status: 3
                }
            }
        },
        createPayout: {
            requestExample: {
                PartnerID: "1b8a6445-d23c-4a3a-acc0-f05abcebb081",
                PhoneNumber: "385981234567",
                PartnerUserID: "12345",
                Parameters: [
                    {
                        Key: "emai",
                        Value: "user@example.net"
                    },
                    {
                        Key: "PayerFirstName",
                        Value: "John"
                    },
                    {
                        Key: "PayerLastName",
                        Value: "Doe"
                    },
                    {
                        Key: "PayerBirthDate",
                        Value: "1990-01-01"
                    }],
                Amount: 123.45,
                CurrencyID: 978,
                PartnerTransactionID: "123..abc..123",
                Signature: "CX9v6V....Bw="
            },
            responseExample: {
                aircashTransactionID: "760aed25-b409-450b-937d-ba4f0ffa33cc"
            },
        },
        checkPlayer: {
            inputParametersExample: {
                emailAsIdentifier: {
                    Parameters: [{
                        Key: "PayerFirstName",
                        Value: "John"
                    },
                    {
                        Key: "PayerLastName",
                        Value: "Doe"
                    },
                    {
                        Key: "PayerBirthDate",
                        Value: "1990-01-01"
                    },
                    {
                        Key: "email",
                        Value: "user@example.net"
                    }],
                    Signature: "c6RDz....Pc="
                },
                usernameAsIdentifier: {
                    Parameters: [{
                        Key: "PayerFirstName",
                        Value: "John"
                    },
                    {
                        Key: "PayerLastName",
                        Value: "Doe"
                    },
                    {
                        Key: "PayerBirthDate",
                        Value: "1990-01-01"
                    },
                    {
                        Key: "username",
                        Value: "aircash"
                    }],
                    Signature: "123...abc"
                }
            },
            outputParametersExample: {
                depositPossible: {
                    IsPlayer: true,
                    Error: null,
                    Parameters: [
                        {
                            Key: "PartnerUserID",
                            Value: "12345",
                            Type: "String"
                        }
                    ]
                },
                depositNotPossible: {
                    IsPlayer: false,
                    Error:
                    {
                        ErrorCode: 500,
                        ErrorMessage: "Unable to find user account",
                    },
                    Parameters: null
                }
            }
        },
        createAndConfirmPayment: {
            inputParametersExample: {
                TransactionID: "c1cf13b4-52ce-4b2f-9f9b-9d31cc1f800a",
                Amount: 123.45,
                Parameters: [
                    {
                        Key: "email",
                        Value: "user@example.net"
                    }
                ],
                Signature: "Gng+D6.../4="
            },
            outputParametersExample: {
                successfulTransaction: {
                    Success: true,
                    PartnerTransactionID: "ABC...123",
                    Parameters: [
                        {
                            Key: "PartnerUserID",
                            Value: "12345",
                            Type: "String"
                        }
                    ]
                },
                transationWithError: {
                    Success: false,
                    Error: {
                        ErrorCode: 500,
                        ErrorMessage: "Unable to find user account"
                    },
                    Parameters: null
                }

            }
        },
    },
    aBonGenerate: {
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
    },
    aBonDeposit: {
        validateCoupon: {
            requestExample: {
                couponCode: "5460446045144493",
                providerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                signature: "BPz2mGu8UG..."
            },
            responseExample: {
                couponValue: 50.0,
                isValid: true,
                ISOCurrency: "HRK",
                providerTransactionId: "",
                salePartnerId: "31dce332-1d55-4459-b166-d8d33a78226c",
                isoCountryCode: null,
                originalISOCurrency: "HRK",
                originalCouponValue: 50.0
            },
            errorResponseExample: {
                code: 1,
                message: "Invalid ProviderId",
                additionalData: null
            }
        },
        confirmTransaction: {
            requestExample: {
                couponCode: "5460446045144493",
                providerId: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
                providerTransactionId: "d711c31b-9e20-48dd-a749-91778627b569",
                userId: "574f32a7-4ecb-48b2-9723-ac660b9c835d",
                signature: "CVrMFUqDzg..."
            },
            responseExample: {
                couponValue: 50.0,
                ISOCurrency: "HRK",
                providerTransactionId: "33352406-f672-4c27-a415-e26eb3ecd691",
            },
            errorResponseExample: {
                code: 4,
                message: "Coupon Already Used",
                additionalData: {
                    couponValue: 50.0,
                    ISOCurrency: "HRK",
                    providerTransactionId: "33352406-f672-4c27-a415-e26eb3ecd691",
                }
            }
        }
    },
    signature: {
        examplePartner: {
            partnerID: "8f62c8f0-7155-4c0e-8ebe-cd9357cfd1bf",
            amount: 123.45,
            currencyID: 191,
            partnerTransactionID: "7f087237-b81a-48af-8dce-bc048fede397",
            description: "test",
            locationID: "test",
            signature: "bURAs89l0O..."
        },
        exampleAircash: {
            TransactionID: "c1cf13b4-52ce-4b2f-9f9b-9d31cc1f800a",
            Amount: 123.45,
            Parameters: [
                {
                    Value: "Aircash",
                    Key: "userName"
                },
                {
                    Value: "385981234567",
                    Key: "phoneNumber"
                }
            ]
        }
    }
    //requestExample: {},
    //responseExample: {},
    //errorResponseExample: {}

});