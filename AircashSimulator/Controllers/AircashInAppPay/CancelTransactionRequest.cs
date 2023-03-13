using System;

namespace AircashSimulator.Controllers.AircashInAppPay
{
    public class CancelTransactionRequest
    {
        public Guid PartnerTransactionId { get; set; }
    }
}
