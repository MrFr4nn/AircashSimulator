using AircashSignature;

namespace AircashSimulator.Controllers.AircashPayStaticCode
{
    public class AircashPayStaticCodeConfirmTransactionRequest : ISignature
    {
        public string PartnerID { get; set; }
        public string PartnerTransactionID { get; set; }
        public decimal Amount { get; set; }
        public int ISOCurrencyID { get; set; }
        public string Signature { get; set; }
        public string AircashTransactionID { get; set; }
    }
}
