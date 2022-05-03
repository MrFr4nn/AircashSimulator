using AircashSignature;

namespace Services.AircashPay
{
    public class AircashRefundTransactionRequest : ISignature
    {
        public string PartnerID { get; set; }
        public string PartnerTransactionID { get; set; }
        public string RefundPartnerTransactionID { get; set; }
        public decimal Amount { get; set; }
        public string Signature { get; set; }
    }
}
