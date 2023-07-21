
using System;

namespace AircashSimulator.Controllers.AircashFrame
{
    public class RefundAcPayTransactionDTO
	{
        public Guid PartnerID { get; set; }
        public string PartnerTransactionID { get; set; }
		public string RefundPartnerTransactionID { get; set; }
		public decimal Amount { get; set; }
    }
}
