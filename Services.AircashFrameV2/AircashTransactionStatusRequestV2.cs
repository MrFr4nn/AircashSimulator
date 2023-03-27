using AircashSignature;

namespace Services.AircashFrameV2
{
    public class AircashTransactionStatusRequestV2 : ISignature
    {
        public string PartnerId { get; set; }
        public string PartnerTransactionId { get; set; }
        public string Signature { get; set; }
    }
}
