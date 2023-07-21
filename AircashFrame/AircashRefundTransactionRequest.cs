using AircashSignature;
using System;

namespace Services.AircashFrame
{
    public class AircashRefundTransactionRequest : ISignature
	{
		public Guid PartnerId { get; set; }
		public string PartnerTransactionId { get; set; }
		public string RefundPartnerTransactionID { get; set; }
		public decimal Amount { get; set; }
		public string Signature { get; set; }
	}
}
