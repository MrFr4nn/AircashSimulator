

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
    appVersion: 1.0,
    apiUrl: 'http://www.facebook.com?api'
});