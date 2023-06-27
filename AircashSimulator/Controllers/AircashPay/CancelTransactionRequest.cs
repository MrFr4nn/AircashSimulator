
using System;

namespace AircashSimulator.Controllers.AircashPay
{
    public class CancelTransaction
    {
        public Guid PartnerId { get; set; }
        public string PartnerTransactionID { get; set; }
    }
}
