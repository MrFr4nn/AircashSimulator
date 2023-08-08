
using System;

namespace AircashSimulator.Controllers.AircashPay
{
    public class RefundTransaction
    {
        public Guid PartnerID { get; set; }
        public string PartnerTransactionID { get; set; }

        public string RefundTransactionID { get; set; }
        public decimal Amount { get; set; }
    }
}
