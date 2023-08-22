using AircashSignature;

namespace Services.AircashPaymentAndPayout
{
    public class CheckDigitsRequest : ISignature
    {
        public string PartnerID { get; set; }
        public string DigitCode { get; set; }
        public string LocationID { get; set; }
        public int CurrencyID { get; set; }
        public string Signature { get; set; }
    }
}
