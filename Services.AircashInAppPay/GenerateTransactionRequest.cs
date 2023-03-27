using System;

namespace Services.AircashInAppPay
{
    public class GenerateTransactionRequest
    {
        public Guid PartnerID { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public string LocationID { get; set; }
    }
}
