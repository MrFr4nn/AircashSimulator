using System;

namespace Services.AircashPay
{
    public class CancelTransactionDTO
    {
        public Guid PartnerId { get; set; }
        public Guid PartnerTransactionId { get; set; }
        public Guid UserId { get; set; }
    }
}
