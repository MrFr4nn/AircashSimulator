using System;

namespace Services.AircashPay
{
    public class CancelTransactionDTO
    {
        public Guid PartnerId { get; set; }
        public string PartnerTransactionId { get; set; }
        public string UserId { get; set; }
    }
}
