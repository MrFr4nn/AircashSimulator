using AircashSignature;

namespace Services.AircashPay
{
    public class AircashCancelTransactionRequest : ISignature
    {
        public string PartnerID { get; set; }
        public string PartnerTransactionID { get; set; }
        public string Signature { get; set; }
    }
}
