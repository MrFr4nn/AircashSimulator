using System;

namespace Services.AircashPay
{
    public class RefundTransactionDTO
    {
        public Guid PartnerId { get; set; }
        public string PartnerTransactionId { get; set; }
        public string RefundPartnerTransactionId { get; set; }

        public decimal Amount { get; set; }
    }
}
