namespace Services.AircashFrame
{
	public class AircashRefundTransactionResponse
	{
		public string PartnerId { get; set; }
		public string PartnerTransactionId { get; set; }
		public string RefundPartnerTransactionID { get; set; }
		public decimal Amount { get; set; }
		public string Signature { get; set; }
	}
}
