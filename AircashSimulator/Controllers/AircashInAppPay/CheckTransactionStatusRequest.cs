using System;

namespace AircashSimulator.Controllers.AircashInAppPay
{
    public class CheckTransactionStatusRequest
    {
        public Guid PartnerId { get; set; }
        public string PartnerTransactionId { get; set; }
    }
}
