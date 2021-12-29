using AircashSignature;

namespace Services.AircashFrame
{
    public class AircashTransactionStatusRequest : ISignature
    {
        public string PartnerId { get; set; }
        public string PartnerTransactionId { get; set; }
        public string Signature { get; set; }
    }
}
